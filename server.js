import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import { handleRegister } from './controllers/register.js';
import { handleProfileRetrieval } from './controllers/profile.js';
import { handleSignin } from './controllers/signin.js';
import { handleEntries, handleApiCall } from './controllers/image.js';

// Some random comment
const db = knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false},
      host : process.env.DATABASE_HOST,
      port : 5432,
      user : process.env.DATABASE_USER,
      password : process.env.DATABASE_PW,
      database : process.env.DATABASE_DB
    }
  });

const app = express();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('This is working!');
})

app.post('/signin', (req, res) => {handleSignin(req, res, db, bcrypt)});

// Example of a dependency injection
app.post('/register', (req, res) => {handleRegister(req, res, db, bcrypt)});

app.get('/profile/:id', (req, res) => {handleProfileRetrieval(req, res, db)});

app.put('/image', (req, res) => {handleEntries(req, res, db)});

app.post('/imageurl', (req, res) => {handleApiCall(req, res)});

app.listen(process.env.PORT || 3000, ()=> {
    console.log(`App is running ${process.env.PORT}`);
});