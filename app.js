const APIKEY = "61140114475feeaa7063e280030780dc";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const cityName = document.getElementById("cityName");
const weatherDesc = document.getElementById("weatherDesc");
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const weatherCard = document.getElementById("weatherCard");
const forecastSection = document.getElementById("forecastSection");
const forecastList = document.getElementById("forecastList");
const errorMsg = document.getElementById("errorMsg");
const show = (el) => el.classList.remove("hidden");
const hide = (el) => el.classList.add("hidden");

const fetchWeather = async (city) => {
  const url = `${BASE_URL}/weather?q=${city}&appid=${APIKEY}&units=metric`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("city not found");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    errorMsg.textContent = error.message;
    show(errorMsg);
  }
};
searchBtn.addEventListener("click", () => {
  if (!cityInput.value) return;
  hide(weatherCard);
  hide(forecastSection);
  hide(errorMsg);

  fetchWeather(cityInput.value).then((data) => displayWeather(data));
  fetchForecast(cityInput.value).then((data) => displayForecast(data));
});

const displayWeather = (data) => {
  const { name, main, weather, wind } = data;

  cityName.textContent = name;
  weatherDesc.textContent = weather[0].description;
  temp.textContent = Math.round(main.temp);
  humidity.textContent = main.humidity;
  windEl.textContent = wind.speed;

  show(weatherCard);
};

const fetchForecast = async (city) => {
  const forecastUrl = `${BASE_URL}/forecast?q=${city}&appid=${APIKEY}&units=metric`;
  try {
    const response = await fetch(forecastUrl);
    if (!response.ok) {
      throw new Error("There is no forcast here");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    errorMsg.textContent = error.message;
    show(errorMsg);
  }
};

const displayForecast = (data) => {
  const dailyForecasts = data.list.filter((item) =>
    item.dt_txt.includes("12:00:00"),
  );

  const forecastHTML = dailyForecasts.map(({ dt_txt, main, weather }) => {
    const date = new Date(dt_txt).toLocaleString("en-NG", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    return `<div> ${date} </div> <div> ${Math.round(main.temp)}°C</div> <div>${weather[0].description}</div> `;
  });

  forecastList.innerHTML = forecastHTML.join("");
  show(forecastSection);

  console.log(dailyForecasts);
};
