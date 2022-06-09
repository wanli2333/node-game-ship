export default Object.freeze({
    PLAYER: {
        MAX_HP: 100,
        SPEED: 500,
        RADUIS: 30,
        FIRE: .1,
        HURT: 5,
    },

    BULLET: {
        SPEED: 1000,
        RADUIS: 20,
    },

    PROP: {
        CREATE_TIME: 5, // 生成道具时间间隔/s
        RADUIS: 30
    },

    MAP_SIZE: 1400,
    STEP: 25,

    MSG_TYPES: {
        JOIN_GAME: '1',
        UPDATE: '2',
        INPUT: '3',
        GAME_OVER: '4',
        GET_DELAY: '5'
    }
});
