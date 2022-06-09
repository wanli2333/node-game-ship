import { Socket } from "socket.io";
import Game from "./game";
import Constants from "../model/constants";

export default class Scoket {
    game: Game;
    io: Socket;
    constructor(game: Game, io: any) {
        this.game = game;
        this.io = io;
    }
    listen(socket: Socket) {
        console.log(`Player connected! Socket Id: ${socket.id}`);
        socket.on(Constants.MSG_TYPES.JOIN_GAME, this.game.joinGame.bind(this.game, socket));
        socket.on(Constants.MSG_TYPES.INPUT, this.game.handleInput.bind(this.game, socket));
        socket.on(Constants.MSG_TYPES.GET_DELAY, data => {
            socket.emit(Constants.MSG_TYPES.GET_DELAY, data);
        });
        socket.on('disconnect', this.game.disconnect.bind(this.game, socket))
    }
}