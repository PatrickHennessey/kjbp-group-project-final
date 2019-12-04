var geojson;

// Lat/Long for Prague
var lat = 0;
var long = 0;

var mymap = L.map('map').setView([lat, long], 2);


var greyscale = L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=${API_KEY}`, {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
}).addTo(mymap);

geojson = L.geoJson(worldData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(mymap);

// geojson.eachLayer(function (layer) {
//     layer._path.id = feature.properties.postal;
// });

// Legend
var legend = L.control({
    position: 'bottomright'
});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        colors = [15000, 20000, 50000, 100000, 200000, 500000, 1000000],
        labels = [];

    div.innerHTML += '<h4>GDP in Thousands of Millions of USD</h4>';

    // Loops through GDP data and grabs colors for each range and puts them in the legend’s key
    for (var i = 0; i < colors.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(colors[i] + 1) + '"></i>' +
            colors[i] + (colors[i + 1] ? '&ndash;' + colors[i + 1] + '<br>' : '+');

    }

    return div;
};

legend.addTo(mymap);

// On hover control that displays information about hovered upon country
var displayInfo = L.control();

displayInfo.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// Passes properties of hovered upon country and displays it in the control
displayInfo.update = function (props) {

    this._div.innerHTML = '<h2>Wealth of European Countries</h2>' + (props ?
        '<h3>' + props.formal_en + '</h3>' + '<b>' + 'GDP in Trillions of USD: ' + '</b>' + props.gdp_md_est / 1000000 + '<br />' +
        '<b>' + ' GDP in Billions of USD: ' + '</b>' + props.gdp_md_est / 1000 + '<br />' +
        '<b>' + 'Economic Status: ' + '</b>' + props.economy + '<br />' +
        '<p class ="flag">' + flags[0].emoji + '</p>' +
        '<b>' + 'Population: ' + '</b>' + props.pop_est / 1000000 + ' million people' :
        'Hover over a European country');
};

displayInfo.addTo(mymap);

// Happens on mouse hover
function highlight(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#ffd32a'
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    // Updates custom legend on hover
    displayInfo.update(layer.feature.properties);
}

// Happens on mouse out
function reset(e) {
    geojson.resetStyle(e.target);
    // Resets custom legend when user unhovers
    displayInfo.update();
}

function getColor(d) {
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

function flag(d) {

}

console.log(flags[21].emoji)

for (var i = 1; i < flags.length; i++) {
    // console.log(flags[i].emoji);
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.gdp_md_est),
        weight: 1,
        opacity: 1,
        color: 'snow',
        fillOpacity: .5,
        className: feature.properties.name
    };
}

function highlight(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#ffd32a',
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    displayInfo.update(layer.feature.properties);
}

function reset(e) {
    geojson.resetStyle(e.target);
    displayInfo.update();
}

function zoomToCountry(e) {
    mymap.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlight,
        mouseout: reset,
        click: zoomToCountry
    });
}