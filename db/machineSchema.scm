CREATE TABLE machines(
    name text not null primary key,
    type varchar(20) not null,
    socketId text not null UNIQUE
);