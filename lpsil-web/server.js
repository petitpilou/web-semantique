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
        res.render('login', { errorUser:false, errorPass:false });
        session.lastPage = 'login';
    }
});

app.post('/login', function (req, res) {
    //connection.connect();
    connection.query("select * from user where username='"+req.body.username+"';",
        function (err, rows, fields) {
            if (!err) {
                if (rows.length>1) {
                    logger.info('same username for '+rows.length+' users !');
                    res.redirect('/login');
                } else if (rows.length==0) {
                    try {
                        res.render('login', {errorUser:true, errorPass:false});
                    } catch (e) {
                        logger.info(e);
                    }
                } else if (rows[0].username==req.body.username) {
                    if (rows[0].password==req.body.password) {
                        session.open = true;
                        session.userid = rows[0].id;
                        session.username = rows[0].username;
                        session.firstname = rows[0].firstname;
                        session.lastname = rows[0].lastname;
                        session.email = rows[0].email;
                        session.tel = rows[0].tel;
                        session.website = rows[0].website;
                        session.birthdate = rows[0].birthdate;
                        session.gender = rows[0].gender;
                        session.city = rows[0].city;
                        session.size = rows[0].size;
                        session.color = rows[0].color;
                        res.redirect('/profile');
                    } else {
                        res.render('login', { errorUser:false, errorPass:true});
                    }
                }
            } else logger.error(err);
        });
    //connection.end();
});

app.get('/register', function (req, res) {
    if (session.open) res.redirect(session.lastPage);
    else {
        res.render('register', {userTaken:false});
        session.lastPage = 'register';
    }
});

app.post('/register', function (req, res) {
    //connection.connect();
    connection.query("select * from user where username='" + req.body.username + "';",
        function (err, rows, fields) {
            if (!err) {
                if(rows.length!=0) {
                    res.render('register', {userTaken:true});
                } else {
                    connection.query("insert into user values (null, '"
                        + req.body.username + "','"
                        + req.body.firstname + "','"
                        + req.body.lastname + "','"
                        + req.body.email + "','"
                        + req.body.tel + "','"
                        + req.body.website + "','"
                        + req.body.birthdate + "','"
                        + req.body.gender + "','"
                        + req.body.city + "','"
                        + req.body.size + "','"
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
                                            session.tel = rows[0].tel;
                                            session.website = rows[0].website;
                                            session.birthdate = rows[0].birthdate;
                                            session.gender = rows[0].gender;
                                            session.city = rows[0].city;
                                            session.size = rows[0].size;
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
            tel:session.tel,
            website:session.website,
            birthdate:session.birthdate,
            gender:session.gender,
            city:session.city,
            size:session.size,
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
            wrongPass:false,
            username:session.username,
            firstname:session.firstname,
            lastname:session.lastname,
            email:session.email,
            tel:session.tel,
            website:session.website,
            birthdate:session.birthdate,
            gender:session.gender,
            city:session.city,
            size:session.size,
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
                    + "tel='" + req.body.tel + "',"
                    + "website='" + req.body.website + "',"
                    + "birthdate='" + req.body.birthdate + "',"
                    + "gender='" + req.body.gender + "',"
                    + "city='" + req.body.city + "',"
                    + "size='" + req.body.size + "',"
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
                                        session.tel = rows[0].tel;
                                        session.website = rows[0].website;
                                        session.birthdate = rows[0].birthdate;
                                        session.gender = rows[0].gender;
                                        session.city = rows[0].city;
                                        session.size= rows[0].size;
                                        session.color = rows[0].color;
                                        res.redirect('/profile');
                                    } else logger.error('1] '+err);
                                });
                        } else logger.error('2] '+err);
                    });
                } else {
                    res.render('changes', {
                        wrongPass:true,
                        username:session.username,
                        firstname:session.firstname,
                        lastname:session.lastname,
                        email:session.email,
                        tel:session.tel,
                        website:session.website,
                        birthdate:session.birthdate,
                        gender:session.gender,
                        city:session.city,
                        size:session.size,
                        color:session.color
                    });
                }
            } else logger.error('3] '+err);
        });
    //connection.end();
});

app.get('/password', function (req, res) {
    if (session.open) {
        res.render('password', {
            wrongPass:false,
            username:session.username
        });
        session.lastPage = 'password';
    }
    else res.redirect(session.lastPage);
});

app.post('/password', function (req, res) {
    connection.query("select * from user where username='"+session.username+"';",
        function (err, rows, fields) {
            if (!err) {
                if (req.body.password == rows[0].password) {
                    connection.query("update user set "
                        + "password='" + req.body.password1 + "' "
                        + "where id='" + session.userid + "';",
                        function (err) {
                            if (!err) {
                                res.redirect('/profile');
                            } else logger.error('1] '+err);
                        });

                } else {
                    res.render('password', {
                        wrongPass:true,
                        username:session.username
                    });
                }
            } else logger.error('2] '+err);
        });
});

app.post('/remove', function(req, res) {
    //connection.connect();
    connection.query("select * from user where id='"+session.userid+"';",
        function(err, rows, fields) {
            if (!err) {
                if (req.body.password == rows[0].password) {
                    connection.query("delete from user where id='" + session.userid + "';",
                        function (err, rows, fields) {
                            if (!err) {
                                session.open = false;
                                res.redirect('/');
                            } else {
                                logger.error('1] ' + err);
                                res.redirect(session.lastPage);
                            }
                        });
                } else {
                    res.render('changes', {
                        wrongPass:true,
                        username:session.username,
                        firstname:session.firstname,
                        lastname:session.lastname,
                        email:session.email,
                        tel:session.tel,
                        website:session.website,
                        birthdate:session.birthdate,
                        gender:session.gender,
                        city:session.city,
                        size:session.size,
                        color:session.color
                    });
                }
            } else logger.error('2] '+err);
        });
    //connection.end();
});

app.get('/logout', function (req, res) {
    session.open = false;
    res.redirect('/');
});

logger.info('server start');
app.listen(1313);

//TODO profile pic
//TODO print errors (css)
//TODO sessions