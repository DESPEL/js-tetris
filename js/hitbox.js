function overlaps(x, y, blocks) {
    const board = getBoard()
    for (let i = 0; i < blocks.length; i++) {
        const rowOverlaps = doesRowOverlap(x, y, blocks[i])
        if (rowOverlaps) {
            return true
        }
    }
}

function doesRowOverlap(x, y, row) {
    let overlaps = false
    for (let i = 0; i < row.length; i++) {
        if (row[i] === 1) {
            overlaps |= doesBlockOverlap(x + i, y)
        }
    }
    return overlaps
}

function doesBlockOverlap(x, y) {
    if (getBlock(x, y) === undefined) {
        return true
    }
    const isCurrent = getBlock(x, y).classList.contains(CURRENT)
    return isBlockOccupied(x, y) && !isCurrent
}

function doesColumnOverlap(x, y, column) {
    for (let i = 0; i < column.length; i++) {
        if (column[i] === 1 && isBlockOccupied(x, y + i)) {
            return true
        }
    }
}

function isBlockOccupied(x, y) {
    return getBoard()[y][x].classList.contains(ACTIVE)
}

function isInBoundsDelta(dx, dy, tetromino) {
    const leftInBounds = getBlock(tetromino.leftBound() + dx, tetromino.lowerBound() + dy) !== undefined
    const rightInBounds = getBlock(tetromino.rightBound() + dx, tetromino.lowerBound() + dy) !== undefined
    return leftInBounds && rightInBounds
}