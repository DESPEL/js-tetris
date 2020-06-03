function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function generateMatrix(rows, columns) {
    let matrix = []
    for (let i = 0; i < rows; i++) {
        matrix.push(new Array(columns))
    }
    return matrix
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