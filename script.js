// !todo possibly better handling of the input? verify it, provide an error if nothing can be produced. 
// !todo general cleanup, add comments 

var apiKey = "226c7f48de6d96ec8e61f348613686a1";
var city = "";
var now = moment().format("HH:mm");
var localStorageIndex = 0;
var cityArray = [];
var cityObj = {};

$(document).ready(function() {

  // Populate city history, if it exists.
  createHistory();

  // Click event to clear city history
  $("#clearhistory").on("click", function(){
    clearHistory();
    $("#citylist").empty();
  })

  // Click event to submit city to be searched
  $("#searchbtn").on("click", function() {
    ajaxCall();
  });

  // Click event to gather weather data from city history buttons
  $("#citylist").on("click", function() {
    city = event.target.textContent.trim();
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial" +
      "&APPID=" +
      apiKey;
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      clearContent();
      currentConditions(response);
      fiveDay(response);
      console.log(response);
    });
  });

  // This function clears content to make way for incoming data
  function clearContent() {
    $(".clearme").empty();
  }

  // Ajax call for current city
  function ajaxCall() {
    city = $("#cityfield").val();
    alert(city);
    
    // Add to city list initially
    $("#citylist").prepend("<li class='citylist'><a id='cityitem'>" + city);
    //prettier-ignore
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=" + apiKey;

    // Ajax call, gather response and then A: add localStorage item and B: pass response to other functions
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      cityObj["name"] = city;
      cityObj["ID"] = response.id;
      window.localStorage.setItem(cityObj["name"], cityObj["ID"]);
      clearContent();
      currentConditions(response);
      fiveDay(response);
      console.log(response);
    });
  }

  // This function updates card with current city weather info
  function currentConditions(response) {
    var currentIcon =
      "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
    $("#maincard").text(response.name + ", " + now);
    $("#maincard").append("<img src='" + currentIcon + "'>");
    $("#cardtemp").append("<h5 class='clearme'>" + response.main.temp + " &#8457;");
    $("#cardhumidity").append("<h5 class='clearme'>" + response.main.humidity + " %");
    $("#cardwindspeed").append("<h5 class='clearme'>" + response.wind.speed + " MPH");
    currentUV(response);
  }

  // This function retrieves UV info for current city and appends it to the card
  function currentUV(response) {
    var cityLat = response.coord.lat;
    var cityLong = response.coord.lon;
    //prettier-ignore
    var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + cityLat + "&lon=" + cityLong;
    $.ajax({
      url: uvURL,
      method: "GET"
    }).then(function(uv) {
      $("#carduv").append("<h5 class='clearme'>" + uv.value);
    });
  }

  // Function to generate five day forecast
  function fiveDay(response) {
    var cityID = response.id;
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/forecast?id=" +
        cityID +
        "&units=imperial" +
        "&appid=" +
        apiKey,
      method: "GET"
    }).then(function(fiveday) {

      // For loop generates data for each card 
      for (var i = 0; i < 5; i++) {
        $("#day" + [i]).prepend(
          "<h3>" + moment().format("MMMM") + " " + (moment().date() + i)
        );
        $("#day" + [i]).append(
          "<img src='" +
            "http://openweathermap.org/img/w/" +
            fiveday.list[i * 8].weather[0].icon +
            ".png" +
            "'>"
        );
        $("#day" + [i]).append(
          "<h6>" + "Temp: " + fiveday.list[i * 8].main.temp + " &#8457;"
        );
        $("#day" + [i]).append(
          "<h6>" + "Humidity: " + fiveday.list[i * 8].main.humidity + "%"
        );
      }
    });
  }

  // Function to create city history (if it exists) on page load
  function createHistory() {
    for (var i = 0; i < localStorage.length; i++) {
      // Variable to hold item of current place in local storage
      var currentItem = JSON.stringify(localStorage.key(i));
      // Check to see if the current item is already in the array of cities
      if (!cityArray.includes(currentItem)) {
      // If not, add it. Just add the key - this will be used to retrieve the ID for the AJAX call (methinks)
        cityArray.push(localStorage.key(i));
      }
      $("#citylist").prepend("<li class='citylist'><a id='cityitem'>" + localStorage.key(i));
    }
    console.log(cityArray);
  }
});

  // Function to clear history, when called 
  function clearHistory(){
    localStorage.clear();
  }

