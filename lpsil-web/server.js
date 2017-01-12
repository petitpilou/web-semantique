var express = require('express');
var morgan = require('morgan'); // Charge le middleware de logging
var favicon = require('serve-favicon'); // Charge le middleware de favicon
var logger = require('log4js').getLogger('Server');
var bodyParser = require('body-parser');
var app = express();

/* Config */
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined')); // Active le middleware de logging
app.use(express.static(__dirname + '/public')); // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)
app.use(express.session({secret: '???'}));
req.session.lastPage = '/';
req.session.open = false;

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
    res.redirect('/login');
});

app.get('/login', function(req, res){
    if (req.session.open) res.render(req.session.lastPage);
    else {
        req.session.lastPage = 'login';
        res.render('login');
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
                res.render('login');
            }
            else if (rows.length==0) {
                logger.info('this user doesn\'t exist');
                res.render('login');
            }
            else if (rows[0].username==req.body.username) {
                if (rows[0].password==req.body.password) {
                    req.session.open = true;
                    req.session.lastPage = '/profile';
                    res.render('profile', {"username":rows[0].username, "firstname":rows[0].firstname, "lastname":rows[0].lastname, "email":rows[0].email});
                } else {
                    logger.info('wrong password');
                    res.render('login');
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
    //TODO déconnecter l'utilisateur
    res.redirect('/');
});

/* On affiche le profile  */
app.get('/profile', function (req, res) {
    if (req.session.open) {
        req.session.lastPage = 'profile';
        res.render('profile');
    }
    else res.render(req.session.lastPage);
});

logger.info('server start');
app.listen(1313);
