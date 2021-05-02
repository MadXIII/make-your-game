let score

let field

let blocks = initBlocks(5, 15)

let ball
let ballX = 0
let ballY = 0
let ballVectorX = 0
let ballVectorY = 0

let platform = {
    x: 0,
    left: false,
    right: false,
}



let start = false
let restart = false

function onLoad() {
    field = document.getElementById('field')
    ball = document.getElementById('ball')
    platform = document.getElementById('platform')
}
requestAnimationFrame(loop)

function loop(timestamp) {
    requestAnimationFrame(loop)
}

function triggerGame(event) {
    if (!restart) {
        if (!start) {
            event.innerHTML = 'start'
            start = true
        }
    }
}
document.addEventListener('keydown', (event) => {
    if (event.key == 'ArrowLeft') {
        platform.left = true
    }
    if (event.key == 'ArrowRight') {
        platform.left = true
    }
})

document.addEventListener('keyup', (event) => {
    if (event.key == 'ArrowLeft') {
        platform.left = false
    }
    if (event.key == 'ArrowRight') {
        platform.left = false
    }
})

function initBlocks(rows, columns) {
    let blocks = new Array(rows)
    for (let i = 0; i < rows; i++) {
        blocks[i] = new Array(columns)
        for (let j = 0; j < columns; j++) {
            blocks[i][j] = { exists: true, x: j * 4, y: 61.5 - i * 4 }
        }
    }
    return blocks
}

function renderBlocks() {
    for (let i = 0; i < blocks.length; i++) {
        let rowDiv = document.createElement('div')
        rowDiv.className('row')
        for (let j = 0; j < blocks[i].length; j++) {
            let blockDiv = document.createElement('div')
            blockDiv.className('block')
            if (!blocks[i][j].exists) {
                blockDiv.className = ' hidden'
            }
            rowDiv.appendChild(blockDiv)
        }
        field.appendChild(rowDiv)
    }
}