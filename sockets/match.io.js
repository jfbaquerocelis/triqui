const Match = require('../models/match')
let moment = require('moment')

function matchIO (io) {
  io.on('connection', async socket => {
    // Cuando el backend se conecte con el frontend, vamos a validar si existe alguna partida sin finalizar
    try {
      let match = await Match.findOne({ isFinished: false })

      if (match) socket.emit('there is an unfinished match', match)
    } catch (err) {
      console.error(err)
    }

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
    // Guardamos el proceso para evitar que actualicen la página y se pierda la información
    socket.on('save process', async function (match) {
      try {
        await Match.findByIdAndUpdate(match._id, match)
      } catch (err) {
        console.error(err)
      }
    })
    // Vamos a recibir el socket cuando finalice una partida
    socket.on('match finished', async function (match) {
      try {
        let updated = await Match.findByIdAndUpdate(match._id, match, { new: true })

        socket.emit('new match finished', updated)
      } catch (err) {
        console.error(err)
      }
    })
  })
}

module.exports = matchIO
