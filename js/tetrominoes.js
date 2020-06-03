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
    constructor(blocks, color) {
        this.rotation = 0
        this.blocks = blocks
        this.x = Math.floor((9 - blocks[0].length) / 2)
        this.y = 0
        this.frozen = false
        this.color = color
    }

    getRotation() {
        return this.rotation
    }

    getBlocks() {
        return this.blocks
    }

    rotate() {
        this.blocks = rotate90deg(this.blocks)
        this.rotation = (this.rotation + 1) % 4
    }

    freeze() {
        this.frozen = true

        const position = this.getPosition()
        const blocks = this.getBlocks()
        let board = getBoard()
        for (let i = 0; i < blocks.length; i++) {
            for (let j = 0; j < blocks[0].length; j++) {
                if (blocks[i][j] !== 0) {
                    let DOMBlock = board[position.y + i][position.x + j]
                    DOMBlock.classList.remove(CURRENT)
                }
            }
        }
    }

    getPosition() {
        return {
            x: this.x,
            y: this.y
        }
    }

    setPosition(position) {
        this.x = position.x
        this.y = position.y
    }

    lowerBound() {
        if (this.maxY !== undefined) {
            return this.y + this.maxY
        }
        this.maxY = this._calculateLowerY()
        return this.y + this.maxY
    }

    _calculateLowerY() {
        let maxY = 0
        for (let i = 0; i < this.blocks.length; i++) {
            for (let j = 0; j < this.blocks[0].length; j++) {
                if (this.blocks[i][j] == 1) {
                    maxY = i
                }
            }
        }
        return maxY
    }

    leftBound() {
        if (this.minX !== undefined) {
            return this.x + this.minX
        }
        this.minX = this._calculateMinX()
        return this.x + this.minX
    }

    _calculateMinX() {
        for (let i = 0; i < this.blocks[0].length; i++) {
            for (let j = 0; j < this.blocks.length; j++) {
                if (this.blocks[j][i] == 1) {
                    return i
                }
            }
        }
    }

    rightBound() {
        if (this.maxX !== undefined) {
            return this.x + this.maxX
        }
        this.maxX = this._calculateMaxX()
        return this.x + this.maxX
    }

    _calculateMaxX() {
        for (let i = this.blocks[0].length - 1; i >= 0; i--) {
            for (let j = 0; j < this.blocks.length; j++) {
                if (this.blocks[j][i] == 1) {
                    return i
                }
            }
        }
    }
}

function getRandomTetromino() {
    const blocks = tetrominoes[Math.floor(Math.random() * tetrominoes.length)]
    const color = colors[Math.floor(Math.random() * colors.length)]
    return new Tetromino(blocks, color)
}

function rotate90deg(matrix) {
    let result = generateMatrix(matrix[0].length, matrix.length)

    for (let i = 0; i < matrix[0].length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            result[i][j] = matrix[matrix.length - j - 1][i]
        }
    }
    return result
}

function generateMatrix(rows, columns) {
    let matrix = []
    for (let i = 0; i < rows; i++) {
        matrix.push(new Array(columns))
    }
    return matrix
}