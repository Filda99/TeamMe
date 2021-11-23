window.onresize = Teams_resize;
window.onload = Teams_resize;

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

var number_of_teams = document.querySelectorAll('.team_middle').length;
var myheight = myheight = 200 + number_of_teams*120 + 40;

function Teams_resize(){
    if(window.innerWidth < 800){
        if(document.getElementById("dropdown-news")){
            document.getElementById("dropdown-news").style.display = "none";
        }
        // document.getElementById("dropdown-news").style.display = "none";
        if(document.getElementById("notif")){
            document.getElementById("notif").style.display = "none";
        }
        // document.getElementById("notif").style.display = "none";
    }
    else{
        if(document.getElementById("dropdown-news")){
            document.getElementById("dropdown-news").style.display = current;
        }
        // document.getElementById("dropdown-news").style.display = current;
        if(document.getElementById("notif")){
            document.getElementById("notif").style.display = "flex";
        }
        // document.getElementById("notif").style.display = "flex";
    }
    
    if(window.innerWidth <= 875){
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
    // if(myheight > window.innerHeight){
    //     document.getElementById("team_border").style.height = "auto";
    // }
    // else{ 
    //     document.getElementById("team_border").style.height = "70%";
    // }
}

var my_teams = document.getElementById("team_list").innerHTML;
var number_of_original_teams = document.querySelectorAll('.team_middle').length;

function Search(){
    let search_phrase = document.getElementById("search_phrase").value.toLowerCase();
    let stringos = "";
    let team_name;
    let keywords;
    let lastrowindex = 0;

    for(var i = 0; i < number_of_original_teams; i++){
        team_name = my_teams.substring(my_teams.indexOf("team_name", lastrowindex) + 11, my_teams.indexOf("</li>", lastrowindex)).toLocaleLowerCase();
        keywords = my_teams.substring(my_teams.indexOf("team_keywords", lastrowindex) + 18, my_teams.indexOf("</ul>", lastrowindex) - 66).toLocaleLowerCase();
        if(team_name.includes(search_phrase) || keywords.includes(search_phrase)){
            stringos = stringos.concat(my_teams.substring(my_teams.indexOf('<a class="team_middle"', lastrowindex), my_teams.indexOf("</a>", lastrowindex) + 5));
            stringos = stringos.concat('<hr class="row"></hr>');
        }
        lastrowindex = my_teams.indexOf('<hr class="row">', lastrowindex) + 10;
    }

    document.getElementById("team_list").innerHTML = stringos;
    number_of_teams = document.querySelectorAll('.team_middle').length;
}

var filter = false;
var selectValue;

function OpenFilter(){
    if(filter){
        // selectValue = "../?semester=" + document.getElementById("year").value;
        // console.log(selectValue);
        filter = false
        document.getElementById("filter").style.display = "none";
    }
    else{
        filter = true;
        document.getElementById("filter").style.display = "flex";
    }
    return;
}

function HomePage(){
    document.location.href = "/";
}


