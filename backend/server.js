// import du package http natif de Node pour créer un serveur
const http = require('http')

// import de "l'index" de l'application
const app = require('./app')

// écoute le port par défaut ou le port 3000
const PORT = process.env.PORT || 3000

// configure le port
app.set('port', PORT)

// un serveur Node basique est démarré avec la méthode createServer du package http
const server = http.createServer(app)

// écoute le port
server.listen(PORT, (error) => {
	if (error) {
		console.log('Something went wrong', error)
	} else {
		console.log('Server is listening on port ' + PORT)
	}
})

