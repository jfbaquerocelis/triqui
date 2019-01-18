function newMatch (io) {
  io.on('connection', socket => {
    socket.emit('Hello?')
  })
}

module.exports = newMatch
