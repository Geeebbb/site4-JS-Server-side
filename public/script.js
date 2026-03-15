window.onload = function(){


var map = new ol.Map({
target: "map",

layers: [
new ol.layer.Tile({
source: new ol.source.OSM()
})
],

view: new ol.View({
center: ol.proj.fromLonLat([37.648, 55.752]), 
zoom: 14
})

});



var input = document.getElementById("chatInput");
var sendBtn = document.getElementById("sendBtn");
var voiceBtn = document.getElementById("voiceBtn");
var messages = document.getElementById("chatMessages");


function addMessage(text, type){

var div = document.createElement("div");
div.className = "message " + type;

div.innerText = text;

messages.appendChild(div);

messages.scrollTop = messages.scrollHeight;

}



function botReply(text){

var lower = text.toLowerCase();

var answers = [];

if(lower.includes("привет")){

answers = [
"Привет!",
"Здравствуйте!",
"Рад вас видеть!"
];

}

else if(lower.includes("вшэ")){

answers = [
"ВШЭ - один из лучших университетов России.",
"Я учусь в МИЭМ НИУ ВШЭ.",
"Это отличный университет!"
];

}

else if(lower.includes("матем")){

answers = [
"Математика - основа многих IT-направлений.",
"Я люблю прикладную математику!"
];

}

else{

answers = [
"Интересный вопрос)",
"Расскажите подробнее.",
"Я пока не знаю что ответить."
];

}

var random = Math.floor(Math.random() * answers.length);

setTimeout(function(){

addMessage("Бот: " + answers[random], "bot");

},1000);

}



sendBtn.onclick = function(){

var text = input.value.trim();

if(text === "") return;

addMessage("Вы: " + text, "user");

botReply(text);

input.value = "";

};


let mediaRecorder;
let chunks = [];

voiceBtn.onclick = async function(){

if(!mediaRecorder || mediaRecorder.state === "inactive"){

try{

const stream = await navigator.mediaDevices.getUserMedia({audio:true});

mediaRecorder = new MediaRecorder(stream);

mediaRecorder.ondataavailable = function(e){
chunks.push(e.data);
};

mediaRecorder.onstop = function(){

const blob = new Blob(chunks,{type:'audio/webm'});
const audioUrl = URL.createObjectURL(blob);

var div = document.createElement("div");
div.className = "message user";

var audio = document.createElement("audio");
audio.controls = true;
audio.src = audioUrl;

div.appendChild(audio);
messages.appendChild(div);

messages.scrollTop = messages.scrollHeight;

chunks = [];

};

mediaRecorder.start();
voiceBtn.innerText = "⏹";

}catch(e){
alert("Нет доступа к микрофону");
}

}else{

mediaRecorder.stop();
voiceBtn.innerText = "🎤";

}

};
};