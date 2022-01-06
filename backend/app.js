const express = require('express');
const mongoose = require('mongoose');
const app = express();
const helmet = require('helmet')
require('dotenv').config()

app.use(helmet())

app.use((req, res, next) => {
  res.removeHeader('Cross-Origin-Resource-Policy')
  res.removeHeader('Cross-Origin-Embedder-Policy')
  next()
})

const path = require('path')

app.use(express.json())

const userRoutes = require('./routes/user')
const saucesRoutes = require('./routes/sauces')

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.p4wwi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes)
app.use('/api/sauces', saucesRoutes)

module.exports = app;