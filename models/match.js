const mongoose = require('mongoose')
const moment = require('moment')
let Schema = mongoose.Schema

let matchSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  formatDate: String,
  winner: { type: String, default: '' },
  draw: { type: Boolean, default: false },
  isFinished: { type: Boolean, default: false },
  game: { type: [[]], default: [[0, 0, 0], [0, 0, 0], [0, 0, 0]] },
  isPaused: { type: Boolean, default: false },
  turn: { type: String, default: '' }
})

matchSchema.pre('save', function (next) {
  this.formatDate = moment(this.createdAt).format('DD MMM YYYY hh:mm:ss a')
  next()
})

module.exports = mongoose.model('Match', matchSchema)
