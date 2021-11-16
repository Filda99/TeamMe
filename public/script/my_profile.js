/*
ajaxarando = new XMLHttpRequest();
ajaxaranba.open("GET", "LE CESTA", true);
ajaxaranba.send();

ajaxaranba.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){

        try{
            var data = JSON.parse(ajaxaranba.responseText);
        }
        catch(e){
            return;
        }
        if(document.getElementById("prof_name")){
            document.getElementById("prof_name").innerText = data[0].name;
        }
        if(document.getElementById("prof_email")){
            document.getElementById("prof_email").innerText = data[0].email;
        }
        if(document.getElementById("prof_faculty")){
            document.getElementById("prof_faculty").innerText = data[0].faculty;
        }
        if(document.getElementById("prof_year")){
            document.getElementById("prof_year").innerText = data[0].year;
        }
        if(document.getElementById("prof_contact")){
            document.getElementById("prof_contact").innerText = data[0].contact;
        }
        if(document.getElementById("prof_time")){
            document.getElementById("prof_time").innerText = data[0].time;
        }
        if(document.getElementById("prof_approach")){
            document.getElementById("prof_approach").innerText = data[0].attitude;
        }
        if(document.getElementById("prof_nationality")){
            document.getElementById("prof_nationality").innerText = data[0].nationality;
        }
    }
}*/