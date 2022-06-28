const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

console.log(c)

const scoreEl = document.querySelector('#scoreEl')
const scoreElBtn = document.querySelector('#scoreElBtn')
const startGameBtn = document.querySelector('#startGameBtn')
const modalEl = document.querySelector('#modalEl')

class Player {
    constructor() {
        this.speed = 4
        this.x = canvas.width / 2
        this.y = canvas.height / 2
        this.velocity = { //velocity of player
            x: 0,
            y: 0
        }
        this.radius = 10
        this.color = 'white'
    }
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }
    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }
    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }
    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}
const friction = 0.99
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }
    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        this.alpha -= 0.02
        c.restore()
    }
    update() {
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

// this part will be changed afterwards to create player movement 

//mouse position click error calculation   event.clientX - 145, event.clientY - 32

let player = new Player()
let x = player.x
let y = player.y
let projectiles = []
let enemies = []
let particles = []


function init() {
    player = new Player()
    x = player.x
    y = player.y
    projectiles = []
    enemies = []
    particles = []
    score = 0
    scoreEl.innerHTML = score
    scoreElBtn.innerHTML = score
}
let keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    up: {
        pressed: false
    },
    down: {
        pressed: false
    }
}

function spawnEnemies() {
    setInterval(() => {
        const radius = 25 * Math.random() + 5
        let ex, ey;
        const color = `hsl(${Math.random() * 360},50%,50%)`
        if (Math.random() < 0.5) {
            ex = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            ey = Math.random() * canvas.height
        } else {
            ex = Math.random() * canvas.width
            ey = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }
        const angle = Math.atan2(y - ey, x - ex)
        const a = 3 * Math.random()
        const velocity = {
            x: a * Math.cos(angle),
            y: a * Math.sin(angle)
        }
        enemies.push(new Enemy(ex, ey, radius, color, velocity))
    }, 1000)
}

let animationId;
let score = 0;
function animate() {
    animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0,0,0,0.1)' // the fourth input, alpha, allows the trail effect
    c.fillRect(0, 0, canvas.width, canvas.height)

    //player stuffs
    player.update()
    //player movement
    if (keys.right.pressed && (player.x < canvas.width - player.radius - 50) && (player.y > player.radius + 50) && (player.y < canvas.height - player.radius - 50)) {  //player movement
        player.velocity.x = player.speed
    } else if (keys.left.pressed && (player.x > player.radius + 50) && (player.y > player.radius + 50) && (player.y < canvas.height - player.radius - 50)) {  //player movement
        player.velocity.x = -player.speed
    }
    else if (keys.up.pressed && (player.y > player.radius + 50) && (player.x < canvas.width - player.radius - 50) && (player.x > player.radius + 50)) {  //player movement
        player.velocity.y = -player.speed
    }
    else if (keys.down.pressed && (player.y < canvas.height - player.radius - 50) && (player.x < canvas.width - player.radius - 50) && (player.x > player.radius + 50)) {  //player movement
        player.velocity.y = player.speed
    }
    else {
        player.velocity.x = 0
        player.velocity.y = 0
    }
    particles.forEach((particle, i) => {
        if (particle.alpha <= 0) {
            particles.splice(i, 1)
        } else {
            particle.update()
        }
    })
    projectiles.forEach((p, pIndex) => {
        p.update()
        //remove projectiles from the edges of screen
        if (p.x - p.radius < 0 || p.x + p.radius > canvas.width || p.y - p.radius < 0 || p.y + p.radius > canvas.height)
            setTimeout(() => {
                projectiles.splice(pIndex, 1)
            }, 0)
    })


    enemies.forEach((e, index) => {
        e.update()
        const dist = Math.hypot(player.x - e.x, player.y - e.y);
        if (dist - e.radius - player.radius < 1) {
            cancelAnimationFrame(animationId)
            modalEl.style.display = 'flex'
        }

        projectiles.forEach((p, pIndex) => {
            const dist = Math.hypot(p.x - e.x, p.y - e.y);

            //when projectiles touch enemy
            if (dist - e.radius - p.radius < 1) {
                for (let index = 0; index < e.radius * 2; index++) {
                    particles.push(new Particle(p.x, p.y, 2 * Math.random(), e.color, { x: (Math.random() - 0.5) * (Math.random() * 6), y: (Math.random() - 0.5) * (Math.random() * 6) }))
                }
                if (e.radius - 10 > 10) {
                    gsap.to(e, {
                        radius: e.radius - 10
                    })
                    score += 50
                    scoreEl.innerHTML = score
                    scoreElBtn.innerHTML = score
                    setTimeout(() => {
                        projectiles.splice(pIndex, 1)
                    }, 0)
                } else {
                    score += 100
                    scoreEl.innerHTML = score
                    scoreElBtn.innerHTML = score
                    setTimeout(() => {
                        enemies.splice(index, 1)
                        projectiles.splice(pIndex, 1)
                    }, 0)
                }
            }
        })
    })
}

//bullet shooting mechanism
addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x)
    const velocity = {
        x: 12 * Math.cos(angle),
        y: 12 * Math.sin(angle)
    }
    projectiles.push(
        new Projectile(player.x, player.y, 5, 'green', velocity)
    )

})

//player movement
window.addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 65: //when A is pressed
            keys.left.pressed = true
            break;
        case 83: //when S is pressed
            keys.down.pressed = true
            break;
        case 68: //when D is pressed
            keys.right.pressed = true;
            break;
        case 87: //when W is pressed
            keys.up.pressed = true
            break;

        //restart, impliment later
        case 82:
            cancelAnimationFrame(animationId)
            modalEl.style.display = 'flex'
            break;
        default:
            console.log(keyCode)
            break;
    }
})
window.addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 65: //when A is pressed
            console.log("left")
            keys.left.pressed = false
            break;
        case 83: //when S is pressed
            keys.down.pressed = false
            break;
        case 68: //when D is pressed
            console.log("right")
            keys.right.pressed = false
            break;
        case 87: //when W is pressed
            keys.up.pressed = false
            break;
        default:
            console.log(keyCode)
            break;
    }
})

startGameBtn.addEventListener('click', () => {
    init()
    animate()
    spawnEnemies()
    modalEl.style.display = 'none'
})
