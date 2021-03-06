const authServices = {
    getAllUsers(knex) {
        return knex
        .select('*')
        .from("auth")
    },
    insertUser(knex, newUser) {
        return knex
        .insert(newUser)
        .into("auth")
        .returning('*')
        .then(rows => {
            return rows[0]
          })
    },
    getById(knex, id) {
        return knex
        .from("auth")
        .select('*')
        .where('id', id)
        .first()
    },
    updateUser(knex, id, newUserInfo){
        return knex("auth")
        .where({ id })
        .update(newUserInfo)
    },
    deleteUser(knex, id){
        return knex("auth")
        .where({ id })
        .delete()
    }
}

module.exports = authServices;