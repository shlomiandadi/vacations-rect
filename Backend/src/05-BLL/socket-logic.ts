import { Server as HttpServer } from "http";
import { Server as SocketIoServer, Socket } from "socket.io";
import VacationModel from "../03-Models/vacation-model";

let socketIoServer: SocketIoServer;

function initSocketIo(httpServer: HttpServer) {

    const options = {
        cors: { origin: "*",methods:["GET","POST"] }
    };

    socketIoServer = new SocketIoServer(httpServer, options);

    socketIoServer.sockets.on("connection", (socket: Socket) => {

        console.log("One client has been connected");

        //disconnect
        socket.on("disconnect", () => {
            console.log("one client has been disconnect");
        });
    });
}

function emitAddVacation(vacation: VacationModel): void {
    socketIoServer.sockets.emit("admin-add-vacation", vacation);
}

function emitUpdateVacation(vacation: VacationModel): void {
    socketIoServer.sockets.emit("admin-update-vacation", vacation);

}

function emitDeleteVacation(id: number): void {
    socketIoServer.sockets.emit("admin-delete-vacation", id);

}

export default {
    initSocketIo,
    emitAddVacation,
    emitUpdateVacation,
    emitDeleteVacation
}