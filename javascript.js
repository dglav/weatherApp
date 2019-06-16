// PR1: Add cookies to store access rights to geolocator
// PR2: Get correct output strings for weather checking

// development-only flags (remove for production)
var use_google_api = false;
var use_weather_api = true;

contentAlign();

try {
    navigator.geolocation.getCurrentPosition(function (pos) {
        var lat = pos.coords.latitude;
        var long = pos.coords.longitude;

        // Test various locations
        // lat = 40.728373;
        // long = -74.172490;

        if (use_google_api) {
            var loc = getLocationData(lat, long);
            $("#location").text(loc.city + ", " + loc.country);
        } else {
            $("#location").text("Nagoya" + ", " + "Japan");
        }

        if (use_weather_api) {
            getWeatherData(lat, long);
        }
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
function contentAlign() {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var contentWidth = 222; //px
    var contentHeight = 354; //px

    var leftPosition = 1.03 / 2 * windowWidth - 0.35 * windowHeight - contentWidth / 2; //in pixels
    if (leftPosition >= 0) {
        leftPosition *= 100 / windowWidth; //convert to %
    } else {
        leftPosition = 0;
    }

    var topPosition = (windowHeight - contentHeight) / 2;
    if (topPosition >= 0) {
        topPosition *= 100 / windowHeight; //convert to %
    } else {
        topPosition = 0;
    }

    $("#content").css("left", leftPosition + "%");
    $("#content").css("top", topPosition + "%");
}


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
        console.log(dayTime);
    } else {
        dayTime = false;
        $("body").css("background", "rgb(28, 39, 51)");
        $(".selected").css("color", "rgb(28, 39, 51)");
        console.log(dayTime);
    }
        
    console.log(dayTime);

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
            $("img").attr("src", "https://res.cloudinary.com/aeroware/image/upload/v1497522842/danieledesantis-weather-icons-night-rainy_nduxzx.svgg");
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

function getLocationData(lat, long) {
    const googleAPIKey = "&key=AIzaSyAh9wBj38F0d2pYh5Xxw7I731iUWsvpucs";

    var googleLocationSite =
        "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        lat +
        "," +
        long +
        googleAPIKey;

    $.getJSON(googleLocationSite, function (json) {
        console.log(json);
        var location = json.results[0].address_components;

        // Because address are not always formatted the same
        for (i = 0; i < location.length; i++) {
            for (j = 0; j < location[i].types.length; j++) {
                if (location[i].types[j] == "locality") {
                    var city = location[i].short_name;
                    // console.log("The city is " + city);
                } else if (location[i].types[j] == "country") {
                    var country = location[i].long_name;
                    // console.log("The country is " + country);
                }
            }
        }  
    });
    city = 'Nagoya'
    country = 'Japan'
    return { city, country }
}

function getWeatherData_darksky(lat, long) {
    const darkskyAPIKey = "e94975b33e4f54c7dfd26b844d587681";

    var darksky =
        "https://crossorigin.me/https://api.darksky.net/forecast/" +
        darkskyAPIKey +
        "/" +
        lat +
        "," +
        long;

    $.getJSON(darksky, function (weather) {
        console.log(weather);
        var appTempF = weather.currently.apparentTemperature;
        var sunrise = new Date(weather.daily.data[0].sunriseTime);
        var sunset = weather.daily.data[0].sunsetTime;
        var sky = weather.currently.icon;
    });

    return { appTempF, sunrise, sunset, sky }
}

function getWeatherData(lat, lon) {
    const openweathermapkey = "702be017e2a96887878d8cc987da071c";
    var api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${openweathermapkey}`;

    $.getJSON( api, {
        format: "json"
    })
        .done(function( response ) {
            console.log(response);
            var temp = response.main.temp;  // [K]
            var sunriseTime = new Date(response.sys.sunrise);  // unix, UTC [s]
            var sunsetTime = new Date(response.sys.sunset);  // unix, UTC [s]
            var weatherPrimary = response.weather[0].main;  // [-]
            var weatherSecondary = response.weather[0].description;  // [-]
    
            var city = response.name;  // [-]
            var country = response.sys.country;  // [-]

            console.log(weatherPrimary);
            console.log(weatherSecondary);

            updateWeatherData(temp, city, country);
            updateWeatherBackground(weatherPrimary, weatherSecondary, sunriseTime, sunsetTime);
            return 1
        })
        .fail(function() {
            console.log("error")
        }); 
}