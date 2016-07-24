//Client side code
var socket = io('http://back-swiftlyback.rhcloud.com');
var $$ = Dom7;
var myApp = new Framework7();
var storage = window.localStorage;
myApp.addNotification({
    title: 'Add this to you home screen',
    message: 'Learn how <a onclick="here();" >here</a>'
});
// if (storage.getItem("logUser") !== null) {
//   window.location.replace("./index.html");
// }
function here() {
  window.location = "http://www.howtogeek.com/196087/how-to-add-websites-to-the-home-screen-on-any-smartphone-or-tablet/"
}
function createUser(){
    if($("#first").val() == "" || $("#username").val() == "" || $("#email").val() == "" || $("#password").val() == ""){alert("Please fill out all fields.")}
    else if($("#email").val().indexOf('@') == -1 || $("#username").val().indexOf(' ') !== -1 || $("#username").val().indexOf('/') !== -1)
    {alert("Check your email or username again (usernames can only contain letters and '.')");}
    else{
        //send user data to server for processing
                var userData = {
                 first: $("#first").val()
                , username: $("#username").val()
                , email: $("#email").val()
                , password: $("#password").val()
               };
                socket.emit('Create User', userData);
    }
}


function login(){
    if($("#usernamelog").val() == "" || $("#passwordlog").val() == ""){alert("Please fill out all fields")}
    else{
        var loguserData = {
          username: $("#usernamelog").val()
        , password: $("#passwordlog").val()
        }
          socket.emit('Log User', loguserData);
    }
}

//Gets data from server (validation)
  socket.on('regSuc', function () {
    alert("Created Acount now log in!")
  });
  socket.on('regUnsuc', function () {
    alert('Your username or email is alredy taken')
  });
  socket.on('logSuc', function(session){
    storage.setItem("logUser", session)
    window.location = "./index.html"
  })
  socket.on('logUnsuc', function(){
      alert('Please check your username and password again');
  })
