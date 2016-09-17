/*

	  Unum (c) All rights reserved.
	 The code that powers unum front.
	Coded by Henry Confos & Tom Lister.

*/
var myApp = new Framework7();
var socket = io.connect('https://unum-back.herokuapp.com/');
var $$ = Dom7;
var scoll = 0;
  // Init slider and store its instance in mySwiper variable
  var mySwiper = myApp.swiper('.swiper-container', {
    pagination:'.swiper-pagination',
    paginationClickable: true
  });

if (localStorage.getItem("woid") === null) {
  console.log("hi")
  $('head').append("    <script src='https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\"sydney\")&format=json&callback=callbackFunction1'></script>")
 }else{
  $('head').append("   <script src='https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\""+""+localStorage.getItem("woid")+""+"\")&format=json&callback=callbackFunction1'></script>")
}

function more() {
	if ($(".wet-card").height() == 350) {
			$(".wet-card").animate({height: 60});
			$(".wet-hidden").toggle();
	}else{
		$(".wet-card").animate({height: 350});
		$(".wet-hidden").fadeToggle("slow")
	}
}
var ptrContent = $$('.pull-to-refresh-content');

// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {
		location.reload();
        myApp.pullToRefreshDone();
});

/*

Start Main Functions

*/


function getDistance(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return Number(d).toFixed(2);
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function loadMore(type,lat,long,id,provider,name,address,emoji,color) {
  scoll = $('.swiper-slide').scrollTop();
	var distance = getDistance(lat,long,localStorage.getItem("lat"),localStorage.getItem("long"));
	var time = distance * 0.50;
	var uberFare = Number(distance * 1.50 + 5 + time).toFixed(2);
	var taxiFare = Number(distance * 2.86 + 5).toFixed(2);
	var uberLink = "https://m.uber.com/ul?client_id=YOUR_CLIENT_ID&action=setPickup&pickup[latitude]="+localStorage.getItem("lat")+"&pickup[longitude]=-"+localStorage.getItem("long")+"&pickup[nickname]=Your Location[formatted_address]=Your Location Rd&dropoff[latitude]="+lat+"&dropoff[longitude]=-"+long+"&dropoff[nickname]="+name+"[formatted_address]="+address+"&product_id=a1111c8c-c720-46c3-8534-2fcdd730040d&link_text=View%20team%20roster&partner_deeplink=Unum"
	var taxiLink = "https://www.google.com.au/#safe=active&q=book%20a%20taxi"
	var mapUrl = "http://maps.googleapis.com/maps/api/staticmap?center="+lat+","+long+"&zoom=18&size=500x400&sensor=false"
  $('.main-list').after(' <div style="background-color: '+color+'" class="info-card fullscreen"> <div onclick="closePopup();" class="info-head"> <i class="material-icons">arrow_back</i><h2 class="info-title">'+emoji+'   '+name+'</h2> </div> <div class="info-map" style="background-image: url('+mapUrl+');"></div> <div class="info-footer"> <p id="loadmore-add"style="margin: 0;">'+name+' is located on <span style="font-weight: bold;">'+address+'</span></p> <h2 style="margin: 0;">In a taxi it would cost around <span style="font-weight: bold;">'+taxiFare+'</span> or an Uber would cost <span style="font-weight: bold;">'+uberFare+'</span> 🚕</h2> <div class="info-butt"> <div class="info-book">Book a</div><a onclick="navLink('+"'"+uberLink+"'"+')" href="'+uberLink+'"><div class="uber">Uber</div></a><a onclick="navLink('+"'"+taxiLink+"'"+')"href="'+taxiLink+'>"<div class="taxi">Taxi</div></a> </div> <p>Infomation provided by '+provider+' ✌️</p> </div> </div>');
  $('.swiper-slide').scrollTop('0');

if (address == undefined) {  console.log(address);$('#loadmore-add').hide()}
  $('.info-card').hide()
	$('.info-card').animate({width: 'toggle'}, 120);
}

function closePopup() {
  $('.swiper-slide').scrollTop(scoll);
	$('.info-card').animate({width: 'toggle'}, 120, function(){
		$('.info-card').remove();
	});
}

function smartInfo() {
	var d = new Date();
	var n = d.getHours();
    n = 18
  console.log(n);
	if(n >= 18 && n <= 24){
		//Dinner Time
		$('.hero-img').css('background-image','url(./night2.jpeg)'); //night 2
		$('.smart-start').empty();
    $('#world-hero').css('background-image','url(./trade.jpeg)'); //trade
    $('#smart-start').append(' <li> <div class="pop-card"> <div id="emoji-left" class="emoji-left"> <h2>🍲</h2> </div> <div class="wet-text"> <h2>Its dinner time!</h2> <p>Are you hungry?</p> </div> <div class="pop-but"> <ul class="but-list"> <li><a><div onclick="getRest(\'Chinese\')" class="but">Chinese Food</div></a></li> <li><a><div onclick="getRest(\'Burger\')" class="but">Burger</div></a></li> <li><a><div onclick="getRest(\'Sea&20Food\')" class="but">Seafood</div></a></li> <li><a><div onclick="getRest(\'Thai\')" class="but">Thai</div></a></li> </ul> </div> </div> </li>')
	}else if(n >= 1 && n <= 10){
		$('.smart-start').empty();
		$('#smart-start').append(' <li> <div class="pop-card"> <div id="emoji-left" class="emoji-left"><h2>☕️</h2> </div> <div class="wet-text"> <h2>Good Morning!</h2> <p>Are you hungry?</p> </div> <div class="pop-but"> <ul class="but-list"> <li><a><div onclick="getRest(\'Cafe\')" class="but">Coffee</div></a></li> <li><a><div onclick="getRest(\'Pancakes\')" class="but">Pancakes</div></a></li> <li><a><div onclick="getRest(\'Breakfast\')" class="but">Breakfast Spot</div></a></li> <li><a><div onclick="getRest(\'Brunch\')" class="but">Brunch Spot</div></a></li> </ul> </div> </div> </li>')
		$('.hero-img').css('background-image','url(./sunrise.jpg)');
    $('#world-hero').css('background-image','url(../day.jpg)');
	}else if (n >= 11 && n <= 12){
		$('.smart-start').empty();
		$('.hero-img').css('background-image','url(./day.jpg)');
    $('#world-hero').css('background-image','url(../coast.jpeg)');//coast
	}else if (n >= 13 && n <= 17){
		$('.smart-start').empty();
		$('.hero-img').css('background-image','url(./day.jpg)');
    $('#world-hero').css('background-image','url(../coast.jpeg)');//coast
	}else{
		$('.smart-start').empty();
		$('.hero-img').css('background-image','url(./night2)'); //night 2
	}
}

function navLink(link) {
	window.location.href = link;
}

function popupBox(head,body,number,address,type,lat,long) {

if (address == null){address = "We could not find an adress but here is the venue on a map"}else{address = "This venue is located on "+address}
var mapUrl = "http://maps.googleapis.com/maps/api/staticmap?center="+lat+","+long+"&zoom=18&size=500x400&sensor=false"
	if(head == "fail"){
		$('.main-list').append('<div style="background-color: #42A5F5;" class="popup-rest"> <div class="popup-head" > <h2>Unable to find near restarunts!</h2> </div> <hr> <div class="popup-body"> <p> There are no restarunts nearby!</p> </div> <div class="popup-number"> <br><p>Close ❌</p></div> </div>').toggle().slideDown();
	}else{
		$('.main-list').append('<div style="background-color: #42A5F5;" class="popup-rest"> <div class="popup-head" > <h2>🍴 '+head+'</h2> </div> <hr> <div class="popup-body"> <p> Food here we come! 😎 <br>'+address+'</p> </div> <div class="info-map" style="background-image: url('+mapUrl+');"></div> <br><div class="popup-number"> <a href="tel:'+number+'"><div style="background-color: #2ecc71;" id="phone-but" class="but">📞 '+number+'</div></a> <br><p>Close ❌</p></div> </div>').hide().fadeIn();
	if (number == null) {$('#phone-but').hide()}
	}
}

function closePop() {
	$('#phone-but').show()
	$('.popup-rest').remove();
}

function getRest(type) {
	socket.emit('getResturant',localStorage.getItem("lat"),localStorage.getItem("long"),type)
}

function refresh() {
  var $elem = $('#refresh');
  $({deg: 0}).animate({deg: 360}, {
      duration: 500,
      step: function(now) {
          $elem.css({
              transform: 'rotate(' + now + 'deg)'
          });
      }
  });
  $('.load').toggle()
  localStorage.removeItem('lat')
  localStorage.removeItem('long')
  $( ".event-card" ).remove();
  $( ".food-card" ).remove();
  getNearby();
}

function setSave() {

  var woid = $('.set-loc-input').val()
  localStorage.setItem("woid",woid)

}

function setInput() {
  $('.set-loc-input').val(localStorage.getItem("woid"))
}
/*

End Main Functions

*/

/*

Start Nearby Places

*/



function getNearby(position) {
	//Get geo location
	if(localStorage.getItem("lat") == undefined){
		navigator.geolocation.getCurrentPosition(function(location) {


		  var lat = Number(location.coords.latitude).toFixed(2);
		  var long =  Number(location.coords.longitude).toFixed(2);
		  localStorage.setItem("lat", lat);
		  localStorage.setItem("long", long);
		  localStorage.setItem("quadTime", Date.now());
		  socket.emit('getEvent',localStorage.getItem("lat"),localStorage.getItem("long"))
		  socket.emit('getVenue',localStorage.getItem("lat"),localStorage.getItem("long"))
	});
	}else{
		socket.emit('getEvent',localStorage.getItem("lat"),localStorage.getItem("long"))
		socket.emit('getVenue',localStorage.getItem("lat"),localStorage.getItem("long"))
	}

}


socket.on('displayVenue', function (venue) {
	$( "#venue-start" ).slideDown().after(venue);
})

socket.on('displayNews', function (article) {
	$( "#world-list" ).slideDown().append(article);
})

socket.on('displayEvent', function (eventt) {
  $('.load').hide()
   $('#event-start').after(eventt)
})

socket.on('displayRest', function (name,address,phone,type,lat,long) {
  popupBox(name,name,phone,address,type,lat,long)
 })

//Call Function on load
window.onload = function () {
  $('.load').toggle()
 getNearby();
 smartInfo()
 socket.emit('getNews')
}
  $(function(){
  $('#header').data('size','big');
});

$('#you').scroll(function(){
  if($('#you').scrollTop() > 0)
{
    if($('#header').data('size') == 'big')
    {
        $('#header').data('size','small');
        $('#header').stop().animate({
            height:'50px'
        },600);
        $('#you-logo').stop().animate({
            fontSize:'10pt', top:'0px', display: 'none'
        },600);
    }
}
else
  {
    if($('#header').data('size') == 'small')
      {
        $('#header').data('size','big');
        $('#header').stop().animate({
            height:'250px'
        },600);
        $('#you-logo').stop().animate({
            fontSize:'30pt', top:'70px', display: 'block'
        },600);
      }
  }
});
