const ROWS = 20
const COLUMNS = 10

function setupBoard() {
    let m_board = []

    const board = document.getElementById('board')
    for (let i = 0; i < ROWS; i++) {
        row = document.createElement('div')
        row.classList.add('game_row')
        let a_row = []
        for (let j = 0; j < COLUMNS; j++) {
            cell = document.createElement('div')
            cell.classList.add('block')
            row.appendChild(cell)
            a_row.push(cell)
        }
        board.appendChild(row)
        m_board.push(a_row)
    }
    return m_board
}

let getBoard = function() {
    let board = setupBoard()
    return function() {
        return board
    }
}()

function getBlock(x, y) {
    if (getBoard()[y] === undefined)
        return undefined
    return getBoard()[y][x]
}