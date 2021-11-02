window.onresize = Teams_resize;
window.onload = Teams_resize;

let number_of_teams = 4;
var myheight = myheight = 200 + number_of_teams*120 + 40;

function Teams_resize(){
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


/*
var ajaxus = new XMLHttpRequest(); 
ajaxus.open("POST", ":/", true); 
ajaxus.send();

ajaxus.onreadystatechange = function(){             // jmeno   max         %       pocet_clenu
    if(this.readyState == 4 && this.status == 200){ // name maxNumOfMem percentage joinedUsers

        try{
            var data1 = JSON.parse(ajaxus.responseText); // SELECT * FROM TEAM INNER JOIN SUBJECT WHERE subject=team;
        }
        catch(e){
            return;
        }

        let contentos = document.getElementById("team_list");
        let stringos = "";
        let members_of_team = [];

        for(var x = 0; x < data1.length; x++){
            for(var y = 0; y < data2.length; y++){
                if(data2[y].id == data1[x].id){ 
                    members_of_team.push(data1[x].name);
                }
            }
        }

        

        contentos.innerHTML = stringos;
    }
}*/