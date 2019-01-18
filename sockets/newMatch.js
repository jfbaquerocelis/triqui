const Match = require('../models/match')

function newMatch (io) {
  io.on('connection', socket => {
    // Vamos a crear el socket para crear un nuevo juego
    socket.on('new match', async function () {
      try {
        let match = new Match()

        await match.save()
        socket.emit('new match created', match)
      } catch (err) {
        console.error(err)
      }
    })
  })
}

module.exports = newMatch
