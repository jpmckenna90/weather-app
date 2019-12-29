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
  $("#citylist").append("<li>" + city);

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
    updateInfo(response);
    console.log(response);
  });
}

function updateInfo(response) {
  $("#maincard").text(response.city.name + ", " + now);
  $("#cardtemp").append("<h6>" + response.list[0].main.temp)
  $("#cardhumidity").append("<h6>" + response.list[0].main.temp)
  $("#cardwindspeed").append("<h6>" + response.list[0].main.temp)
  $("#carduv").append("<h6>" + response.list[0].main.temp)
}
