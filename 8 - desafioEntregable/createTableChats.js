const { optionsSQLITE } = require('./options/config.js');
const knex = require('knex') (optionsSQLITE);


knex.schema.createTable('messages', table => {
    table.increments('id')
      table.string('date')
      table.string('email')
      table.string('message')
      
})
    .then(() => console.log('tabla creada'))
    .catch((err) => { console.log(err); throw err })
    .finally(() => knex.destroy()
    );