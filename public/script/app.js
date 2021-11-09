window.onresize = ResElPage;
window.onload = ResElPage;
var current = document.getElementById("dropdown-news").style.display;

function ResElPage(){
    if(window.innerWidth < 800){
        document.getElementById("dropdown-news").style.display = "none";
        document.getElementById("notif").style.display = "none";
    }
    else{
        document.getElementById("dropdown-news").style.display = current;
        document.getElementById("notif").style.display = "flex";
    }
}
