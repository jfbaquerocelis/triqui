const Match = require('../models/match')

function matchIO (io) {
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
    // Vamos a recibir el socket cuando finalice una partida
    socket.on('match finished', async function (match) {
      try {
        let updated = await Match.findByIdAndUpdate(match._id, match)
      } catch (err) {
        console.error(err)
      }
    })
  })
}

module.exports = matchIO
