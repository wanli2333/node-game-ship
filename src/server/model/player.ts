import Item from "./item";
import Constants from './constants';
import Bullet from "./bullet";
import Prop, { BuffsType } from "./Prop";

export default class Player extends Item{
    move: { left: number; right: number; top: number; bottom: number; [x: string]: number };
    username: string;
    hp: number;     // hp
    speed: number; // 速度
    score: number; // 分数
    buffs: Map<BuffsType, Prop>; // buffs
    fire: boolean;
    fireTime: number;
    fireMouseDir: number;
    hurt: number;

    constructor(data: { username?: any; id?: string; x?: number; y?: number; w?: number; h?: number; }){
        super(data)
    
        this.move = {
          left: 0, right: 0,
          top: 0, bottom: 0
        };
        this.username = data.username;
        this.hp = Constants.PLAYER.MAX_HP;
        this.speed = Constants.PLAYER.SPEED;
        this.hurt = Constants.PLAYER.HURT;
        this.score = 0;
        this.buffs = new Map();

        // 开火
        this.fire = false;
        this.fireMouseDir = 0;
        this.fireTime = 0; //点击时间

    }

    update(dt: number) {

        // 玩家移动位置
        this.x += (this.move.left + this.move.right) * this.speed * dt;
        this.y += (this.move.top + this.move.bottom) * this.speed * dt;
        this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
        this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

        // 射击
        this.fireTime -= dt;
        if(this.fire && this.fireTime <= 0) {
            this.fireTime = Constants.PLAYER.FIRE;
            return new Bullet(this.id, this.x, this.y, this.fireMouseDir);
        }



        // 更新buff状态
        for (const type of this.buffs.keys()) {
            const buffs = this.buffs.get(type);
            if(buffs.time <= 0) {
                buffs.remove(this);
                this.buffs.delete(type);
            } else {
                buffs.update(dt);
            }
        }
    }

    serializeForUpdate() {
        return {
          ...(super.serializeForUpdate()),
          username: this.username,
          score: this.score,
          hp: this.hp,
        //   buffs: this.buffs.map(item => item.serializeForUpdate())
        }
    }

    // 计算伤害
    takeBulletDamage(player: Player) {
        this.hp = this.hp < 0 ? 0 : this.hp - player.hurt;
    }

    pushBuff(prop: Prop) {
        prop.add(this);
        this.buffs.set(prop.type, prop);
    }
}