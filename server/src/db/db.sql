-- EXECUTED
create database cap;

create table user (
  id int not null auto_increment primary key,
  name varchar(100) not null,
  email varchar(200) not null unique,
  password varchar(256) not null
);

-- NOT EXECUTED
create table documents (
  id int not null auto_increment primary key,
  description varchar(100) not null,
  expiration date not null,
  value decimal(12, 2) not null
);

create table payment_methods (
  id int not null auto_increment primary key,
  description varchar(100) not null
);

create table situations (
  id int not null auto_increment primary key,
  description varchar(100) not null
);

alter table documents
  add foreign key payment_method references payment_methods (id);

alter table documents
  add foreign key situation references situations (id);