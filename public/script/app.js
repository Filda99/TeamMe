window.onresize = ResElPage;
window.onload = ResElPage;
if(document.getElementById("dropdown-news")){
    var current = document.getElementById("dropdown-news").style.display;

}

function ResElPage(){
    if(document.getElementById("dropdown-news")){
        if(window.innerWidth < 800){
            document.getElementById("dropdown-news").style.display = "none";
            document.getElementById("notif").style.display = "none";
        }
        else{
            document.getElementById("dropdown-news").style.display = current;
            document.getElementById("notif").style.display = "flex";
        }
    }
}

function closeNotif(){
    document.getElementById("popup").style.display = "none";
}

function HomePage(){
    document.location.href = "/";
}