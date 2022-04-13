/* Replace with your SQL commands */
CREATE TABLE orderProducts (
    id SERIAL ,
    order_id INTEGER REFERENCES orders (id) ON DELETE CASCADE ON UPDATE NO ACTION NOT NULL ,
    Product_id INTEGER REFERENCES products (id) ON DELETE CASCADE ON UPDATE NO ACTION NOT NULL,
    quantity BIGINT NOT NULL,
    PRIMARY KEY (order_id,Product_id,id)  
);