/* Replace with your SQL commands */
CREATE TABLE orderProducts (
    id SERIAL,
    order_id INTEGER REFERENCES orders (id) NOT NULL,
    Product_id INTEGER REFERENCES products (id) NOT NULL,
    quantity BIGINT NOT NULL,
    PRIMARY KEY (order_id,product_id,id)
);