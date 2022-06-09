interface assetObj {
    PLAYER?: HTMLImageElement,
    BULLET?: HTMLImageElement,
    DRUG?: HTMLImageElement,
    HURT?: HTMLImageElement,
    [x: string]: HTMLImageElement;
}

const ASSET_NAMES = {
    PLAYER: '/assets/player.svg',
    BULLET: '/assets/bullet.svg',
    DRUG: '/assets/drug.svg',
    HURT: '/assets/hurt.svg',
}

export const ASSETS:assetObj = {};


function downloadImage(path: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            resolve(img);
        }
        img.onerror = (err) => {
            console.warn('load error', err);
            reject(err);
        }
    });
}

export function initAssets() {
    const funs = Object.keys(ASSET_NAMES).map(async i => {
        ASSETS[i] = await downloadImage((ASSET_NAMES as any)[i]);
    });
    return Promise.all(funs);
}
