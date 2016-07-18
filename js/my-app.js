var myApp = new Framework7();
var socket = io('http://back-swiftlyback.rhcloud.com/');
var $$ = Dom7;
var ptrContent = $$('.pull-to-refresh-content');
var skip = 0;
var notifSkip = 0;
var profileSkip = 0;
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
socket.emit('Get Username', storage.getItem("logUser"))
socket.on('Return Username', function(user){
  $('#profile-card-info').append('<p> Your logged in as @'+user+'</p>')
  $('.profile-photo').append('<img class="changepic" src="http://back-swiftlyback.rhcloud.com//uploads/'+user+'.jpg" alt="" />')
  $('.profile-coverphoto').append('<img src="http://back-swiftlyback.rhcloud.com//uploads/cover-'+user+'.jpg" alt="" />')
})
var mainView = myApp.addView('.view-main', {
  dynamicNavbar: true
});


//Feed Page Js
function getPost() {
  socket.emit('Get Feed Posts', storage.getItem("logUser"), skip)
  skip = skip+12;
}

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
  console.log("hey");
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
  var l = text.length
  if (l <= 23) {var font = 14}else{var font = 12}
  $$(''+loc+'').append(' <div class="card demo-card-header-pic"> <div class="card-content"> <div class="card-content-inner"><p class="color-gray"><img src="http://back-swiftlyback.rhcloud.com//uploads/'+user+'.jpg" class="profilepic" /><a href="#" id="profile-link" onclick="navUser('+"'"+user+"'"+','+"'henry'"+');"class="color-blue">'+user+'      <span class="time"> '+timeConverter(time)+'</span></a> <p style="font-size: '+font+'pt;">'+text+'</p> </div> </div> <div class="card-footer"> <a href="#" onclick="like('+"'"+user+"'"+','+"'"+id+"'"+')" class="link"><i class="material-icons">thumb_up</i><span class="like-text">Like</span></a> <p id="'+id+'" class="link">'+like+' Likes</p> </div> </div>')
}

function displayImagePost(loc,user,text,time,like,id, ext) {
  var l = text.length
  if (l <= 23) {var font = 14}else{var font = 12}
  $$(''+loc+'').append(' <div class="card demo-card-header-pic"> <div style="background-image:url(http://back-swiftlyback.rhcloud.com//uploads/'+id+ext+')"valign="bottom" class="card-header color-white no-border"></div> <div class="card-content"> <div class="card-content-inner"> <p class="color-gray"><img src="http://back-swiftlyback.rhcloud.com//uploads/'+user+'.jpg"" class="profilepic" /><a href="#" id="profile-link" onclick="navUser('+"'"+user+"'"+','+"'henry'"+');" class="color-blue">'+user+' <span class="time"> '+timeConverter(time)+'</span></a> <p style="font-size: '+font+'pt;" >'+text+'</p> </div> </div> <div class="card-footer"> <a href="#" onclick="like('+"'"+user+"'"+','+"'"+id+"'"+')" class="link"><i class="material-icons">thumb_up</i><span class="like-text">Like</span></a> <p id="'+id+'" class="link">'+like+' Likes</p> </div> </div>')
}
function timeConverter(UNIX_timestamp){
  var time = moment(UNIX_timestamp).fromNow()
  return time;
}

console.log();
function like(user, id) {
  var cuser = storage.getItem("logUser");
    socket.emit("Like Post", user, id, cuser)
    setTimeout(function(){ socket.emit('Get Like Count', id,storage.getItem("logUser")) }, 600);
}

socket.on('Return Like Count', function(count,id){
  document.getElementById(id).innerHTML = count+' Likes';
})


function post() {
  var text = document.getElementById("post-text").value;
  var postText = text.replace(/<(?:.|\n)*?>/gm, '');
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
        , score: 1
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
  $('#unfollow').empty();
  $('#unfollow').append('<p onclick="unfollowUser('+"'"+user+"'"+');" class="close-popup" style="color: red; font-weight: 500;">Unfollow</p>')
}

function notFollow(user) {
  $$('.userPosts').append('<div style="text-align: center;"><i style="margin-top: 10px;"class="material-icons">lock_outline</i><h3>You do not follow this user</h3><h3>Follow them to see their posts</h3><a class="close-popup" onclick="followUser('+"'"+user+"'"+');" href="#"><i class="material-icons">person_add</i><h4 style="margin: 0;">Follow</h4></a></div>')
  $('#more-but').empty();
}

function followUser(user){
  socket.emit('Follow User', storage.getItem("logUser"), user);
  myApp.addNotification({
    title: 'Started following @'+user,
    message: ''
});
}

function unfollowUser(user){
  socket.emit('Unfollow User', storage.getItem("logUser"), user);
  myApp.addNotification({
    title: 'Unfollowed @'+user,
    message: ''
});
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
  var postText = postText.replace(/<(?:.|\n)*?>/gm, '');
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
        , score: 1
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
  notifSkip = notifSkip+8;
}

function getNotif() {
  socket.emit('Get Notif', storage.getItem("logUser"), notifSkip);
  notifSkip = notifSkip+8;
}

socket.on('Send Notif', function(docs){
  for (var i = 0; i < docs.length; i++) {
    $$('#notifList').append('<li> <div id="no-border" class="item-content"> <div class="item-media"><img src="http://back-swiftlyback.rhcloud.com//uploads/'+docs[i].user+'.jpg" width="44"></div> <div class="item-inner"> <div class="item-title-row"> <div onclick="navUser('+"'"+docs[i].user+"'"+');" id="bold" class="item-title">'+docs[i].user+'</div> </div> <div class="item-subtitle">'+docs[i].reason+'</div> </div> </div> </li>')
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

socket.on('Search Result', function(docs,count){
  $('#search-ul').empty();
  $$('#search-ul').append('<li> <div id="no-border" class="item-content"> <div class="item-media"><img src="http://back-swiftlyback.rhcloud.com//uploads/'+docs+'.jpg" width="44"></div> <div class="item-inner"> <div class="item-title-row"> <div onclick="navUser('+"'"+docs+"'"+');" class="blue item-title">'+docs+'</div> </div> <div class="item-subtitle">'+count+' Followers</div> </div> </div> </li>')
})

function logout() {
  socket.emit('Log Out', storage.getItem("logUser"))
    storage.removeItem("logUser")
  window.location.replace("./login.html");
}

socket.on('Post Done', function(docs){
 $('.prog-bar').empty();
 $('.posts').empty();
 skip = 0;
 getPost()
})

function loadProfile() {
  $('.profile-posts').empty();
  profileSkip = 0;
  socket.emit('Get User Posts', storage.getItem("logUser"), profileSkip);
  profileSkip = profileSkip+5;
}

socket.on('Send Profile Post', function(post){
  for (var i = 0; i < post.length; i++) {
    if (post[i].image === "no" || post[i].image === undefined) {
        displayTextPost(".profile-posts",post[i].user, post[i].text, post[i].time, post[i].like, post[i]._id);
    }else{
      displayImagePost(".profile-posts", post[i].user, post[i].text, post[i].time, post[i].like, post[i]._id, post[i].ext);
    }
  }
});

function getProfilePosts() {
  socket.emit('Get User Posts', storage.getItem("logUser"), profileSkip);
  profileSkip = profileSkip+5;
}
