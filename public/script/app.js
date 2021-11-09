window.onresize = ResElPage;
window.onload = ResElPage;

function ResElPage(){
    if(window.innerWidth < 800){
        document.getElementById("dropdown-news").style.display = "none";
        document.getElementById("notif").style.display = "none";
    }
    else{
        document.getElementById("notif").style.display = "flex";
    }
}
