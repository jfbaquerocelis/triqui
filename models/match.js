let mongoose = require('mongoose')
let Schema = mongoose.Schema

let matchSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  winner: String,
  draw: { type: Boolean, default: false },
  isFinished: { type: Boolean, default: false },
  game: { type: [[]], default: [[0, 0, 0], [0, 0, 0], [0, 0, 0]] },
  isPaused: { type: Boolean, default: false },
  turn: String
})

module.exports = mongoose.model('Match', matchSchema)
