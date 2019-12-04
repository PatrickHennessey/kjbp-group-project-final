///////////////////////////////////////////////////////////////////////////////////////////////////
////-----VARIABLES  ---------------////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

var geojson;
var lat = 0;
var long = 0;
var mymap = L.map('map').setView([lat, long], 2);
var database_info = "";
var display_this = 0; //temp var to determine map color
var map_color_data = "";
var db_data = [];
var initialize = 0;

L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=${API_KEY}`, {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
}).addTo(mymap);


///////////////////////////////////////////////////////////////////////////////////////////////////
////---- BUILD MAP WITH GEOJASON ---------------///////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function draw_map(db_data) /// THIS FUNCTION WRAPS MOST OF THIS CODE 
{

  console.log("this is db data", db_data);
  if (display_this < 11) {
    geojson = L.geoJson(worldData, {
      style: style,
      onEachFeature: onEachFeature,
      clickable: true
    }).addTo(mymap);
  }
  /*
          if ( display_this >= 2)// PLACE HOLDER  FOR A 3RD DATA SET TO COLOR MAP?
              {
                geojson = L.geoJson(worldData, {
                                                style: style2(db_data),
                                                onEachFeature: onEachFeature,
                                                clickable: true
                                                }).addTo(mymap);
              }
  */
  /////////////////////////////////////////////////////////////////////////////////////////////////
  ////------- LEGEND ------------------////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////

  ///--LEGEND POSITION:
  var legend = L.control({
    position: 'bottomleft'
  });

  ///--LEGEND CREATION:
  legend.onAdd = function (map) {
    console.log("initialize is ", initialize);

    var colorz = [];
    if (display_this == 0) {
      colorz = [1500000, 1000000, 500000, 200000, 100000, 50000, 20000, 15000];
    }
    if (display_this == 1) {
      colorz = [500000000, 250000000, 100000000, 75000000, 25000000, 5000000, 1000000, 100000];
    }
    if (display_this == 3 || display_this == 4 || display_this == 5) {
      colorz = [90, 80, 70, 60, 50, 40, 20, 10];
    }
    if (display_this == 2 || display_this == 7) {
      colorz = [160, 140, 120, 100, 80, 60, 40, 20];
    }
    if (display_this == 6 || display_this == 10 || display_this == 8 || display_this == 9) {
      colorz = [55, 50, 45, 40, 35, 30, 25, 20, 10];
    }

    var div = L.DomUtil.create('div', 'info legend'),
      colors = colorz,
      labels = [];

    if (display_this == 0) {
      div.innerHTML += '<h4> GDP in Thousands of Millions of USD</h4>';
    }
    if (display_this == 1) {
      div.innerHTML += '<h4> Population in the Millions</h4>';
    }
    if (display_this == 2) {
      div.innerHTML += '<h4> World Rank (Lower is Better) </h4>';
    }
    if (display_this == 3) {
      div.innerHTML += '<h4> Government Integrity (Higher is Better) </h4>';
    }
    if (display_this == 4) {
      div.innerHTML += '<h4> Judicial Effectiveness (Higher is Better)  </h4>';
    }
    if (display_this == 5) {
      div.innerHTML += '<h4> Fiscal Health (Higher is Better) </h4>';
    }
    if (display_this == 6) {
      div.innerHTML += '<h4> Inflation   </h4>';
    }
    if (display_this == 7) {
      div.innerHTML += '<h4> Public Debt of GDP   </h4>';
    }
    if (display_this == 8) {
      div.innerHTML += '<h4> Avg Income Tax Rate   </h4>';
    }
    if (display_this == 9) {
      div.innerHTML += '<h4> Avg Corporate Tax Rate   </h4>';
    }
    if (display_this == 10) {
      div.innerHTML += '<h4> Unemployement </h4>';
    }

    // /FOR LOOP CREATE LEGEND -- Loops through GDP data and grabs colors for each range and puts them in the legend’s key
    for (var i = 0; i < colors.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(colors[i] + 1) + '"></i>' +
        colors[i] + (colors[i + 1] ? '&ndash;' + colors[i + 1] + '<br>' : '-');
    }

    return div;
  };
  legend.addTo(mymap);


  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ////--- INFORMATION BOX --------///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////

  ///--ON HOVER-----DISPLAY COUNTRY INFO IN INFORMATION BOX

  if (displayInfo) {
    mymap.removeLayer(displayInfo);
  }


  var displayInfo = L.control();


  displayInfo.onAdd = function (map) /// create a div with a class "info"
  {

    console.log("initialize is ", initialize);
    this._div = L.DomUtil.create('div', 'info');

    this.update();
    return this._div;

  };

  displayInfo.clear = function clear_displayInfo_box() ///CLEAR CONTENT
  {
    this._div.innerHTML = ("");
  };
  ///--POPULATE THE INFO BOX WITH HTML:
  displayInfo.update = function (props) //, meta)//,db_data) /// Passes properties of hovered upon country and displays it in the control
  {
    this._div.innerHTML = (props ?
      // '<p class = "flag">' + flags[0].emoji + '</p>' +
      '<h3>' + props.name + '</h3>' + '<b>' + 'GDP in Trillions of USD: ' + '</b>' + props.gdp_md_est / 1000000 + '<br />' +
      '<b>' + ' GDP in Billions of USD: ' + '</b>' + props.gdp_md_est / 1000 + '<br />' +
      '<b>' + 'Economic Status: ' + '</b>' + props.economy + '<br />' +
      '<b>' + 'Population: ' + '</b>' + props.pop_est / 1000000 + ' million people' :
      'Hover over a European country');
  }
  displayInfo.addTo(mymap);

  /////////////////////////////////////////////////////////////////////////
  ///   MY INFO BOX  INFO FROM FLASK 
  /////////////////////////////////////////////////////////////////////////

  if (info_box) {
    mymap.removeLayer(info_box);
  }
  if (info_box) {
    info_box.removeLayer();
  }
  if (info_box) {
    info_box.remove();
  }
  var info_box = L.control();


  info_box.onAdd = function (map) /// create a div with a class "info"
  {
    console.log("initialize is ", initialize);
    this._divi = L.DomUtil.create('div', 'info');
    this.update();
    return this._divi;
  };

  info_box.clear = function clear_info_box() ///CLEAR CONTENT
  {
    this._divi.innerHTML = ("");
  };

  info_box.update = function (key, value) //UNPACK JSON
  {
    this._divi.innerHTML += ('<li>' + key + ": " + value + '</li>');
  };
  info_box.addTo(mymap);
  /////////////////////////////////////////////////////////////////////////
  ///  END MY INFO BOX 
  ////////////////////////////////////////////////////////////////////////     



  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ////--- MAP STYLING ------------///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////

  function highlight(e) /// HOVER ON MAP ITEMS - UPDATES INFO BOXES AND OUTLINES COUNTRY
  {
    var layer = e.target;

    layer.setStyle({
      weight: 3,
      color: '#ffd32a'
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }

    displayInfo.update(layer.feature.properties); // Updates custom legend on hover
    // info_box(layer.feature.properties);
  }


  function reset(e) /// RESET LEGEND ON MOUSE OUT
  {
    geojson.resetStyle(e.target);
    displayInfo.update(); // Resets custom legend when user unhovers
  }


  function getColor(d) /// COLOR GRADIENT THRESHOLDS FOR MAP
  {
    // console.log("get color func is being called and display this is ", displayInfo);
    // console.log("get color func is being called and display this is ", displayInfo);
    console.log("display this value is:", display_this);

    if (display_this == 0) // GDP COLOR
    {
      return d > 1500000 ? '#49006a' :
        d > 1000000 ? '#7a0177' :
        d > 500000 ? '#ae017e' :
        d > 200000 ? '#dd3497' :
        d > 100000 ? '#f768a1' :
        d > 50000 ? '#fa9fb5' :
        d > 20000 ? '#fcc5c0' :
        d > 15000 ? '#fde0dd' :
        '#fff7f3'
    }
    if (display_this == 1) // POPULATION COLOR
    {
      return d > 500000000 ? '#49006a' :
        d > 250000000 ? '#7a0177' :
        d > 100000000 ? '#ae017e' :
        d > 75000000 ? '#dd3497' :
        d > 25000000 ? '#f768a1' :
        d > 5000000 ? '#fa9fb5' :
        d > 1000000 ? '#fcc5c0' :
        d < 100000 ? '#fde0dd' :
        '#fff7f3'
    }

    if (display_this == 3 || display_this == 4 || display_this == 5) // ECO TEST
    {
      return d > 90 ? '#260038' :
        d > 80 ? '#34004d' :
        d > 70 ? '#49006a' :
        d > 70 ? '#680188' :
        d > 60 ? '#7a0177' :
        d > 50 ? '#ae017e' :
        d > 40 ? '#c4058d' :
        d > 20 ? '#dd3497' :
        d < 10 ? '#f768a1' :
        '#fff7f3'
    }


    if (display_this == 2 || display_this == 7) // ECO TEST
    {
      return d > 160 ? '#49006a' :
        d > 140 ? '#7a0177' :
        d > 120 ? '#ae017e' :
        d > 100 ? '#dd3497' :
        d > 80 ? '#f768a1' :
        d > 60 ? '#fa9fb5' :
        d > 40 ? '#fcc5c0' :
        d < 20 ? '#fde0dd' :
        '#fff7f3'
    }

    if (display_this == 6 || display_this == 10 || display_this == 8 || display_this == 9) // ECO TEST
    {
      return d > 55 ? '#260038' :
        d > 50 ? '#34004d' :
        d > 45 ? '#49006a' :
        d > 40 ? '#680188' :
        d > 35 ? '#7a0177' :
        d > 30 ? '#ae017e' :
        d > 25 ? '#c4058d' :
        d > 20 ? '#dd3497' :
        d < 10 ? '#f768a1' :
        '#fff7f3'

    }
    mymap.update();
  }



  function flag(d) {} /// EMOJI FLAG PER COUNTRY 

  for (var i = 1; i < flags.length; i++) {
    // console.log(flags[i].emoji);
  }


  function style(feature) /// COLOR OF COUNTRYS BASED ON THIS VARIABLE FROM GEOJSON
  {
    console.log("the style function is being called");
    if (display_this == 0) {
      map_color_data = feature.properties.gdp_md_est
    }; // THIS CHANGES DATA BEING FED INTO COLOR
    if (display_this == 1) {
      map_color_data = feature.properties.pop_est
    }; // THIS CHANGES DATA BEING FED INTO COLOR
    if (display_this == 2) {
      map_color_data = feature.properties.World_Rank
    }; // THIS CHANGES DATA BEING FED INTO COLOR
    if (display_this == 3) {
      map_color_data = feature.properties.Government_Integrity
    }; // THIS CHANGES DATA BEING FED INTO COLOR
    if (display_this == 4) {
      map_color_data = feature.properties.Judical_Effectiveness
    }; // THIS CHANGES DATA BEING FED INTO COLOR
    if (display_this == 5) {
      map_color_data = feature.properties.Fiscal_Health
    }; // THIS CHANGES DATA BEING FED INTO COLOR
    if (display_this == 6) {
      map_color_data = feature.properties.Inflation
    }; // THIS CHANGES DATA BEING FED INTO COLOR
    if (display_this == 7) {
      map_color_data = feature.properties.Public_Debtof_GDP
    }; // THIS CHANGES DATA BEING FED INTO COLOR
    if (display_this == 8) {
      map_color_data = feature.properties.Income_Tax_Rate
    }; // THIS CHANGES DATA BEING FED INTO COLOR
    if (display_this == 9) {
      map_color_data = feature.properties.Corporate_Tax_Rate
    }; // THIS CHANGES DATA BEING FED INTO COLOR
    if (display_this == 10) {
      map_color_data = feature.properties.Unemployment
    }; // THIS CHANGES DATA BEING FED INTO COLOR
    console.log("display this value is:", display_this);

    return {

      // fillColor: getColor(feature.properties.gdp_md_est),
      fillColor: getColor(map_color_data),
      weight: 1,
      opacity: 1,
      // color: 'snow',
      fillOpacity: .5,
      className: feature.properties.geounit,
    };

  }


  function highlight(e) // OUTLINING COUNTRY POLYGONS /// API CALL ON HOVER COUNTRY
  {
    info_box.clear();
    var layer = e.target;

    layer.setStyle({
      weight: 3,
      color: '#ffd32a',
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }

    ////// JSON API REQUEST //////////////////////////////////////////////
    name_country = layer.feature.properties.name; // OR // props.name;

    urlz = `/metadata/${name_country}` /// API ADDRESS USE COUNTRY NAME AS QUERY 

    d3.json(urlz).then(function (response) //JSON RESPONSE
      {
        var info = response;
        console.log("this is the data", response);
        // info_box.update(info);
        Object.entries(info).forEach(([key, value]) => {
          info_box.update(key, value); //PASS JASON TO INFO_BOX.UPDATE FUNC
        });
      });

    displayInfo.update(layer.feature.properties);
  }


  function reset(e) /// CLEARING INFO BOX 
  {
    geojson.resetStyle(e.target);
    displayInfo.update();
  }

  function zoomToCountry(e) {
    mymap.fitBounds(e.target.getBounds());
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlight, //highlight is a func
      mouseout: reset, // reset is a func
      click: zoomToCountry // zoom is a funct 
    });
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //           END  -    MAP    FUNCTIONS 
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




  ////////////////////////////////////////////////////////////////////////////
  //   D3 AND Button AND HTML  control                      /////////////////
  ///////////////////////////////////////////////////////////////////////////

  var button_1 = d3.select(".button_1");
  var button_2 = d3.select(".button_2");
  var button_3 = d3.select(".button_3");
  var world_drop = d3.select(".world_scroll");

  button_1.on("click", function () {
    display_this = 0; //dictates color value thresholds -Hardcoded for now
    // mymap.removeLayer(displayInfo);
    // mymap.removeLayer(legend);
    mymap.removeLayer(displayInfo);

    displayInfo.remove();
    legend.remove();
    mymap.removeLayer(geojson); // clears map
    info_box.clear();
    displayInfo.clear();
    d3.selectAll(".info")
      .remove()
    draw_map(); // draws new map 
    console.log("button_1 clicked");
    clickActions();
  });


  button_2.on("click", function () {

    display_this = 1; //dictates color value thresholds -Hardcoded for now
    displayInfo.remove();
    mymap.removeLayer(displayInfo);
    legend.remove();
    info_box.clear();
    displayInfo.clear();
    d3.selectAll(".info")
      .remove()
    mymap.removeLayer(geojson); // clears map
    draw_map(); // draws new map 
    console.log("button_2 clicked");
    clickActions();
  });

  //  world_drop.on("click", function()      
  world_drop.on("change", function () {
    // if ( world_drop.property("value") == "Inflation"   ){console.log("gov inflation selected");}
    // if ( world_drop.property("value") != "Inflation"   ){console.log("something selected");}
    if (world_drop.property("value") == "World_Rank") {
      display_this = 2;
    }
    if (world_drop.property("value") == "Government_Integrity") {
      display_this = 3;
    }
    if (world_drop.property("value") == "Judical_Effectiveness") {
      display_this = 4;
    }
    if (world_drop.property("value") == "Fiscal_Health") {
      display_this = 5;
    }
    if (world_drop.property("value") == "Inflation") {
      display_this = 6;
    }
    if (world_drop.property("value") == "Public_Debtof_GDP") {
      display_this = 7;
    }
    if (world_drop.property("value") == "Income_Tax_Rate") {
      display_this = 8;
    }
    if (world_drop.property("value") == "Corporate_Tax_Rate") {
      display_this = 9;
    }
    if (world_drop.property("value") == "Unemployment") {
      display_this = 10;
    }
    displayInfo.remove();
    legend.remove();
    info_box.clear();
    d3.selectAll(".info")
      .remove()
    // mymap.removeLayer(geojson); // clears map
    geojson.remove();
    draw_map(); // draws new map 
    console.log(world_drop.property("value"));
    console.log("drop down clicked");
    console.log("display this value is:", display_this);
    clickActions();
  });






  // function fillit(db_data) ///THIS DOESNT WORK TO COLOR MAP BUT DOES BRING IN JSON
  //     {
  //       console.log( "fillit db_data is: ", db_data) ;

  //       for (var d = 0; d < db_data.length; d++) 
  //           {
  //              if (    db_data[d].balance_rank > 175 ) {colorz = '#49006a';}
  //              if (    db_data[d].balance_rank > 150) {colorz = '#7a0177' ;}
  //              if (    db_data[d].balance_rank > 125 ) {colorz = '#ae017e' ;}
  //              if (    db_data[d].balance_rank > 100 ) {colorz =  '#dd3497' ;}
  //              if (    db_data[d].balance_rank > 75 ) {colorz =  '#f768a1' ;}
  //              if (    db_data[d].balance_rank > 50 ) {colorz =  '#fa9fb5' ;}
  //              if (    db_data[d].balance_rank > 25 ) {colorz =  '#fcc5c0' ;}
  //              if (    db_data[d].balance_rank < 10 ) {colorz = '#fde0dd' ;}


  //         var  countrys = (`${db_data[d].country}`+`\xa0`+"leaflet-interactive");
  //            console.log("this is countrys", countrys);
  //         //  console.log( `${db_data[d].country}`);

  //          var   countries = d3.select(`.${countrys}`);
  //             countries.select("fill")
  //            .append("path")
  //            .attr("fill", colorz)
  //            .append("path")
  //            .attr("color", colorz)
  //            .attr("z-index", 2)

  //         // display_this = 2; //dictates color value thresholds -Hardcoded for now
  //         }

  //   }

  // button_3.on("click", function() 
  //     { 
  //         //  var url = `http://127.0.0.1:5000/samples/balrank`;
  //         var url = "/metadata/balrank";
  //         // url =  `/metadata/Germany`
  //         // url = `/names`
  //         console.log("this is the url ", url);
  //         // const dataPromise = d3.json(url);
  //         // console.log("Data Promise: ", dataPromise);

  //         d3.json(url).then(function(response) 
  //             {
  //             //  // my json looks just like this but wont take 
  //             // var url=  `https://api.spacexdata.com/v2/launchpads`;
  //             db_data = response;
  //             console.log("db_data.length", db_data.length);
  //             fillit(db_data);
  //             });
  //   });


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////END OF DRAWMAP FUNCTION WRAP////////////////////////////////////////////////////////// 
} ////////////
/////////////END OF DRAWMAP FUNCTION WRAP////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////
// OPTIONAL WAY OF EXTRACTING COUNTRY NAME
//// IDENTIFYING MAP ELEMENT THAT HAS BEEN CLICKED 
///// EXTRACT COUNTRY NAME FROM CLASS NAME OF PATH ELEMENT

function clickActions() {
  var map_element = d3.selectAll("path");
  console.log("this is button", map_element);

  // This function is triggered when the button is clicked
  function handleClick() {
    console.log("this item was clicked");
    // We can use d3 to see the object that dispatched the event
    console.log("this is event target", d3.event.target);
  }

  // We can use the `on` function in d3 to attach an event to the handler function
  map_element.on("click", handleClick);

  // You can also define the click handler inline
  map_element.on("click", function () {
    element_clicked = d3.event.target;
    // console.log("this is the element clicked", element_clicked);
    // console.log("this is element class", element_clicked.className);
    class_element = element_clicked.className;
    // console.log("this is class names elements " , class_element.baseVal);  
    // example of element target returned
    //SVGAnimatedString {baseVal: "Madagascar leaflet-interactive", animVal: "Madagascar leaflet-interactive"}
    var class_names = class_element.baseVal;
    var class_names_text = class_names.toString();
    //  console.log("this is class name as text " ,class_names_text  );
    var class_split = class_names_text.split(" ");
    // console.log("this is class name split" ,class_split );
    var grab_all_before_this = class_split.length;
    var country_list = class_split.slice(0, (grab_all_before_this - 1));
    var country_name = country_list.join(" ");
    console.log("this should be country name ", country_name);
    // console.log(" " ,  );
  });
}


///////////////////////////////
//CALL CLICK FUNCTIONS 
clickActions();

///////////////////////////////////////////////////////////////////////////////
// INITIALIZER //////////////////////////////////////////////////////////////// 
///////////////////////////////////////////////////////////////////////////////
function init() {
  draw_map();
}

init();

console.log("initialize is ", initialize);
if (initialize == 0) {
  initialize = 1;
}
console.log("initialize is ", initialize);





///////////////////////////////////////////////////////////////////////////////////////////////////
////--- END OF ACTIVE CODE------------////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////











/*



//////////////////////////////////////////////////////////////////
/////---VARIOUS D3 MOUSE CLICK SELECT OBJECT

    var button = d3.select("#click-me");

    // Getting a reference to the input element on the page with the id property set to 'input-field'
    var inputField = d3.select("#input-field");
    
    // This function is triggered when the button is clicked
    function handleClick() 
          {
            console.log("A button was clicked!");
            // We can use d3 to see the object that dispatched the event
            console.log(d3.event.target);
          }
    
    // We can use the `on` function in d3 to attach an event to the handler function
    button.on("click", handleClick);
    
    // You can also define the click handler inline
    button.on("click", function() 
              {
                console.log("Hi, a button was clicked!");
                console.log(d3.event.target);
              });




//////////////////////////////////////////////////////////////////////
//// --VARIOUS TOOL TIPS FROM D3


      // Step 1: Append a div to the body to create tooltips, assign it a class
    // =======================================================
    chartGroup.selectAll("rect")
        .on("mouseover", function() 
                {
                d3.select(this)
                        .attr("fill", "red");
                })

                var toolTip = d3.select("body").append("div")
                .attr("class", "tooltip");
            
              // Step 2: Add an onmouseover event to display a tooltip
              // ========================================================
              circlesGroup.on("mouseover", function(d, i)
                  {
                  toolTip.style("display", "block");
                  toolTip.html(`Pizzas eaten: <strong>${pizzasEatenByMonth[i]}</strong>`)
                      .style("left", d3.event.pageX + "px")
                      .style("top",  d3.event.pageY + "px");
                  })
                // Step 3: Add an onmouseout event to make the tooltip invisible
                .on("mouseout", function() 
                      {
                          toolTip.style("display", "none");
                      });
            }
            

        // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.rockband}<br>Hair length: ${d.hair_length}<br>Hits: ${d.num_hits}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });


      */