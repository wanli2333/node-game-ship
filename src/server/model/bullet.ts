import Item from "./item";
import Constants from './constants';
import { shortLink } from '../../shared/util';

export default class Bullet extends Item {
    dir: number;
    rotate: number;
    parentID: any;
    isOver: boolean;
    constructor(parentID: string, x: number, y: number, dir: number) {
        super({
            id: shortLink(),
            x,
            y,
            w: Constants.BULLET.RADUIS,
            h: Constants.BULLET.RADUIS,
        });

        this.rotate = 0;
        this.dir = dir;
        this.parentID = parentID;
        this.isOver = false;
    }

    update(dt: number) {
        this.x += dt * Constants.BULLET.SPEED * Math.cos(this.dir);
        this.y += dt * Constants.BULLET.SPEED * Math.sin(this.dir);

        // this.rotate += dt * 360;
        // this.rotate = this.dir;
        this.rotate = this.dir;
        if(this.x < 0 || this.y < 0 || this.x > Constants.MAP_SIZE || this.y > Constants.MAP_SIZE) {
            this.isOver = true;
        }
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            rotate: this.rotate
        }
    }
}