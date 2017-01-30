var map;
var markers = [];

function initMap() {
  var uluru = {lat: 0, lng: 0};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: uluru,
    disableDefaultUI: true,
    styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
  });
}

var year;
function loadData(element) {

  removeAllMarkers();
  var previousElement = $('#'+year);
  $(previousElement).removeClass('active active' + year);

  year = element.id;

  var script = document.createElement('script');
  var url = 'http://scottbossak.com/52places/' + year + '.geojson'
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
  $(element).addClass('active active' + year);
}

function removeAllMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

function colorForYear(year) {
  var color;
  switch (year) {
    case "2012":
      color = "#2ecc71";
      break;
    case "2013":
      color = "#f1c40f";
      break;
    case "2014":
      color = "#e67e22";
      break;
    case "2015":
      color = "#e74c3c";
      break;
    case "2016":
      color = "#9b59b6";
      break;
    case "2017":
      color = "#3498db";
      break;
    default:
  }
  return color
}

function urlFor(year, slug) {
  var url;
  switch (year) {
    case "2012":
      url = "http://www.nytimes.com/2012/01/08/travel/45-places-to-go-in-2012.html";
      break;
    case "2013":
      url = "http://www.nytimes.com/interactive/2013/01/10/travel/2013-places-to-go.html";
      break;
    case "2014":
      url = "https://www.nytimes.com/interactive/2014/01/10/travel/2014-places-to-go.html#/?placeId=" + slug;
      break;
    case "2015":
      url = "http://www.nytimes.com/interactive/2015/01/11/travel/52-places-to-go-in-2015.html?placeId=" + slug;
      break;
    case "2016":
      url = "http://www.nytimes.com/interactive/2016/01/07/travel/places-to-visit.html?place=" + slug
      break;
    case "2017":
      url = "https://www.nytimes.com/interactive/2017/travel/places-to-visit.html?place=" + slug;
      break;
    default:
  }
  return url;
}

window.eqfeed_callback = function(results) {

  // Show markers
  $('#locationsList').empty();
  for (var i = 0; i < results.features.length; i++) {

    var feature = results.features[i];
    var title = feature.properties.rank + ": "  + feature.properties.name;

    // Populate list
    $('#locations_list').append("<li class=\"locationListItem\"><a>"+feature.properties.name+"</a></li>");

    var coords = feature.geometry.coordinates;
    var latLng = new google.maps.LatLng(coords[1], coords[0]);

    // Create marekr
    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: title,
      slug: feature.properties.slug,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
        fillColor: colorForYear(year),
        fillOpacity: 1,
        strokeWeight: 0
      }
    })

    // Create info window
    var infoWindow = new google.maps.InfoWindow({ });
    marker.addListener('click', function() {
      infoWindow.close();
      var content = "<a href=\"" + urlFor(year, this.slug) + "\">" + this.title + "</a>"
      infoWindow.setContent(content);
      infoWindow.open(map, this);
    });
    markers.push(marker);
  }

  var listItems = document.getElementsByClassName("locationListItem");
  Array.prototype.forEach.call(listItems, function(el) {
    el.remove
    el.addEventListener("click", function(){listItemSelected(el)}, false);
  });

}

// Creating navigation
var elements = document.getElementsByClassName("year_link");
Array.prototype.forEach.call(elements, function(el) {
  el.removeEventListener("click", function(){loadData(el)}, false);
  el.addEventListener("click", function(){loadData(el)}, false);
});

loadData(elements[elements.length - 1]);

function listItemSelected(element) {
  var listItems = $(".locationListItem").get();
  var index = listItems.indexOf(element);
  var marker = markers[index];
  google.maps.event.trigger(marker, 'click');
  map.panTo(marker.getPosition());
}
