import Constants from "../model/constants";
import Item from "./item";
import Player from "./player";

export enum BuffsType {
    DRUG,
    HURT
}

export default class Prop extends Item {
    isOver: boolean;
    time: number;
    type: BuffsType;
    constructor() {
        const x = (Math.random() * .5 + .25) * Constants.MAP_SIZE;
        const y = (Math.random() * .5 + .25) * Constants.MAP_SIZE;
        super({
            x, y,
            w: Constants.PROP.RADUIS,
            h: Constants.PROP.RADUIS
        });

        // 是否被获取
        this.isOver = false;
        // 持续时间
        this.time = 10;
        // 道具类型
        this.type = Math.random() > .5 ? BuffsType.DRUG : BuffsType.HURT;
    }

    add(player: Player) {
        switch (this.type) {
            case BuffsType.DRUG:
                this.time = 0;
                player.hp = Math.min(player.hp + 30, 100)
                break;
            case BuffsType.HURT:
                player.hurt = Constants.PLAYER.HURT + 5;
                break;
            default:
                break;
        }
    }

    // 移除buffs
    remove(player: Player) {
        switch (this.type) {
            case BuffsType.DRUG:
                break;
            case BuffsType.HURT:
                player.hurt = Constants.PLAYER.HURT;
                break;
            default:
                break;
        }
    }

    update(dt: number) {
        this.time -= dt;
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            type: this.type,
        }
    }
}