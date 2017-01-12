drop table user;
create table user(
	id int not null auto_increment primary key,
	username varchar(20) unique not null,
	firstname varchar(30) not null,
	lastname varchar(30) not null,
	email varchar(30) unique not null,
	password varchar(20) not null
);

insert into user (username,firstname,lastname,email,password) values ('petitpilou','Adrien','Magnin','adrien-06@hotmail.fr','pilou');
insert into user (username,firstname,lastname,email,password) values ('johnduff','John','Duff','john.duff@gmail.com','jduff');
