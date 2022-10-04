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
const chat = new Contenedor(optionsSQLITE, 'messages');

const normalizr = require('normalizr');
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;
const schema = normalizr.schema;


    const authorSchema = new schema.Entity('autor')
    const mensajeSchema = new schema.Entity('mensaje', {
        autor: {
            id: 'mail',
            nombre: 'nombre',
            apellido: 'apellido',
            edad: 'edad',
            avatar: 'avatar',
         },
         text:'mensaje'
    })

const util = require ('util')

function print(objeto) {
    console.log(util.inspect(objeto,false,12,true))
}
console.log('------ORIGINAL------')
console.log(JSON.stringify(chat).length)

console.log('------NORMALIZADO------')
const MensajesNormalizados = normalize ( chat , mensajeSchema )
//print(mensajeSchema)
console.log(JSON.stringify( MensajesNormalizados ).length)

console.log('------DENORMALIZADO------')
const Mensajesnormalizados = normalize ( chat , mensajeSchema )
const MensajesDesnormalizados = denormalize ( Mensajesnormalizados , mensajeSchema , Mensajesnormalizados.entities )
console.log(JSON.stringify( MensajesDesnormalizados ).length)




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