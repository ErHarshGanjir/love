const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const keys = {};

document.addEventListener("keydown",(e)=>{
    keys[e.code]=true;

    if(e.code==="Digit1") currentWeapon=0;
    if(e.code==="Digit2") currentWeapon=1;
    if(e.code==="Digit3") currentWeapon=2;
    if(e.code==="Digit4") currentWeapon=3;

    document.getElementById("weaponName").textContent =
        weapons[currentWeapon].name;
});

document.addEventListener("keyup",(e)=>{
    keys[e.code]=false;
});

class Tank{
    constructor(x,y,color){
        this.x=x;
        this.y=y;
        this.angle=0;
        this.speed=0;
        this.color=color;
        this.hp=100;
    }

    update(){
        if(keys["ArrowLeft"]) this.angle-=0.05;
        if(keys["ArrowRight"]) this.angle+=0.05;

        if(keys["ArrowUp"]) this.speed=3;
        else if(keys["ArrowDown"]) this.speed=-2;
        else this.speed*=0.9;

        this.x+=Math.cos(this.angle)*this.speed;
        this.y+=Math.sin(this.angle)*this.speed;
    }

    draw(){
        ctx.save();

        ctx.translate(this.x,this.y);
        ctx.rotate(this.angle);

        ctx.fillStyle=this.color;
        ctx.fillRect(-20,-15,40,30);

        ctx.fillStyle="#444";
        ctx.fillRect(0,-4,30,8);

        ctx.restore();
    }
}

class Bullet{
    constructor(x,y,angle,speed,size,color,damage){
        this.x=x;
        this.y=y;
        this.angle=angle;
        this.speed=speed;
        this.size=size;
        this.color=color;
        this.damage=damage;
    }

    update(){
        this.x+=Math.cos(this.angle)*this.speed;
        this.y+=Math.sin(this.angle)*this.speed;
    }

    draw(){
        ctx.fillStyle=this.color;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.fill();
    }
}

class Enemy{
    constructor(){
        this.x=Math.random()*canvas.width;
        this.y=Math.random()*canvas.height;
        this.angle=0;
        this.hp=50;
    }

    update(){
        let dx=player.x-this.x;
        let dy=player.y-this.y;

        this.angle=Math.atan2(dy,dx);

        this.x+=Math.cos(this.angle)*1.5;
        this.y+=Math.sin(this.angle)*1.5;
    }

    draw(){
        ctx.save();

        ctx.translate(this.x,this.y);
        ctx.rotate(this.angle);

        ctx.fillStyle="red";
        ctx.fillRect(-18,-12,36,24);

        ctx.fillStyle="#660000";
        ctx.fillRect(0,-3,22,6);

        ctx.restore();
    }
}

const player=new Tank(
    canvas.width/2,
    canvas.height/2,
    "#00ff88"
);

const bullets=[];
const enemies=[];

let score=0;

for(let i=0;i<8;i++){
    enemies.push(new Enemy());
}

const weapons=[
{
    name:"Shell",
    speed:8,
    size:5,
    color:"yellow",
    damage:25
},
{
    name:"Missile",
    speed:6,
    size:8,
    color:"orange",
    damage:50
},
{
    name:"Cluster",
    speed:7,
    size:6,
    color:"cyan",
    damage:35
},
{
    name:"Laser",
    speed:15,
    size:3,
    color:"lime",
    damage:70
}
];

let currentWeapon=0;

document.addEventListener("keydown",(e)=>{
    if(e.code==="Space"){

        let w=weapons[currentWeapon];

        bullets.push(
            new Bullet(
                player.x+Math.cos(player.angle)*30,
                player.y+Math.sin(player.angle)*30,
                player.angle,
                w.speed,
                w.size,
                w.color,
                w.damage
            )
        );
    }
});

function collision(a,b,radius){
    let dx=a.x-b.x;
    let dy=a.y-b.y;
    return Math.sqrt(dx*dx+dy*dy)<radius;
}

function gameLoop(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    player.update();
    player.draw();

    bullets.forEach((bullet,bi)=>{
        bullet.update();
        bullet.draw();

        enemies.forEach((enemy,ei)=>{

            if(collision(bullet,enemy,20)){

                enemy.hp-=bullet.damage;

                bullets.splice(bi,1);

                if(enemy.hp<=0){

                    enemies.splice(ei,1);

                    enemies.push(new Enemy());

                    score+=10;

                    document.getElementById("score").textContent=score;
                }
            }
        });
    });

    enemies.forEach(enemy=>{
        enemy.update();
        enemy.draw();
    });

    requestAnimationFrame(gameLoop);
}

gameLoop();
