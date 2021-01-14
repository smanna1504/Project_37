//Create variables here

var  dog, happyDog, database, foodS, lastFed,fedTime;//var foodStock;
var feed,add;
var dogSprite,foodObj;
var position;
var bedroom,garden,washroom,vaccination;
var sadDog;
var gameState;
var readState;
var currentTime;

function preload()
{
dog=loadImage("images/Dog.png");
happyDog=loadImage("images/Happy.png");
bedroom=loadImage("images/Bed Room.png");
garden=loadImage("images/Garden.png");
washroom=loadImage("images/Wash Room.png");
sadDog=loadImage("images/Lazy.png");
vaccination=loadImage("images/Vaccination.jpg");
}

function setup() {
createCanvas(800,500);
database=firebase.database();

foodObj=new Food();

dogSprite=createSprite(600,250,20,20);
dogSprite.addImage(dog);
dogSprite.scale=0.2;

var dogO=database.ref('food');
dogO.on("value",readPosition,showError);
feed=createButton("FEED THE DOG");
feed.position(900,60);
feed.mousePressed(feedDog);
//feed.mousePressed(update("Fed"));

add=createButton("ADD FOOD");
add.position(800,60);
add.mousePressed(addFood);

if(gameState!="Hungry"){

}else{

}
}


function draw() {  
background(49,139,87);
fedTime=database.ref('feedTime');
fedTime.on("value",(data)=>{
lastFed=data.val();
});

readState=database.ref('gameState');
readState.on("value",(data)=>{
gameState=data.val();
});

if(lastFed!=undefined){

drawSprites();
//foodObj.display();

textSize(16);
fill(Infinity);
stroke(Infinity);
if(lastFed>=12){
text("LAST FEED: "+lastFed%12+"PM",150,30);
}else if(lastFed===0){
text("LAST FEED: 12AM",150,30);
}else{
text("LAST FEED: "+lastFed+"AM",150,30);
}

currentTime=hour();
 if(currentTime==lastFed){
 update("Fed");
  foodObj.display();
  feed.show();
  add.show();
 dogSprite.addImage(happyDog);
 }
 else if(currentTime==(lastFed+1)){
update("Playing");
foodObj.garden();
feed.hide();
add.hide();
dogSprite.remove();
}else if(currentTime==(lastFed+2)){
update("Sleeping");
foodObj.bedroom();
feed.hide();
add.hide();
dogSprite.remove();
}else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
update("Bathing");
foodObj.washroom();
feed.hide();
add.hide();
dogSprite.remove();
}else if(currentTime==(lastFed+12)){
update("Vaccinating");
foodObj.vaccination();
feed.hide();
add.hide();
dogSprite.remove();
}
else{
update("Hungry");
foodObj.display();
feed.show();
add.show();
dogSprite.addImage(sadDog);
}

}
}

function readPosition(data){
position=data.val();
foodObj.updateFoodStock(position);
}

function showError(){
console.log("Error in Writing to Database");
}


function writePosition(x){

if (x<=0) {
x=0;
} else {
x-=1;
}
database.ref('/').update({
'food':x
})
}

function addFood(){
position++;
database.ref('/').update({
  'food':position
});
}

function update(state){
database.ref('/').update({
  'gameState':state
});
}

function feedDog(){
dogSprite.addImage(happyDog);
foodObj.updateFoodStock(foodObj.getFoodStock()-1);
update("Fed");
  database.ref('/').update({
  'food':foodObj.getFoodStock(),
  'feedTime':hour()
});
}

