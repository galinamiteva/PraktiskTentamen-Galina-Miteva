let url = 'https://restcountries.eu/rest/v2/all?fields=name;timezones;flag'

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Country(index, flagSrc, name, timeZoneOffset) {
  this.index = index;
  this.flag = flagSrc;
  this.name = name;
  this.timeZoneOffset = timeZoneOffset;
}

function calcTime(offset) {
    // create Date object for current location
    var d = new Date();

    // convert to msec
    // subtract local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    var nd = new Date(utc + (3600000*offset));
    
    //format time
    var localeSpecificTime = nd.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});

    // return time as a string
    return localeSpecificTime;
}

Country.prototype.addCurrentCountryFlag = function(){
    let flags = document.querySelectorAll('img');
    flags[this.index].src = this.flag;
}

Country.prototype.addCurrentCountryName = function(){
    let h1s = document.querySelectorAll('h1');
    h1s[this.index].append(this.name);
}

Country.prototype.addCurrentCountryTime = function(){
      let offset;
      if(this.timeZoneOffset.includes('+')){
        offset = '+' + this.timeZoneOffset.split('+')[1].replace(':', '.');
      } else {
        offset = '-' + this.timeZoneOffset.split('-')[1].replace(':', '.');
      }

      let countryTime = calcTime(offset);
      let h3s = document.querySelectorAll('h3');
      h3s[this.index].innerText='Local time ';
      h3s[this.index].append(countryTime);
      
}

fetch(url).then(
    function(response){
       
        console.log(response);

       
        if(response.status >= 200 && response.status <300){
            return response.json();
        }

        
        else if(response.status === 404){
            throw 'Not Found';
        }

        
        else if(response.status === 400){  //finns mer statuser
            throw response.statusText;
        }

    }
).then(
    function(data){

        for(let i = 0; i < 3; i++) {
            let randomCountry = data[getRandomInt(0, data.length)];
            let currentCountry = new Country(i, randomCountry.flag, randomCountry.name, randomCountry.timezones[0]);
            currentCountry.addCurrentCountryFlag();
            currentCountry.addCurrentCountryName();
            currentCountry.addCurrentCountryTime();
            

        }

        console.log(data);

    }
).catch(
    function(error){
        console.log(error);
    }
)
