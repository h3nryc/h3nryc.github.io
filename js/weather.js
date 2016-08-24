  /*

      Unum (c) All rights reserved.
     The code that powers unum front.
    Coded by Henry Confos & Tom Lister.

*/
  function code2Emoji(code) {
    if (code == '32') {
            //Sunny
           return '☀️';
        } else if (code == '31') {
            //Clear (Night)
            return '🌃';
        } else if (code == '26' || code == '34') {
            //Cloudy
            return '☁️';
        } else if (code == '11' || code == '12' || code == '10') {
            //Rain
           return '🌧';
        }else if (code == '30'){
            //Partly Couldy 
            return '⛅️';
        }else if (code == '40'){
            //Scattered showers
            return '🌦';
        }else if (code == '39'){
            //scattered thunderstorms
            return '⛈';
        }else if (code == '28'){
            //Mostly Cloudy
            return '🌥';
        }
        else{
            //None
            return '🌂';
        }
  }
  var callbackFunction1 = function(data) {
    var oneword = data.query.results.channel.item.condition.text;
    var weathercode = data.query.results.channel.item.condition.code;
    var temp = Math.round((data.query.results.channel.item.condition.temp - 32) * 5 / 9);
      window.addEventListener('load', function (){
        document.getElementById('onewordweather').innerHTML = oneword;
        document.getElementById('emoji-left').innerHTML = '<h2>'+code2Emoji(weathercode)+'</h2>';
        document.getElementById('temp').innerHTML = temp + ' °C';

        //Hidden div
        
        var forecast = data.query.results.channel.item.forecast;
        for (var i = 0; i < 5; i++) {
             // console.log(forecast[i].code+'means '+forecast[i].text)
            var high = Math.round((forecast[i].high - 32) * 5 / 9);
            $("#wet-list").append("<li><h2 style='font-weight: 200; margin: 0;' ><span style='margin: 0; font-size: 25pt;'>"+code2Emoji(forecast[i].code)+"</span> "+forecast[i].date+", "+forecast[i].text+"</h2></li>");
        }    
    });
  };



