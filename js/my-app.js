/*

	  Unum (c) All rights reserved.
	 The code that powers unum front.
	Coded by Henry Confos & Tom Lister.
	
*/
var myApp = new Framework7(); 
var socket = io.connect('https://unum-back.herokuapp.com/');
var $$ = Dom7;
  // Init slider and store its instance in mySwiper variable
  var mySwiper = myApp.swiper('.swiper-container', {
    pagination:'.swiper-pagination'
  });


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
	var distance = getDistance(lat,long,localStorage.getItem("lat"),localStorage.getItem("long"));
	var time = distance * 0.50;
	var uberFare = Number(distance * 1.50 + 5 + time).toFixed(2);
	var taxiFare = Number(distance * 2.86 + 5).toFixed(2);
	var uberLink = "https://m.uber.com/ul?client_id=YOUR_CLIENT_ID&action=setPickup&pickup[latitude]="+localStorage.getItem("lat")+"&pickup[longitude]=-"+localStorage.getItem("long")+"&pickup[nickname]=Your Location[formatted_address]=Your Location Rd&dropoff[latitude]="+lat+"&dropoff[longitude]=-"+long+"&dropoff[nickname]="+name+"[formatted_address]="+address+"&product_id=a1111c8c-c720-46c3-8534-2fcdd730040d&link_text=View%20team%20roster&partner_deeplink=Unum"
	var taxiLink = "https://www.google.com.au/#safe=active&q=book%20a%20taxi"
	var mapUrl = "http://maps.googleapis.com/maps/api/staticmap?center="+lat+","+long+"&zoom=18&size=500x400&sensor=false"
	$('.main-list').after(' <div style="background-color: '+color+'" class="info-card fullscreen"> <div onclick="closePopup();" class="info-head"> <i class="material-icons">arrow_back</i><h2 class="info-title">'+emoji+'   '+name+'</h2> </div> <div class="info-map" style="background-image: url('+mapUrl+');"></div> <div class="info-footer"> <p style="margin: 0;">'+name+' is located on <span style="font-weight: bold;">'+address+'</span></p> <h2 style="margin: 0;">In a taxi it would cost around <span style="font-weight: bold;">'+taxiFare+'</span> or an Uber would cost <span style="font-weight: bold;">'+uberFare+'</span> 🚕</h2> <div class="info-butt"> <div class="info-book">Book a</div><a onclick="navLink('+"'"+uberLink+"'"+')" href="'+uberLink+'"><div class="uber">Uber</div></a><a onclick="navLink('+"'"+taxiLink+"'"+')"href="'+taxiLink+'>"<div class="taxi">Taxi</div></a> </div> <p>Infomation provided by '+provider+' ✌️</p> </div> </div>');
	$('.info-card').hide()
	$('.info-card').animate({width: 'toggle'}, 120);
}

function closePopup() {
	$('.info-card').animate({width: 'toggle'}, 120, function(){
		$('.info-card').remove();
	});
}

function smartInfo() {
	var d = new Date();
	var n = d.getHours();
			console.log(n)
	if(n >= 18 && n <= 24){
		//Dinner Time
		$('.hero-img').css('background-image','url(../night.jpg)');
		$('.smart-start').empty();
		$('#smart-start').append(' <li> <div class="pop-card"> <div id="emoji-left" class="emoji-left"> <h2>🍲</h2> </div> <div class="wet-text"> <h2>Its dinner time!</h2> <p>Are you hungry?</p> </div> <div class="pop-but"> <ul class="but-list"> <li><a><div onclick="getRest(\'Chinese\')" class="but">Chinese Food</div></a></li> <li><a><div onclick="getRest(\'Burger\')" class="but">Burger</div></a></li> <li><a><div onclick="getRest(\'Sea&20Food\')" class="but">Seafood</div></a></li> <li><a><div onclick="getRest(\'Thai\')" class="but">Thai</div></a></li> </ul> </div> </div> </li>')
	}else if(n >= 1 && n <= 10){
		$('.smart-start').empty();
			$('#smart-start').append(' <li> <div class="pop-card"> <div id="emoji-left" class="emoji-left"><h2>☕️</h2> </div> <div class="wet-text"> <h2>Good Morning!</h2> <p>Are you hungry?</p> </div> <div class="pop-but"> <ul class="but-list"> <li><a><div onclick="getRest(\'Cafe\')" class="but">Coffee</div></a></li> <li><a><div onclick="getRest(\'Pancakes\')" class="but">Pancakes</div></a></li> <li><a><div onclick="getRest(\'Breakfast\')" class="but">Breakfast Spot</div></a></li> <li><a><div onclick="getRest(\'Brunch\')" class="but">Brunch Spot</div></a></li> </ul> </div> </div> </li>')
		$('.hero-img').css('background-image','url(../sunrise.jpg)');
	}else if (n >= 11 && n <= 12){
		$('.smart-start').empty();
		$('.hero-img').css('background-image','url(../day.jpg)');
	}else if (n >= 13 && n <= 17){
		$('.smart-start').empty();
		$('.hero-img').css('background-image','url(../day.jpg)');
	}else{
		$('.smart-start').empty();
		$('.hero-img').css('background-image','url(../night.jpg)');
	}
}

function navLink(link) {
	window.location.href = link;
}

function popupBox(head,body,number,address,type) {
	if(head == "fail"){
		$('.main-list').append('<div style="background-color: #42A5F5;" class="popup-rest"> <div class="popup-head" > <h2>Unable to find near restarunts!</h2> </div> <hr> <div class="popup-body"> <p> There are no restarunts nearby!</p> </div> <div class="popup-number"> <br><p>Close ❌</p></div> </div>').toggle().slideDown();
	}else{
		$('.main-list').append('<div style="background-color: #42A5F5;" class="popup-rest"> <div class="popup-head" > <h2>🍴 '+head+'</h2> </div> <hr> <div class="popup-body"> <p> Food here we come! 😎 <br>This great restarunt is located on '+address+'</p> </div> <div class="popup-number"> <a href="tel:'+number+'"><div style="background-color: #2ecc71;" class="but">📞 '+number+'</div></a> <br><p>Close ❌</p></div> </div>').toggle().slideDown();
	}
}

function closePop() {
	$('.popup-rest').remove();
}

function getRest(type) {
	socket.emit('getResturant',localStorage.getItem("lat"),localStorage.getItem("long"),type)
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


socket.on('displayVenue', function (image,name,type,tip,address,city,vLat,vLong,verified,id,provider) {
	$( "#venue-start" ).slideDown().after( ' <li onclick="loadMore('+"'"+type+"'"+','+vLat+','+vLong+','+"'"+id+"'"+','+"'"+provider+"'"+','+"'"+name+"'"+','+"'"+address+"'"+','+"'"+type2Emoji(type)+"'"+','+"'"+type2Emoji(type)+"'"+')" style="background-color: '+type2Color(type)+';"class="food-card"> <div class="food-head"> <h2>'+type2Emoji(type)+'  '+type+' - '+tip+' tips</h2> </div> <div style="background-image: url('+image+');" class="food-hero"></div> <div class="food-footer"> <h2>'+name+'</h2> <p style="margin: 0;">This '+type+' is located on '+address+' '+city+'</p> </div> </li>' );
})


socket.on('displayEvent', function (name,lat,long,id,provider,rand,emoji,eventfulUrl,startTime,venueAddress,venueName,cityName,image) {
   $('#event-start').after(' <li onclick="loadMore('+"'"+name+"'"+','+lat+','+long+','+"'"+id+"'"+','+"'"+provider+"'"+','+"'"+name+"'"+','+"'"+venueAddress+"'"+','+"'"+emoji+"'"+','+"'"+type2Color(rand)+"'"+')" style="background-color: '+type2Color(rand)+';" class="event-card"> <div class="event-head"> <h2>🎉 Event - '+name+'</h2> </div> <div style="background-image: url('+image+');" class="event-hero"></div> <div class="event-footer"> <h2>When - '+startTime+'</h2> <p>'+venueName+' / '+venueAddress+'</p> </div> </li>')
})         	

socket.on('displayRest', function (name,address,phone,type) {
  popupBox(name,name,phone,address,type)
 }) 

function type2Emoji(type) {
	if(type == "Beach"){
		return "🏖";
	}else if (type == "Park"){
		return "🌲";
	}else if (type == "Playground"){
		return "⛳️";
	}else if (type == "Food & Drink"){
		return "🍴";
	}else if(type == "Preserve"){
		return "🍀";
	}else if(type == "Historic Site"){
		return "👴";
	}else if (type == "Pool"){
		return "🌊";
	}else if (type == "Café"){
		return "☕️";
	}
	else{
		return "🚶";
	}
}


function type2Color(type) {
	if(type == "Beach" || type == 1){
		return "#f1c40f";
	}else if (type == "Park" || type == 2){
		return "#2ecc71";
	}else if (type == "Playground" || type == 3){
		return "#e74c3c";
	}else if (type == "Food & Drink" || type == 4){
		return "#e67e22";
	}else if(type == "Preserve"){
		return "#EF2D56";
	}else if (type == "Historic Site" || type == "Café" || type == 5){
		return '#ED7D3A';
	}else if (type == "Pool" || type == 6){
		return "#5BC0EB";
	}
	else{
		var rand = Math.floor(Math.random() * 3) + 1  
		if (rand == 1) {
			return "#03FCBA";
		} else if (rand == 2) {
			return "#01FDF6";
		}else if (rand == 3){
			return "#CBBAED";
		}
		
	}
}

//Call Function on load
window.onload = function () {
 getNearby();
 smartInfo()
 
}






