import mongoose from 'mongoose'
import config from '../config.js'

await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)

class ContenedorMongoDb {

    constructor(nombreColeccion, esquema) {
        this.coleccion = mongoose.model(nombreColeccion, esquema)
    }

    async listar(id) {
        try {
            const docs = await this.coleccion.find({ '_id': id }, { __v: 0 });
            if (docs.length == 0) {
              throw new Error(`No existe el documento con id ${id}`);
            } else {
              const result = renameField(asPojo(docs[0]), '_id', 'id');
              return result;
            }
          } catch (error) {
            throw new Error(`Error al listar el documento con id ${id}: ${error}`);
          }
    }

    async listarAll() {
        try {
            const docs = await this.coleccion.find({}, { __v: 0 });
            const result = docs.map(doc => renameField(asPojo(doc), '_id', 'id'));
            return result;
          } catch (error) {
            throw new Error(`Error al listar los documentos: ${error}`);
          }
    }

    async guardar(nuevoElem) {
        try {
            const doc = new this.coleccion(nuevoElem);
            const result = await doc.save();
            return renameField(asPojo(result), '_id', 'id');
          } catch (error) {
            throw new Error(`Error al guardar el documento: ${error}`);
          }
    }

    async actualizar(nuevoElem) {
        try {
            const id = objeto.id;
            const doc = removeField(nuevoElem, 'id');
            const result = await this.coleccion.updateOne({ '_id': id }, doc);
            if (result.n == 0) {
              throw new Error(`No existe el documento con id ${id}`);
            } else {
              return id;
            }
          } catch (error) {
            throw new Error(`Error al actualizar el documento: ${error}`);
          } 
    }

    async borrar(id) {
        try {
            const result = await this.coleccion.deleteOne({ '_id': id });
            if (result.n == 0) {
              throw new Error(`No existe el documento con id ${id}`);
            } else {
              return id;
            }
          } catch (error) {
            throw new Error(`Error al borrar el documento con id ${id}: ${error}`);
          }
    }

    async borrarAll() {
        try {
            const result = await this.coleccion.deleteMany({});
            return result;
          } catch (error) {
            throw new Error(`Error al borrar los documentos: ${error}`);
          }
        }
    }


export default ContenedorMongoDb