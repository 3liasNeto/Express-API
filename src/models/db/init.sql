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

DELETE FROM  Books;