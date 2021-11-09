window.onresize = Teams_resize;
window.onload = Teams_resize;
var current = document.getElementById("dropdown-news").style.display;

var number_of_teams = document.querySelectorAll('.team_middle').length;
var myheight = myheight = 200 + number_of_teams*120 + 40;

function Teams_resize(){
    if(window.innerWidth < 800){
        document.getElementById("dropdown-news").style.display = "none";
        document.getElementById("notif").style.display = "none";
    }
    else{
        document.getElementById("dropdown-news").style.display = current;
        document.getElementById("notif").style.display = "flex";
    }
    
    if(window.innerWidth <= 750){
        if(document.getElementById("find_container").innerHTML != ""){
            document.getElementById("find_con_phone").innerHTML = document.getElementById("find_container").innerHTML;
            document.getElementById("find_container").innerHTML = "";
        }
    }
    else{
        if(document.getElementById("find_con_phone").innerHTML != ""){
            document.getElementById("find_container").innerHTML = document.getElementById("find_con_phone").innerHTML;
            document.getElementById("find_con_phone").innerHTML = "";
        }
    }
    if(myheight > window.innerHeight){
        document.getElementById("team_border").style.height = "auto";
    }
    else{ 
        document.getElementById("team_border").style.height = "70%";
    }
}

var my_teams = document.getElementById("team_list").innerHTML;
var number_of_original_teams = document.querySelectorAll('.team_middle').length;

// zmenit <input type="text" class="find_bar" id="search_phrase">
// na     <input type="text" class="find_bar" id="search_phrase" oninput="Search(this)">

function Search(){
    let search_phrase = document.getElementById("search_phrase").value.toLowerCase();
    let stringos = "";
    let first = true;
    let team_name;
    let keywords;

    for(var i = 0; i < number_of_original_teams; i++){ // my_teams - inner HTML (string)
        team_name = my_teams.substring(my_teams.indexOf("team_name", i+1) + 11, my_teams.indexOf("</li>", 1+(i*3))).toLocaleLowerCase();
        keywords = my_teams.substring(my_teams.indexOf("team_keywords", i+1) + 18, my_teams.indexOf("</ul>", i+1)- 66).toLocaleLowerCase();
        if(team_name.includes(search_phrase) || keywords.includes(search_phrase)){
            if(first == true){
                first = false;
            }
            else{
                stringos = stringos.concat('<hr class="row"></hr>');
            }
            stringos = stringos.concat(my_teams.substring(my_teams.indexOf('<a class="team_middle" href="team.html">', i+1), my_teams.indexOf("</a>", 1+(i*3)) + 4));
        }
    }

    document.getElementById("team_list").innerHTML = stringos;
    number_of_teams = document.querySelectorAll('.team_middle').length;
}
