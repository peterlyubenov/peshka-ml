var rows = [];
var filtersVisible = false;
var searchTerm = "";

//Toggle filters visibility
$('.filter-btn').click(function {
    filtersVisible = !filtersVisible; //Toggle value
    if(filtersVisible) {
        $('.filters').slideDown();
        return;    
    }
    $('.filters').slideUp();
});

//On input change, refilter groups
$('#group').change(function{
    filterRows();
});

$('#search').keyup(function{
    searchTerm = $('#search')[0].value;
    filterRows();
});

//Load schedule from programa.html
function loadSchedule() {
    $.ajax({
        url: '/programa.html'
    }).done(function(data){
        $('tbody').html(data);
        filterRows();
    })
}

//Get value from group input
function getSelectedGroup() {
    return parseInt($('#group').prop('value'));
}


//Filter rows based on groups and search term
function filterRows() {
    const group = getSelectedGroup();
    const semGroup = Math.floor((group+1)/2); 

    rows = $('tbody').children();

    showAll();

    for(var i = 0; i < rows.length; i++) {
        var html = rows[i].innerHTML;
        
        if(group != 0){
            if(
                html.includes(`${group} лаб.`) ||     //Лабораторни упражнения
                html.includes(`${semGroup} сем.`) ||  //Сем. групи
                html.includes('<td>Л</td>')           //Лекции
            ) {
                rows[i].className = ""; //Remove 'hidden' class
            } else {
                rows[i].className = "hidden"; //Add 'hidden' class
            }
        }

        if( //Hide all rows that do not include the searchTermь 
            searchTerm.length > 0 &&
            !html.toLowerCase().includes(searchTerm.toLowerCase())) 
        { 
            rows[i].className = "hidden";
        }
    }

    highlightToday();
    updateTheme();
}

//Show all rows
function showAll() {
    for(var i = 0; i < rows.length; i++) {
        rows[i].className=""; //Remove 'hidden' class from all rows
    }
}

//Highlight today's classes
function highlightToday() {
    for(var i = 0; i < rows.length; i++) {
        var html = rows[i].innerHTML;
        if(html.includes(`<td>${getDay()}</td>`)) {
            var className = rows[i].className;
            rows[i].className = "highlighted" + (className.length == 0? "" : ` ${className}`); //Add class 'highlighted'
        }
    }
}

//Get the name of the day of the week
function getDay() {
    var day = new Date().getDay(); 

    switch(day) {
        case 0: return "Неделя";
        case 1: return "Пон.";
        case 2: return "Вт.";
        case 3: return "Ср.";
        case 4: return "Четв.";
        case 5: return "Пт.";
        case 6: return "Сб.";
    }
}



var theme = "";

var darkThemePeriod = {
    max: 6,  //6:00
    min: 18, //18:00
}

//Determine which theme to use based on the time of day
function determineTheme() {
    var hours = new Date().getHours();
    return (hours < darkThemePeriod.min && hours > darkThemePeriod.max) ? "light" : "dark";
}

function updateTheme() {
    var newTheme = determineTheme();

    if(newTheme == theme) return;
    theme = newTheme;

    var light = theme == "light" ? '-day' : ''; //background-day if theme == light

    $('body').css('background-image', `url("/img/background${light}.jpg")`);

}

updateTheme();