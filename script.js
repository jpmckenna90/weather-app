// !TODO what should go into local storage? should it be key: city, property: queryURL? - maybe, this seems to work
// !TODO make the city list items into buttons, when clicked, pass relevant queryURL into function

var apiKey = "226c7f48de6d96ec8e61f348613686a1";
var city = "";
var now = moment().format("HH:mm");

$(document).ready(function() {
  $("#searchbtn").on("click", function() {
    ajaxCall();
    $("h6").empty();
  });

  $("#citylist").on("click", function(){
    city = event.target.textContent.trim();
    console.log(city);
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=" + apiKey;
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) { 
      clearContent();
      currentConditions(response);
      fiveDay(response)
      console.log(response);
    });
  })

  // This function clears content to make way for incoming data 
  function clearContent(){
    $(".clearme").empty();
  }

  //This is for current weather - need to implement forecasts
  function ajaxCall() {
    city = $("#cityfield").val();
    // how can I make these clickable? and then call ajax call but not update the list of cities (actually that part should be easy, can
    // maybe even write a conditional within this function that says if citylist !contain city. might have to bring in an array and ignore case to do that)
    $("#citylist").prepend("<li class='citylist'><a id='cityitem'>" + city);
    //prettier-ignore
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=" + apiKey;
    window.localStorage.setItem(city, queryURL);
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      clearContent();
      currentConditions(response);
      fiveDay(response)
      console.log(response);
    });
  }

 

  // This function updates card with current city info
  function currentConditions(response) {
    var currentIcon = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
    $("#maincard").text(response.name + ", " + now);
    $("#maincard").append("<img src='" + currentIcon + "'>");
    $("#cardtemp").append("<h5 class='clearme'>" + response.main.temp);
    $("#cardhumidity").append("<h5 class='clearme'>" + response.main.humidity);
    $("#cardwindspeed").append("<h5 class='clearme'>" + response.wind.speed);
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
  function fiveDay(response){
    var cityID = response.id;
    $.ajax({
      url: "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&units=imperial" + "&appid=" + apiKey,
      method: "GET"
    }).then(function(fiveday) {

      // var iconID = "";

      for(var i = 0; i < 5; i++){
        // iconID = fiveday
      $("#day" + [i]).prepend("<h3>" + moment().format("MMMM") + " " + (moment().date() + i));
      $("#day" + [i]).append("<img src='" + "http://openweathermap.org/img/w/" + fiveday.list[i * 8].weather[0].icon + ".png" + "'>");
      $("#day" + [i]).append("<h6>" + "Temp: " + fiveday.list[i * 8].main.temp + " &#8457;");
      $("#day" + [i]).append("<h6>" + "Humidity: " + fiveday.list[i * 8].main.humidity + "%");

    }

      console.log(fiveday);
    });
  }
});

// http://openweathermap.org/img/w/10d.png