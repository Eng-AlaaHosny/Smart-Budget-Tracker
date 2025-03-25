require('dotenv').config()
const session = require('express-session')
const express = require('express')
const bodyParser = require('body-parser');
const path = require('path')
const authRoutes = require('./server/routes/authRoutes');

const app = express();

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
}))
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/*+json' }))
app.set('view engine', 'ejs');
// app.use(express.static('public'));
app.set("views", path.join(__dirname, "view"));

app.use('/', authRoutes);

app.listen(port = 3000, () => {
    console.log(`Example app listening on port ${port}`)
})

