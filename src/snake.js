const STATE_RUNNING = 1;
const STATE_LOSING = 2;

const TICK = 60;
const SQUARE_SIZE = 20;
const BOARD_WIDTH = 35;
const BOARD_HEIGHT = 35;
const GROW_SCALE = 1;
const COLORS = {
    '49':'#22dd22',
    '50':'#ff4D27',
    '51':'#22eee1',
    '52':'#e90cff'
}

const DIRECTIONS_MAP = {
    '65': [-1,0],
    '68': [1,0],
    '83': [0,1],
    '87': [0,-1],
    '37': [-1,0],
    '39': [1,0],
    '40': [0,1],
    '38': [0,-1]
};
let state = {
    canvas: null,
    context: null,
    snake: [{x: 17, y:30}],
    direction: {x: 0, y:-1},
    prey: {x:parseInt(Math.random() * BOARD_WIDTH),y:parseInt(Math.random() * BOARD_HEIGHT)},
    growing: 5,
    paint_color: '#22dd22',
    score: 0,
    runState: STATE_RUNNING
};

function randomXY(){
    return {
        x: parseInt(Math.random() * BOARD_WIDTH),
        y: parseInt(Math.random() * BOARD_HEIGHT)
    };
}
function tick(){
    const head = state.snake[0];
    const dx = state.direction.x;
    const dy = state.direction.y;
    const highestIndex = state.snake.length - 1;
    let tail = {};
    let interval = TICK;

    Object.assign(tail,state.snake[state.snake.length-1]);

    let didScore = (
        head.x === state.prey.x && head.y === state.prey.y
    );

    if (state.runState === STATE_RUNNING) {
        for (let idx = highestIndex; idx > -1 ; idx--){
            const sq = state.snake[idx];

            if (idx === 0){
                sq.x += dx;
                sq.y += dy;
            } else {
                sq.x = state.snake[idx-1].x;
                sq.y = state.snake[idx-1].y;
            }
        }
    } else if (state.runState === STATE_LOSING){
        interval = 10;

        if (state.snake.length > 0){
            state.snake.splice(0,1);
        }

        if (state.snake.length === 0){
            state.runState = STATE_RUNNING;
            state.snake.push(randomXY());
            state.prey = randomXY();
        }
    }

    if (detectCollition()){
        state.runState = STATE_LOSING;
        state.growing = 0;
        state.score = 0;
        document.getElementById("score").innerHTML = "Score: "+state.score;
    }

    if (didScore){
        state.growing += GROW_SCALE;
        state.prey = randomXY();
        state.score+=10;
        document.getElementById("score").innerHTML = "Score: "+state.score;
    }

    if (state.growing > 0){
        state.snake.push(tail);
        state.growing-=1;
    }

    requestAnimationFrame(draw);
    setTimeout(tick, interval)
}

function detectCollition(){
    const head = state.snake[0];

    if (head.x < 0 || head.x >= BOARD_WIDTH || head.y >= BOARD_HEIGHT 
    || head.y < 0){
        return true;
    }
    for (var idx = 1; idx < state.snake.length; idx++){
        const sq = state.snake[idx];
        if (sq.x === head.x && sq.y === head.y){
            return true;
        }
    }
    return false;
}

function drawPixel(color,x,y){
    state.context.fillStyle = color;
    state.context.fillRect(
        x * SQUARE_SIZE,
        y * SQUARE_SIZE,
        SQUARE_SIZE,
        SQUARE_SIZE
    )
}

function draw(){
    state.context.clearRect(0,0,750,750)
    for (var idx = 0; idx < state.snake.length; idx++){
        const {x,y} = state.snake[idx];
        drawPixel(state.paint_color,x,y);
    }
        
    const {x,y} = state.prey;
    drawPixel('yellow',x,y);
}

window.onload = function(){
    state.canvas = document.querySelector('canvas');
    state.context = state.canvas.getContext('2d');

    window.onkeydown = function(e) {
        const direction = DIRECTIONS_MAP[e.keyCode];
        const snake_color = COLORS[e.keyCode];

        if(direction){
            const [x,y] = direction;
            if (-x !== state.direction.x && -y !== state.direction.y){
                state.direction.x = x;
                state.direction.y = y;
            }
        }
        if(snake_color){
            state.paint_color=snake_color;
        }
    }

    tick();
}