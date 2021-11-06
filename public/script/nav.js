document.write('\
<header>\
        <img src="/images/logo.png" alt="logo" class="logo" width="200" height="50">\
        <input type="checkbox" id="nav-toggle" class="nav-toggle">\
        <nav>\
            <ul>\
                <li><a href="index.html">Domů</a></li>\
                <li><a href="#">Najít tým</a></li>\
                <li><a href="registration.html">Účet</a>\
                    <ul class="dropdown" id="dropdown">\
                        <li><a class="dropdown_item" href="my_profile.html">Můj účet</a></li>\
                        <li><a class="dropdown_item" href="#">Moje týmy</a></li>\
                        <li><a class="dropdown_item" href="#">Odhlásit se</a></li>\
                    </ul>\
                </li>\
		<li><a href="registration.html">new</a>\
                    <ul class="dropdown-news" id="dropdown-news">\
                        <p class="dropdown_item-news">xplagiat96 odešel z týmu PNF</p>\
                        <p class="dropdown_item-news">xplagiat96 odešel z týmu Dlouhý název týmu</p>\
                        <p class="dropdown_item-news">xplagiat96 odešel z týmu Project Not Found</p>\
                        <p class="dropdown_item-news">xplagiat96 se přidal do týmu Název</p>\
                        <button type="submit" class="clear-btn_index">Vyčistit</button>\
                    </ul>\
                </li>\
            </ul>\
        </nav>\
        <label for="nav-toggle" class="nav-toggle-label"><span></span></label>\
    </header>\
\
');