import 'sass/style.scss'

document.addEventListener('DOMContentLoaded', () => {
  let socket = window.io('http://localhost:3000')

  socket.on('Hello?', () => {
    alert('Socket connect sucessfull')
  })
})
