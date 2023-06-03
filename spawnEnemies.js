//for generating enemies from random location. Not much fun

function spawnEnemies1(){
    setInterval(()=>{
        const radius = 20*Math.random() + 5
        let ex, ey;

        if (Math.random() < 0.5) {
            ex = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            ey = Math.random()*canvas.height
        }else{
            ex = Math.random()*canvas.width
            ey = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }
        const angle = Math.atan2(y,x)
    const velocity = {
        x: 10*Math.random()*Math.cos(angle),
        y: 10*Math.random()*Math.sin(angle)
    }
        enemies.push(new Enemy(ex,ey,radius,'green',velocity))
    },1000)
}


//for generating enemies from screen edges in random direction. Will be better with moveable player

function spawnEnemies2(){
    setInterval(()=>{
        const radius = 20*Math.random() + 5
        let ex, ey;

        if (Math.random() < 0.5) {
            ex = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            ey = Math.random()*canvas.height
        }else{
            ex = Math.random()*canvas.width
            ey = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }
        const angle = Math.atan2(y - ey,x - ex)
    const velocity = {
        x: 10*Math.random()*Math.cos(angle),
        y: 10*Math.random()*Math.sin(angle)
    }
        enemies.push(new Enemy(ex,ey,radius,'green',velocity))
    },1000)
}


//for generating enemies from screen edges towards the players with random velocity

function spawnEnemies3(){
    setInterval(()=>{
        const radius = 20*Math.random() + 5
        let ex, ey;

        if (Math.random() < 0.5) {
            ex = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            ey = Math.random()*canvas.height
        }else{
            ex = Math.random()*canvas.width
            ey = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }
        const angle = Math.atan2(y - ey,x - ex)
        const a = Math.random()
    const velocity = {
        x: 10*a*Math.cos(angle),
        y: 10*a*Math.sin(angle)
    }
        enemies.push(new Enemy(ex,ey,radius,'green',velocity))
    },1000)
}
