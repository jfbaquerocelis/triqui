import 'sass/style.scss'

document.addEventListener('DOMContentLoaded', () => {
  let socket = window.io('http://localhost:3000')
  // Cada vez que el DOM cargue de nuevo, significa que el usuario a actualizado la página, por lo tanto vamos a eliminar la variable turn de local storage
  localStorage.removeItem('match')

  // Vamos a capturar el botón que se encuentra en el header, será quien se encargue de enviar las acciones de "nuevo juego" y "renaudar juego"
  let headerButton = document.querySelector('.header__button')
  let pauseButton = document.querySelector('.match__pause')
  let fields = document.querySelectorAll('.match__board td')
  let turnMessage = document.querySelector('.match__turn')

  // Cuando el usuario accione el botón vamos a validar si está iniciando un nuevo juego o si está renaudando el que no ha terminado
  headerButton.addEventListener('click', function () {
    let action = this.dataset.action
    // A partir del dataset vamos a realizar las acciones
    if (action === 'new match') {
      socket.emit(action)
      // Desactivamos el botón
      this.classList.add('disabled')
    } else if (action === 'resume match') {

    }
  })

  // A cada campo del juego, vamos a agregar un evento click que nos permita colocar "X" o "O" en la celda
  fields.forEach(field => {
    field.addEventListener('click', function () {
      // Vamos a verificar antes de realizar las acciones si hay un nuevo juego, es decir, si existe un turno en localStorage
      let match = JSON.parse(localStorage.getItem('match'))
      // Vamos a verificar que ese campo no esté lleno
      let value = this.dataset.value

      if (match && value === '0') {
        // Agregamos el valor al campo
        this.dataset.value = match.turn
        // Agregamos a la matriz el valor del campo correspondiente
        match.game[this.dataset.row][this.dataset.col] = match.turn
        // Agregamos el icono correspondiente
        this.innerHTML = (match.turn === 'X') ? '<i class="fas fa-times fa-3x grey-text text-darken-3"></i>' : '<i class="fas fa-circle fa-3x white-text"></i>'
        // Cambiamos el turno
        match.turn = (match.turn === 'X') ? 'O' : 'X'
        // Informamos al usuario
        turnMessage.textContent = `Tu turno ${match.turn}`
        localStorage.setItem('match', JSON.stringify(match))
      }
    })
  })

  // recibimos la señal cuando el juego se haya creado en el backend
  socket.on('new match created', match => {
    // Primero, vamos a guardar el match en localStorage
    // pero antes decimos quien va a empezar, es decir, cual es el primer turno
    match.turn = 'X'
    localStorage.setItem('match', JSON.stringify(match))
    // Vamos a llenar los valores de la tabla a partir de la matríz del juego
    match.game.forEach((array, row) => {
      array.forEach((value, col) => {
        fields.forEach((field, index) => {
          let fieldCol = parseInt(field.dataset.col, 10)
          let fieldRow = parseInt(field.dataset.row, 10)

          if (fieldCol === col && fieldRow === row) field.dataset.value = value
        })
      })
    })
    // Activamos el botón de pausa
    pauseButton.classList.remove('disabled')
    turnMessage.textContent = '¡A Jugar!'
    setTimeout(() => {
      turnMessage.textContent = `Tu turno ${match.turn}`
    }, 1000)
  })
})
