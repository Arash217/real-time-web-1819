require('dotenv').config();
const Koa = require('koa');
const hbs = require('koa-hbs');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const passport = require('koa-passport');
const serve = require('koa-static');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

require('./db/mongoose');
const router = require('./routes');
// const middlewares = require('./middlewares');
const controller = require('./controllers');
require('./auth');

const app = new Koa();

app.keys = ['secret'];
app.use(session({}, app));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser());

app.use(serve(path.join(__dirname, '/public')));

hbs.registerHelper('equals', (val1, val2) => val1 === val2);

app.use(hbs.middleware({
    viewPath: path.join(__dirname, '/views'),
    partialsPath: path.join(__dirname, 'views/partials'),
}));

// app.use(middlewares);
app.use(router.routes());
app.use(router.allowedMethods());

const server = http.createServer(app.callback());
const io = socketIO(server);

// start server
const port = process.env.HTTP_PORT || 3000;
server.listen(port, () => console.log('Server listening on', port));
io.on('connection', controller.socketHandler);