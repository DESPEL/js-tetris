const ACTIVE = 'active'
const CURRENT = 'current'
const DEFAULT_COLOR = 'antiquewhite'

const tetrominoes = [
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    [
        [1, 1],
        [1, 1],
    ],
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ]
]

const colors = [
    'aqua', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'
]

class Tetromino {
    constructor(blocks, color, stopCallback = () => {}) {
        this.blocks = blocks
        this.position = {
            x: Math.floor((9 - blocks[0].length) / 2),
            y: 0,
        }
        this.frozen = false
        this.color = color
        this.stopHandler = stopCallback

        this.addPauseListener()
    }

    pauseHandler(e) {
        if (e.keyCode != 32) {
            return
        }
        if (!this.paused) {
            this.pause()
            console.log('paused')
        } else {
            this.resume()
            console.log('unpaused')
        }
    }

    getPauseHandler() {
        let handler = (e) => this.pauseHandler(e)
        this.removePauseHandler = () => document.removeEventListener('keypress', handler)
        return handler
    }

    addPauseListener() {
        this.paused = false
        document.addEventListener('keypress', this.getPauseHandler())
    }

    kbHandler(e) {
        const keyHandlers = {
            40: this.moveDown,
            37: this.moveLeft,
            39: this.moveRight,
            38: this.rotate,
            13: this.instaFloor
        }
        if (keyHandlers[e.keyCode] !== undefined)
            return keyHandlers[e.keyCode].apply(this)
        return true
    }

    getKbHandler() {
        let handler = (e) => {
            this.kbHandler.apply(this, [e])
        }
        this.removeKbHandler = () => document.removeEventListener("keydown", handler)
        return handler
    }

    getIntervalHandler() {
        return () => {
            this.moveDown.apply(this)
        }
    }

    initListeners() {
        this.render()
        this.moveDownInterval = setInterval(this.getIntervalHandler(), 1000)
        document.addEventListener("keydown", this.getKbHandler())
    }

    stop() {
        clearInterval(this.moveDownInterval)
        this.removeKbHandler()
        this.removePauseHandler()

        let board = getBoard()
        for (let i = 0; i < this.blocks.length; i++) {
            for (let j = 0; j < this.blocks[0].length; j++) {
                if (this.blocks[i][j] !== 0) {
                    let DOMBlock = board[this.position.y + i][this.position.x + j]
                    DOMBlock.classList.remove(CURRENT)
                }
            }
        }

        this.stopHandler()
    }

    pause() {
        this.paused = true
        clearInterval(this.moveDownInterval)
        this.removeKbHandler()
    }

    resume() {
        this.paused = false
        this.initListeners()
    }

    instaFloor() {
        while (this.moveDown()) {}
    }

    rotate() { // TODO: Finish rotation
        this.renderableTask(this.rotationHelper)
    }
    rotationHelper() {
        let newBlocks = rotate90deg(this.blocks)
        if (!overlaps(this.position.x, this.position.y, newBlocks)) {
            this.blocks = newBlocks
        }
    }

    moveDown() {
        const moved = this.renderableTask(() => this.move(0, 1))
        if (!moved) {
            this.stop()
            return false
        }
        return true
    }

    moveLeft() {
        this.renderableTask(() => this.move(-1, 0))
    }

    moveRight() {
        this.renderableTask(() => this.move(1, 0))
    }

    move(dx, dy) {
        let newPos = clone(this.position)
        newPos.y += dy
        newPos.x += dx
        const canMove = isInBoundsDelta(dx, dy, this) &&
            !overlaps(newPos.x, newPos.y, this.blocks)
        if (!canMove) {
            return false
        }
        this.position = newPos
        return true
    }


    renderableTask(fn) {
        this.unrender()
        let r = fn.apply(this)
        this.render()
        return r
    }

    unrender() {
        let board = getBoard()
        for (let i = 0; i < this.blocks.length; i++) {
            for (let j = 0; j < this.blocks[0].length; j++) {
                if (this.blocks[i][j] !== 0) {
                    let block = board[this.position.y + i][this.position.x + j]
                    block.classList.remove(ACTIVE)
                    block.classList.remove(CURRENT)
                    block.style.backgroundColor = DEFAULT_COLOR
                }
            }
        }
    }

    render() {
        let board = getBoard()
        for (let i = 0; i < this.blocks.length; i++) {
            for (let j = 0; j < this.blocks[0].length; j++) {
                if (this.blocks[i][j] !== 0) {
                    let DOMBlock = board[this.position.y + i][this.position.x + j]
                    DOMBlock.classList.add(ACTIVE)
                    DOMBlock.classList.add(CURRENT)
                    DOMBlock.style.backgroundColor = this.color
                }
            }
        }
    }



    lowerBound() {
        let maxY = 0
        for (let i = 0; i < this.blocks.length; i++) {
            for (let j = 0; j < this.blocks[0].length; j++) {
                if (this.blocks[i][j] == 1) {
                    maxY = i
                }
            }
        }
        return this.position.y + maxY
    }

    leftBound() {
        for (let i = 0; i < this.blocks[0].length; i++) {
            for (let j = 0; j < this.blocks.length; j++) {
                if (this.blocks[j][i] == 1) {
                    return this.position.x + i
                }
            }
        }
    }

    rightBound() {
        for (let i = this.blocks[0].length - 1; i >= 0; i--) {
            for (let j = 0; j < this.blocks.length; j++) {
                if (this.blocks[j][i] == 1) {
                    return this.position.x + i
                }
            }
        }
    }
}

function getRandomTetromino(stopCallback = () => {}) {
    const blocks = tetrominoes[Math.floor(Math.random() * tetrominoes.length)]
    const color = colors[Math.floor(Math.random() * colors.length)]
    return new Tetromino(blocks, color, stopCallback)
}


function overlaps(x, y, blocks) {
    const board = getBoard()
    for (let i = 0; i < blocks.length; i++) {
        const rowOverlaps = doesRowOverlap(x, y + i, blocks[i])
        if (rowOverlaps) {
            return true
        }
    }
    return false
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
    return isBlockOccupied(x, y) && (!isCurrent)
}

function isBlockOccupied(x, y) {
    return getBlock(x, y).classList.contains(ACTIVE)
}

function isInBoundsDelta(dx, dy, tetromino) {
    const leftInBounds = getBlock(tetromino.leftBound() + dx, tetromino.lowerBound() + dy) !== undefined
    const rightInBounds = getBlock(tetromino.rightBound() + dx, tetromino.lowerBound() + dy) !== undefined
    return leftInBounds && rightInBounds
}