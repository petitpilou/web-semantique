drop table user;
create table user(
	id int not null auto_increment primary key,
	username varchar(20) unique not null,
	firstname varchar(30) not null,
	lastname varchar(30) not null,
	email varchar(30) unique not null,
	birthdate varchar(20) not null,
	city varchar(20) not null,
	color varchar(8) not null,
	password varchar(20) not null
);
insert into user values (null, 'petitpilou','Adrien','Magnin','adrien-06@hotmail.fr','20/01/1996','Antibes','#FFFFFF','pilou');
insert into user values (null, 'johndoe','John','Duff','john.duff@gmail.com','01/04/2001','Marly Gomont','#FFFF00','jdoe');
-- try convert(date,'dd/mm/yyyy') for birthdate
