(function(){
  var API_WORLD_TIME_KEY = "694e328b81937efe508bdfe76b071";
  var API_WORLD_TIME = "http://api.worldweatheronline.com/free/v2/tz.ashx?key=" + API_WORLD_TIME_KEY;
  var API_WEATHER_KEY = "a67d111f7f943411d375b6edb008ac48";
  var API_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather?";
  var WEATHER_IMG = "http://openweathermap.org/img/w/";

  
  var cities = [];
  var activarGuardado = false;
  var today = new Date();
  var timeNow = today.toLocaleTimeString();

  var $body = $("body");
  var $loader = $(".loader");
  var $nameNewCity = $("[data-input='cityAdd']");
  var $btnSendCity = $("[data-button='add']");
  var $btnLoad = $("[data-saved-cities]");

  $($btnSendCity).on('click', addNewCity);
  $($btnLoad).on('click', loadSavedCities);

  var cityWeather = {};
  cityWeather.zone;
  cityWeather.icon;
  cityWeather.hour;
  cityWeather.temp;
  cityWeather.temp_max;
  cityWeather.temp_min;
  cityWeather.main;


  if (navigator.geolocation) {

    function startGeolocation() {
      navigator.geolocation.getCurrentPosition(getPosition, errorFound);
    }

    function errorFound(error) {
      console.log(":( ha ocurrido un error " + error);
    }

    function getPosition(data) {
      var lat = data.coords.latitude;
      var lon = data.coords.longitude;
      $.getJSON(API_WEATHER_URL + "lat=" + lat + "&" + "lon=" + lon, getCurrentWeather);
    }

    function getCurrentWeather(data) {
      //HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      cityWeather = {};
      cityWeather.zone = data.name;
      cityWeather.icon = WEATHER_IMG + data.weather[0].icon + ".png";
      cityWeather.temp = data.main.temp - 273.15;
      cityWeather.temp_max = data.main.temp_max - 273.15;
      cityWeather.temp_min = data.main.temp_min - 273.15;
      cityWeather.main = data.main;

      $.getJSON(API_WORLD_TIME + "&q=" + cityWeather.zone + "&format=json", function(response) {
        $nameNewCity.val("");
        cityWeather.hour = response.data.time_zone[0].localtime.split(" ")[1];

        renderTemplate(cityWeather);
      });
    }

    function activateTemplate(id) {
      var t = document.getElementById(id);
      return document.importNode(t.content, true);
    }

    function renderTemplate(cityWeather) {
      var clone = activateTemplate("template-city");
      clone.querySelector("[data-city]").innerHTML = cityWeather.zone;
      clone.querySelector("[data-time]").innerHTML = cityWeather.hour;
      clone.querySelector("[data-icon]").src = cityWeather.icon;
      clone.querySelector("[data-temp='max']").innerHTML = cityWeather.temp_max.toFixed(2);
      clone.querySelector("[data-temp='min']").innerHTML = cityWeather.temp_min.toFixed(2);
      clone.querySelector("[data-temp='current']").innerHTML = cityWeather.temp.toFixed(2);

      $($loader).hide();
      $($body).append(clone);
    }
    function addNewCity(event) {
      event.preventDefault();
      $.getJSON(API_WEATHER_URL + "q=" + $nameNewCity.val(), getNewCityWeather);
    }

    function getNewCityWeather(data){
      $.getJSON(API_WORLD_TIME + "&q=" + cityWeather.zone + "&format=json", function(response) {
        $nameNewCity.val("");
        cityWeather = {};
        cityWeather.zone = data.name;
        cityWeather.hour = response.data.time_zone[0].localtime.split(" ")[1];
        cityWeather.icon = WEATHER_IMG + data.weather[0].icon + ".png";
        cityWeather.temp = data.main.temp - 273.15;
        cityWeather.temp_max = data.main.temp_max - 273.15;
        cityWeather.temp_min = data.main.temp_min - 273.15;
        cityWeather.main = data.main;
        renderTemplate(cityWeather);
        saveCity(cityWeather);
      });
    }

    function saveCity(city) {
      cities.push(city);
      localStorage.setItem('cities', JSON.stringify(cities));
    }

    function loadSavedCities(event) {
      event.preventDefault();
      var backup = JSON.parse(localStorage.getItem('cities'));
      var cities = JSON.parse(localStorage.getItem('cities'));

      backup.concat(cities);
      cities = backup;
      
      cities.forEach(function(city) {
        renderTemplate(city);
      });
      /*for (i = 0 ; i < cities.length; i++){
        renderTemplate(cities[i]);
        console.log(i);
      }*/

    }

    startGeolocation();

  }else{
    document.write("<h1>Deberias altualizar tu navegador a uno mas moderno it's free</h1>");
  }
})();