/**
 * 获取短链
 * @param {*} len 
 * @returns 
 */
export function shortLink(len = 6) {
    const chars = '0123456789bcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ'.split('');
    let link = '';
    for (let i = 0; i < len; i++) {
        const char = parseInt(Math.random() * chars.length + '', 10);
        link += chars[char];
    }
    return link;
}