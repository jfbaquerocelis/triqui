const express = require('express')
const server = express()

server.get('/', (req, res) => {
  res.status(200).send('Welcome to Triqui Game')
})

server.listen(3000, () => {
  console.log('Server running on http://127.0.0.1:3000')
})
