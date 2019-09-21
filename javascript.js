try {
    navigator.geolocation.getCurrentPosition(function (pos) {
        var lat = pos.coords.latitude;
        var long = pos.coords.longitude;

        // Test various locations
        // lat = 40.728373;
        // long = -74.172490;

        getWeatherData(lat, long);
    });
} 
catch (e) {
    alert("Your browser does not support geolocation services.");
}


// Click Listeners 
$("#F").click(function () {
    if ($("#F").hasClass("selected") == 0) {
        $(this).addClass("selected");
        $("#C").removeClass("selected");
        
        var celcius = $("#temp").text();
        $("#temp").text((celcius * (9 / 5) + 32).toFixed(0));
    }
});
$("#C").click(function () {
    if ($("#C").hasClass("selected") == 0) {
        $(this).addClass("selected");
        $("#F").removeClass("selected");

        var fahrenheit = $("#temp").text();
        $("#temp").text(((fahrenheit - 32) * 5 / 9).toFixed(1));
    }
});


// Functions

function updateWeatherData(temp, city, country) {
    if ( $("#F").hasClass('selected') ){
        $("#temp").text((1.8 * (temp - 273) + 32).toFixed(0));
    } else if ( $("#C").hasClass('selected') ) {
        $("#temp").text((temp - 273.15).toFixed(1));
    }
    
    $("#location").text(city + ", " + country);
}

function updateWeatherBackground(weatherPrimary, weatherSecondary,sunriseTime, sunsetTime) {
    var curDate = Date.now() / 1000;  // Divide by 1000 to get time in seconds

    if (curDate > sunriseTime && curDate < sunsetTime) {
        dayTime = true;
        $("body").css("background", "rgb(86, 149, 191)");
    } else {
        dayTime = false;
        $("body").css("background", "rgb(28, 39, 51)");
        $("button").css("color", "rgb(28, 39, 51)");
    }
    
    if ( weatherPrimary == "Clear" ) {
        $("#weather-text").text("clear");
        if ( dayTime ) {
            $("img").attr("src", "https://res.cloudinary.com/aeroware/image/upload/v1497522848/danieledesantis-weather-icons-sunny_ifhcu4.svg");
        } else {
            $("img").attr("src", "https://res.cloudinary.com/aeroware/image/upload/v1497522842/danieledesantis-weather-icons-night-clear_s03q48.svg");
        }

    } else if ( weatherPrimary == "Clouds" ) {
        if ( weatherSecondary == "broken clouds" ) {
            $("#weather-text").text("partly cloudy");
            if ( dayTime ) {
                $("img").attr("src", "https://res.cloudinary.com/aeroware/image/upload/v1497522849/danieledesantis-weather-icons-cloudy_may53x.svg");
            } else {
                $("img").attr("src", "https://res.cloudinary.com/aeroware/image/upload/v1497522842/danieledesantis-weather-icons-night-cloudy_faqwcw.svg");
            }
        } else {
            $("#weather-text").text("cloudy");
            if ( dayTime ) {
                $("img").attr("src", "https://res.cloudinary.com/aeroware/image/upload/v1497522850/danieledesantis-weather-icons-cloudy-3_lx1nzr.svg");
            } else {
                $("img").attr("src", "https://res.cloudinary.com/aeroware/image/upload/v1497522842/danieledesantis-weather-icons-night-cloudy-3_knuv8o.svg");
            }
        }

    } else if (weatherPrimary == "Rain") {
        $("#weather-text").text("rainy");
        if ( dayTime ) {
            $("img").attr("src", "https://res.cloudinary.com/aeroware/image/upload/v1497522845/danieledesantis-weather-icons-rainy_uqq06h.svg");
        } else {
            $("img").attr("src", "https://res.cloudinary.com/aeroware/image/upload/v1497522842/danieledesantis-weather-icons-night-rainy_nduxzx.svg");
        }

    } else if (weatherPrimary == "Snow") {
        $("#weather-text").text("snowy");
        if ( dayTime ) {
            $("img").attr("src", "https://res.cloudinary.com/aeroware/image/upload/v1497522845/danieledesantis-weather-icons-snowy_bo2ghg.svg");
        } else {
            $("img").attr("src", "https://res.cloudinary.com/aeroware/image/upload/v1497522845/danieledesantis-weather-icons-night-snowy_uqzbcz.svg");
        }

    } else {
        $("#weather-text").text("unknown");
        // Insert question mark image 
    }
}

function getWeatherData(lat, lon) {
    const openweathermapkey = "702be017e2a96887878d8cc987da071c";
    var api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${openweathermapkey}`;

    $.getJSON( api, {
        format: "json"
    })
        .done(function( response ) {
            var temp = response.main.temp;  // [K]
            var sunriseTime = new Date(response.sys.sunrise);  // unix, UTC [s]
            var sunsetTime = new Date(response.sys.sunset);  // unix, UTC [s]
            var weatherPrimary = response.weather[0].main;  // [-]
            var weatherSecondary = response.weather[0].description;  // [-]
    
            var city = response.name;  // [-]
            var country = response.sys.country;  // [-]

            updateWeatherData(temp, city, country);
            updateWeatherBackground(weatherPrimary, weatherSecondary, sunriseTime, sunsetTime);
            $("body").css("display", "block")
            return 1
        })
        .fail(function() {
            alert('API call failed');
        }); 
}