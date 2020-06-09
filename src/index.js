const express = require ('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore =  require('express-mysql-session');
const passport = require('passport');

const { database } = require('./keys');


//inicializations
const app = express();
require('./lib/passport');


//settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//middleware
app.use(session({
    secret: 'MySQLSession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
//
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


//global Variables
app.use((req, res, next) =>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
})

//routes
app.use(require('./routes/index.js'));
app.use( require('./routes/authentication.js'));
app.use( '/links', require ('./routes/links.js'));
app.use( '/auth', require ('./routes/authentication.js'));

//Public
app.use(express.static(path.join(__dirname, 'public')))
//startig the Server
app.listen(app.get('port'), (req, res ) => {
    console.log('Server on port', app.get('port')); 
})