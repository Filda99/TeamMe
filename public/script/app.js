window.onresize = ResElPage;
window.onload = ResElPage;
if(document.getElementById("dropdown-news")){
    var current = document.getElementById("dropdown-news").style.display;

    var timeStamp = "";
    var counter = 0;
    for(var i = 0; i < document.getElementsByClassName("dropdown_item-time").length; i++){
        counter = 0;
        timeStamp = document.getElementsByClassName("dropdown_item-time")[i].innerHTML;
        while(timeStamp[counter] == " " || timeStamp[counter] == "\n"){
            counter++;
        }
        timeStamp = timeStamp.substring(counter+4,counter+21);
        document.getElementsByClassName("dropdown_item-time")[i].innerHTML = timeStamp;
    }
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

