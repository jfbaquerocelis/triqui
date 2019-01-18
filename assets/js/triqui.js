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

      if (match) {
        if (!match.isFinished && !match.isPaused && value === '0') {
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
          // Vamos a validar quien ha ganado contando cuantos espacios en blanco hay en el campo de juego para validar desde el movimiento 5
          var blankFields = match.game.flat().filter(item => { return !item })

          if (blankFields.length <= 4) {
            let winner = whoWon(match.game)

            if (winner) {
              match.winner = winner
              match.isFinished = true
              match.turn = ''
              headerButton.classList.remove('disabled')
              pauseButton.classList.add('disabled')
              turnMessage.textContent = `¡Has ganado ${winner}!`
              socket.emit('match finished', match)
              localStorage.removeItem('match')
            } else if (blankFields.length === 0) {
              match.draw = true
              match.isFinished = true
              match.turn = ''
              headerButton.classList.remove('disabled')
              pauseButton.classList.add('disabled')
              turnMessage.textContent = `Empate`
              socket.emit('match finished', match)
              localStorage.removeItem('match')
            }
          }

          localStorage.setItem('match', JSON.stringify(match))
        }
      }
    })
  })

  // Cuando el usuario desee pausar el juego no podrá agregar valores al campo y en ese caso podrá renaudarlo cuando desee
  pauseButton.addEventListener('click', function () {
    let match = JSON.parse(localStorage.getItem('match'))
    let icon = this.children.item(0)
    let text = this.children.item(1)

    if (!match.isPaused) {
      icon.classList.remove('fa-pause')
      icon.classList.add('fa-play')
      text.textContent = 'SEGUIR'
      match.isPaused = true
    } else {
      icon.classList.remove('fa-play')
      icon.classList.add('fa-pause')
      text.textContent = 'PAUSA'
      match.isPaused = false
    }

    localStorage.setItem('match', JSON.stringify(match))
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

          if (fieldCol === col && fieldRow === row) {
            field.dataset.value = value
            field.innerHTML = ''
          }
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

  // Recibimos el objeto del match que acaba de finalizar para listarlo en el historial
  socket.on('new match finished', match => {
    console.log(match)
    let matchContainer = document.querySelector('.dashboard__container')
    let isDraw = (match.draw) ? 'Si' : 'No'
    let dashboardMatch = document.createElement('div')

    dashboardMatch.classList.add('dashboard__match')
    dashboardMatch.innerHTML = `
      <small class="dashboard__match__date">${match.createdAt}</small>
      <p class="dashboard__match__winner">Ganador: <strong>${match.winner}</strong></p>
      <p class="dashboard__match__draw">Empate? <strong>${isDraw}</strong></p>
    `

    matchContainer.prepend(dashboardMatch)
  })

  // El parametro game es la matríz
  function whoWon (game) {
    // Vamos a validar la información horizontalmente
    for (let index = 0; index < game.length; index++) {
      if (game[index][0] === game[index][1] && game[index][1] === game[index][2]) {
        return game[index][1]
      }
    }
    // Vamos a validar la información verticalmente
    for (let index = 0; index < game.length; index++) {
      if (game[0][index] === game[1][index] && game[1][index] === game[2][index]) {
        return game[1][index]
      }
    }
    // Vamos a validar la información diagonalmente
    if (game[0][0] === game[1][1] && game[1][1] === game[2][2]) {
      return game[1][1]
    }
    if (game[0][2] === game[1][1] && game[1][1] === game[2][0]) {
      return game[1][1]
    }
  }
})

