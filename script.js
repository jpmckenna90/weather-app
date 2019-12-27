var apiKey = "226c7f48de6d96ec8e61f348613686a1";
var city = "";
// var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey;

// var results = 

//ajax call - set as many variables here as possible! 
// $.ajax({
//   url: queryURL,
//   method: "GET"
// }).then(function(response){
//  console.log(response);
// })

// button test, works duh 
$("#searchbtn").on("click", function(){

  city = $("#cityfield").val();
  $("ul").append("<li>" + city);

  var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&APPID=" + apiKey;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response){
   console.log(response);
  })
})

// $.ajax({
//   url: queryURL,
//   method: "GET"
// }).then(function(response){
//  console.log(response);
// })