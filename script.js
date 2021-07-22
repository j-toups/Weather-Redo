function getForecast() {
    const input = document.getElementById("input");
    const searchWeather = document.getElementById("searchBtn");
    const clear = document.getElementById("clear");
    const name = document.getElementById("city-name");
    const icon = document.getElementById("icon");
    const curTemp = document.getElementById("temp");
    const curHum = document.getElementById("humidity");4
    const curWind = document.getElementById("wind");
    const currUV = document.getElementById("UV");
    const history = document.getElementById("history");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    console.log(searchHistory);
    

    const APIKey = "2967c64585b38281e9f00732387b3b93";


    function getAPI(city) {

        var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
        axios.get(url)
        .then(function(res){
            console.log(res);

            const curDate = new Date(res.data.dt*1000);
            console.log(curDate);

            const day = curDate.getDate();
            const month = curDate.getMonth() + 1;
            const year = curDate.getFullYear();
            
            name.innerHTML = res.data.name + " (" + month + "/" + day + "/" + year + ") ";
            let weatherPic = res.data.weather[0].icon;
            icon.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
            icon.setAttribute("alt",res.data.weather[0].description);
            curTemp.innerHTML = "temp: " + tempChange(res.data.main.temp) + " &#176F";
            curHum.innerHTML = "Humidity: " + res.data.main.humidity + "%";
            curWind.innerHTML = "Wind Speed: " + res.data.wind.speed + " MPH";
        let lat = res.data.coord.lat;
        let lon = res.data.coord.lon;
        let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
        axios.get(UVQueryURL)
        .then(function(res){
            let UVIndex = document.createElement("span");
            UVIndex.setAttribute("class","badge badge-danger");
            UVIndex.innerHTML = res.data[0].value;
            currUV.innerHTML = "UV Index: ";
            currUV.append(UVIndex);
        });

        let cityID = res.data.id;
        let forecastFromApi = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
        axios.get(forecastFromApi)
        .then(function(res){
            

            console.log(res);
            const F5Day = document.querySelectorAll(".forecast");
            for (i=0; i<F5Day.length; i++) {
                F5Day[i].innerHTML = "";
                const findex = i*8 + 4;
                const fdate = new Date(res.data.list[findex].dt * 1000);
                const day = fdate.getDate();
                const month = fdate.getMonth() + 1;
                const year = fdate.getFullYear();
                const fdateEl = document.createElement("p");
                fdateEl.setAttribute("class","mt-3 mb-0 forecast-date");
                fdateEl.innerHTML = month + "/" + day + "/" + year;
                F5Day[i].append(fdateEl);
                const fWeather = document.createElement("img");
                fWeather.setAttribute("src","https://openweathermap.org/img/wn/" + res.data.list[findex].weather[0].icon + "@2x.png");
                fWeather.setAttribute("alt",res.data.list[findex].weather[0].description);
                F5Day[i].append(fWeather);
                const fTemp = document.createElement("p");
                fTemp.innerHTML = "Temp: " + tempChange(res.data.list[findex].main.temp) + " &#176F";
                F5Day[i].append(fTemp);
                const forecastHumidityEl = document.createElement("p");
                forecastHumidityEl.innerHTML = "Humidity: " + res.data.list[findex].main.humidity + "%";
                F5Day[i].append(forecastHumidityEl);
                }
            })
        });  
    }

    searchWeather.addEventListener("click",function() {
        const searchTerm = input.value;
        getAPI(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search",JSON.stringify(searchHistory));
        renderHistory();
    })

    clear.addEventListener("click",function() {
        searchHistory = [];
        renderHistory();
    })

    function tempChange(K) {
        return Math.floor((K - 273.15) *1.8 +32);
    }

    function renderHistory() {
        history.innerHTML = "";
        for (let i=0; i<searchHistory.length; i++) {
            const historyStuff = document.createElement("input");
            
            historyStuff.setAttribute("type","text");
            historyStuff.setAttribute("readonly",true);
            historyStuff.setAttribute("value", searchHistory[i]);
            historyStuff.addEventListener("click",function() {
                getAPI(historyStuff.value);
            })
            history.append(historyStuff);
        }
    }

    renderHistory();
    if (searchHistory.length > 0) {
        getAPI(searchHistory[searchHistory.length - 1]);
    }




}
getForecast();