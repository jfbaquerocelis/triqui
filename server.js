const express = require('express')
const nunjucks = require('nunjucks')
const rootDir = require('app-root-dir')
const mongoose = require('mongoose')
const URI = 'mongodb://localhost:27017/triqui'

const server = express()
const app = require('http').createServer(server)
const io = require('socket.io')(app)

// Configuramos el view engine para las vistas
server.set('view engine', 'html')
// Configuramos nunjucks
nunjucks.configure('./views', {
  express: server,
  watch: process.env.NODE_ENV === 'development'
})

// Servimos los archivos estáticos
server.use(express.static(`${rootDir.get()}/dist/`))

server.get('/', function (req, res) {
  res.render('index')
})

mongoose.connect(URI, { useNewUrlParser: true }, err => {
  if (err) throw err

  app.listen(3000, function () {
    console.log('Server running on http://127.0.0.1:3000')
  })
})
