export default class Item {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;

    constructor(data: { id?: string, x?: number, y?: number, w?: number, h?: number } = {}) {
        this.id = data.id;
        this.x = data.x;
        this.y = data.y;
        this.w = data.w;
        this.h = data.h;
    }

    serializeForUpdate(){
        return {
            id: this.id,
            x: Math.floor(this.x),
            y: Math.floor(this.y),
        }
    }

    distanceTo(item: Item){
        const dx = this.x - item.x;
        const dy = this.y - item.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}