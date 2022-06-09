import { getCurrentState } from "./state";
import Item from '../server/model/item';
import Player from '../server/model/player';
import Constants from '../server/model/constants';
import { ASSETS } from './asset';
import Input from './input';
import Bullet from "../server/model/bullet";
import Networking from "./networking";
import Prop, { BuffsType } from "../server/model/Prop";

export default class Render {
    canva: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    renderInterval: number;
    delayInterval: number;
    input: Input;
    delay: number;
    networking: Networking;


    constructor(canva: HTMLCanvasElement, networking: Networking) {
        this.input = new Input(canva, networking);
        this.canva = canva;
        this.ctx = canva.getContext('2d');

        this.canva.width = 900;
        this.canva.height = 650;
        // this.canva.width = window.innerWidth;
        // this.canva.height = window.innerHeight - 4;

        this.delay = 0; // 延时
        this.networking = networking;
    }

    runner() {
        const currentState = getCurrentState()
        if(!currentState) return;
        
        const { me, others, bullets, props } = currentState;
        

        // console.log(me, others);
        
        // this.ctx.clearRect(0, 0, this.canva.width, this.canva.height);

        this.ctx.strokeStyle = 'block';
        this.ctx.lineWidth = 1;

        this.renderBackground(me.x, me.y);
        this.readerBoundary(me.x, me.y);
        this.renderPlayer(me, me);
        others.forEach(this.renderPlayer.bind(this, me));
        bullets.map(this.renderBullet.bind(this, me));
        props.map(this.renderProp.bind(this, me));
        this.renderLeaderboard(me, others);
        this.renderDelay();
    }

    renderPlayer(me: Player, player: Player) {
        // this.ctx.clearRect(0, 0, 1000, 1000)

        const { x, y } = player;

        const canvasX = this.canva.width / 2 + x - me.x - Constants.PLAYER.RADUIS;
        const canvasY = this.canva.height / 2 + y - me.y - Constants.PLAYER.RADUIS; 

        this.ctx.save();
        this.ctx.translate(canvasX, canvasY); // 设置原点


        this.ctx.drawImage(ASSETS.PLAYER, 0, 0, Constants.PLAYER.RADUIS * 2, Constants.PLAYER.RADUIS * 2);
        this.ctx.restore(); // 用来恢复Canvas旋转、缩放等之后的状态，当和canvas.save( )一起使用时，恢复到canvas.save( )保存时的状态。


        // 绘制血条
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(canvasX, canvasY - 8, Constants.PLAYER.RADUIS * 2, 4);

        this.ctx.fillStyle = me.id === player.id ? 'green' : 'red';
        this.ctx.fillRect(canvasX, canvasY - 8, (Constants.PLAYER.RADUIS * 2 * player.hp / Constants.PLAYER.MAX_HP), 4);

        // 绘制用户名
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.font = "20px '微软雅黑'";
        this.ctx.fillText(player.username, canvasX + Constants.PLAYER.RADUIS, canvasY - 16);


    }
    // 绘制背景/线条
    renderBackground(x: number, y: number) {
        // 单元格相对玩家偏移
        const offsetX = x % Constants.STEP;
        const offsetY = y % Constants.STEP;

        this.ctx.save()
        this.ctx.fillStyle = '#2B2E41';
        this.ctx.fillRect(0, 0, this.canva.width, this.canva.height);
        
        this.ctx.strokeStyle = "#cccccc";
        this.ctx.lineWidth = 0.1;
        for (let i = offsetX; i < this.canva.width; i+= Constants.STEP) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canva.height);
            this.ctx.stroke();
        }

        for (let i = offsetY; i < this.canva.height; i+= Constants.STEP) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canva.width, i);
            this.ctx.stroke();
        }
        this.ctx.restore();
    }

    // 绘制边界
    readerBoundary(x: number, y: number) {
        const canvasX = this.canva.width / 2;
        const canvasY = this.canva.height / 2; 

        let linex,liney = -1;

        if(x < canvasX || (x + canvasX) > Constants.MAP_SIZE || y < canvasY || ((y + canvasY) > Constants.MAP_SIZE)) {
            
            // 横线与竖线点位置
            linex = x < canvasX ? canvasX - x : linex;
            linex = (x + canvasX) > Constants.MAP_SIZE ? Constants.MAP_SIZE + canvasX - x : linex;

            liney = y < canvasY ? canvasY - y : liney;
            liney = (y + canvasY) > Constants.MAP_SIZE ? Constants.MAP_SIZE + canvasY - y : liney;

            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = "#FFFFFF";
            if(linex > 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(linex, liney > 0 ? liney : 0);
                this.ctx.lineTo(linex, (y + canvasY) > Constants.MAP_SIZE ? 0 : canvasY * 2 );
                this.ctx.closePath();
                this.ctx.stroke();
            }
            if(liney > 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(linex > 0 ? linex : 0, liney);
                this.ctx.lineTo((x + canvasX) > Constants.MAP_SIZE ? 0 : canvasX * 2, liney);
                this.ctx.closePath();
                this.ctx.stroke();
            }
        }
    }

    // 绘制子弹
    renderBullet(me: Item, bullet: Bullet) {
        const { x, y, rotate } = bullet;

        this.ctx.save();
        // 子弹位置设为中心点
        this.ctx.translate(this.canva.width / 2 + x - me.x, this.canva.height / 2 + y - me.y);
        // 设置旋转角度
        // this.ctx.rotate((rotate * (180 / Math.PI) + 90) * Math.PI / 180);
        this.ctx.rotate(rotate + Math.PI / 2);
        this.ctx.drawImage(ASSETS.BULLET, -Constants.BULLET.RADUIS, -Constants.BULLET.RADUIS, Constants.BULLET.RADUIS * 2, Constants.BULLET.RADUIS * 2);
        this.ctx.restore();
    }

    // 绘制排行榜
    renderLeaderboard(me: Player, others: Player[]) {
        const list = [...others, me].sort((a, b) =>  b.score- a.score).slice(0, 10);
        let html = '';
        list.forEach((i, idx) => {
            html += `<li>
                <span>${idx + 1}</span>
                <span>${i.username}</span>
                <span>${i.score}</span>
            </li>`
        });
        document.querySelector('.leaderboard ul').innerHTML = html;
    }

    // 绘制道具
    renderProp(me: Player, prop: Prop) {
        const { x, y } = prop;
        const canvasX = this.canva.width / 2 + x - me.x - Constants.PROP.RADUIS;
        const canvasY = this.canva.height / 2 + y - me.y - Constants.PROP.RADUIS; 

        this.ctx.save();
        const img = prop.type === BuffsType.DRUG ? ASSETS.DRUG : ASSETS.HURT;
        this.ctx.drawImage(img, canvasX, canvasY, Constants.PROP.RADUIS * 2, Constants.PROP.RADUIS * 2)
        this.ctx.restore();
    }

    // 延迟
    renderDelay() {
        const color = this.delay < 100 ? 'springgreen' : (this.delay < 200 ? 'yellow' : 'red');

        this.ctx.fillStyle = color;
        this.ctx.textAlign = 'right';
        this.ctx.font = "10px '微软雅黑'";

        this.ctx.fillText(this.delay + 'ms', this.canva.width - 5, this.canva.height - 5);
    }

    startRendering() {
        this.stopRendering();

       
        this.input.startCapturingInput();

        this.networking.getDelay((date: any) => {
            this.delay = (new Date().getTime() - date) / 2;
        });

        this.delayInterval = window.setInterval(() => {
            this.networking.ping();
        }, 1000)

        this.renderInterval = window.setInterval(() => {
            this.runner();
        }, 1000 / 60);
    }

    stopRendering() {
        this.input.stopCapturingInput();
        clearInterval(this.delayInterval);
        clearInterval(this.renderInterval);
    }
}
