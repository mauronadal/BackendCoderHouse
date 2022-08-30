const express = require('express')
const { Router } = express


const ContenedorArchivo = require('./contenedores/ContenedorArchivo.js')

//--------------------------------------------
// instancio servidor y persistencia

const app = express()

const apiProducts = new ContenedorArchivo('dbProductos.json')
const apiCars = new ContenedorArchivo('dbCarritos.json')

//--------------------------------------------
// permisos de administrador

const Admin = true

function errorNoEsAdmin(ruta, metodo) {
    const error = {
        error: -1,
    }
    if (ruta && metodo) {
        error.descripcion = `ruta '${ruta}' metodo '${metodo}' no autorizado`
    } else {
        error.descripcion = 'no autorizado'
    }
    return error
}

function permisoAdmin(req, res, next) {
    if (!Admin) {
        res.json(errorNoEsAdmin())
    } else {
        next()
    }
}

//--------------------------------------------


// configuro router de productos

const productosRouter = new Router()

productosRouter.get('/', async (req, res) => {
    const productos = await apiProducts.listarAll()
    res.json(productos)
})

productosRouter.get('/:id', async (req, res) => {
    res.json(await apiProducts.listar(req.params.id))
})

productosRouter.post('/', permisoAdmin,  async (req, res) => {
    console.log(req.body)
    res.json({ id: await apiProducts.guardar(req.body) })
})

productosRouter.put('/:id', permisoAdmin, async (req, res) => {
    res.json(await apiProducts.actualizar(req.body, req.params.id))
})

productosRouter.delete('/:id', permisoAdmin, async (req, res) => {
    res.json(await apiProducts.borrar(req.params.id))
})

//--------------------------------------------
// configuro router de carritos

const carritosRouter = new Router()

carritosRouter.get('/', async (req, res) => {
    res.json((await apiCars.listarAll()).map(c => c.id))
})

carritosRouter.post('/', async (req, res) => {
    timestamp = Date.now();
    res.json({ id: await apiCars.guardar({ timestamp, productos: [] }) })
})

carritosRouter.delete('/:id', async (req, res) => {
    res.json(await apiCars.borrar(req.params.id))
})

carritosRouter.get('/:id/productos', async (req, res) => {
    const carrito = await apiCars.listar(req.params.id)
    res.json(carrito.productos)
})

carritosRouter.post('/:id/productos', async (req, res) => {
    const carrito = await apiCars.listar(req.params.id)
    const producto = await apiProducts.listar(req.body.id)
    carrito.productos.push(producto)
    await apiCars.actualizar(carrito, req.params.id)
    res.end()
})

carritosRouter.delete('/:id/productos/:idProd', async (req, res) => {
    const carrito = await apiCars.listar(req.params.id)
    const index = carrito.productos.findIndex(p => p.id == req.params.idProd)
    if (index != -1) {
        carrito.productos.splice(index, 1)
        await apiCars.actualizar(carrito, req.params.id)
    }
    res.end()
})



//--------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/productos', productosRouter)
app.use('/api/carritos', carritosRouter)


module.exports = app