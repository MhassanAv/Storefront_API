# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index 
- Show
- Create [token required]
- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category)

#### Users
- Index [token required]
- Show [token required]
- Create N[token required]

#### Orders
- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category

#### User
- id
- firstName
- lastName
- password

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

#### Database Schema

## User
id
username (unique) 2 users can't have the same username
first_name
last_name
passoword

| Columne       |  type                |
| ------------- | -------------------- |
| id            | SERIAL PRIMARY KEY   | 
| username      | VARCHAR(30)          | 
| first_name    | VARCHAR(60)          | 
| last_name     | VARCHAR(60)          | 
| passoword     | VARCHAR(250)         | 


## products
id 
name
price


| Columne       |  type                |
| ------------- | -------------------- |
| id            | SERIAL PRIMARY KEY   | 
| name          | VARCHAR(60)          | 
| price         | VARCHAR(60)          | 

## orders
id
status
user_id (foreign key)


| Columne       |  type                        |
| ------------- | ---------------------------- |
| id            | SERIAL PRIMARY KEY           | 
| status        | VARCHAR(60)                  | 
| user_id       | INTEGER REFERENCES users (id)| 

## orderProducts
id
Product_id (foreign key)
order_id (foreign key)
quantity
primary key(id,Product_id,order_id) so that you can add the same product multiple times with no issues

| Columne       |  type                            |
| ------------- | -------------------------------- |
| id            | SERIAL                           | 
| order_id      | INTEGER REFERENCES orders (id)   | 
| Product_id    | INTEGER REFERENCES products (id) | 
| quantity      | INTEGER                          | 

