const DEFAULT_COLOR = "antiquewhite"
const ACTIVE = 'active'
const CURRENT = 'current'

function startGame() {
    const board = document.getElementById('board')
    if (board.childElementCount > 0)
        setupBoard()
    return
}

function tetrominoMove() {
    tetromino = getRandomTetromino()
}

function run() {}


const keyHandlers = {
    40: (tetromino) => moveDown(tetromino),
    37: (tetromino) => moveLeft(tetromino),
    39: (tetromino) => moveRight(tetromino),
    38: (tetromino) => rotate(tetromino),
    13: (tetromino) => instaFloor(tetromino)
}

function callKeyHandler(tetromino, keyCode) {
    const keyHandler = keyHandlers[keyCode]
    if (keyHandler !== undefined) {
        keyHandler(tetromino)
    }
}

function getKeydownHandler(tetromino, renderTetromino) {

    function handler(event) {
        callKeyHandler(tetromino, event.keyCode)
        renderTetromino()
        if (tetromino.frozen) {
            document.removeEventListener('keydown', handler)
            tetromino.freeze()
        }
    }
    return handler
}

function generateDropManager(tetromino, renderTetromino) {
    let controller = undefined

    function dropManager() {
        if (tetromino.frozen) {
            setTimeout(tetrominoLife(), 0)
            return
        }
        moveDown(tetromino)
        renderTetromino()
        controller = setTimeout(dropManager, 1000)
    }
    controller = setTimeout(dropManager, 1000)
    return dropManager
}

function spawnTetromino() {
    let tetromino = getRandomTetromino()
    const pos = tetromino.getPosition()
    if (overlaps(pos.x, pos.y, tetromino.getBlocks())) {
        return false
    }
    return tetromino
}

function tetrominoLife() {
    let tetromino = spawnTetromino()

    const renderTetromino = getTetrominoRenderer(tetromino)
    renderTetromino()


    const keyDownHandler = getKeydownHandler(tetromino, renderTetromino)
    document.addEventListener('keydown', keyDownHandler)
    generateDropManager(tetromino, renderTetromino)
    return true
}

function run() {
    tetrominoLife()
}

run()