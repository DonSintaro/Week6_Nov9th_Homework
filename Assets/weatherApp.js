
var arrayHist = JSON.parse(localStorage.getItem("hist8")) || [];
var arrayImg =["Assets/Images/60x60.png","Assets/Images/sunny.png","Assets/Images/rainybig.png","Assets/Images/cloudy.png","Assets/Images/hazy.png","Assets/Images/snow.png"];
var array5Days = [0,8,16,24,32];
var histCount = 0;




var apiKey = "appid=bab66fa9fd2ae33cb9ded43d331a294c";
var lat;
var lon;
var city;
var cityID;

var histWeatherAPI = "https://api.openweathermap.org/data/2.5/weather?id="
var currentWeatherAPI = "https://api.openweathermap.org/data/2.5/weather?q=";
var fiveDayForcast = "https://api.openweathermap.org/data/2.5/forecast?id=";
var DayUV = "https://api.openweathermap.org/data/2.5/uvi?" + apiKey;


if (arrayHist[0] != null || arrayHist[0] != undefined){
    MakeButtons();
    cityID = arrayHist[0].id;
    getHistDay();
}



$(".submitC").on("click",function(){
    if ($("#searchField").val() == NaN){}
    else if ($("#searchField").val() == ""){}
    else if ($("#searchField").val() == " "){}
    else if ($("#searchField").val() == null){}
    else {
        city = $("#searchField").val()
        getCurrentDay();
    
    }      
})

$(document).on("click",".histBtn",function(){
    cityID = $(this).attr("data-name");

    getHistDay();
})


function getHistDay(){
    $.ajax({
        url: (histWeatherAPI  + cityID +"&"+ apiKey),
        method: "GET"   
    })
    .then(function(info){
        console.log(info);
        lat = info.coord.lat;
        lon = info.coord.lon;
        cityID = info.id;
        $("#searchedCity").text(info.name + " (" +moment().format('L') + ")");
        $("#currentTemp").text("Temperature: " + KtoF(info.main.temp) + " F");
        $("#humidity").text("Humidity: " + info.main.humidity + "%");
        $("#wind").text("Wind Speed: " + info.wind.speed + " MPH");
        get5Day(cityID);
        getUV(lon,lat);
        checkDups(info.id,info.name);   



        
    }).catch(function(error){
        console.log(error);
    });
}


function getCurrentDay(){
    $.ajax({
        url: (currentWeatherAPI  + city +"&"+ apiKey),
        method: "GET"   
    })
    .then(function(info){
        console.log(info);
        lat = info.coord.lat;
        lon = info.coord.lon;
        cityID = info.id;
        $("#searchedCity").text(info.name + " (" +moment().format('L') + ")");
        $("#currentTemp").text("Temperature: " + KtoF(info.main.temp) + " F");
        $("#humidity").text("Humidity: " + info.main.humidity + "%");
        $("#wind").text("Wind Speed: " + info.wind.speed + " MPH");
        get5Day(cityID);
        getUV(lon,lat);
        checkDups(info.id,info.name);   



        
    }).catch(function(error){
        console.log(error);
    });
}

function getUV(x,y){
    $.ajax({
        url: (DayUV +"&lat="+ y + "&lon="+ x),
        method: "GET"   
    })
    .then(function(info){
        console.log(info);
        $("#uvSpan").text(info.value);
        
    })
}

function get5Day(x){
    $.ajax({
        url: (fiveDayForcast + x +"&"+ apiKey),
        method: "GET"   
    })
    .then(function(info){
        $(".fiveDay").html("");
        console.log(info);


        array5Days.forEach(function(iter){
           $(".fiveDay").append(makeSomeDays(iter,info));
           $("#someDaysDay"+iter).text(getDayNum(info.list[iter].dt_txt));
           $("#someDayTemp"+iter).text("Temp: "+ KtoF(info.list[iter].main.temp) + " F");
           $("#someDayHumid"+iter).text("Humidity: "+info.list[iter].main.humidity + "%");
            
        }) 
    });

}
function getDayNum(x){
    var arrayBuffer = x.split(" ");
    return arrayBuffer[0];
}

function makeSomeDays(x,response){ 
    return `
        <div class="someDay">
            <h5 id=${"someDaysDay"+x}>xx/xx/xxxx</h5>
            <img id="${"weatherImg"+x}" src="${weatherCode(response.list[x].weather[0].main)}" alt="weatherImage" style="height: 50px; width:50px;" />
            <p class ="lilDay" id=${"someDayTemp"+x}>Temp: xx.xx -F</p>
            <p class ="lilDay" id=${"someDayHumid"+x}>Humidity: xx%</p>
        </div>
    `
}

/////

function makeHistBtn(y,i){
    console.log(i);
    console.log(y);
    return `
        <button type="button" class="btn btn-outline-secondary histBtn" data-name="${y}">${i}</button>
    `;
}

function KtoF(x){
    return Math.round((x - 273.15)*(9/5) + 32);

}

function weatherCode(x){
    if (x == "Clear"){return arrayImg[1]}
    else if (x == "Rain"){return arrayImg[2]}
    else if (x == "Clouds"){return arrayImg[3]}
    else if (x == "Mist"){return arrayImg[4]}
    else if (x == "Snow"){return arrayImg[5]}
    else { return arrayImg[0]}
}

function checkDups(id,city){
   var check = true;
    if (arrayHist[0]){
        arrayHist.forEach(function(iter){
            if (iter.id == id){
                removeItem(iter);
                arrayHist.unshift({id,city});
                check = false;
            }
        })
        if (check != false){
            arrayHist.unshift({id,city});
        }
    }
    else{
        arrayHist.unshift({id,city});
    }
    if (arrayHist.length >= 9){
        console.log("gothere")
        arrayHist.splice(8,1);
        console.log(arrayHist);
    }
    MakeButtons();
    localStorage.setItem("hist8",JSON.stringify(arrayHist));
}
function removeItem(y){
    arrayHist.forEach(function(x,i){
        if (y.id == x.id){
           arrayHist.splice(i,1);
        }
    })
    return
}

function MakeButtons(){

    $(".historical8").html("");
    arrayHist.forEach(function(iter){
        $(".historical8").append(makeHistBtn(iter.id, iter.city));
    })
}




