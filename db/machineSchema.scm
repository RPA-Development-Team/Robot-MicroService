CREATE TABLE mchines(
    name text not null primary key,
    id serial not null UNIQUE,
    type varchar(10) not null,
    socketId bigInt not null UNIQUE,
);