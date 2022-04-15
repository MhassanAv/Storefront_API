# Storefront Backend Project

## Required Technologies
Your application must make use of the following libraries:
- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## Steps to run

###  Creating database and users

First of all, Before running the migration scripts you must create 2 databases (one for development and one for testing)
you can name them as :
storefrontdb and storefrontdb_test
then you need to create 2 users as following
dev for storefrontdb with pass 1234
tester for storefrontdb_test with pass 1234
I will provide the database.json for simplicity 
after creating the databases and users you can run the migration up command (npx db-migrate up) to create the required tables


###   ENV variables

As I won't provide the .env file here is the environment varibles

POSTGRES_HOST=localhost
POSTGRES_PORT=8000
POSTGRES_DB=storefrontdb
POSTGRES_USER=dev
POSTGRES_TESTER=tester
POSTGRES_PASSWORD=1234
POSTGRES_TEST_DB=storefrontdb_test
ENV=dev
BCRYPT_PASSWORD=SCARFACE123 (you can change this ofc)
SALT_ROUNDS=7 (you can change this ofc)
TOKEN_KEY=TONYMONTANA123 (you can change this ofc)



###  Models

I have created 3 models with CRUD operations and 1 service for getting data, plus a middleware for authentcation and authorization
it also contains password hashing logic.

###  Endpoints

## Getting Started


First, you need to access signup route first and provied the required data(username,first_name,last_name,password),
then you will need to access signin route with the same username and password for created user to authorize the user in database and start using the app

then you need to provide the authorized user's id in body with every request that require a token (explained below)

i will add the endpoints as they are in src code to expose the http request and the authvalidator middleware for authentcation

## usersRoutes

get('/users', authvalidator, index);
post('/signin', authenticate);
put('/users/:id',authvalidator, update);
get('/users/:id', authvalidator, show);
post('/signup', create); 
delete('/users/:id', authvalidator, destroy);

## productsRoutes

get('/products', authvalidator, index);
put('/products/:id', authvalidator, update);
app.get('/products/:id', authvalidator, show);
post('/products', authvalidator, create);
delete('/products/:id', authvalidator, destroy);

## ordersRoutes

get('/orders', authvalidator, index);
put('/orders/:id', authvalidator, update);
get('/orders/:id', authvalidator, show);
post('/orders', authvalidator, create);
post('/orders/:ido/products/:idp', authvalidator, addProduct);
delete('/orders/:id', authvalidator, destroy);


## orderProductsRoutes

get('/order/list', authvalidator, productsInOrders);
get('/activeorders', authvalidator, activeOrders);
get('/order/:id', authvalidator, Orders);


### JWTs

For more scurity, after you take user token and place is in header you will need to to add {user_auth_id:id value of authenticated user} to make sure that every user will use his own token not anyone else's'

ex. for updating a product the body should look something like this
{
    user_auth_id:1,
    name:"yourProduct",
    price:"yourPrice"
}


