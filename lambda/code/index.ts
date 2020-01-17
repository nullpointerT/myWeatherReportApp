const axios = require ('axios');
const AWS = require("aws-sdk");

let weatherInfo:any = {};
let weatherMsg:string = "";

async function getWeather() {
    await axios({
        "method":"GET",
        "url": "https://community-open-weather-map.p.rapidapi.com/forecast",
        "headers":{
            "content-type":"application/octet-stream",
            "x-rapidapi-host":"community-open-weather-map.p.rapidapi.com",
            "x-rapidapi-key":""
        },"params":{
            "q":"seattle,us",
            "units":"imperial"
        }
    })
        .then((response:any) => {
            weatherInfo = response;
            console.log(weatherInfo);
            const list = weatherInfo.data.list[0]
            processWeatherInfo();
            console.log("sending sns:")
            const sns = new AWS.SNS();
            const params = {
                Message: weatherMsg,
                Subject: "Weather Report",
                PhoneNumber: ""
            };
            sns.publish(params, function(err:any, data:any){
                if(err) {
                    console.log(err, err.stack)
                }
                else {
                    console.log("msg sent:", data);
                }
            });

        })
        .catch((error:any) => {
            console.log(error)
        })
}

function processWeatherInfo() {
    const oneDayWeather:Array<any> = []
    for(let i = 0;i < 8;i++) {
        oneDayWeather.push(weatherInfo.data.list[i])
    }
    console.log("one day weather:", oneDayWeather);
    let temp_max = 0;
    let temp_min = 500;
    oneDayWeather.forEach((value:any) => {
        if(value.main.temp_max > temp_max) {
            temp_max = value.main.temp_max
        }
        if(value.main.temp_min < temp_min) {
            temp_min = value.main.temp_min
        }
    });

    const sunriseDate = new Date((weatherInfo.data.city.sunrise + weatherInfo.data.city.timezone) * 1000);

    const sunriseHrs = sunriseDate.getHours()
    const sunriseMins = "0" + sunriseDate.getMinutes();

    console.log("sunriseDate:", sunriseDate)

    const sunsetDate = new Date((weatherInfo.data.city.sunset + weatherInfo.data.city.timezone) * 1000 );
    const sunsetHrs = sunsetDate.getHours();
    const sunsetMins = "0" + sunsetDate.getMinutes();

    console.log("sunsetDate:", sunsetDate)

    const sunriseTime:string = sunriseHrs + ':' + sunriseMins.substr(-2);
    const sunsetTime:string = sunsetHrs + ':' + sunsetMins.substr(-2);
    weatherMsg = "🔅Morning! Today's weather in " + weatherInfo.data.city.name + ": " + oneDayWeather[0].weather[0].main + " with temperature "+ Math.round(temp_min) + "°F - " + Math.round(temp_max) + "°F, " + "humidity: " + oneDayWeather[0].main.humidity + "%. Sunrise: " + sunriseTime + ", Sunset: " + sunsetTime;
    console.log("weatherMsg", weatherMsg)
}

async function main() {
    await getWeather();
}


// entry point for AWS Lambda
exports.handler = (event: any, context: any) => {
    main();
}