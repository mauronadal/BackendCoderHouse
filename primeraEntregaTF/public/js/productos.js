const apiProducts = {
    get: () => {
        return fetch('/api/productos')
            .then(data => data.json())
    },
    post: (nuevoProd) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoProd)
        }
        return fetch('/api/productos', options)
    },
    put: (idProd, nuevoProd) => {
        const options = {
            method: 'PUT',
            body: JSON.stringify(nuevoProd),
            headers: {
                'Content-Type': 'application/json',
            }
        }
        return fetch(`/api/productos/${idProd}`, options)
    },
    delete: (idProd) => {
        const options = {
            method: 'DELETE'
        }
        return fetch(`/api/productos/${idProd}`, options)
    },
}

//-------------------------------------------------------------------
// productos

actualizarListaProductos()

const formAgregarProducto = document.getElementById('formAgregarProducto')
formAgregarProducto.addEventListener('submit', e => {
    e.preventDefault()
    const producto = leerProductoDelFormulario()
    apiProducts.post(producto)
        .then(actualizarListaProductos)
        .then(() => {
            formAgregarProducto.reset()
        })
        .catch((err) => {
            alert(err.message)
        })
})

function leerProductoDelFormulario() {
    const producto = {
        title: formAgregarProducto[0].value,
        descrip: formAgregarProducto[1].value,
        price: formAgregarProducto[2].value,
        thumbnail: formAgregarProducto[3].value,
        stock: formAgregarProducto[4].value
    }
    return producto
}

function actualizarListaProductos() {
    return apiProducts.get()
        .then(prods => makeHtmlTable(prods))
        .then(html => {
            document.getElementById('productos').innerHTML = html
        })
}

function borrarProducto(idProd) {
    apiProducts.delete(idProd)
        .then(actualizarListaProductos)
}

function actualizarProducto(idProd) {
    const nuevoProd = leerProductoDelFormulario()
    apiProducts.put(idProd, nuevoProd)
        .then(actualizarListaProductos)
}


function llenarFormulario(title = '', descrip = '', price = '',thumbnail = '',stock = '') {
    formAgregarProducto[0].value = title
    formAgregarProducto[1].value = descrip
    formAgregarProducto[2].value = price
    formAgregarProducto[3].value = thumbnail
    formAgregarProducto[4].value = stock
}

function makeHtmlTable(productos) {
    let html = `
        <style>
            .table td,
            .table th {
                vertical-align: middle;
            }
        </style>`

    if (productos.length > 0) {
        html += `
        <h2>Lista de Productos</h2>
        <div class="table-responsive">
            <table class="table table-dark">
                <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Imagen</th>
                    <th>Stock</th>
                </tr>`
        for (const prod of productos) {
            html += `
                    <tr>
                    <td><a type="button" onclick="llenarFormulario('${prod.title}', '${prod.price}','${prod.price}','${prod.thumbnail}', )" title="copiar a formulario...">${prod.title}</a></td>
                    <td>$${prod.price}</td>
                    <td><img width="50" src=${prod.thumbnail} alt="not found"></td>
                    <td>${prod.stock}</td>
                    <td><a type="button" onclick="borrarProducto('${prod.id}')"><img src="https://cdn3.iconfinder.com/data/icons/social-messaging-ui-color-line/254000/82-256.png" width="48px"> Borrar</a></td>
                    <td><a type="button" onclick="actualizarProducto('${prod.id}')"><img src="https://cdn0.iconfinder.com/data/icons/seo-web-4-1/128/Vigor_edit-writing-content-editing-256.png" width="48px"> Editar</a></td>
                    </tr>`
        }
        html += `
            </table>
        </div >`
    }
    return Promise.resolve(html)
}
