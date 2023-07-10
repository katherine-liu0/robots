let sizeDifference = 10
let colorB=90
let speed=1
let a = 255
let aChange = -1
let upArrow,downArrow, leftArrow, rightArrow
let upArrowI,downArrowI, leftArrowI, rightArrowI
let robots=[]
let arrows=[]
let lockClicks=10

function preload(){
    upArrow = loadImage("media/arrow_up.png")
    downArrow = loadImage("media/arrow_down.png")
    leftArrow = loadImage("media/arrow_left.png")
    rightArrow = loadImage("media/arrow_right.png")
    upArrowI = loadImage("media/arrow_up_inactive.png")
    downArrowI = loadImage("media/arrow_down_inactive.png")
    leftArrowI = loadImage("media/arrow_left_inactive.png")
    rightArrowI = loadImage("media/arrow_right_inactive.png")
}

function setup() {
    let canvas = createCanvas(800,600);
    background(200)

    for (let x = 1;x<8;x++){
        for (let y=1;y<6;y++){
            let temp=new Arrow(100*x,100*y)
            arrows.push(temp)
        }
    }


    canvas.style('display', 'block');
    canvas.style('margin', 'auto');
    canvas.parent("#center")

}

function draw(){
    background(200)

    if (frameCount % 150 ==1){
        robots.push(new Robot(-10,height/2,"right"))
    }

    for (let i = 0; i<arrows.length; i++){
        arrows[i].drawPath()
    } 

    for (let i = 0; i<arrows.length; i++){
        arrows[i].display()
    } 

    for (let i = 0; i<robots.length; i++){
        robots[i].display()
        if (robots[i].move() == "gone"){
            robots.splice(i,1)
            i-=1
        } 

    }

  
}


function mouseClicked(){
    for (let i = 0; i<arrows.length; i++){
        arrows[i].checkClick()
    }
}

class Robot{
    constructor(x,y,d){
        this.x=x
        this.y=y
        this.size=random(25,50)
        this.headColorH=random(0,180)
        this.headColorS=random(50,70)
        this.bodyColorH=random(180,360)
        this.bodyColorS=random(50,70)
        this.eyeType=random(0,1)
        this.d=d
        this.thickness
    }

    display(){

        noStroke()
        colorMode(RGB)

        //thruster
        a+=aChange
        if (a<=128){
            aChange=1
        }

        if (a>=255){
            aChange = -1
        }

        fill(255,150,102,a)
        if (this.d=="left"){
            ellipse(this.x+this.size/2+sizeDifference/2, this.y+(this.size+sizeDifference)/2,this.size-sizeDifference)
        }

        else if (this.d=="right"){
            ellipse(this.x-this.size/2-sizeDifference/2, this.y+(this.size+sizeDifference)/2,this.size-sizeDifference)
        }

        else if (this.d=="up"){
            ellipse(this.x,this.y+this.size+sizeDifference, this.size-sizeDifference)
        }

        else{
            ellipse(this.x,this.y-this.size,this.size-sizeDifference)
        }

        //antenna
        stroke(255)
        strokeWeight(1)
        line(this.x,this.y-this.size,this.x-this.size/2,this.y-this.size*4/3)
        line(this.x,this.y-this.size,this.x+this.size/2,this.y-this.size*4/3)
        noStroke()
        fill(255,a)
        ellipse(this.x-this.size/2,this.y-this.size*4/3,10)
        ellipse(this.x+this.size/2,this.y-this.size*4/3,10)
       

        colorMode(HSB)
        //head & body
        fill(this.headColorH, this.headColorS, colorB)
        rect(this.x-this.size/2, this.y-this.size, this.size, this.size)
        fill(this.bodyColorH, this.bodyColorS, colorB)
        rect(this.x-this.size/2-sizeDifference/2, this.y, this.size+sizeDifference, this.size+sizeDifference)
        
        //eyes
        if (this.eyeType<0.5){
            fill(0,0,100)
            rect(this.x-this.size*3/10, this.y-this.size*4/5, this.size/5, this.size/3)
            rect(this.x+this.size/10, this.y-this.size*4/5, this.size/5, this.size/3)
        }

        else{
            fill(0,0,100)
            rect(this.x-this.size*3/10, this.y-this.size*4/5, this.size*3/5, this.size/3)
        }


        colorMode(RGB)

    }

    move(){
        if (this.d=="left"){
            this.x-=speed
        }

        else if (this.d=="right"){
            this.x+=speed
        }

        else if (this.d=="up"){
            this.y-=speed
        }

        else{
            this.y+=speed
        }

        for (let i = 0; i<arrows.length; i++){
            this.thickness=map(dist(this.x,this.y,arrows[i].x,arrows[i].y),0,800,10,-150)
            if(dist(this.x,this.y,arrows[i].x,arrows[i].y)<=49){
                stroke(255,255,0)
                strokeWeight(this.thickness)
                line(this.x,this.y,arrows[i].x,arrows[i].y)
                noStroke(0)

            }
            if(dist(this.x,this.y,arrows[i].x,arrows[i].y)<=0){
                this.d=arrows[i].d
            }

        }

        if((this.x>900)||(this.x<-100)||(this.y>700)||(this.y<-100) ){
            return "gone"
        }

        else{
            return "ok"
        }

    }

}

class Arrow{
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.dIndex=random(0,4)
        this.d
        this.imageFile
        this.state
        this.type=random(0,1)
        this.click=0
    }

    display(){
        if (this.type<0.9){

            if (this.type<0.5){
                this.state = "active"
            }

            else{
                if (this.click>=lockClicks){
                    this.state="inactive"
                }
                else{
                    this.state="active"
                }
            }
        }

        else{
            this.state="inactive"
        }

        if (this.state=="active"){
            if (this.dIndex < 1){
                this.d="left"
                this.imageFile=leftArrow
            }

            else if (this.dIndex >=1 && this.dIndex <2){
                this.d="right"
                this.imageFile=rightArrow
            }

            else if (this.dIndex>=2 && this.dIndex <3){
                this.d="up"
                this.imageFile=upArrow
            }

            else{
                this.d="down"
                this.imageFile=downArrow
            }
        }

        else{
            if (this.dIndex < 1){
                this.d="left"
                this.imageFile=leftArrowI
            }

            else if (this.dIndex >=1 && this.dIndex <2){
                this.d="right"
                this.imageFile=rightArrowI
            }

            else if (this.dIndex>=2 && this.dIndex <3){
                this.d="up"
                this.imageFile=upArrowI
            }

            else{
                this.d="down"
                this.imageFile=downArrowI
            }

        }

        imageMode(CENTER)
        image(this.imageFile,this.x,this.y)
    }


    drawPath(){
        colorMode(RGB)
        fill(255,255,0,50)
        if (this.dIndex < 1){
            rect(this.x-100,this.y-25,100,50)
        }

        else if (this.dIndex >=1 && this.dIndex <2){
            rect(this.x,this.y-25,100,50)
        }

        else if (this.dIndex>=2 && this.dIndex <3){
            rect(this.x-25,this.y-100,50,100)
        }

        else{
            rect(this.x-25,this.y,50,100)
        }

    }

    checkClick(){
        if (dist(mouseX,mouseY,this.x,this.y)<=25){
            if (this.imageFile==downArrow){
                this.dIndex=0.5
            }

            else if (this.imageFile==leftArrow){
                this.dIndex=2.5
           }

            else if (this.imageFile==upArrow){
                this.dIndex=1.5
            }

            else if (this.imageFile==rightArrow){
                this.dIndex=3.5
            }

            this.click+=1
        }

    }
}



