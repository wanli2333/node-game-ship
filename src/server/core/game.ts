import { Socket } from "socket.io";
import Bullet from "../model/bullet";
import Constants from "../model/constants";
import Player from '../model/player';
import Prop from "../model/Prop";


export default class Game {
    sockets: Map<string, Socket>;
    players: Map<string, Player>;
    lastUpdateTime: number;
    bullets: Bullet[];
    props: Prop[];

    createPropTime: number;

    constructor() {
        this.sockets = new Map();
        this.players = new Map();
        this.bullets = [];
        this.props = [];

        this.lastUpdateTime = Date.now();
        this.createPropTime = 0;

        setInterval(this.update.bind(this), 1000 / 60);
        // setInterval(this.update.bind(this), 1000);
    }

    update() {
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;


        // 创建buffs
        this.createPropTime -= dt;
        this.props = this.props.filter(item => !item.isOver);
        if(this.createPropTime <= 0 && this.props.length < 10) {
            this.createPropTime = Constants.PROP.CREATE_TIME;
            this.props.push(new Prop());
        }


        // 子弹移动
        this.bullets = this.bullets.filter(i => !i.isOver);
        this.bullets.map(i=> i.update(dt));


        // 玩家移动
        for (const playerID of this.sockets.keys()) {
            const player = this.players.get(playerID);
            const bullet = player.update(dt);
            if(bullet) {
                this.bullets.push(bullet);
            }
        }

        // 判断玩家与子弹是否重合
        this.collisionsBullet([...this.players.values()], this.bullets);
        // 判断玩家与道具是否重合
        this.collisionsProp([...this.players.values()], this.props);


        // 向客户端发送
        for (const playerID of this.sockets.keys()) {
            const socket = this.sockets.get(playerID);
            const player = this.players.get(playerID);

            if(player.hp <= 0){
                socket.emit(Constants.MSG_TYPES.GAME_OVER)
                this.disconnect(socket);
            }

            socket.emit(
                Constants.MSG_TYPES.UPDATE,
                this.createUpdate(player)
            )
        }
    }

    createUpdate(player: Player) {
        const otherPlayer = new Map([...this.players]);
        otherPlayer.delete(player.id);

        // console.log(otherPlayer.values());
        return {
            t: Date.now(),
            me: player.serializeForUpdate(),
            bullets: this.bullets.map(bullet => bullet.serializeForUpdate()),
            others: [...otherPlayer.values()].map(player => player.serializeForUpdate()),
            props: this.props.map(prop => prop.serializeForUpdate()),
        }
    }

    joinGame(socket: Socket, username: string) {
        this.sockets.set(socket.id, socket)


        // 玩家位置随机生成
        const x = (Math.random() * .5 + .25) * Constants.MAP_SIZE;
        const y = (Math.random() * .5 + .25) * Constants.MAP_SIZE;

        this.players.set(socket.id, new Player({
            id: socket.id,
            username,
            x,
            y,
        }));
    }

    // 接受客户端消息
    handleInput(socket: Socket, item: { action: string, data: boolean|number }) {
        const player = this.players.get(socket.id);
        if(player) {
            const data = item.action.split('-');
            const type = data[0];
            const value = data[1];
            switch (type) {
                case 'move':
                    player.move[value] = item.data === 0 ? 0 : item.data ? 1 : -1;
                    break;
                case 'dir':
                    player.fireMouseDir = item.data as number;
                    break;
                case 'bullet':
                    player.fire = item.data as boolean;
            
                default:
                    break;
            }
        }
    }

    collisionsBullet(players: Player[], bullets: Bullet[]) {
        for (let i = 0; i < players.length; i++) {
            for (let j = 0; j < bullets.length; j++) {
                const player = players[i];
                const bullet = bullets[j];

                if(player.id !== bullet.parentID && player.distanceTo(bullet) <= (Constants.PLAYER.RADUIS + Constants.BULLET.RADUIS)) {
                    bullet.isOver = true;
                    player.takeBulletDamage(this.players.get(bullet.parentID));
                    if(player.hp <= 0) {
                        this.players.get(bullet.parentID).score++;
                    }
                    break;
                }
            }
        }
    }

    collisionsProp(players: Player[], props: Prop[]) {
        for (let i = 0; i < players.length; i++) {
            for (let j = 0; j < props.length; j++) {
                const player = players[i];
                const prop = props[j];

                if(player.distanceTo(prop) <= Constants.PLAYER.RADUIS + Constants.PROP.RADUIS){
                    prop.isOver = true;
                    player.pushBuff(prop);
                    break;
                }
            }
        }
    }


    // 清除
    disconnect(socket: Socket) {
        this.players.delete(socket.id);
        this.sockets.delete(socket.id);
    }
}

