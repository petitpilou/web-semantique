var express = require('express');
var morgan = require('morgan'); // Charge le middleware de logging
var favicon = require('serve-favicon'); // Charge le middleware de favicon
var logger = require('log4js').getLogger('Server');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session');
session.open = false;
session.lastPage = '/';

/* Config */
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined')); // Active le middleware de logging
app.use(express.static(__dirname + '/public')); // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)

/* MySql Server */
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'websem'
});

/* On affiche le formulaire d'enregistrement */
app.get('/', function(req, res){
    if (session.open) res.redirect('/profile');
    else res.redirect('/login');
});

app.get('/login', function(req, res){
    if (session.open) res.render(session.lastPage);
    else {
        res.render('login');
        session.lastPage = 'login';
    }
});

app.post('/login', function (req, res) {
    connection.connect();
    connection.query("select * from user where username='"+req.body.username+"';",
        function (err, rows, fields) {
        if (!err) {
            //logger.info("results: ", rows);
            if (rows.length>1) {
                logger.info('same username for '+rows.length+' users !');
                res.redirect('/login');
            }
            else if (rows.length==0) {
                logger.info('this user doesn\'t exist');
                res.redirect('/login');
            }
            else if (rows[0].username==req.body.username) {
                if (rows[0].password==req.body.password) {
                    session.open = true;
                    session.userid = rows[0].id;
                    session.username = rows[0].username;
                    session.firstname = rows[0].firstname;
                    session.lastname = rows[0].lastname;
                    session.email = rows[0].email;
                    res.redirect('/profile');
                } else {
                    logger.info('wrong password');
                    res.redirect('/login');
                }
            }
        }
        else logger.error(err);
     });
    connection.end();
});

app.get('/register', function (req, res) {
    // TODO ajouter un nouveau utilisateur
});

app.get('/logout', function (req, res) {
    session.open = false;
    res.redirect('/');
});

/* On affiche le profile  */
app.get('/profile', function (req, res) {
    if (session.open) {
        res.render('profile', {"username":session.username, "firstname":session.firstname, "lastname":session.lastname, "email":session.email});
        session.lastPage = 'profile';
    }
    else res.render(session.lastPage);
});

logger.info('server start');
app.listen(1313);
