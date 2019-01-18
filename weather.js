let APPID = "bea8681ece4f65fb347501141dbdb51c"; // tempoAPI senha)
let temp;
let loc;
let icon;
let humidity;
let wind;
let direction;

const update = (weather) => {
	icon.src = "imgs/codes/" + weather.icon + ".png";
	wind.innerHTML = weather.wind;
	direction.innerHTML = weather.direction;
	humidity.innerHTML = weather.humidity;
	loc.innerHTML = weather.loc;
	temp.innerHTML = weather.temp;	
};

const updateByGeo=(lat, lon)=>{
	let url = "http://api.openweathermap.org/data/2.5/weather?" +
	"lat=" + lat +
	"&lon=" + lon + 
	"&APPID=" + APPID;
	sendRequest(url);
};

const updateByZip = (zip) =>{
	let url = "http://api.openweathermap.org/data/2.5/weather?" + 
	"zip=" + zip + 
	"&APPID=" + APPID;
	sendRequest(url);
};

// funcao para celcius
const K2C=(k)=>{
	return Math.round(k - 273.15);
};

// pedido ajax
const sendRequest=(url)=>{
	let xmlhttp = new 	XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
			let data = JSON.parse(xmlhttp.responseText);
			let weather= {};
			weather.icon = data.weather[0].id;
			weather.humidity = data.main.humidity;
			weather.wind = data.wind.speed;
			weather.direction = directionWind(data.wind.deg);
			weather.loc = data.name;
			weather.temp = K2C(data.main.temp);

			update(weather);
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

// direcao vento
const directionWind=(degrees)=>{
	let range = 360/16;
	let low = 360-range / 2;
	let high = (low + range) % 360;
	let angles = ("N", "NNE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW");
	for(i in angles){
		if (degrees >= low && degrees <high){
			return angles[i];
		}
		low = (low + range) % 360;
		high = (high + range) % 360;
	}
	return "N";
}

// when app loads initail this
window.onload = function(){
	temp = document.getElementById("temperature");
	loc = document.getElementById("location");
	icon = document.getElementById("icon");
	humidity = document.getElementById("humidity");
	wind = document.getElementById("wind");
	direction = document.getElementById("direction");

	if(navigator.geolocation){
		let showPosition = function(position){
			updateByGeo(position.coords.latitude, position.coords.longitude);	
		}
		navigator.geolocation.getCurrentPosition(showPosition);
	}
	else{
		let zip = window.prompt("Não foi possível obter a sua localização!");
		updateByZip(zip);
	}
}

