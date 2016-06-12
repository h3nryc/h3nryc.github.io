var myApp = new Framework7();
var socket = io('http://back-swiftlyback.rhcloud.com');
var $$ = Dom7;
var ptrContent = $$('.pull-to-refresh-content');
var skip = 0;
var notifSkip = 0;
var loading = false;
var userSkip = 0;
var storage = window.localStorage;
var lastEntry = "";
getPost();
check();

setInterval(function() {
  check();
}, 2000);

function check() {
  if (storage.getItem("logUser") === null) {
    window.location.replace("./login.html");
  }
}

var mainView = myApp.addView('.view-main', {
  dynamicNavbar: true
});


//Feed Page Js
function getPost() {
  socket.emit('Get Feed Posts', storage.getItem("logUser"), skip)
  skip = skip+12;
}

$('#profile-card-info').append('<p> Your logged in as @'+storage.getItem("logUser")+'</p>')

socket.on('Send Post', function(post){
  for (var i = 0; i < post.length; i++) {
    if (post[i].image === "no" || post[i].image === undefined) {
        displayTextPost(".posts",post[i].user, post[i].text, post[i].time, post[i].like, post[i]._id);
    }else{
      displayImagePost(".posts", post[i].user, post[i].text, post[i].time, post[i].like, post[i]._id, post[i].ext);
    }
  }
})
//Action Sheets

$$('.changepic').on('click', function () {
    var buttons = [
        {
            text: 'Change Cover Photo',
            onClick: function () {
              var popupHTML = '<div class="popup">'+
                                  '<div class="done-but"><h3 href="#" class="close-popup" onclick="changeCoverpic()">Done</h3></div>'+
                                  '<div class="done-but" id="up-but"><h3 href="#" class="close-popup">Cancel</h3></div>'+
                                  ' <input id="ImageSubmit" class="inputfile" type="file" name="filename" accept="image/jpeg" /> <label for="ImageSubmit"><i class="material-icons">photo_camera</i></label>'+
                              '</div>'
              myApp.popup(popupHTML);
            }
        },
        {
            text: '<label>Change profile picture</label>',
            onClick: function () {
              var popupHTML = '<div class="popup">'+
                                  '<div class="done-but"><h3 href="#" class="close-popup" onclick="changeProfilepic()">Done</h3></div>'+
                                  '<div class="done-but" id="up-but"><h3 href="#" class="close-popup">Cancel</h3></div>'+
                                  ' <input id="ImageSubmit" class="inputfile" type="file" name="filename" accept="image/jpeg" /> <label for="ImageSubmit"><i class="material-icons">photo_camera</i></label>'+
                              '</div>'
              myApp.popup(popupHTML);
            }
        },
        {
            text: 'Cancel',
            color: 'red',
            onClick: function () {
                myApp.alert('Cancel clicked');
            }
        },
    ];
    myApp.actions(buttons);
});

//Pull to refresh

ptrContent.on('refresh', function (e) {
    // Emulate 2s loading
    setTimeout(function () {
          $('.posts').empty();
          skip = 0;
          getPost()

        myApp.pullToRefreshDone();
    }, 2000);
});

//All Functions

function displayTextPost(loc,user,text,time,like,id) {
  $$(''+loc+'').append(' <div class="card demo-card-header-pic"> <div class="card-content"> <div class="card-content-inner"><p class="color-gray"><img src="http://back-swiftlyback.rhcloud.com/uploads/'+user+'.jpg" class="profilepic" /><a href="#" id="profile-link" onclick="navUser('+"'"+user+"'"+','+"'henry'"+');"class="color-blue">'+user+'      <span class="time"> '+timeConverter(time)+'</span></a> <p>'+text+'</p> </div> </div> <div class="card-footer"> <a href="#" onclick="like('+"'"+user+"'"+','+"'"+id+"'"+')" class="link"><i class="material-icons">thumb_up</i><span class="like-text">Like</span></a> <p class="link">'+like+' Likes</p> </div> </div>')
}

function displayImagePost(loc,user,text,time,like,id, ext) {
  $$(''+loc+'').append(' <div class="card demo-card-header-pic"> <div style="background-image:url(http://back-swiftlyback.rhcloud.com/uploads/'+id+ext+')"valign="bottom" class="card-header color-white no-border"></div> <div class="card-content"> <div class="card-content-inner"> <p class="color-gray"><img src="http://back-swiftlyback.rhcloud.com/uploads/'+user+'.jpg"" class="profilepic" /><a href="#" id="profile-link" onclick="navUser('+"'"+user+"'"+','+"'henry'"+');" class="color-blue">'+user+' <span class="time"> '+timeConverter(time)+'</span></a> <p>'+text+'</p> </div> </div> <div class="card-footer"> <a href="#" onclick="like('+"'"+user+"'"+','+"'"+id+"'"+')" class="link"><i class="material-icons">thumb_up</i><span class="like-text">Like</span></a> <p class="link">'+like+' Likes</p> </div> </div>')
}
function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' at ' + hour + ':' + min;
  return time;
}

function like(user, id) {
  var cuser = storage.getItem("logUser");
    socket.emit("Like Post", user, id, cuser)
}

function post() {
  var postText = document.getElementById("post-text").value;
  var user = storage.getItem("logUser");
  var time = Date.now();
    Icon = document.getElementById("imagePost");
    var Image = Icon.files[0];
  if (Image === undefined) {
    var postData = {
        text: postText
        , user: user
        , time: time
        , like: 0
        , image: "no"
    }
          socket.emit('Post', postData);

        $('.prog-bar').append('<div styleclass="progressbar-infinite"></div>')
        $('.post-box').val('');
  }else {
       uploadPostImage(Image, "post", postText, user, time)
  }
}

function navUser(user) {
  $('.userPosts').empty();
  userSkip = 0;
  storage.setItem("navUser", user)
                  var html = '<div style="background-color: rgba(235, 235, 241, 0.5);" class="popup popup-user navbar-fixed"> <div class="navbar"> <div class="navbar-inner"> <div class="left"><div class="close-but close-popup"><i class="material-icons">close</i></div></div><div class="center"><p>@'+user+'</p></div> <div id="unfollow" class="right"></div></div> </div><div style="margin-top: 40px;"class="userPosts"> </div><div id="more-but"><a href="#" id="small-but" onclick="getUserPosts()" class="button button-big">More</a></div></div> </div> <!-- Close .mainbox --> </div>'
  myApp.popup(html);
  socket.emit('Check Follow', storage.getItem("logUser"), user);
  socket.emit('Get Bio', user);
}

socket.on('Send User Post', function(post){
  for (var i = 0; i < post.length; i++) {
    if (post[i].image === "no" || post[i].image === undefined) {
        displayTextPost(".userPosts",post[i].user, post[i].text, post[i].time, post[i].like, post[i]._id);
    }else{
      displayImagePost(".userPosts",post[i].user, post[i].text, post[i].time, post[i].like, post[i]._id, post[i].ext);
    }
  }
})

socket.on('Follow Result', function(result){
  if (result === "yes") {
    var user = storage.getItem("navUser");
    getUserPosts(user)
  }else {
    var user = storage.getItem("navUser");
    notFollow(user)
  }
})

function getUserPosts(user) {
  if (user === undefined) {
    var localUser = storage.getItem("navUser");
    socket.emit('Get Profile Posts', localUser, userSkip);
    userSkip = userSkip+4
  }else {
    socket.emit('Get Profile Posts', user, userSkip);
    userSkip = userSkip+4
  }
  $('#unfollow').append('<p onclick="unfollowUser('+"'"+user+"'"+');" style="color: red; font-weight: 500;">Unfollow</p>')
}

function notFollow(user) {
  $$('.userPosts').append('<div style="text-align: center;"><i style="margin-top: 10px;"class="material-icons">lock_outline</i><h3>You do not follow this user</h3><h3>Follow them to see their posts</h3><a onclick="followUser('+"'"+user+"'"+');" href="#"><i class="material-icons">person_add</i><h4 style="margin: 0;">Follow</h4></a></div>')
  $('#more-but').empty();
}

function followUser(user){
  socket.emit('Follow User', storage.getItem("logUser"), user);
}

function unfollowUser(user){
  socket.emit('Unfollow User', storage.getItem("logUser"), user);
}
function changeProfilepic() {
  Icon = document.getElementById("ImageSubmit");
  var Image = Icon.files[0];
  uploadProfileImage(Image, 'Profile');
}

function changeCoverpic() {
  Icon = document.getElementById("ImageSubmit");
  var Image = Icon.files[0];
  uploadCoverImage(Image, 'Profile');
}

function uploadProfileImage(file, location) {
	//Reads file content as binary and sends to server

	var reader = new FileReader();
	reader.onload = function(e) {
		//get all content
		var buffer = e.target.result;
    var ext = file.name.slice(-4)
		//send the content via socket
		socket.emit('Upload Profile Image', storage.getItem("logUser"), ext, buffer, location); //change to storage
	};
	reader.readAsBinaryString(file);
}

function uploadCoverImage(file, location) {
	//Reads file content as binary and sends to server

	var reader = new FileReader();
	reader.onload = function(e) {
		//get all content
		var buffer = e.target.result;
    var ext = file.name.slice(-4)
		//send the content via socket
		socket.emit('Upload Cover Image', storage.getItem("logUser"),ext, buffer, location); //change to storage
	};
	reader.readAsBinaryString(file);
}


function uploadPostImage(file, location, postText, user, time) {
	//Reads file content as binary and sends to server

	var reader = new FileReader();
	reader.onload = function(e) {
		//get all content
		var buffer = e.target.result;
    var ext = file.name.split('.').pop();
		//send the content via socket
    var postData = {
        text: postText
        , user: user
        , time: time
        , like: 0
        , image: "yes"
        , ext: ext
    }
	socket.emit('Image Post', ext, buffer, location, postData, { image: true, buffer: buffer });
  $('.prog-bar').append('<div style="height: 30px;" class="progressbar-infinite"></div>')
  $('.post-box').val('');
	};
	reader.readAsBinaryString(file);
}

$$('.infinite-scroll').on('infinite', function () {
  if (loading) return;
  loading = true;
  setTimeout(function () {
    loading = false;
      getPost();
  }, 500);
});

function loadNotif() {
  $('#notifList').empty();
  notifSkip = 0;
  socket.emit('Get Notif', storage.getItem("logUser"), notifSkip);
  notifSkip = notifSkip+3;
}

function getNotif() {
  socket.emit('Get Notif', storage.getItem("logUser"), notifSkip);
  notifSkip = notifSkip+3;
}

socket.on('Send Notif', function(docs){
  for (var i = 0; i < docs.length; i++) {
    $$('#notifList').append('<li> <div id="no-border" class="item-content"> <div class="item-media"><img src="http://back-swiftlyback.rhcloud.com/uploads/'+docs[i].user+'.jpg" width="44"></div> <div class="item-inner"> <div class="item-title-row"> <div class="item-title">'+docs[i].user+'</div> </div> <div class="item-subtitle">'+docs[i].reason+'</div> </div> </div> </li>')
  }
})

//Search
$('#search-input').keyup(function(event) {
   if($('#search-input').val() != lastEntry) {
    socket.emit('Search', $(this).val())
      $('#search-ul').empty();
   }
   lastEntry = $('#text').val()
});

socket.on('Search Result', function(docs){
  $('#search-ul').empty();
  $$('#search-ul').append('<li> <a onclick="navUser('+"'"+docs+"'"+');" href="#"> <div class="search-div"> <div class="search-pic"> <img src="http://back-swiftlyback.rhcloud.com/uploads/'+docs+'.jpg" alt=""> </div> <h3>@'+docs+'</h3></div> </a> </li>')
})

function logout() {
  socket.emit('Log Out', storage.getItem("logUser"))
    storage.removeItem("logUser")
  window.location.replace("./login.html");
}

socket.on('Post Done', function(docs){
            console.log("yo");
 $('.prog-bar').empty();
 $('.posts').empty();
 skip = 0;
 getPost()
})
