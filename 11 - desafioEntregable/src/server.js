const faker = require ('faker');
faker.locate = 'es';

const express = require('express');
const http = require('http');
const app = express();
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const Contenedor = require('./contenedor');
const { optionsSQLITE, optionsSQL } = require('../options/config');

const server = http.createServer(app);
const io = new Server(server);

const contenedor = new Contenedor(optionsSQL, 'productos');
const chat = new Contenedor(optionsSQLITE, 'messages')





app.use(express.static('public'));

app.set('views', './src/views');
app.set('view engine', 'hbs');

app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}))

io.on('connection', async(socket) => {
    console.log('Usuario conectado')
    
    const productos = await contenedor.getAll();
    socket.emit('bienvenidoLista', productos )
    
    const mensajes = await chat.getAll();
    socket.emit('listaMensajesBienvenida', mensajes)
    
    socket.on('nuevoMensaje', async(data) => {
        await chat.save(data);
        
        const mensajes = await chat.getAll();
        io.sockets.emit('listaMensajesActualizada', mensajes)
    })

    socket.on('productoAgregado', async(data) => {
        console.log('Alguien presionó el click')
        await contenedor.save(data);
        
        const productos = await contenedor.getAll();
        io.sockets.emit('listaActualizada', productos);
    })
    
    socket.on('disconnect', () => {
        console.log('Usuario desconectado')
    })
    
})

function crearCombinacionesAlAlzar() {
    return {
        title: faker.commerce.product(),
        price: faker.commerce.price(),
        thumbnail: faker.image.imageUrl()
    }
}


app.get('/productos', async(req, res) => {
    const productos = await contenedor.getAll();
    res.render('pages/list', {productos})
})

app.post('/productos', async(req,res) => {
    const {body} = req;
    await contenedor.save(body);
    res.redirect('/');
})

app.get('/', (req,res) => {
    res.render('pages/form', {})
})

app.get('/api/productos-test', (req, res) => {
    const objs = [];
    for (let i = 0; i < 5; i++) {
        objs.push(crearCombinacionesAlAlzar());
    }
    res.json(objs);
})


const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
})

server.on('error', (err) => console.log(err))