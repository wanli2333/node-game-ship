import Bullet from "../server/model/bullet";
import Player from "../server/model/player";
import Prop from "../server/model/Prop";

const gameUpdates: {
    me: Player,
    others: Player[],
    bullets: Bullet[],
    props: Prop[]
}[] = [];


export function processGameUpdate(update: any){
    gameUpdates.push(update);
}

export function getCurrentState() {
    return gameUpdates[gameUpdates.length - 1];
}
