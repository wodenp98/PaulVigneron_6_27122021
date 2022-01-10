// import du package http de node
const http = require('http')

// import de l'application
const app = require('./app')

// écoute le port par défaut ou le port 3000
const PORT = process.env.PORT || 3000

// configure le port
app.set('port', PORT)

// création d'un serveur
const server = http.createServer(app)

// écoute le port
server.listen(PORT, (error) => {
	if (error) {
		console.log('Something went wrong', error)
	} else {
		console.log('Server is listening on port ' + PORT)
	}
})

