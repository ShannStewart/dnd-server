const path = require('path')
const express = require('express')
const xss = require('xss')
const authServices = require('./auth-service');

const authRouter = express.Router();
const jsonParser = express.json();

const cleanNotes = users => ({
    id: users.id,
    name: users.name,
    password: xss(users.password),
})

authRouter
    .route('/')
    .get(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        authServices.getAllUsers(knexInstance)
        .then( users => {
            res.json(users.map(cleanNotes))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name, password } = req.body
        const newUser = {};
        newUser.name = name;
        newUser.password = password;

        for (const [key, value] of Object.entries(newUser)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                  })
            }
        }
        //console.log('test:')

        authServices.insertUser(
            req.app.get('db'),  
            newUser
        )
        .then(user => {
            res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${user.id}`))
            .json(user)
        })
        .catch(next)
    })

    authRouter
    .route('/:user_id')
    .all((req, res, next) => {
        authServices.getById(
            req.app.get('db'),
            req.params.user_id
          )
        .then(user => {
            if (!user){
                return res.status(404).json({
                    error: { message: `Folder doesn't exist` }
                  })
            }
            res.user = user;
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
          res.json(cleanNotes(res.user))  
        })
    .patch(jsonParser, (req, res, next) => {
            const { name, password } = req.body
            const userToUpdate = { name, password }

            const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
            if (numberOfValues === 0)
              return res.status(400).json({
                error: {
                  message: `Request body must contain 'name', 'password', 'test' or 'questions'`
                }
              })

              authServices.updateUser(
                  req.app.get('db'),
                  req.params.user_id,
                  userToUpdate
              )
              .then(numRowsAffected => {
                res.status(204).end()
              })
              .catch(next)
        })
    .delete((req, res, next) => {
        authServices.deleteUser(
            req.app.get('db'),
            req.params.user_id
        )
        .then(numRowsAffected => {
            res.status(204).end()
          })
          .catch(next)
    })

    module.exports = authRouter