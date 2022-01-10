// importation d'express
const express = require('express');
const app = express();

// sécurités
const helmet = require('helmet')
require('dotenv').config()

// configuration d'helmet
app.use(helmet())

app.use((req, res, next) => {
  res.removeHeader('Cross-Origin-Resource-Policy')
  res.removeHeader('Cross-Origin-Embedder-Policy')
  next()
})

// images
const path = require('path')

// import des routes
const userRoutes = require('./routes/user')
const saucesRoutes = require('./routes/sauces')


// MongoDB
const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.p4wwi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS : système de sécurité qui bloque par défaut les appels http entre les servers
  app.use((req, res, next) => {

    // accéder à notre API depuis n'importe où
    res.setHeader('Access-Control-Allow-Origin', '*');

    // ajouter les headers sur nos réponses
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');

    // nous permet d'utiliser le CRUD
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// middleware
// les données sont reçues en objet JSON
app.use(express.json()) 

app.use('/images', express.static(path.join(__dirname, 'images')));

// routes
app.use('/api/auth', userRoutes)
app.use('/api/sauces', saucesRoutes)

module.exports = app;