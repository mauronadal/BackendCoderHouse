
const Contenedor = require('./Contenedor.js');


async function test() {
	const data = new Contenedor('./productos.txt');
	// Save
	const products = await data.save({ title: "producto", price: 150, thumbnail: "url de la foto del producto" });
	
	// getAll
	console.log('Todos los productos');
	let allProducts = await data.getAll();
	console.log(allProducts);

	// getByIg
	//console.log('Producto con ID 1');
	//let product = await data.getById(1);
	//console.log(product);

	// deleteAll
	//let deleteAll = await data.deleteAll();
	//console.log(deleteAll);
	
	// deleteById
	//let deleteById = await data.deleteById(4);
	//console.log(deleteById);
}

test();