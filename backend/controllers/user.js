const bcrypt = require('bcrypt')
const User = require('../models/User')
// génère un token
const jwt = require('jsonwebtoken') 

// enregistrer un compte
exports.signup = (req, res, next) => {
  // crypte le mot de passe
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        // créé le nouvel user
        const user = new User({
          email: req.body.email,
          password: hash
        });
        // enregistre le user
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      // erreur serveur
      .catch(error => res.status(500).json({ error }));
  };

  // se connecter
  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        // si l'user n'existe pas
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        // compare le mdp entré par l'user avec le hash enregistré
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            // tout est valide
            res.status(200).json({
              userId: user._id,
              // encode un nouveau token qui expire dans 24h
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };