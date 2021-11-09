window.onresize = FacultiesRes;
window.onload = FacultiesRes;

function FacultiesRes(){
    if(window.innerWidth < 800){
        document.getElementById("dropdown-news").style.display = "none";
        document.getElementById("notif").style.display = "none";
    }
    else{
        document.getElementById("notif").style.display = "flex";
    }
    const faculties = document.querySelector("#faculty_list");
    var all_faculties = [];
    var number_of_faculties = faculties.getElementsByTagName("li").length;
    var number_of_rows = faculties.getElementsByTagName("ul").length;
    var first_row_number = faculties.getElementsByTagName("ul")[0].getElementsByTagName("li").length; // pocet fakult v rade
    var stringos = "";
    var faculties_in_row = facultiesInRow(); // predpokladany pocet fakult v rade
    if(first_row_number == faculties_in_row){
        CheckHeight(faculties_in_row);
        return;
    }
    all_faculties = Loadfaculties();
    if(first_row_number > faculties_in_row){ //vymažu obsahy ul, přidám další ul, přidám obsah do všech ul
        for(var x = 0; x < number_of_rows; x++){
            faculties.getElementsByTagName("ul")[x].innerHTML = "";
        }
        for(var y = 0; y < Math.ceil(number_of_faculties / faculties_in_row) - number_of_rows; y++){
            stringos = '<ul class="faculty_list">';
            faculties.innerHTML += stringos;
        }
        number_of_rows = faculties.getElementsByTagName("ul").length;
        for(var i = 0; i < number_of_rows; i++){
            for(var t = 0; t < faculties_in_row && i*faculties_in_row + t < all_faculties.length; t++){
                faculties.getElementsByTagName("ul")[i].innerHTML += all_faculties[i*faculties_in_row + t];
            }
        }
    }
    else{  // vymažu všechny ul, vytvořím adekvátní počet, přidám obsah do všech ul
        faculties.innerHTML = "";
        for(var y = 0; y < Math.ceil(number_of_faculties / faculties_in_row); y++){
            stringos = '<ul class="faculty_list">';
            faculties.innerHTML += stringos;
        }
        number_of_rows = faculties.getElementsByTagName("ul").length;
        for(var i = 0; i < number_of_rows; i++){
            for(var t = 0; t < faculties_in_row && i*faculties_in_row + t < all_faculties.length; t++){
                faculties.getElementsByTagName("ul")[i].innerHTML += all_faculties[i*faculties_in_row + t];
            }
        }
    }
    CheckHeight(faculties_in_row);
}

function Loadfaculties(){
    let faculties = document.querySelector("#faculty_list");
    let number_of_faculties = faculties.getElementsByTagName("li").length;
    let all_faculties = [];
    for(var i = 0; i < number_of_faculties; i++){
        all_faculties.push(faculties.getElementsByTagName("li")[i].outerHTML);
    }
    return all_faculties;
}

function facultiesInRow(){
    var width = window.innerWidth;
    if(width >= 1150){
        return 4;
    }
    else if(width >= 850){
        return 3;
    }
    else if(width >= 550){
        return 2;
    }
    else{
        return 1;
    }
}

function CheckHeight(faculties_in_row){
    if(faculties_in_row == 4){
        if(window.innerHeight > 750){
            document.getElementById("content").style.height = "100%";
        }
        else{
            document.getElementById("content").style.height = "auto";
        }
    }
    else{
        document.getElementById("content").style.height = "auto";
    }
}

var ajaxaranba = new XMLHttpRequest();
ajaxaranba.open("GET", "/faculty", true);
ajaxaranba.send();

ajaxaranba.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){

        try{
            var data = JSON.parse(ajaxaranba.responseText);
        }
        catch(e){
            return;
        }
    }
}