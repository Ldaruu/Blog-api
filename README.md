# Getting Started with Blog-API

## Prerequisites

- mongo DB (https://docs.mongodb.com/manual/)

## In the project directory, run:

```
yarn install
```

Start the server

```
yarn start
```

## .env file example:

```
PORT=3001
DB_SERVER=mongodb://localhost:27017/blog
ORIGIN=http://localhost:3000
API_URL=http://localhost:3001
SECRET_KEY=tOpSeCrEtSeCrEtKeY
```

## Main used packages:

- [Express](https://expressjs.com/)
- [Mongoose](https://github.com/Automattic/mongoose)
- [cors](https://github.com/expressjs/cors#readme)
- [dotenv](https://github.com/motdotla/dotenv)
- [Multer](https://github.com/expressjs/multer)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
