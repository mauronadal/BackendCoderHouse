const { optionsSQL } = require('./options/config.js');
const knex = require('knex') (optionsSQL);


knex.schema.createTable('productos', table => {
    table.increments("id").primary().notNullable(),
      table.string("title", 100).notNullable(),
      table.float("price").notNullable(),        
      table.string("thumbnail", 200)
     
})
    .then(() => console.log('tabla creada'))
    .catch((err) => { console.log(err); throw err })
    .finally(() => {
        knex.destroy()
    });