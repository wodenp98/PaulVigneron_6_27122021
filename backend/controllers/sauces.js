const Sauce = require('../models/sauce')
const fs = require('fs')


exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce)
	delete sauceObject._id 
	const sauce = new Sauce({
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
		
		{ _id: req.params.id },
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

exports.voteOneSauce = (req, res) => {
	const like = req.body.like
	const userId = req.body.userId

	// on cherche la sauce sélectionnée
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			// find : vérifie si userId existe déjà
			let userLike = sauce.usersLiked.find((id) => id === userId)
			let userDislike = sauce.usersDisliked.find((id) => id === userId)

			console.log('Statut : ', like)

			// case "n" : n valeur au click
			// += : j'ajoute || -= je retire
			// filter : montre les id différents de l'userId
			switch (like) {
				// like +1
				case 1:
					sauce.likes += 1
					sauce.usersLiked.push(userId)
					break

				// annule -1
				case 0:
					if (userLike) {
						sauce.likes -= 1
						sauce.usersLiked = sauce.usersLiked.filter((id) => id !== userId)
					}
					if (userDislike) {
						sauce.dislikes -= 1
						sauce.usersDisliked = sauce.usersDisliked.filter(
							(id) => id !== userId
						)
					}
					// On termine la boucle avec la fonction break
					break

				// dislike +1
				case -1:
					sauce.dislikes += 1
					sauce.usersDisliked.push(userId)
			}
			// sauvegarde la sauce
			sauce
				.save()
				.then(() => res.status(201).json({ message: 'save sauce' }))
				.catch((error) => res.status(400).json({ error }))
		})
		.catch((error) => res.status(500).json({ error }))
}
