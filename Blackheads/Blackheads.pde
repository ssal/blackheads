/* Blackheads
     by ssal
     
  This code is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/.
 */

static int buffersize = 10000;

static int bhpoptime = 100;
static int minimumtimeout = 14;

static float rate = 10.0f;
Blackhead bh[] = new Blackhead[buffersize];
int bhi = 0;


void setup(){
  background(255);
  noStroke();
  smooth();
  size(displayWidth,displayHeight);
  
  addbh();
  
  fill(0);
}
void draw(){
  background(255);
  
  if(random(rate) < 1){
    rate += 1/log(rate)*10;
    addbh();
  } else if(random(rate) < 0.15f){
    addbh(round(mouseX+random(-rate, rate)),round(mouseY+random(-rate, rate)));
  } else if(random(bhpoptime) > bhpoptime/4){
    bhpoptime = ceil(abs(bhpoptime + random(-2,2)*random(bhpoptime)+8));
  }
  
  for(int i = 0; i < bhi; ++i){
    bh[i].draw();
    if(random(rate/2) < 1) bh[i].grow();
  }
}


void addbh(){
  if(bhi < bh.length) bh[bhi++] = new Blackhead(round(random(width)),round(random(height)),4);
} void addbh(int ix, int iy){
  if(bhi < bh.length) bh[bhi++] = new Blackhead(ix,iy,4);
}

void mousePressed(){
  for(int i = 0; i < bhi; ++i){
    if(bh[i].popped) continue;
    
    if(bh[i].x-bh[i].r < mouseX && mouseX < bh[i].x+bh[i].r && bh[i].y-bh[i].r < mouseY && mouseY < bh[i].y+bh[i].r){
      if((sq(mouseX - bh[i].x) + sq(mouseY - bh[i].y))/sq(bh[i].r) <= 1){
        bh[i].pop();
        if((1/rate)*random(log(bh[i].r)) > 0.05f){
          int moremax = 8;
          for(int a = 0; a < moremax; ++a){
            if(random(moremax-a) < moremax/2) break;
            addbh(round(bh[i].x+random(-bh[i].r*10, bh[i].r*10)),round(bh[i].y+random(-bh[i].r*10, bh[i].r*10)));

          }
        }
        break;
      }
    }
  }
}


class Blackhead {
  int thisi;
  int x, y, r, ar = 0;
  
  int timesincepop = 0;
  boolean popped = false;
  
  Blackhead(int ix, int iy, int ir){
    x = ix; y = iy; r = ir;
    thisi = bhi;
  }
  
  void draw(){
    if(!popped) ellipse(x,y,ar,ar);
    else {
      if(timesincepop == 0) ar = r;
      if(ar > 0){
        ar--;
        ellipse(x,y,ar,ar);
      }
      if(timesincepop > bhpoptime && timesincepop > r-ar + minimumtimeout){
        popped = false;
        bigger();
        timesincepop = 0;
      } else {
        timesincepop++;
      }
    }
  }
  
  void pop(){
    popped = true;
  }
  void bigger(){
    r += random(3);
  }
  void grow(){
    if(ar < r) ar++;
  }
}
