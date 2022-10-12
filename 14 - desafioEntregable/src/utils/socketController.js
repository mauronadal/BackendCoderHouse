import MessagesController from "../../controller/messagesController.js";
import { normalizeMessages } from "../normalizr/normalizeMessages.js";

const messagesController = new MessagesController();

export const socketController = (io) => {
  io.on("connection", async (socket) => {
    console.log("Nuevo Cliente Conectado: " + socket.id);
    io.sockets.emit(
      "messages",
      normalizeMessages(await messagesController.getAll())
    );
    //queda escuchando el siguiente socket, socket es el usuario/cliente
    socket.on("new-message", async (msjClient) => {
      await messagesController.save(JSON.parse(msjClient));
      io.sockets.emit(
        "messages",
        normalizeMessages(await messagesController.getAll({ sort: true }))
      );
    });
  });
};
