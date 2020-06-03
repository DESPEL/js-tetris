function tetrominoCrazy() {
    let tetromino = getRandomTetromino(tetrominoCrazy)
    if (overlaps(tetromino.position.x, tetromino.position.y, tetromino.blocks)) {
        console.log('You noob')
        return
    }

    checkRows()
    tetromino.initListeners()
}

function checkRows() {
    let rows = document.getElementById('board').children
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i]
        let rowItems = row.children
        let great = true
        for (let j = 0; j < rowItems.length; j++) {
            let block = rowItems[j]
            if (!block.classList.contains(ACTIVE)) {
                great = false
            }
        }
        if (great) {
            row.remove()
            getBoard().splice(i)
            createNewRow()
        }
    }
}

function createNewRow() {
    let board = document.getElementById('board')
    let row = document.createElement('div')
    row.classList.add('game_row')
    let a_row = []
    for (let j = 0; j < COLUMNS; j++) {
        cell = document.createElement('div')
        cell.classList.add('block')
        row.appendChild(cell)
        a_row.push(cell)
    }
    board.insertBefore(row, board.firstChild)
    getBoard().unshift(a_row)
}
tetrominoCrazy()