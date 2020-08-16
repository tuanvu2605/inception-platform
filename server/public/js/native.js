var myIndex = 0;
carousel();

function carousel() {
    var i;
    var x = document.getElementsByClassName("mySlides");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    myIndex++;
    if (myIndex > x.length) {
        myIndex = 1
    }
    x[myIndex - 1].style.display = "block";
    setTimeout(carousel, 6000);
}

$(document).ready(function() {
    $("a").click(function() {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", 'http://34.71.238.73:3000/ad/log/3', true ); // false for synchronous request
        xmlHttp.send( null );
    });
});

