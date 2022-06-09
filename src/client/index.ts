import { ASSETS, initAssets } from './asset';
import Networking from './networking';
import Render from './render';
import './css/index.css';

declare global {
    interface Window {
        render: Render
    }
}


function $(name: string): HTMLElement|HTMLInputElement {
    return document.querySelector(name);
}

const networking = new Networking();
networking.onGameOver = gameOver;

window.onload = () => {
    initAssets().then(() => {
        console.warn('资源加载完成', ASSETS);
        return networking.connect();
    }).then(() => {
        console.warn('服务器连接成功');
        joinGame();
    }).catch(err => {
        console.error(err);
    });
}

function joinGame() {
    const canvas = document.getElementById('cnv') as HTMLCanvasElement;

    // $('.Join-box').classList.toggle('hide');
    // $('.game').classList.toggle('hide');
    $('input').focus();

    $('button').onclick = () => {
        const val = ($('input') as HTMLInputElement).value;
        if(!val.trim()) {
            alert('名称不能为空')
            return;
        } else {
            $('.Join-box').classList.toggle('hide');
            $('.game').classList.toggle('hide');

            networking.play(val);
            if(!window.render) {
                window.render = new Render(canvas, networking);
                window.render.startRendering();
            }
        }
    }
}

function gameOver(){
    alert('你GG了，重新进入游戏吧。');
    $('.Join-box').classList.toggle('hide');
    $('.game').classList.toggle('hide');
    joinGame();
}