var owm = new Vue({
  el :'#app',

  // initializing instances
  data:
  {
      message:null,
      weather:[],
      weathername:null,
      icon:null,
      url:null,
      x:0,
      temperature:null,
      pressure:null,
      min_temp:null,
      max_temp:null,
      windspeed:null,
      windDirection:null,
      humidity:null,
      weathercountry :null,
      grndlevel:null,
      sealevel:null,
      day:null,
      description:null,
      id:null,
      autocomplete:null,
      city:null,

  },
  // watching the change in city(location)
    
    watch:{
      message: function(val) {
        if(val.length > 0) {
          this.city=null;
        }
      }
    },

   
    
    mounted()
    {
      // google autocomplete
      this.autocomplete = new google.maps.places.Autocomplete(
        (this.$refs.autocomplete),
        {types: ['geocode']});
      this.autocomplete.addListener('place_changed', this.fillInAddress);
    },

    methods:
    {
      // google autocomplete single click selection
      fillInAddress()
      {
         var place = this.autocomplete.getPlace();
         
         this.message = place.name;
         this.onclick('metric',null);
      },



      // gps location
      getLocation()
      {
          if (navigator.geolocation)
          {
              navigator.geolocation.getCurrentPosition(this.showPosition,this.showError);
          }
          else
          {
              x.innerHTML="Geolocation is not supported by this browser.";
          }
      },
      // showing position using lat and lon
      showPosition(position)
      {
        lat=position.coords.latitude;
        lon=position.coords.longitude;
        this.displayLocation(lat,lon);
      },
      // errors
      showError(error)
      {
          switch(error.code)
          {
              case error.PERMISSION_DENIED:
                  x.innerHTML="User denied the request for Geolocation."
              break;
              case error.POSITION_UNAVAILABLE:
                  x.innerHTML="Location information is unavailable."
              break;
              case error.TIMEOUT:
                  x.innerHTML="The request to get user location timed out."
              break;
              case error.UNKNOWN_ERROR:
                  x.innerHTML="An unknown error occurred."
              break;
          }
      },
      // displaying the location 
      displayLocation(latitude,longitude)
      {
          const t = this;
          var geocoder;
          geocoder = new google.maps.Geocoder();
          var latlng = new google.maps.LatLng(latitude, longitude);

          geocoder.geocode(
              {'latLng': latlng}, 
              function(results, status) {
                  if (status == google.maps.GeocoderStatus.OK) {
                      if (results[0]) {
                          var add= results[0].formatted_address ;
                          var  value=add.split(",");

                          count=value.length;
                          country=value[count-1];
                          state=value[count-2];
                          t.city=value[count-3].slice(1);
                          t.message=t.city;
                          t.onclick('metric',t.city);
                          c

                      }
                      else  {
                          x.innerHTML = "address not found";
                      }
                  }
                  else {
                      x.innerHTML = "Geocoder failed due to: " + status;
                  }
              }
          );
      },


      // fetching the data from html and js and calculating the results
      onclick(unit,city) {
        const t = this;
        
        if (t.city!= null) 
        { 
          t.message = t.city;
          
        }
        var url  = 'https://api.openweathermap.org/data/2.5/find?q='+ t.message +'&units='+ unit +'&type=like&appid=766b78c39446a8fa6313c3b7b2063ade';
        axios.get(url)
          .then(function (response) {
            t.weather = response.data.list[0];
            t.id = t.weather.weather[0].id;
            t.weathername = t.weather.name + ', ' + t.weather.sys.country;
            
            t.temperature = t.weather.main.temp.toFixed(0);
            t.pressure = t.weather.main.pressure;
            t.min_temp = t.weather.main.temp_min;
            t.max_temp = t.weather.main.temp_max;
            t.windspeed = t.weather.wind.speed;
            t.windDirection =  t.weather.wind.deg;
            t.humidity = t.weather.main.humidity;
            t.grndlevel = t.weather.main.grnd_level;
            t.sealevel = t.weather.main.sea_level;
            
            t.day = t.Unix_timestamp(t.weather.dt);
            t.description = t.weather.weather[0].description.toUpperCase();
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      // this is used to convert unix to timestamp
      Unix_timestamp(t)
      {
      var dt = new Date(t*1000);
      
      if(dt.getDay()==0) {
        var day  = 'Sunday';
      }
      else if (dt.getDay()==1) {
        var day = 'Monday';
      }
      else if (dt.getDay()==2) {
        var day = 'Tuesday';
      }
      else if (dt.getDay()==3) {
        var day = 'Wednesday';
      }
      else if (dt.getDay()==4) {
        var day = 'Thrusday';
      }
      else if (dt.getDay()==5) {
        var day = 'Friday';
      }
      else if (dt.getDay()==6) {
        var day = 'Saturday';
      }

      
      var month = ["January","February","March","April","May","June","July","August","September","October","November","December"]
      

      
      return day+ ', '+ month[dt.getMonth()] +' '+ dt.getDate()+'th';
      }


    
    },

  
});