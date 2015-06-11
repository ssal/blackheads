var canvas;

var blackheads = [];

var poptime = 100;
var minimumtimeout = 14;

var rate = 10.0;

function setup(){
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.mousePressed(click);

	frameRate(30);

	smooth();
	noStroke();
	fill(0);

	blackheads[blackheads.length] = new Blackhead();
}

function draw(){
	background(255);

	if(random(rate) < 1){
		rate += 1/log(rate)*10;
		blackheads[blackheads.length] = new Blackhead();
	} else if(random(rate) < 0.15){
		blackheads[blackheads.length] = new Blackhead(round(mouseX+random(-rate, rate)),round(mouseY+random(-rate, rate)));
	} else if(random(poptime) > poptime/4){
		poptime = ceil(abs(poptime + random(-2,2)*random(poptime)+8));
	}
	
	for(i = 0; i < blackheads.length; ++i){
		blackheads[i].draw();
		if(random(rate/2) < 1) blackheads[i].grow();
	}
}

function click(){
	for(i = 0; i < blackheads.length; ++i){
		if(blackheads[i].popped) continue;
		
		if(blackheads[i].x-blackheads[i].r < mouseX && mouseX < blackheads[i].x+blackheads[i].r && blackheads[i].y-blackheads[i].r < mouseY && mouseY < blackheads[i].y+blackheads[i].r){
			if((sq(mouseX - blackheads[i].x) + sq(mouseY - blackheads[i].y))/sq(blackheads[i].r) <= 1){
				blackheads[i].pop();
				if((1/rate)*random(log(blackheads[i].r)) > 0.05){
					var moremax = 8;
					for(a = 0; a < moremax; ++a){
						if(random(moremax-a) < moremax/2) break;
						blackheads[blackheads.length] = new Blackhead(round(blackheads[i].x+random(-blackheads[i].r*10, blackheads[i].r*10)),round(blackheads[i].y+random(-blackheads[i].r*10, blackheads[i].r*10)));
					}
				}
				break;
			}
		}
	}

}

function Blackhead(ix, iy, ir){
	if(!ix) this.x = random(width)
	else this.x = ix;
	if(!iy) this.y = random(height)
	else this.y = iy;
	if(!ir) this.r = 4
	else this.r = ir;

	this.ar = 0;

	this.timesincepop = 0;
	this.popped = false;

	this.draw = function(){
		if(!this.popped) ellipse(this.x,this.y,this.ar,this.ar);
		else {
			if(this.timesincepop == 0) this.ar = this.r;
			if(this.ar > 0){
				this.ar--;
				ellipse(this.x,this.y,this.ar,this.ar);
			}
			if(this.timesincepop > poptime && this.timesincepop > this.r-this.ar + this.minimumtimeout){
				this.popped = false;
				this.bigger();
				this.timesincepop = 0;
			} else {
				this.timesincepop++;
			}
		}
	}

	this.pop = function(){
		this.popped = true;
	}
	this.bigger = function(){
		this.r += random(3);
	}
	this.grow = function(){
		if(this.ar < this.r) this.ar++;
	}
}