const fs = require('fs');

class Contenedor {
    constructor(ruta) {
        this.ruta = ruta;
        this.products = this.readData(this.ruta) || [];
    }
    
    async generateId() {
        try {
            this.products = await this.getAll() || [];
            let maxId = this.products.length;
            this.products.forEach(p => {
                p.id > maxId ? maxId = p.id : maxId
            })
            return maxId + 1;
        } catch (err) {
            console.log(err);
        }
    }
  
    async save(prod) {
        try {
            const readFile = await this.getAll();
            if (!readFile) {
                prod.id = await this.generateId();
                this.products.push(prod);
                this.writeData(this.products);
                return prod.id;
            }
            this.products = readFile;
            prod.id = await this.generateId();
            this.products.push(prod);
            this.writeData(this.products);
            return prod.id;
        } catch (err) {
            console.log(err);
        }
    }
  
    async getById(id) {
        try {
            this.products = await this.getAll();
            const prod = this.products.find(p => p.id === Number(id));
            return prod ? prod : null;
        } catch (err) {
            console.log(err);
        }
    }
  
    async getAll() {
        try {
            const data = await this.readData(this.ruta);
            return data;
        } catch (err) {
            console.log(err);
        }
    }
    

    async deleteById(id) {
        try {
            this.products = await this.getAll();
            this.products = this.products.filter(p => p.id != Number(id));
            this.writeData(this.products);
        } catch (err) {
            console.log(err);
        }
    }
 
    async deleteAll() {
        try {
            this.products = await this.getAll();
            this.products = [];
            this.writeData(this.products);
        } catch (err) {
            console.log(err);
        }
    }
    readData(path) {
        const data = JSON.parse(fs.readFileSync(path, 'utf-8'));
        return data;
    }
    writeData(products) {
        fs.writeFileSync(this.ruta, JSON.stringify(products, null, 2));
    }
}

module.exports = Contenedor;