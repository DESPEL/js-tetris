function moveDown(tetromino) {
    move(tetromino, 0, 1, () => tetromino.freeze())
}

function moveLeft(tetromino) {
    move(tetromino, -1, 0)
}

function moveRight(tetromino) {
    move(tetromino, 1, 0)
}

function move(tetromino, dx, dy, error = () => {}) {
    const blocks = tetromino.getBlocks()
    let newPos = tetromino.getPosition()
    newPos.y += dy
    newPos.x += dx
    if (!isInBoundsDelta(dx, dy, tetromino)) {
        error()
        return
    }
    if (overlaps(newPos.x, newPos.y + blocks.length, blocks[blocks.length - 1])) {
        error()
        return
    }
    tetromino.setPosition(newPos)
}


function rotate(tetromino) {
    tetromino.rotate()
}

function instaFloor(tetromino) {
    while (!tetromino.frozen) {
        //unrender(tetromino.getPosition(), tetromino.getBlocks())
        moveDown(tetromino)
            //render(tetromino)
    }
}