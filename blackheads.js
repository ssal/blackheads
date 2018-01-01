var language = navigator.language || navigator.userLanguage;

var canvas;

var blackheads = [];
var talker;
var storyi;

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

	addBlackhead();
}

function draw(){
	background(255);

	if(random(rate) < 1){
		rate += 1/log(rate)*10;
		addBlackhead();
	} else if(random(rate) < 0.15){
		addBlackhead(round(mouseX+random(-rate, rate)),round(mouseY+random(-rate, rate)));
	} else if(random(poptime) > poptime/4){
		poptime = ceil(abs(poptime + random(-2,2)*random(poptime)+8));
	}
	
	for(i = 0; i < blackheads.length; ++i){
		blackheads[i].draw();
		if(random(rate/2) < 1){
			if(talker != null && i == talker.li) talker.grow();
			blackheads[i].grow();
		}
	}
	if(talker != null) talker.draw();
}

function addBlackhead(ix, iy){
	if(!ix) ix = random(width);
	if(!iy) iy = random(height);
	blackheads[blackheads.length] = new Blackhead(ix, iy, 4);
	if(talker == null && width/5 < ix&&ix < width/2 && height/5 < iy&&iy < height*4/5) talker = new Talker(blackheads.length - 1);
}

function click(){
	for(i = 0; i < blackheads.length; ++i){
		if(blackheads[i].popped) continue;
		
		if(blackheads[i].x-blackheads[i].r < mouseX && mouseX < blackheads[i].x+blackheads[i].r && blackheads[i].y-blackheads[i].r < mouseY && mouseY < blackheads[i].y+blackheads[i].r){
			if((sq(mouseX - blackheads[i].x) + sq(mouseY - blackheads[i].y))/sq(blackheads[i].r) <= 1){
				blackheads[i].pop();
				if(talker != null && i == talker.li) talker.pop();
				if((1/rate)*random(log(blackheads[i].r)) > 0.05){
					var moremax = 8;
					for(a = 0; a < moremax; ++a){
						if(random(moremax-a) < moremax/2) break;
						addBlackhead(round(blackheads[i].x+random(-blackheads[i].r*10, blackheads[i].r*10)),round(blackheads[i].y+random(-blackheads[i].r*10, blackheads[i].r*10)));
					}
				}
				break;
			}
		}
	}
}

function Blackhead(ix, iy, ir){
	this.x = ix;
	this.y = iy;
	this.r = ir;

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

function Talker(ili){
	this.entext = ["ooh, what are these dots? (hint: try clicking on them)"];
	this.kotext = ["와, 이 점들 뭐야? (힌트: 점들을 클릭해)"];

	switch(language){
		case "ko-kr": this.ctext = this.kotext; break;
		default: this.ctext = this.entext; break;
	}

	this.li = ili;

	this.x = blackheads[this.li].x;
	this.y = blackheads[this.li].y;

	this.gb = 255;
	this.popped = false;

	this.draw = function(){
		if(this.popped){
			if(this.gb < 255) this.gb += 63.5;
			// else this = null; // TODO: find another way to call the garbage collector
		}

		stroke(255,this.gb,this.gb);
		noFill();

		ellipse(this.x,this.y,24,24);

		noStroke();
		fill(255,this.gb,this.gb);
		textSize(16);
		text(this.ctext, this.x - 12, this.y - 16);

		fill(0);

		this.phase++;
	}

	this.grow = function(){
		if(this.gb > 0) this.gb -= 63.75;
	}
	this.pop = function(){
		this.popped = true;
	}
}