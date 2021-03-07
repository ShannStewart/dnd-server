const path = require('path')
const express = require('express')
const xss = require('xss')
const charaServices = require('./chara-service');

const charaRouter = express.Router();
const jsonParser = express.json();

const cleanNotes = charas => ({
    id: charas.id,
    name: charas.name,
    race: charas.race,
    class: charas.class,
    skills: charas.skills,
    str: charas.str,
    dex: charas.dex,
    con: charas.con,
    int: charas.int,
    wis: charas.wis,
    cha: charas.cha,
    userid: xss(charas.userid)
})

charaRouter
    .route('/')
    .get(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        charaServices.getAllCharas(knexInstance)
        .then( charas => {
            res.json(charas.map(cleanNotes))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name, race, job, skills, str, dex, con, int, wis, cha, userid } = req.body
        const newChara = {};
        newChara.userid = userid;

        for (const [key, value] of Object.entries(newChara)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                  })
            }
        }

        newChara.name = name;
        newChara.race = race;
        newChara.class = job;
        newChara.skills = skills;
        newChara.str = str;
        newChara.dex = dex;
        newChara.con = con;
        newChara.int = int;
        newChara.wis = wis;
        newChara.cha = cha;

        charaServices.insertChara(
            req.app.get('db'),  
            newChara
        )
        .then(chara => {
            res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${chara.id}`))
            .json(chara)
        })
        .catch(next)
    })

    charaRouter
    .route('/:chara_id')
    .all((req, res, next) => {
        charaServices.getById(
            req.app.get('db'),
            req.params.chara_id
          )
        .then(chara => {
            if (!chara){
                return res.status(404).json({
                    error: { message: `Folder doesn't exist` }
                  })
            }
            res.chara = chara;
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
          res.json(cleanNotes(res.chara))  
        })
    .patch(jsonParser, (req, res, next) => {
        const { name, race, job, skills, str, dex, con, int, wis, cha, userid } = req.body
            const charaToUpdate = { name, race, job, skills, str, dex, con, int, wis, cha, userid }

              charaServices.updateChara(
                  req.app.get('db'),
                  req.params.chara_id,
                  charaToUpdate
              )
              .then(numRowsAffected => {
                res.status(204).end()
              })
              .catch(next)
        })
    .delete((req, res, next) => {
        charaServices.deleteChara(
            req.app.get('db'),
            req.params.chara_id
        )
        .then(numRowsAffected => {
            res.status(204).end()
          })
          .catch(next)
    })

    module.exports = charaRouter