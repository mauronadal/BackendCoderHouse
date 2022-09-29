const optionsSQLITE = {
    client: 'sqlite3',
    connection: {
        filename: './DB/chats.sqlite'},
    useNullAsDefault: true
} 

const optionsSQL = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'productos',
        port: '3307'

    }
}

module.exports = { optionsSQLITE, optionsSQL };