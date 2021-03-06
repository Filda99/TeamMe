var current = document.getElementById("dropdown-news").style.display;

function SubjectsRes(){
    if(window.innerWidth < 800){
        document.getElementById("dropdown-news").style.display = "none";
        document.getElementById("notif").style.display = "none";
    }
    else{
        document.getElementById("dropdown-news").style.display = current;
        document.getElementById("notif").style.display = "flex";
    }
    
    const subjects = document.querySelector("#search");
    var all_subjects = [];
    var number_of_subjects = subjects.getElementsByTagName("li").length;
    var number_of_rows = subjects.getElementsByTagName("ul").length;
    if(!subjects.getElementsByTagName("ul")[0]){
        return;
    }
    var first_row_number = subjects.getElementsByTagName("ul")[0].getElementsByTagName("li").length; // pocet předmětů v rade
    var stringos = "";
    var subjects_in_row = subjectsInRow(); // predpokladany pocet předmětů v rade
    if(first_row_number == subjects_in_row){
        CheckHeight(number_of_rows);
        return;
    }
    if(subjects_in_row <= 3){
        document.getElementById("faculty_ref").innerText = "";
        if(document.getElementById("find_container").innerHTML != ""){
            document.getElementById("find_con_phone").innerHTML = document.getElementById("find_container").innerHTML;
            document.getElementById("find_container").innerHTML = "";
        }
    }
    else{
        document.getElementById("faculty_ref").innerText = "Výběr fakulty";
        if(document.getElementById("find_con_phone").innerHTML != ""){
            document.getElementById("find_container").innerHTML = document.getElementById("find_con_phone").innerHTML;
            document.getElementById("find_con_phone").innerHTML = "";
        }
    }
    all_subjects = Loadsubjects();
    if(first_row_number > subjects_in_row){ //vymažu obsahy ul, přidám další ul, přidám obsah do všech ul
        for(var x = 0; x < number_of_rows; x++){
            subjects.getElementsByTagName("ul")[x].innerHTML = "";
        }
        for(var y = 0; y < Math.ceil(number_of_subjects / subjects_in_row) - number_of_rows; y++){
            stringos = '<ul class="subject_list">';
            subjects.innerHTML += stringos;
        }
        number_of_rows = subjects.getElementsByTagName("ul").length;
        for(var i = 0; i < number_of_rows; i++){
            for(var t = 0; t < subjects_in_row && i*subjects_in_row + t < all_subjects.length; t++){
                subjects.getElementsByTagName("ul")[i].innerHTML += all_subjects[i*subjects_in_row + t];
            }
        }
    }
    else{  // vymažu všechny ul, vytvořím adekvátní počet, přidám obsah do všech ul
        subjects.innerHTML = "";
        for(var y = 0; y < Math.ceil(number_of_subjects / subjects_in_row); y++){
            stringos = '<ul class="subject_list">';
            subjects.innerHTML += stringos;
        }
        number_of_rows = subjects.getElementsByTagName("ul").length;
        for(var i = 0; i < number_of_rows; i++){
            for(var t = 0; t < subjects_in_row && i*subjects_in_row + t < all_subjects.length; t++){
                subjects.getElementsByTagName("ul")[i].innerHTML += all_subjects[i*subjects_in_row + t];
            }
        }
    }
    CheckHeight(number_of_rows);
}

function Loadsubjects(){
    let subjects = document.querySelector("#search");
    let number_of_subjects = subjects.getElementsByTagName("li").length;
    let all_subjects = [];
    for(var i = 0; i < number_of_subjects; i++){
        all_subjects.push(subjects.getElementsByTagName("li")[i].outerHTML);
    }
    return all_subjects;
}

function subjectsInRow(){
    var width = window.innerWidth;
    if(width >= 1100){
        return 6;
    }
    else if(width >= 950){
        return 5;
    }
    else if(width >= 750){
        return 4;
    }
    else if(width >= 600){
        return 3;
    }
    else if(width >= 350){
        return 2;   
    }
    else{
        return 1;
    }
}

function CheckHeight(number_of_rows){
    let height_sum = 200 + number_of_rows*170;
    let height_of_window = window.innerHeight;
    if(height_of_window > height_sum){
        document.getElementById("content").style.height = "100%";
    }
    else{
        document.getElementById("content").style.height = "auto";
    }
}

window.onresize = SubjectsRes;
window.onload = SubjectsRes;    

var filter = false;

function Return(){
    filter = false;
    document.getElementById("filter").style.display = "none";
}

function OpenFilter(){
    if(filter){
        filter = false
        document.getElementById("filter").style.display = "none";
    }
    else{
        filter = true;
        document.getElementById("filter").style.display = "flex";
    }
}


var my_subjects = document.getElementById("search").innerHTML;
var number_of_original_subjects = document.querySelectorAll('.subject_item').length;

function Search(){
    let search_phrase = document.getElementById("search_phrase").value.toLowerCase();
    console.log(my_subjects);
    let stringos = "";
    let shortcut;
    let counter = 0;

    for(var i = 0; i < number_of_original_subjects; i++){ // my_teams - inner HTML (string)
        shortcut = my_subjects.substring(my_subjects.indexOf('href="teams.html"', i+1) + 18, my_subjects.indexOf("</a>", i+1)).toLocaleLowerCase();
        if(shortcut.includes(search_phrase)){
            if(counter%5 == 0){
                stringos = stringos.concat('<ul class="subject_list">');
            }
            stringos = stringos.concat(my_subjects.substring(my_subjects.indexOf('<li class="subject_item">', i+1), my_subjects.indexOf("</li>", i+1) + 5));
            counter++;
            if(counter == 5){
                stringos = stringos.concat('</ul>');
            }
        }
    }
    if(counter != 5){
        stringos = stringos.concat('</ul>');
    }
    document.getElementById("search").innerHTML = stringos;
}