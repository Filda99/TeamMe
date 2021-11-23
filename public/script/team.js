// ajaxindl = new XMLHttpRequest();
// ajaxindl.open("GET", "LE CESTA", false);
// ajaxindl.send();

// ajaxusus = new XMLHttpRequest();
// ajaxusus.open("GET", "LE CESTA", true);
// ajaxusus.send();

// ajaxusus.onreadystatechange = function(){
//     if(this.readyState == 4 && this.status == 200){

//         try{
//             var data = JSON.parse(ajaxusus.responseText);
//         }
//         catch(e){
//             return;
//         }
//         if(document.getElementById("team_name")){
//             document.getElementById("team_name").innerText = data[0].name;
//         }
//         if(document.getElementById("team_capacity")){
//             document.getElementById("team_capacity").innerText = data[0].email;
//         }
//         if(document.getElementById("team_description")){
//             document.getElementById("team_description").innerText = data[0].faculty;
//         }
//         if(document.getElementById("team_keywords")){
//             document.getElementById("team_keywords").innerText = data[0].year;
//         }
//         if(document.getElementById("team_contact")){
//             document.getElementById("team_contact").innerText = data[0].contact;
//         }
//         if(document.getElementById("team_time")){
//             document.getElementById("team_time").innerText = data[0].time;
//         }
//         if(document.getElementById("team_approach")){
//             document.getElementById("team_approach").innerText = data[0].attitude;
//         }
//         if(document.getElementById("team_nationality")){
//             document.getElementById("team_nationality").innerText = data[0].nationality;
//         }
//         if(document.getElementById("team_members")){
//             let stringos = "";
//             try{
//                 var data2 = JSON.parse(ajaxindl.responseText);
//             }
//             catch(e){
//                 return;
//             }

//             for(let i = 0; i < data2.length; i++){
//                 stringos = stringos.concat('<li class="loginLi">', data2[i].name, '<button type="button" class="exit-btn" >X</button></li>');
//             }

//             document.getElementById("team_members").innerHTML = stringos;
//         }
//     }
// }