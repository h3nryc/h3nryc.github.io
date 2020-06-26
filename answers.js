var url_string = window.location.href
var url = new URL(url_string);
var q = url.searchParams.get("question");
console.log(q);

$('.a'+q).show();
