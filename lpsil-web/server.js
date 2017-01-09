var express = require('express');
var morgan = require('morgan'); // Charge le middleware de logging
var favicon = require('serve-favicon'); // Charge le middleware de favicon
var logger = require('log4js').getLogger('Server');
var bodyParser = require('body-parser');
var app = express();

/* MySql Server */
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'websem'
});
connection.connect();
/*connection.query('SELECT * from < table name >', function (err, rows, fields) {
    if (!err)
        logger.info('Le résultat de la requête: ', rows);
    else
        logger.error(err);
});*/
connection.end();

/* Config */
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined')); // Active le middleware de logging
app.use(express.static(__dirname + '/public')); // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)

/* On affiche le formulaire d'enregistrement */
app.get('/', function(req, res){
    res.redirect('/login');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', function (req, res) {
    // TODO vérifier si l'utilisateur existe
});

app.get('/register', function (req, res) {
    // TODO ajouter un nouveau utilisateur
});

/* On affiche le profile  */
app.get('/profile', function (req, res) {
    // TODO
    // On redirige vers la login si l'utilisateur n'a pas été authentifier
    // Afficher le button logout
});

logger.info('server start');
app.listen(1313);
