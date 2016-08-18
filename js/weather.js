  var callbackFunction1 = function(data) {
    var oneword = data.query.results.channel.item.condition.text;
    var temp = Math.round((data.query.results.channel.item.condition.temp - 32) * 5 / 9);
    window.onload = function () {
    	document.getElementById('onewordweather').innerHTML = oneword;
    	document.getElementById('temp').innerHTML = temp + ' °C';
    }
  };