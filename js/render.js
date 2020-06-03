function unrender(position, blocks) {
    let board = getBoard()
    for (let i = 0; i < blocks.length; i++) {
        for (let j = 0; j < blocks[0].length; j++) {
            if (blocks[i][j] !== 0) {
                let block = board[position.y + i][position.x + j]
                block.classList.remove(ACTIVE)
                block.classList.remove(CURRENT)
                block.style.backgroundColor = DEFAULT_COLOR
            }
        }
    }
}

function render(tetromino) {
    const position = tetromino.getPosition()
    const blocks = tetromino.getBlocks()
    let board = getBoard()
    for (let i = 0; i < blocks.length; i++) {
        for (let j = 0; j < blocks[0].length; j++) {
            if (blocks[i][j] !== 0) {
                let DOMBlock = board[position.y + i][position.x + j]
                DOMBlock.classList.add(ACTIVE)
                DOMBlock.classList.add(CURRENT)
                DOMBlock.style.backgroundColor = tetromino.color
            }
        }
    }
}

function getTetrominoRenderer(tetromino) {
    let lastPosition = tetromino.getPosition()
    let lastBlocks = tetromino.getBlocks()
    let lastFrozen = tetromino.frozen

    function renderer() {
        if (lastFrozen) {
            return
        }
        unrender(lastPosition, lastBlocks)
        render(tetromino)
        lastPosition = tetromino.getPosition()
        lastBlocks = tetromino.getBlocks()
        lastFrozen = tetromino.frozen
    }
    return renderer
}