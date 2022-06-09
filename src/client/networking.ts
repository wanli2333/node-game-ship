import { ManagerOptions, Socket, SocketOptions }  from 'socket.io-client';
import Constants from '../server/model/constants';
import { processGameUpdate } from './state'

// js 方式引入减小包体积
declare function io(uri: string, opts?: Partial<ManagerOptions & SocketOptions>): Socket;

// const socketProtocal = (window.location.protocol.includes('https') ? 'wss' : 'ws');
// const socket = io(`${socketProtocal}://${window.location.host}`, { reconnection: false });

// export const sendPing = () => {
//     socket.emit(Constants.MSG_TYPES.GET_DELAY);
// }

// export const getDelay = (callback: (arg0: number) => void) => {
//     const prev = new Date().getTime();
//     socket.on(Constants.MSG_TYPES.GET_DELAY, () => {
//         const now = new Date().getTime();
//         callback((now - prev) / 2);
//     });
// }


export default class Networking {
    socketProtocal: string;
    socket: Socket;
    onGameOver: (...args: any[]) => void;
    delay: number;
    

    constructor() {
        this.socketProtocal = (window.location.protocol.includes('https') ? 'wss' : 'ws');
        this.socket = io(`${this.socketProtocal}://${window.location.host}`, { reconnection: true });

        this.socket.on('connect', this.connectPromise);
        this.delay = 0;
    }

    private connectPromise() {
        return new Promise<void>(resolve => {
            resolve();
        });
    }

    connect() {
        return this.connectPromise().then(() => {
            console.log('Connect to server!');
            this.socket.on(Constants.MSG_TYPES.UPDATE, processGameUpdate);
            this.socket.on(Constants.MSG_TYPES.GAME_OVER, this.onGameOver);
            this.socket.on('disconnect', this.onGameOver);
        });
    }

    ping() {
        this.socket.emit(Constants.MSG_TYPES.GET_DELAY, new Date().getTime());
    }

    getDelay(callback: { (date: any): void; (arg0: number): void; }) {
        this.socket.on(Constants.MSG_TYPES.GET_DELAY, (date: number) => {
            callback(date);
        });
    }

    emitControl(data: {action: string, data: Boolean | number}) {
        this.socket.emit(Constants.MSG_TYPES.INPUT, data);
    }

    play(username: string){
        this.socket.emit(Constants.MSG_TYPES.JOIN_GAME, username);
    }
}