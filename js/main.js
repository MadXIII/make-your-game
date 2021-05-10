let score
let scorePoint
let winScore
let lives

let field

let blocks = initBlocks(3, 15)

let ball
let ballX = 29
let ballY = 3
let ballVectorX = Math.random(10) - Math.random(10)
let ballVectorY = 1

let platform = {
    x: 24.5,
    left: false,
    right: false,
}

let start = false
let animation

let win
let lose
// let end = true

let sec
let timer = '00:00'
let startTimer = false

winScore = blocks.length * blocks[0].length

function onLoad() {
    field = document.getElementById('field')
    ball = document.getElementById('ball')
    platformDom = document.getElementById('platform')
    score = document.getElementById('score')
    lives = document.getElementById('lives')
    button = document.getElementById('btn')
    win = document.getElementById('win')
    lose = document.getElementById('lose')
    timeSet()
    createBlocks()
}

function timeSet() {
    timerId = setInterval(() => {
        let min = Number(timer.slice(0, 2))
        let sec = Number(timer.slice(3))
        if (startTimer) {
            sec += 1
            if (sec == 60) {
                min += 1
                sec = 0
            }
            if (sec < 10) {
                sec = '0' + sec
            }
            if (min < 10) {
                min = '0' + min
            }
            timer = `${min}:${sec}`
            document.getElementById('timer').innerHTML = timer
        }
    }, 1000);
}

function triggerGame(event) {
    if (!start) {
        console.log(start)
        event.innerHTML = 'start'
        start = true
        startTimer = true
        startGame()
    } else {
        event.innerHTML = 'pause'
        console.log(start)
        start = false
        startTimer = false
        pauseGame()
    }
}

function startGame() {
    animation = requestAnimationFrame(ballVector)
}
function pauseGame() {
    cancelAnimationFrame(animation)
}
function restart() {
    location.reload()
}

document.addEventListener('keydown', (event) => {
    if (event.key == 'ArrowLeft') {
        platform.left = true
    }
    if (event.key == 'ArrowRight') {
        platform.right = true
    }
})

document.addEventListener('keyup', (event) => {
    if (event.key == 'ArrowLeft') {
        platform.left = false
    }
    if (event.key == 'ArrowRight') {
        platform.right = false
    }
})

function ballVector() {
    scorePoint = Number(score.innerHTML)

    if (scorePoint >= winScore) {
        win.style.visibility = 'visible'
        startTimer = false
        return
    }
    ballY += 0.5 * ballVectorY
    ball.style.bottom = ballY + 'vmin'
    ballX += 0.5 * ballVectorX
    ball.style.left = ballX + 'vmin'
    checkIfHit()

    if (ballY <= 0) {
        lives.lastElementChild.remove()
        if (lives.childElementCount <= 0) {
            lose.style.visibility = 'visible'
            button.style.visibility = 'hidden'
            startTimer = false
        }
        ballX = 29
        ballY = 3
        ball.style.bottom = ballY + 'vmin'
        ball.style.left = ballX + 'vmin'
        platform.x = 24.5
        platformDom.style.left = platform.x + 'vmin'
        startTimer = false
        return
    }

    if (platform.left) {
        if (platform.x >= 0.5) {
            platform.x -= 1
            platformDom.style.left = platform.x + 'vmin'
        }
    }
    if (platform.right) {
        if (platform.x <= 48.5) {
            platform.x += 1
            platformDom.style.left = platform.x + 'vmin'
        }
    }
    animation = requestAnimationFrame(ballVector)
}

function changeVector(brick = null) {
    if (checkIfHitsPlate()) {
        if (ballX === platform.x + 4.5) {
            ballVectorX = 0;
            ballVectorY = 1;
        } else if (ballX < platform.x + 4.5) {
            ballVectorX = -1;
            ballVectorY = 1;
        } else if (ballX > platform.x + 4.5) {
            ballVectorX = 1;
            ballVectorY = 1;
        }
    } else if (checkIfHitLeftSide()) {
        ballVectorX = 1;
    } else if (checkIfHitRightSide()) {
        ballVectorX = -1;
    } else if (checkIfHitUpSide()) {
        ballVectorY = ballVectorY === 1 ? -1 : 1;
    } else if (ballY - 2.5 > brick.y && ballVectorX !== 0) {
        ballVectorX = ballVectorX === 1 ? -1 : 1;
    } else {
        ballVectorY = ballVectorY === 1 ? -1 : 1;
    }
}

function checkIfHit() {
    for (let i = 0; i < blocks.length; ++i) {
        for (let j = 0; j < blocks[i].length; ++j) {
            if (checkIfHitsBlock(i, j)) {
                blocks[i][j].exists = false;
                changeVector(blocks[i][j]);
                hideBlocks(i);
                score.innerHTML = 1 + Number(score.innerHTML);
            }
        }
    } if (checkIfHitsPlate() || checkIfHitSide()) {
        changeVector();
    } else if (ballY <= 0) {
        cancelAnimationFrame(animation)
    }
}

function checkIfHitsBlock(i, j) {
    return (ballX >= blocks[i][j].x
        && ballX < blocks[i][j].x + 4
        && ballY - 2.5 >= blocks[i][j].y
        && ballY - 2.5 < blocks[i][j].y + 4
        && blocks[i][j].exists);
}

function checkIfHitsPlate() {
    return (ballX >= platform.x
        && ballX <= platform.x + 11)
        && ballY <= 3;
}

function checkIfHitSide() {
    return checkIfHitLeftSide() || checkIfHitRightSide() || checkIfHitUpSide()
}
function checkIfHitLeftSide() {
    return (ballX <= 0)
}
function checkIfHitRightSide() {
    return (ballX >= 58)
}
function checkIfHitUpSide() {
    return (ballY >= 67.5)
}

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

function createBlocks() {
    for (let i = 0; i < blocks.length; i++) {
        let rowDiv = document.createElement('div')
        rowDiv.className = 'row'
        for (let j = 0; j < blocks[i].length; j++) {
            let blockDiv = document.createElement('div')
            blockDiv.className = 'block'
            rowDiv.appendChild(blockDiv)
        }
        field.appendChild(rowDiv)
    }
}

function hideBlocks() {
    for (let i = 0; i < blocks.length; i++) {
        let rowDiv = document.getElementsByClassName('row')[i]
        for (let j = 0; j < blocks[i].length; j++) {
            if (!blocks[i][j].exists) {
                let blockDiv = rowDiv.getElementsByClassName('block')[j]
                blockDiv.className += ' hidden'
            }
        }
    }
}