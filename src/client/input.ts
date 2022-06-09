import Networking from './networking';


export default class Input {
    canvas: HTMLCanvasElement;
    networking: Networking;
    constructor(canvas: HTMLCanvasElement, networking: Networking) {
        this.canvas = canvas;
        this.networking = networking;
    };

    onKeydown(ev: KeyboardEvent) {
        const key = ev.key;
        switch (key) {
            case 'W':
            case 'w':
            case 'ArrowUp':
                this.networking.emitControl({ action: 'move-top', data: false });
                break;
            case 'D':
            case 'd':
            case 'ArrowRight':
                this.networking.emitControl({ action: 'move-right', data: true });
                break;
            case 'S':
            case 's':
            case 'ArrowDown':
                this.networking.emitControl({ action: 'move-bottom', data: true });
                break;
            case 'A':
            case 'a':
            case 'ArrowLeft':
                this.networking.emitControl({ action: 'move-left', data: false });
                break;
        
            default:
                break;
        }
    }

    onKeyup(ev: KeyboardEvent) {
        const key = ev.key;
        switch (key) {
            case 'W':
            case 'w':
            case 'ArrowUp':
                this.networking.emitControl({ action: 'move-top', data: 0 });
                break;
            case 'D':
            case 'd':
            case 'ArrowRight':
                this.networking.emitControl({ action: 'move-right', data: 0
                });
                break;
            case 'S':
            case 's':
            case 'ArrowDown':
                this.networking.emitControl({ action: 'move-bottom', data: 0 });
                break;
            case 'A':
            case 'a':
            case 'ArrowLeft':
                this.networking.emitControl({ action: 'move-left', data: 0 });
                break;
            default:
                break;
        }
    }

    getMouseDir(ev: MouseEvent){
        const dir = Math.atan2(ev.offsetY - this.canvas.height / 2, ev.offsetX - this.canvas.width / 2);
        return dir;
    }

    onMousemove(ev: MouseEvent){    
        if(ev.button === 0){
            this.networking.emitControl({ action: 'dir', data: this.getMouseDir(ev) });
        }
    }

    onMousedown(ev: MouseEvent){
        if(ev.button === 0){
            this.networking.emitControl({ action: 'bullet', data: true });
        }
    }

    onMouseup(ev: MouseEvent){
        if(ev.button === 0){
            this.networking.emitControl({ action: 'bullet', data: false });
        }
    }

    startCapturingInput() {
        window.addEventListener('keydown', this.onKeydown.bind(this));
        window.addEventListener('keyup', this.onKeyup.bind(this));
        this.canvas.addEventListener('mousedown', this.onMousedown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMousemove.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseup.bind(this));
        this.canvas.addEventListener('mouseleave', this.onMouseup.bind(this));
    }

    stopCapturingInput() {
        window.removeEventListener('keydown', this.onKeydown.bind(this));
        window.removeEventListener('keyup', this.onKeyup.bind(this));
        this.canvas.removeEventListener('mousedown', this.onMousedown.bind(this));
        this.canvas.removeEventListener('mousemove', this.onMousemove.bind(this));
        this.canvas.removeEventListener('mouseup', this.onMouseup.bind(this));
        this.canvas.addEventListener('mouseleave', this.onMouseup.bind(this));
    }
}
