const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

const KnexSessionStorage = require('connect-session-knex')(session);

const knexConnection = require('./data/db-config');

const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');

const server = express();

const sessionConfiguration = {
    // default name is sid (session id); 
    //  we will change so people don't know we're using express-session
    name: "userSession",
    secret: process.env.COOKIE_SECRET || "make sure it's a secret",
    cookie: {
        maxAge: 1000 * 60 * 60, // valid for 1 hour (in milliseconds)
        // Always want secure to be true in production; dev will be false
        //  Do we send cookie over unsecure http? Or only encrypted https?
        secure: process.env.NODE_ENV === "production",
        httpOnly: true, // prevents client JS code from accessing the cookie
        resave: false, // save sessions even when they have not changed
        // read about saveUninitialized in the docs to respect GDPR
        //  should be false in production, true in development
        saveUninitialized: true,
        store: new KnexSessionStorage({
            knex: knexConnection,
            // deleted expired sessions every 10 mins
            clearInterval: 1000 * 60 * 10,
            tablename: "user_sessions",
            sidfieldname: 'id',
            createtable: true, // probably always want to do; creates table if not there
        })
    }
};


server.use(helmet());
server.use(express.json());
server.use(cors());

server.use(session(sessionConfiguration));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
    res.json({ api: "It's alive", session: req.session });
});

module.exports = server;