/* Replace with your SQL commands */
CREATE TABLE products (
    id SERIAL PRIMARY KEY ,
    name VARCHAR(60) NOT NULL UNIQUE,
    price VARCHAR(60) NOT NULL
);