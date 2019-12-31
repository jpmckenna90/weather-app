var apiKey = "226c7f48de6d96ec8e61f348613686a1";
var city = "";
var now = moment().format("HH:mm");
// var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey;

// button test, works duh
$("#searchbtn").on("click", function() {
  ajaxCall();
  $("h6").empty();
});

//This is for current weather - need to implement forecasts
function ajaxCall() {

  city = $("#cityfield").val();

  // how can I make these clickable? and then call ajax call but not update the list of cities (actually that part should be easy, can 
  // maybe even write a conditional within this function that says if citylist !contain city. might have to bring in an array and ignore case to do that)
  $("#citylist").prepend("<li>" + city);

//prettier-ignore
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=" + apiKey;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    currentConditions(response);
    currentUV(response);
    console.log(response);
  });
}


// This function updates card with current city info
function currentConditions(response) {
  $("#maincard").text(response.name + ", " + now);
  $("#cardtemp").append("<h6>" + response.main.temp);
  $("#cardhumidity").append("<h6>" + response.main.humidity);
  $("#cardwindspeed").append("<h6>" + response.wind.speed);
}

// This function retrieves UV info for current city and appends it to the card
function currentUV(response){
  var cityLat = response.coord.lat;
  var cityLong = response.coord.lon;
  var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + cityLat + "&lon=" + cityLong;
  $.ajax({
    url: uvURL,
    method: "GET"
  }).then(function(uv){
    $("#carduv").append("<h6>" + uv.value);
    console.log(uv);
  })
}
