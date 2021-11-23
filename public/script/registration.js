window.onresize = RegAdjust;
window.onload = RegAdjust;

var button = document.getElementById("btn");
var login = document.getElementById("login");
var register = document.getElementById("register");
var formbox = document.getElementById("form-box");

var stringos;
var reg = false;

function RegAdjust(){
    login = document.getElementById("login");
    register = document.getElementById("register");  
    formbox = document.getElementById("form-box");
    if(reg == false && window.innerWidth >= 800){
        register.style.transition = "none";
        stringos = "";
        stringos = stringos.concat(formbox.clientWidth + 50, "px");
        register.style.left = stringos;
        register.style.transition = ".5s";
    }
}

function switch_to_registration(){
    if(window.innerWidth <= 800){
        login.style.left = "-400px";
        register.style.left = "50px";
    }
    else{
        stringos = "";
        stringos = stringos.concat("-", formbox.clientWidth + 50, "px");
        login.style.left = stringos;
        register.style.left = "50px";
    }
    button.style.left = "110px";
    reg = true;
}

function switch_to_login(){
    if(window.innerWidth <= 800){
        login.style.left = "50px";
        register.style.left = "450px";
    }
    else{
        stringos = "";
        stringos = stringos.concat(formbox.clientWidth + 50, "px");
        register.style.left = stringos;
        login.style.left = "50px";
    }
    button.style.left = "0px";
    reg = false;
}

if(document.getElementById("errorLogin")){
    document.getElementById("errorLogin").innerText = "Nesprávné přihlašovací údaje";
}

