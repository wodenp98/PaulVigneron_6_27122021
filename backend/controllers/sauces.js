const Sauce = require('../models/sauce')
const fs = require('fs')


exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce)
	// supprime l'id renvoyé par le front
	delete sauceObject._id 
	const sauce = new Sauce({
		// contient les informations du body
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${
			req.file.filename
		}`,
	})
	sauce
		.save()
		.then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
		.catch((error) => res.status(400).json({ message: error }))
}

exports.getOneSauce = (req, res, next) => {
	// trouve la sauce avec le meme id
	Sauce.findOne({ _id: req.params.id }) 
		.then((sauce) => {
			res.status(200).json(sauce)
		})
		.catch((error) => {
			res.status(404).json({ error })
		})
}

exports.modifySauce = (req, res, next) => {
	const sauceObject = req.file
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get('host')}/images/${
					req.file.filename
				}`,
		  }
		: { ...req.body }
	Sauce.updateOne(
		// id de l'élément à modifier
		{ _id: req.params.id },
		// la modification
		{ ...sauceObject, _id: req.params.id }
	)
		.then(() => res.status(200).json({ message: 'Sauce modifié !' }))
		.catch((error) => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split('/images/')[1]
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
					.catch((error) => res.status(400).json({ error }))
			})
		})
		.catch((error) => res.status(500).json({ error }))
}

exports.getAllSauces = (req, res, next) => {
	Sauce.find()
		.then((sauces) => {
			res.status(200).json(sauces)
		})
		.catch((error) => {
			res.status(400).json({
				error: error,
			})
		})
}

// Un user peut like ou dislike
exports.voteOneSauce = (req, res) => {
	const like = req.body.like;
  switch(like) {

    case 1: 
     Sauce.updateOne({_id: req.params.id}, 
      { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } })
     .then(() => res.status(200).json({ message: 'Like ajouté' }))
     .catch(error => res.status(400).json({ error }));
     break;

    case 0: 
     Sauce.findOne({ _id: req.params.id })
     .then(sauce => {
       if (sauce.usersLiked.includes(req.body.userId)) {
        Sauce.updateOne({ _id: req.params.id },
          { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
          .then(() => res.status(200).json({ message: 'Like supprimé' }))
          .catch(error => res.status(400).json({ error }));
      }
      if (sauce.usersDisliked.includes(req.body.userId)) {
        Sauce.updateOne({ _id: req.params.id },
          { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 }})
         .then(() => res.status(200).json({ message: 'Dislike supprimé' }))
         .catch(error=> res.status(400).json({ error }));
      }
    })
    .catch(error => res.status(404).json({ error }));
  break;
  
  case -1:
    Sauce.updateOne({ _id: req.params.id },
      { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } })
      .then(() => {res.status(200).json({ message: 'Dislike ajouté' });
      })
    .catch(error => res.status(400).json({ error }));
    break;
 }
}
