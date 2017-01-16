drop table user;
create table user(
	id int not null auto_increment primary key,
	username varchar(20) unique not null,
	firstname varchar(30) not null,
	lastname varchar(30) not null,
	email varchar(30) unique not null,
	tel varchar(12) not null,
	website varchar(30) not null,
	birthdate varchar(20) not null,
	gender varchar(1) not null,
	city varchar(20) not null,
	size int not null,
	color varchar(8) not null,
	password varchar(20) not null
);
insert into user values (null, 'petitpilou','Adrien','Magnin','adrien-06@hotmail.fr','0628370988','http://magnin.fr','1996-01-20','M','Antibes',160,'#b6b6b6','pilou');
insert into user values (null, 'johndoe','John','Duff','john.duff@gmail.com','0122334455','http://johndoe.com','2001-04-01','M','Legoland',150,'#ff8c1a','jdoe');
insert into user values (null, 'rosap','Rosa','Parks','rosa.parks@gmail.com','0654321789','http://rosap.org','1913-02-04','F','Montgomery',170,'#ff8c1a','rparks');
insert into user values (null, 'test','Test','Test','test@test.test','0123456789','http://test.com','1990-01-01','O','Test City',175,'#ff8c1a','test');
