const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json())

const saucesRoutes = require('./routes/sauces')

mongoose.connect('mongodb+srv://woden98:123e456e@cluster0.p4wwi.mongodb.net/Piiquante?retryWrites=true&w=majority',
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

app.use('/api/sauces', saucesRoutes)

module.exports = app;