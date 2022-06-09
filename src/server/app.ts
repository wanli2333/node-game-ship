import express from 'express';
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
import socketio from  'socket.io';
import Socket from './core/socket';
import Game from './core/game';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

const webpackConfig = require('../../webpack.config.dev.js')

const port = process.env.PORT || 8000

const app = express();
app.use(express.static('public'));

// console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV != 'production') {
    const compiler = webpack(webpackConfig)
    app.use(webpackDevMiddleware(compiler))
} else {
    app.use(express.static('dist'));
}

console.log(process.env.NODE_ENV);


const server = app.listen(port, function() {
    console.log(`the server is start at port ${port}`);
});

app.get('/hello',function(req, res){
    res.send("Hello World!");
});



const game = new Game;
const io = require('socket.io')(server);
const socket = new Socket(game, io);

io.on('connect', (item: socketio.Socket<DefaultEventsMap, DefaultEventsMap>) => {
    socket.listen(item)
});

export default app;
