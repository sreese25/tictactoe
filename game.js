var board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
]
var isXTurn = true
var moves = 0
var gameOver = false
var winner = null

window.onload = function () {
    // add click handlers to all the spaces
    var spaces = document.getElementsByClassName("space")
    for (var i = 0; i < spaces.length; i++) {
        var space = document.getElementsByClassName("space")[i];
        space.addEventListener("click", function (e) {
            claimSpace(e);
        });
    }
}

function claimSpace(e) {
    // don't do anything if there's already something in the space
    if (e.target.innerHTML || gameOver) return

    // set letter based on turn
    var letter = isXTurn ? 'X' : 'O'

    // add letter to the html view
    e.target.innerHTML = `<div class="${letter.toLowerCase()}space">${letter.toUpperCase()}</div>`

    // get row and col from html element and add it to the board
    var row = parseInt(e.target.getAttribute('row'))
    var col = parseInt(e.target.getAttribute('col'))
    board[row][col] = letter

    // change turn
    isXTurn = !isXTurn
    moves++

    checkForWinner(letter, row, col)
}

function checkForWinner(letter, row, col) {
    // only check board based on newly updated row/col
    var rowValid = true
    var colValid = true
    for (var i = 0; i < 3; i++ ) {
        if (rowValid && board[row][i] != letter) rowValid = false
        if (colValid && board[i][col] != letter) colValid = false
    }

    // if row or col is still valid that means there's a winner
    if (rowValid || colValid) {
        gameOver = true
        winner = letter
    } else {
        // check diagonals
        if (
            board[1][1] !== null &&
            ((board[0][0] == board[1][1] && board[1][1] == board[2][2]) || 
            (board[2][0] == board[1][1] && board[1][1] == board[0][2]))
        ) {
            gameOver = true
            winner = board[1][1]
        }
    }

    // if no winner found, see if the board is full
    // note: you can also know if game is over by moves == 9 but i already wrote this so ¯\_(ツ)_/¯
    if (!winner) {
        var emptySpace = false
        for (var r = 0; r < 3; r++ ) {
            for (var c = 0; c < 3; c++ ) {
                if (board[r][c] === null) {
                    emptySpace = true
                    break
                }
            }
            if (emptySpace) break
        }
        gameOver = !emptySpace
    }

    changeStatus()
}

function changeStatus() {
    // hide all statuses
    var statuses = document.getElementsByClassName('statusDisplay')
    for (var i = 0; i < statuses.length; i++) {
        var status = document.getElementsByClassName("statusDisplay")[i];
        status.style.display = 'none'
    }

    if (!gameOver) {
        // show whose turn it is
        if (isXTurn) document.getElementById('status-player1Turn').style.display = 'block'
        else document.getElementById('status-player2Turn').style.display = 'block'
    } else {
        // show game over
        if (winner) {
            var winnerDisplay = document.getElementById('status-win')
            winnerDisplay.style.display = 'block'
            winnerDisplay.innerHTML = `Game Over: <b class='${winner.toLowerCase()}piece'>${winner}</b> Wins`
        } else document.getElementById('status-draw').style.display = 'block'
    }
}