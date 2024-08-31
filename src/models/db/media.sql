CREATE TABLE Books (
id int not null auto_increment primary key,
title varchar(266) not null,
subtitle varchar(266) not null,
authors JSON,
categories JSON,
publishedDate varchar(64),
description text,
images JSON,
language varchar(8),
averageRating int,
ratingsCount int,
price decimal(10,2)
);

drop table Books;

CREATE TABLE Seeds (
id int not null auto_increment primary key,
Seeded bit not null,
Date datetime,
lastSeed varchar(266) not null
);

CREATE TABLE Users (
id int not null auto_increment primary key,
name varchar(266) not null,
lastName varchar(266) not null,
email varchar(500) not null,
password char(64) not null,
icon text
);

CREATE Table Posts(
id int not null auto_incremrsent primary key,
title varchar(266) not null,
description varchar(600),
tags varchar(200),
bookId int,
createdDate datetime not null,
reactionsId int not null,
userID int,
commentsId int,
FOREIGN KEY (userID) REFERENCES Users(id),
FOREIGN KEY (commentsId) REFERENCES Comments(id)
);

CREATE TABLE Comments(
id int not null auto_increment primary key,
comment varchar(800),
replyId int,
reactionsId int not null
);

CREATE TABLE Reaction (
id int not null primary key,
like int,
unlike int,
love int,
fire int,
FOREIGN KEY (id) REFERENCES Comments(id);
);

CREATE TABLE Replies(
id int not null,
comment varchar(800),
fromWhoId int,
reactionId int,
FOREIGN KEY (fromWhoId) REFERENCES Users(id)
)

DELETE FROM  Books;

INSERT INTO Users (name, lastName, email, password) Values('Elias', 'Neto', '3lias.neto@dev.com', 'aalves2');
