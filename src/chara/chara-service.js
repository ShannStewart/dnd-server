const charaServices = {
    getAllCharas(knex) {
        return knex
        .select('*')
        .from("chara")
    },
    insertChara(knex, newChara) {
        return knex
        .insert(newChara)
        .into("chara")
        .returning('*')
        .then(rows => {
            return rows[0]
          })
    },
    getById(knex, id) {
        return knex
        .from("chara")
        .select('*')
        .where('id', id)
        .first()
    },
    updateChara(knex, id, newCharaInfo){
        return knex("chara")
        .where({ id })
        .update(newCharaInfo)
    },
    deleteChara(knex, id){
        return knex("chara")
        .where({ id })
        .delete()
    }
}

module.exports = charaServices;