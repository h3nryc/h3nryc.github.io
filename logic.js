var cQ = 1;


function nextQ() {
  $(".q"+cQ).css({"right": "-1200px"});
  $(".q"+cQ).hide();
  cQ = cQ+1;
  $(".q"+cQ).css({"right": "0px"});
}

function prevQ() {
  $(".q"+cQ).css({"right": "-1200px"});
  console.log(cQ);
  cQ = cQ-1;
  console.log(cQ);
  $(".q"+cQ).css({"right": "0px"});
  $(".q"+cQ).show();
}

function password(num) {
  var pass = prompt("Please enter your Password", "hint it is IPT");
  if (pass === 'IPT') {
    window.location.href = 'answers.html?question='+num;
  }else{
    alert('Wrong password sorry :(')
  }
}



window.setInterval(function(){

  if ($('.middle').text() === 'Part 1') {
    if (cQ === 1) {
      $('.prev').hide();
    }else {
      $('.prev').show();
    }

    if (cQ === 8) {
      $('.next').hide();
    }else {
      $('.next').show();
    }
  }

  if ($('.middle').text() === 'Part 2') {
    if (cQ === 1) {
      $('.prev').hide();
    }else {
      $('.prev').show();
    }

    if (cQ === 5) {
      $('.next').hide();
    }else {
      $('.next').show();
    }
  }

}, 100);
