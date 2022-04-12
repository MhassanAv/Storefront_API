/* Replace with your SQL commands */
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(10),
    user_id INTEGER REFERENCES users (id)
);