////// THis is the Plates layer   ///////////////////////////////////////////////////////////////////////
// var link = "TradeWar/data/PB2002_plates.json";
var plates = [];
function createFeaturesPlates(platesData) {

  console.log("this is plates data", platesData);

// d3.json(link, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  var plates = L.geoJson(platesData, {

    style: function(plates) {
      return {
        color:  "magenta", // chooseColor(feature.properties.PlateName), // "white", 
        opacity: .8,
        fillColor: "white", 
        fillOpacity: 0.0,
        weight: 1,
        // pointerEvents: 'none',
        // zIndex: 650
      };
    }
  }); // .addTo(myMap);
  return plates
// })  
}
// console.log(plates);

/// This is the base earthquake layer, //////////////////////////////////////////////////////////////////////
/// to do: change to year to date and remove second earth quake layer 
//################################################################################################################################
//THIS EARTHQUAKE  ===>  FUNCTION WILL NOT RUN - IT HAS BEEN DISABLED 
//##############################################################################################################################

function createFeatures(earthquakeData) {
  
  var earthquakes = L.geoJSON(earthquakeData, {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
   onEachFeature: function(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3>" + new Date(feature.properties.time) + 
      "<p>" + "Magnitude: " + feature.properties.mag + "</p>" +
      "<p>" + "Location: " + feature.geometry.coordinates + "</p>" +
      "<p>" + "Tsunami: " + feature.properties.tsunami + "</p>" 
      )},

    pointToLayer: function(feature, latlng){

        if (feature.properties.mag < 5.2) {
          colorMag = "yellow";
          radiusMag = (feature.properties.mag ) *20000;
        }
        else if (feature.properties.mag >= 5.2 && feature.properties.mag < 6.4) {
          colorMag = "orange";
          radiusMag = (feature.properties.mag ) *24000;
        }   
        else if (feature.properties.tsunami) {
          colorMag = "blue";
          radiusMag = (feature.properties.mag *1.4) *24000;
        }   
        else  {
          colorMag = "red";
          radiusMag = (feature.properties.mag *1.4) *24000;
        }

        function getColor(d) {
          return d >= 8 ? 'blue' :
                 d > 6.4  ? 'red' :
                 d > 5.2  ? 'orange' :
                 d > 4   ? 'yellow' :
                 d > 0   ? 'white' :
                            'blue';
      }

        var geojsonMarkerOptions = {
          radius: radiusMag,
          fillColor: colorMag,
          color: getColor(feature.properties.mag),
          weight: 3,
          opacity: 1,
          fillOpacity: 0.5
      };

        return L.circle(latlng, geojsonMarkerOptions )
      }
    })

  return earthquakes
}

    // VARIOUS ATTEMPS TO LINK:  DELETE WHEN SOLUTION FOUND 
    // var conflicts = "TradeWar/data/countries_in_conflict.json";
    //   var conflicts =       "../../data/countries_in_conflict.json";
    //   var conflicts = "../data/countries_in_conflict.json";
      ////////////  FLASK LINK  ///////////////  
      var conflicts =       "/conflict";

      let conflictZones = [];
      d3.json(conflicts, function(dataC) 
      {
        console.log("here is conflict return data", dataC);
        conflictZones = dataC.map(dataC => dataC.country);
        console.log("here are conflicts zones", conflictZones[0]);
        return conflictZones
       });
    //    console.log(conflictZones[0]);



/// This is the Flag Markers layer  ////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////   FLAG  CALLS HAVE BEEN DISABLED UNTIL FLASK SOLUTION DETERMINED 
////////////////////////////////////////////////////////////////////////////////////////////////////////
function createFeaturesMarkers(countryMarkersData) {

  var countryMarkers = L.geoJSON(countryMarkersData, {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
   onEachFeature: function(feature, layer) {
     
    layer.bindTooltip("<h2>" + feature.properties.country_name + "</h2>"+
    // "<img src='../data/Flags/"+`${feature.properties.country}`+".png' alt='../data/Flags/NONE.png' style='float:right;clear:both'  height='60' width='60'></img>"+ "</p>" + "<br> " +

    // "<img src='../../data/Flags/"+`${feature.properties.country}`+".png' alt='../../data/Flags/NONE.png' style='float:right;clear:both'  height='60' width='60'></img>"+ "</p>" + "<br> " +

    // "<img src='TradeWar/data/Flags/"+`${feature.properties.country}`+".png' alt='TradeWar/data/Flags/NONE.png' style='float:right;clear:both'  height='60' width='60'></img>"+ "</p>" + "<br> " +

      // "</h3><hr><p>" + new Date(feature.properties.time) + 
      "<h3>" + "Code: " + feature.properties.country + " " + "</h3>"+
      // "<hr><p>" + "Location: " + feature.geometry.coordinates + "</p>" +
      "<p>" + "Import Rank: " + feature.properties.imp_rank +"<br>"+ "Imports YTD: "+feature.properties.ytd_cus+  "</p>" +
      "<p>" + "Export Rank: " + feature.properties.exp_rank + "<br>"+ "Exports YTD: "+feature.properties.exp_ytd+ "</p>" +
      "<p>" + "Balance Rank: " + feature.properties.bal_rank + "<br>"+ "Balance YTD: "+feature.properties.bal_ytd+ "</p>" 
      ,  {sticky: true, offset:[-4,0], direction: 'left' }
      )},
    })

    return countryMarkers
  }
/*
//################################################################################################################################
//COMMENTING OUT EARTHQUAKES - FLASK DOESNT LIKE JAVA MAKING LINK CALLS EXTERNAL OR LOCAL - FLASK MUST DO THAT - WE THINK 
// ALSO NEED ANOTHER SOLUTION FOR FLAGS - WHERE FLASK CAN PASS APPROPRIATE FILE - OR REF TO HTML - NOT SURE 
//##############################################################################################################################
    pointToLayer: function(feature, latlng){
    
      ///  Hides the poles for NONE flags ///// 
      if ( feature.properties.country === "NONE") {
        // var shadow = "TradeWar/data/Flags/NONE.png";
        // var shadow = "../../data/Flags/NONE.png";
        var shadow = "../data/Flags/NONE.png";


        // console.log(feature.properties.country_name[0]);
        // console.log(conflictZones);

      } else if (conflictZones.includes(feature.properties.country_coords_name)) {
        
          // var shadow = "TradeWar/data/Flags/shadowFIRE.png";
        //   var shadow = "../../data/Flags/shadowFIRE.png";
          var shadow = "../data/Flags/shadowFIRE.png";


      } else {
          // var shadow = "TradeWar/data/Flags/shadow.png";
        //   var shadow = "../../data/Flags/shadow.png";
          var shadow = "../data/Flags/shadow.png";


      }
      
      var flag = L.icon({
        shadowUrl: shadow,
        // iconUrl: `TradeWar/data/Flags/${feature.properties.country}.png`,
        // iconUrl: `../../data/Flags/${feature.properties.country}.png`,
        iconUrl: `../data/Flags/${feature.properties.country}.png`,


        // iconUrl: "TradeWar/data/Flags/FIRE.png",

        iconSize:     [26, 26], // size of the icon
        shadowSize:   [57, 57], // size of the shadow
        // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [17, 31],  // the same for the shadow
        // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    
    // console.log(feature.properties.country);
        return L.marker(latlng, { icon: flag} )
      
      }
      
    })

  return countryMarkers
}*/





function createMap() {

  
// Store our API endpoint inside queryUrl
/*
//################################################################################################################################
//COMMENTING OUT EARTHQUAKES - FLASK DOESNT LIKE JAVA MAKING LINK CALLS EXTERNAL OR LOCAL - FLASK MUST DO THAT - WE THINK 
//##############################################################################################################################
var d = new Date();
var year = d.getFullYear();
var month = d.getMonth();
var day = d.getDate();
var ytd = d.setFullYear(d.getFullYear() - 1);
var c = new Date(year - 1, month, day)
var ytd = new Date(ytd)
var date = ytd.toString();

var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime="+
`${year-1}-${month}-${day}`+"&endtime=" +
`${year}-${month}-${day}`+"&maxlongitude=180&minlongitude=-180&maxlatitude=70&minlatitude=-70&minmagnitude=7.0"; 
*/
/*
    // Perform a GET request to the query URL
  d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    var earthquakes =  createFeatures(data.features);
    */
    // VARIOUS ATTEMPS TO LINK:  DELETE WHEN SOLUTION FOUND 
    // var countryCoordsLink = "TradeWar/data/countriesGEO.json";  
    // var countryCoordsLink = "TradeWar/data/TradeData/TradeData_geo.json";
    // var countryCoordsLink = "../../data/TradeData/TradeData_geo.json";
    // var countryCoordsLink = "../data/TradeData/TradeData_geo.json";


      ////////////  FLASK LINK  ///////////////  
    var countryCoordsLink = "/tradedata_geo";

    d3.json(countryCoordsLink, function(data) {
      // Once we get a response, send the data.features object to the createFeatures function
      var countryMarkers = createFeaturesMarkers(data.features);

    // VARIOUS ATTEMPS TO LINK:  DELETE WHEN SOLUTION FOUND:
    // var link = "TradeWar/data/PB2002_plates.json";
    // var link = "../../data/PB2002_plates.json";
    // var link = "../data/PB2002_plates.json";
    // var link = "/data/PB2002_plates.json";
    // var link = "../data/PB2002_plates.json";


      ////////////  FLASK LINK  ///////////////  
    var link = "/plates";
    // var plates = [];
    d3.json(link, function(data) {
      // Once we get a response, send the data.features object to the createFeatures function
      var plates  = createFeaturesPlates(data.features);

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

/// This is the Countries Choropleth Layer currently shows the Population Est ////////////////////////////////

// VARIOUS ATTEMPS TO LINK:  DELETE WHEN SOLUTION FOUND:
        // var link2 = "TradeWar/data/ne_10m_admin_0_countries.geojson";
        // var link2 = "TradeWar/data/customLO.geo.json";
        // var link2 = "TradeWar/data/countries_admn-0.geojson";
        //   var link2 = "../../data/countries_admn-0.geojson";
        //   var link2 = "../data/countries_admn-0.geojson";


////////// FLASK LINK ////////////////
  var link2 = "/countries_g";

  d3.json(link2, function(data) {

    // for (var i = 0; i < data.features.length; i++) {
    //   //   // console.log(data.features[i].properties.pop_est);
    //     colorPop = data.features[i].properties.pop_est;
    // }

    // Once we get a response, send the data.features object to the createFeatures function
    var countries = L.geoJson(data, {
      onEachFeature: onEachFeature,

      style: function(countries) {

        return {
          attribution: "XpopulationX",
          user: "JONAH",
          color:  "red", // chooseColor(feature.properties.PlateName), // "white", 
          opacity: .8,
          fillColor: getColorCountry(countries.properties.pop_est),
          fillOpacity: 0.6,
          weight: 1,
          // pointerEvents: 'none',
          // zIndex: 650
        }; 

        function getColorCountry(d) {
          return d > 1000000000 ? '#800026' :
                 d > 500000000  ? '#BD0026' :
                 d > 200000000  ? '#E31A1C' :
                 d > 100000000  ? '#FC4E2A' :
                 d > 50000000  ? '#FD8D3C' :
                 d > 20000000   ? '#FEB24C' :
                 d > 10000000   ? '#FED976' :
                              '#FFEDA0'
      } 
      },
    
    }); 
    
/// This is the CountriesGDP  Choropleth Layer currently shows the GDP Est ////////////////////////////////
    var countriesGDP = L.geoJson(data, {
      
      onEachFeature: onEachFeature,
  
      style: function(colorStyle) {
  
        return {
          attribution: "XXGDPXX",
          color:  "blue", // chooseColor(feature.properties.PlateName), // "white", 
          opacity: .8,
          fillColor: getColorCountry1(colorStyle.properties.gdp_md_est),
          fillOpacity: 0.8,
          weight: 1,
          // pointerEvents: 'none',
          // zIndex: 650
        }; 
  
        function getColorCountry1(d) {
          return d > 10000000 ? '#006d2c' :
                 d > 4000000  ? '#2ca25f' :
                 d > 1000000  ? '#66c2a4' :
                 d > 200000  ? '#99d8c9' :
                 d > 700   ? '#ccece6' :
                              '#edf8fb'

      } 
      },
    });

    // console.log(countries);        ////////////////////////////////////////////////////////////////////////////////////

function reset(e) {
  // countries.resetStyle(e.target);
  // if (e.target.options.color === "red") {
    if (e.target.options.attribution === "XpopulationX") {
console.log("XpopulationX");
// console.log(e.target.options);
  countries.resetStyle(e.target);
  // console.log(e.target.options.color);
  // console.log(countriesGDP.options);

} else if (e.target.options.attribution === "XXGDPXX") {
  console.log("XXGDPXX");

  countriesGDP.resetStyle(e.target);}
  // console.log(e.target.options.color);
  displayInfo.update();

}

////// This is the countries in conflict code  /////////////////////////////////////////////////////////////
// var conflicts = "TradeWar/data/countries_in_conflict.json";
// var conflicts = "../../data/countries_in_conflict.json";
// var conflicts = "../data/countries_in_conflict.json";


////////////  FLASK LINK  ///////////////  
var conflicts = "/conflict";


var conflictZones = [];
d3.json(conflicts, function(data) {
 
  // Once we get a response, send the data.features object to the createFeatures function

  conflictZones = data.map(data => data.country);
  conflictNames = data.map(data => data);


 } ); // .addTo(myMap);

 // On hover control that displays information about hovered upon country
var displayInfo = L.control();

displayInfo.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};


// Passes properties of hovered upon country and displays it in the control
displayInfo.update = function(props) {
  var temp = [];
  var temp2 = [];
  
// Function for displaying Countries in Conflict
  function conflictInfo(){
    var temp = [];
    var temp2 = [];

    for(var i = 0; i < conflictNames.length; i++) { 

      if ( conflictNames[i].country === props.name && temp.length <= 2 ) { temp.push(conflictNames[i].name_of_conflict)};
      if ( conflictNames[i].country === props.name && temp2.length < 9 ) { temp2.push(conflictNames[i].name_of_conflict)};
    } 
    if (temp2.length > 2 ) {
      temp = temp2+"🔥💣🔥";
      } else if(temp.length === 1 || temp.length === 2 ) {temp =temp+"⚔️"} else {temp = "☮️"}
      return temp
    }

  // conflictInfo();

// Function for displaying Countries in Conflict Body counts
  function conflictDead(){
    var temp = [];
    var temp2 = [];

    for(var i = 0; i < conflictNames.length; i++) { 

      if ( conflictNames[i].country === props.name && temp.length <= 2 ) { temp.push(conflictNames[i].num_deaths_2019)};
      if ( conflictNames[i].country === props.name && temp2.length < 9 ) { temp2.push(conflictNames[i].num_deaths_2019)};
    } 
    if (temp2.length > 2 ) {
      temp = temp2+"🔥💣🔥";
      } else if(temp.length === 1 || temp.length === 2 ) {temp =temp+"⚔️"} else {temp = "☮️"}
      return temp
    }

    this._div.innerHTML = '<h2>Global Index</h2>' + (props ?
        '<h3>' + props.name + '</h3>' + '<br>' + 'GDP in Trillions of USD: ' + '</br><br>' + props.gdp_md_est / 1000000 + '<br>' +
        '<br>' + ' GDP in Billions of USD: ' + '</br>' + props.gdp_md_est / 1000 + '</br>' +
        '<br>' + 'Economic Status: ' + '</br><br>' + props.economy + '<br/>' +
        '<br>' + 'Population: ' + '</br><br>' + props.pop_est / 1000000 + ' million people' + '</br>' +
        '<br>' + 'CONFLICT: ' + '</br><br>' + conflictInfo()  + '</br><br>' +'💀 2019 Deaths: '+conflictDead() + '</br>' :
        // '<b>' + 'Conflict: ' + '</b>' + (conflictZones.includes(props.name) ? 'On ' : 'Off ') + conflictZones[0] + ' DEATHS YTD' :
        'Hover over a country');   
        // console.log(conflictZones);
        // '<b>' + 'Conflict: ' + '</b>' + ((props.name === "Mexico") ? 'On' : 'Off') + ' million people' :
};


// Happens on mouse hover
function highlight(e) {

// var conflicts = "TradeWar/data/countries_in_conflict.json";
// var conflicts = "../../data/countries_in_conflict.json";
// var conflicts = "../data/countries_in_conflict.json";

////////////  FLASK LINK  ///////////////  
var conflicts = "/conflict";

var conflictNames = [];
d3.json(conflicts, function(data) {

  conflictNames = data.map(data => data);
  function getColor(d) {
    return d  >= 4 ? 'blue' :
           d  > 3  ? 'red' :
           d  > 2  ? 'orange' :
           d  == 1   ? 'yellow' :
           d  == 0   ? 'white' :
                      'red';
  }

  function conflictLevel(){
    var temp = [];
    
    for(var i = 0; i < conflictNames.length; i++) { 
      // (conflictZones.includes(props.name) 
      temp = conflictNames[i].country;
      temp2 = "";
      // console.log(layer.feature.properties.name);
      // console.log(conflictZones);

      if ( conflictZones.includes(layer.feature.properties.name)) { temp2 = 1} else {temp2 = 0};
    } 
        return temp2
      }
  var layer = e.target;

  layer.setStyle({
      weight: 3,
      color:  getColor(conflictLevel()), // getColor(conflictNames[0].num_deaths_2019),  //  getColor(layer.feature.properties.pop_est),    //  '#ffd32a',
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
  }

  displayInfo.update(layer.feature.properties);
}

)}

//// Create our map, giving it the streetmap and earthquakes layers to display on load   ////////////////////
    var myMap = L.map("map", {
      worldCopyJump: true,
      center: [
        37.09, -70.00
      ],
      zoom: 3,
      layers: [darkmap, countriesGDP]  // , earthquakes, earthquakes2015] countryMarkers
    });

function zoomToCountry(e) {
  myMap.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlight,
      mouseout: reset,
      click: zoomToCountry
  });
}


//// Create overlay object to hold our overlay layer //////////////////////////////////////////////////////
    var overlayMaps = {
      Countries_POP: countries,
      // Plates: plates,
//################################################################################################################################
//COMMENTING OUT EARTHQUAKES - FLASK DOESNT LIKE JAVA MAKING LINK CALLS EXTERNAL OR LOCAL - FLASK MUST DO THAT - WE THINK 
//##############################################################################################################################
      // Earthquakes_YTD: earthquakes,
      // Earthquakes2015: earthquakes2015,
      Countries_GDP: countriesGDP,
      // CountryMarkers: countryMarkers
    };
  
    L.control.layers(baseMaps, overlayMaps,  {
      collapsed: false
    }).addTo(myMap);

    displayInfo.addTo(myMap);   //////////////////////////

////////////////////////////////////////////
////////// LEGEND /////////////////////////////
    function getColor(d) {
      return d >= 8 ? 'blue' :
             d > 6.4  ? 'red' :
             d > 5.2  ? 'orange' :
             d > 4   ? 'yellow' :
             d > 0   ? 'white' :
                        'blue';
  }
  
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend');
          grades = [0, 4, 5.2, 6.4, 'tsunami'],
          labels = [];
          div.innerHTML += "<h4>Magnitude</h4>";
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);
  
  })   ///////////////////   Old Plates layer position bracket but now line 283 countries geojson  ///////////////
  
})

})

// }) DEPRECATED  earthquakes2015  closing bracket

// })
  };

createMap();



  
function init() { createMap(); console.log("JS has run init Create Map");  }

init(); 
