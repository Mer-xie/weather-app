const button = document.getElementById("btn");
const input = document.getElementById("input");
const form = document.getElementById("form");
const forecastdata = document.getElementById("forecast");
const forecastTime = document.getElementById("forecast-time");
const forecastImg = document.getElementById("forecast-img");
const forecastDeg = document.getElementById("forecast-deg");
const ctx = document.getElementById("myChart");
let topvalue = "";
let myChartInstance;

input.onchange = () => {
  topvalue += input.value.trim();
};
form.addEventListener("submit", (event) => {
  event.preventDefault();
  fetchWeatherData(topvalue)
    .then(() => {
      topvalue = "";
    })
    .catch((error) => {
      console.error(error);
    });
});

document.addEventListener("DOMContentLoaded", () => {
  fetchWeatherData("Nigeria")
    .then(() => {
      topvalue = "";
    })
    .catch((error) => {
      console.error(error);
    });
})

forecastdata.onclick = () => {
  forecastdata1.style.backgroundColor = "rgb(225,225,225,0.1)";
  forecastdata5.style.backgroundColor = "transparent";
  forecastdata2.style.backgroundColor = "transparent";
  forecastdata3.style.backgroundColor = "transparent";
  forecastdata4.style.backgroundColor = "transparent";
};

const ImgLinks = [
  {src: "img/sunny.svg", code: "1000"},
  {src: "img/35_partly_cloudy_daytime_color (1).svg", night:"img/36_partly_cloudy_night_color.svg", code: "1003"},
  {src: "img/cloudy.svg", code: "1006"},
  {src: "img/foggy.png", code: "1135"},
  {src: "img/18_moderate_snow_color.svg", code: "1258"},
  {src: "img/24_blizzard_color.svg", code: "1117"},
  {src: "img/11_heavy_rain_color.svg", code: "1186"},
  {src: "img/Imagewet-.svg", code: "1183"},
  {src: "img/22_snow_color.svg", code: "1125"},
  {src: "img/Image-thunder.svg", code: "1276"},
  {src: "img/07_lightning_color.svg", code: "1087"},
  {src: "img/13_heavy_rainstorm_color.svg", code: "1195"},
  {src: "img/25_mist_color.svg", code: "1030"},
  {src: "img/09_light_rain_color.svg", code: "1240"},
  {src: "", code: "1000"},
]

const ForecastData = [
  { time: "9AM", src: "img/03_cloud_color.svg", deg: "18°", id: 1 },
  { time: "9AM", src: "/img/Imagewind.svg", deg: "19°", id: 2 },
  { time: "9AM", src: "img/Image-cloud-icon (1).svg", deg: "24°", id: 3 },
  { time: "9AM", src: "img/01_sunny_color.svg", deg: "25°", id: 4 },
  { time: "9AM", src: "img/09_light_rain_color.svg", deg: "26°", id: 5 },
];

const fetchWeatherData = async (value) => {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=bd40c0923d484ab9a6a80911243105&q=${value}`,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    fetchForecastData(data);
    console.log(data);
    if (data) {
      const temp = document.getElementById("temp");
      temp.innerHTML = `${data.current.temp_c}°`;
      const place = document.getElementById("place");
      place.innerHTML = `${data.location.name}, ${data.location.country}`;
      const time = document.getElementById("time");
      time.innerHTML = `${data.location.localtime}`;
      const description = document.getElementById("description");
      description.innerHTML = `${data.current.condition.text}`;
      const image = document.getElementById("wimg");
      const imgLink = ImgLinks.find(
        (img) => img.code === data.current.condition.code.toString()
      );
      image.src = imgLink ? imgLink.src : "";
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchForecastData = async (value) => {
  try {
    forecastdata.innerHTML = ""
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${value.location.lat}&longitude=${value.location.lon}&hourly=temperature_2m`,
      {
        method: "GET",
      }
    );
    const result = await response.json();
    console.log(result);

    

    const FilteredTimes = result.hourly.time.slice(0, 5);
    const FilteredTemp = result.hourly.temperature_2m
      .slice(0, 5)
      .map((temp) => Math.round(temp));


      if(myChartInstance){
        myChartInstance.destroy()
      }

     myChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: FilteredTimes,
        datasets: [
          {
            label: "Temperatures",
            data: FilteredTemp,
            borderWidth: 3,
            pointStyle: "circle",
            pointBorderWidth: 4,
            pointRotation: 90,
            borderColor: "#3FD1FF",
            tension: 0.4,
            pointHoverBorderWidth: 5,
            pointHoverRadius: 9,
          },
        ],
      },
      options: {
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
          },
        },
      },
    });


    FilteredTimes.forEach((time, index) => {
      const weirdTime = time;
      const date = new Date(weirdTime);
      let hours = date.getHours();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedTime = `${hours}${ampm}`;

      const forecastItem = document.createElement("div");
      forecastItem.className = "forecast-item";
      forecastItem.innerHTML = `
        <p>${formattedTime}</p>
        <p>${FilteredTemp[index]}°</p>
      `;
      forecastdata.appendChild(forecastItem);
    });
  } catch (error) {
    console.error(error);
  }
};
