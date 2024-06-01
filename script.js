const button = document.getElementById("btn");
const input = document.getElementById("input");
const form = document.getElementById("form")
const forecastdata = document.getElementById("forecast");
const forecastTime = document.getElementById("forecast-time");
const forecastImg = document.getElementById("forecast-img");
const forecastDeg = document.getElementById("forecast-deg");
let topvalue = ""

input.onchange = () => {
  topvalue += input.value.trim()
}
form.addEventListener('submit', (event) => {
  event.preventDefault();
  console.log(topvalue)
  fetchWeatherData(topvalue)
  fetchForecastData('Berlin')
})
// forecastdata5.onclick = () => {
//   forecastdata5.style.backgroundColor = "rgb(225,225,225,0.1)"
//   forecastdata1.style.backgroundColor = "transparent"
//   forecastdata2.style.backgroundColor = "transparent"
//   forecastdata3.style.backgroundColor = "transparent"
//   forecastdata4.style.backgroundColor = "transparent"
// }
// forecastdata5.onmouseenter = () => {
//   forecastdata5.style.backgroundColor = "rgb(225,225,225,0.2)"
// }

forecastdata.onclick = () => {
  forecastdata1.style.backgroundColor = "rgb(225,225,225,0.1)"
  forecastdata5.style.backgroundColor = "transparent"
  forecastdata2.style.backgroundColor = "transparent"
  forecastdata3.style.backgroundColor = "transparent"
  forecastdata4.style.backgroundColor = "transparent"
}

const ImgLinks = [
    {src: "img/sunny.svg", code: "1000"},
    {src: "img/Image.svg", code: "1003"},
    {src: "img/cloudy.svg", code: "1009"},
    {src: "img/foggy.png", code: "1135"},
    {src: "", code: "1261"},
    {src: "", code: "1000"},
]

const ForecastData = [
  {time: "9AM", src: "img/03_cloud_color.svg", deg: "18°", id:1},
  {time: "9AM", src: "/img/Imagewind.svg", deg: "19°", id:2},
  {time: "9AM", src: "img/Image-cloud-icon (1).svg", deg: "24°", id:3},
  {time: "9AM", src: "img/01_sunny_color.svg", deg: "25°", id:4},
  {time: "9AM", src: "img/09_light_rain_color.svg", deg: "26°", id:5}
]



ForecastData.forEach(data => {
  const forecastItem = document.createElement('div');
  forecastItem.className = "forecast-item"
  forecastItem.innerHTML =`
  <p>${data.time}</p>
  <img src="${data.src}" alt="Weather Icon" />
  <p>${data.deg}</p>
  `;
  forecastdata.appendChild(forecastItem)
});

const fetchWeatherData = async (value) => {
 
    try {
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=bd40c0923d484ab9a6a80911243105&q=${value}`,{
            method: 'GET',
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();

          if(data){
            const temp = document.getElementById("temp");
            temp.innerHTML = `${data.current.temp_c}°C`;
            const place = document.getElementById("place");
            place.innerHTML = `${data.location.name}, ${data.location.country}`;
            const time = document.getElementById("time");
            time.innerHTML = `${data.location.localtime}`;
            const description = document.getElementById("description")
            description.innerHTML = `${data.current.condition.text}`
            const image = document.getElementById("wimg");
            const imgLink = ImgLinks.find(img => img.code === data.current.condition.code.toString());
            image.src = imgLink ? imgLink.src : '';
          }
    } catch (error) {
        console.log(error)
    }
};

const fetchForecastData = async (value) => {

try {
	const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m`,{
    method: 'GET',
  });
	const result = await response.json();
	console.log(result);
} catch (error) {
	console.error(error);
}
}

// const url = 'https://forecast9.p.rapidapi.com/rapidapi/forecast/Berlin/hourly/';
// const options = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Key': '81d0e94123msh28dfdf005231dd5p13b059jsn88aab1e0473f',
// 		'X-RapidAPI-Host': 'forecast9.p.rapidapi.com'
// 	}
// };

// try {
// 	const response = await fetch(url, options);
// 	const result = await response.text();
// 	console.log(result);
// } catch (error) {
// 	console.error(error);
// }