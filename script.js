var map;
var request;
var infowindow;
var service;
var markers = [];

function initalize() {
     var location = new google.maps.LatLng(37.789159, -122.395882);

     map = new google.maps.Map(document.getElementById('map'), {
          center: location,
          zoom: 15
     });

     request = {
          location: location,
          radius: 500,
          types: ['food', 'restaurant']
     };

     infowindow = new google.maps.InfoWindow();

     service = new google.maps.places.PlacesService(map);
     //service.nearbySearch(request, callback);

     map.addListener('rightclick', function(event) {
          map.setCenter(event.latLng);
          clearResults(markers);

          var request = {
               location: event.latLng,
               radius: 100,
               types: ['food', 'restaurant']
          };
          service.nearbySearch(request, callback);
     });

     var input = document.getElementById('location');
     var spin = document.getElementById('spinner');

     var autocomplete = new google.maps.places.Autocomplete(input);

     //autocomplete.addListener('place_changed', auto);

     spin.addEventListener('click', function() {
          if(input.value == '') {
               alert('empty');
          } else {
               infowindow.close();
               clearResults(markers);
               var inputLocation = autocomplete.getPlace();

               var request = {
                    location: inputLocation.geometry.location,
                    radius: 300,
                    types: ['food', 'restaurant']
               };
               service.nearbySearch(request, callback);
          }
          //alert(inputLocation.geometry.location);
     });
}

function callback(results, status) {
     if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
               if(results[i].name.includes("Coffee") || results[i].name.includes("Cafe") || results[i].name.includes("Starbucks")) {
                    delete results[i];
               }
          }

          results = results.filter(function(element) {
               return element !== undefined;
          });

          var rand = Math.floor(Math.random()*results.length);
          markers.push(createMarker(results[rand]));
     }
}

function auto() {
     infowindow.close();
     clearResults(markers);
     var place = this.getPlace();
     if (!place.geometry) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          window.alert("No details available for input: '" + place.name + "'");
          return;
     }

     // If the place has a geometry, then present it on a map.
     // if (place.geometry.viewport) {
     //      map.fitBounds(place.geometry.viewport);
     // } else {
     //      map.setCenter(place.geometry.location);
     //      map.setZoom(17);  // Why 17? Because it looks good.
     // }

     var request = {
          location: place.geometry.location,
          radius: 100,
          types: ['food', 'restaurant']
     };
     //service.nearbySearch(request, callback);
     //marker.setPosition(place.geometry.location);
     //marker.setVisible(true);

     var address = '';
     // if (place.address_components) {
     //      address = [
     //           (place.address_components[0] && place.address_components[0].short_name || ''),
     //           (place.address_components[1] && place.address_components[1].short_name || ''),
     //           (place.address_components[2] && place.address_components[2].short_name || '')
     //      ].join(' ');
     // }
}

function createMarker(place) {
     var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
     });

     if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
     } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
     }

     infowindow.setContent(place.name);
     infowindow.open(map, marker);

     marker.addListener('click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, marker);
     });
     return marker;
}

function clearResults(markers) {
     for (var m in markers) {
          markers[m].setMap(null);
     }
     markers = [];
}




//google.maps.event.addDomListener(window, 'load', initalize);

//$(document).ready(start);
