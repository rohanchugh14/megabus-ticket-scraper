var request = require("request");
//var fs = require("fs");

var departure_date = "2021-11-01";
var totalTickets = 0;
var MEGABUS_CITIES = {
    HOUSTON: 318,
    AUSTIN: 320,
    DALLAS: 317
};

var TRAVEL_DATES = {
    url: "https://us.megabus.com/journey-planner/api/journeys/travel-dates",
    qs: {
        originCityId: MEGABUS_CITIES.AUSTIN,
        destinationCityId: MEGABUS_CITIES.HOUSTON
    }
};


var readable = request.get(TRAVEL_DATES);

var allData = "";
    readable.on("data", function(chunk) {
        allData+=chunk;
    });
    readable.on("end", function() {
        allData = JSON.parse(allData).availableDates;
        allData.forEach(date => findLowPrices(date));
        console.log(totalTickets);
    });

// var dates = getReadableData(readable);
// dates.forEach(date => console.log(date));


// readable.on("end", function() {
//     result = JSON.parse(result);
//     //console.log(result);
//     allDates = result.availableDates;
//     //console.log(allDates[0]);
//     allDates.forEach(date => findLowPrices(date));
//     //console.log(JSON.parse(result));
// })

function findLowPrices(date) {
    var JOURNEY_DETAILS = {
        url: "https://us.megabus.com/journey-planner/api/journeys",
        qs: {
            originId: MEGABUS_CITIES.HOUSTON,
            destinationId: MEGABUS_CITIES.AUSTIN,
            departureDate: date,
            totalPassengers: 1,
            concessionCount: 0,
            nusCount: 0,
            days: 1
        }
    }
    var stream = request.get(JOURNEY_DETAILS);
    var data = "";
    stream.on("data", function(chunk) {
        data+=chunk;
    });
    stream.on("end", function() {
        data = JSON.parse(data).journeys;
        data.forEach(function(journey) {
            if(journey.price <= 20.00) {
                console.log("Date: " + date + "\nPrice: " + journey.price + "\nDuration " + cleanTimeString(journey.duration) + "\n");
            }
        });
    });
    
}

function cleanTimeString(timeString) {
    return timeString.substring(2);
}

  //.pipe(fs.createWriteStream('journey-details.json'));
//console.log(jsonFile);
//HOUSTON ID: 318
//AUSTIN ID: 320
//DALLAS ID: 317
//