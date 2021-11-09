window.onresize = Teams_resize;
window.onload = Teams_resize;

let number_of_teams = 4;
var myheight = myheight = 200 + number_of_teams*120 + 40;

function Teams_resize(){
    if(myheight > window.innerHeight){
        document.getElementById("team_border").style.height = "auto";
    }
    else{ 
        document.getElementById("team_border").style.height = "70%";
    }
}
