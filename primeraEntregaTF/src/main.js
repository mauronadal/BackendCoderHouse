const app = require('./server.js')

const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando http://localhost:${PORT}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))
