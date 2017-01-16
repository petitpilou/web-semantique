var express = require('express');
var morgan = require('morgan'); // Charge le middleware de logging
var favicon = require('serve-favicon'); // Charge le middleware de favicon
var logger = require('log4js').getLogger('Server');
var bodyParser = require('body-parser');
var app = express();
var session = require("express-session");
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
    if (session.open) res.redirect(session.lastPage);
    else {
        res.render('login');
        session.lastPage = 'login';
    }
});

app.post('/login', function (req, res) {
    //connection.connect();
    connection.query("select * from user where username='"+req.body.username+"';",
        function (err, rows, fields) {
            if (!err) {
                //logger.info("results: ", rows);
                if (rows.length>1) {
                    logger.info('same username for '+rows.length+' users !');
                    res.redirect('/login');
                } else if (rows.length==0) {
                    res.render('/login', { errorUser:'This user doesn\'t exist.'});
                } else if (rows[0].username==req.body.username) {
                    if (rows[0].password==req.body.password) {
                        session.open = true;
                        session.userid = rows[0].id;
                        session.username = rows[0].username;
                        session.firstname = rows[0].firstname;
                        session.lastname = rows[0].lastname;
                        session.email = rows[0].email;
                        session.birthdate = rows[0].birthdate;
                        session.city = rows[0].city;
                        session.color = rows[0].color;
                        res.redirect('/profile');
                    } else {
                        res.render('/login', { errorPass:'The password is incorrect.'});
                    }
                }
            } else logger.error(err);
        });
    //connection.end();
});

app.get('/register', function (req, res) {
    if (session.open) res.redirect(session.lastPage);
    else {
        res.render('register');
        session.lastPage = 'register';
    }
});

app.post('/register', function (req, res) {
    //connection.connect();
    connection.query("select * from user where username='" + req.body.username + "';",
        function (err, rows, fields) {
            if (!err) {
                if(rows.length!=0) {
                    logger.info('username already taken');
                    res.redirect('/register');
                } else {
                    connection.query("insert into user values (null, '"
                        + req.body.username + "','"
                        + req.body.firstname + "','"
                        + req.body.lastname + "','"
                        + req.body.email + "','"
                        + req.body.birthdate + "','"
                        + req.body.city + "','"
                        + req.body.color + "','"
                        + req.body.password + "');",
                        function (err) {
                            if (!err) {
                                connection.query("select * from user where username='" + req.body.username + "';",
                                    function (err, rows, fields) {
                                        if (!err) {
                                            session.open = true;
                                            session.userid = rows[0].id;
                                            session.username = rows[0].username;
                                            session.firstname = rows[0].firstname;
                                            session.lastname = rows[0].lastname;
                                            session.email = rows[0].email;
                                            session.birthdate = rows[0].birthdate;
                                            session.city = rows[0].city;
                                            session.color = rows[0].color;
                                            res.redirect('/profile');
                                        } else logger.error('1] ' + err);
                                    });
                            } else logger.error('2] ' + err);
                        });
                }
            } else logger.error('3] ' + err);
        });
    //connection.end();
});

/* On affiche le profile  */
app.get('/profile', function (req, res) {
    if (session.open) {
        res.render('profile', {
            username:session.username,
            firstname:session.firstname,
            lastname:session.lastname,
            email:session.email,
            birthdate:session.birthdate,
            city:session.city,
            color:session.color,
            title:session.username
        });
        session.lastPage = 'profile';
    }
    else res.redirect(session.lastPage);
});

app.get('/changes', function (req, res) {
    if (session.open) {
        res.render('changes', {
            username:session.username,
            firstname:session.firstname,
            lastname:session.lastname,
            email:session.email,
            birthdate:session.birthdate,
            city:session.city,
            color:session.color
        });
        session.lastPage = 'changes';
    }
    else res.redirect(session.lastPage);
});

app.post('/changes', function (req, res) {
    //connection.connect();
    connection.query("select * from user where username='"+session.username+"';",
        function (err, rows, fields) {
            if (!err) {
                if (req.body.password == rows[0].password) {
                    connection.query("update user set "
                    + "firstname='" + req.body.firstname + "',"
                    + "lastname='" + req.body.lastname + "',"
                    + "email='" + req.body.email + "',"
                    + "birthdate='" + req.body.birthdate + "',"
                    + "city='" + req.body.city + "',"
                    + "color='" + req.body.color + "' "
                    + "where id='" + session.userid + "';",
                    function (err) {
                        if (!err) {
                            connection.query("select * from user where username='"+session.username+"';",
                                function (err, rows, fields) {
                                    if (!err) {
                                        session.firstname = rows[0].firstname;
                                        session.lastname = rows[0].lastname;
                                        session.email = rows[0].email;
                                        session.birthdate = rows[0].birthdate;
                                        session.city = rows[0].city;
                                        session.color = rows[0].color;
                                        res.redirect('/profile');
                                    } else logger.error('1] '+err);
                                });
                        } else logger.error('2] '+err);
                    });
                } else {
                    logger.info("wrong password");
                    res.redirect('/');
                }
            } else logger.error('3] '+err);
        });
    //connection.end();
});

app.post('/remove', function(req, res) {
    //connection.connect();
    connection.query("delete from user where id='"+session.userid+"';",
        function(err, row, fields) {
            if (!err) {
                session.open = false;
                res.redirect('/');
            } else {
                logger.error(err);
                res.redirect(session.lastPage);
            }
        });
    //connection.end();
});

app.get('/logout', function (req, res) {
    session.open = false;
    res.redirect('/');
});

logger.info('server start');
app.listen(1313);

//TODO print errors
//TODO fix birthdate
//TODO change password
//TODO profile pic
//TODO add gender and other stuff