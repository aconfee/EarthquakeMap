// Initializer is called immediately and all variables are contained. 
function MapInitializer($scope){
	var self = this;
	$scope.selectedItem = 0;

	// Store earthquake location data
	$scope.topTenData = [];

	// Create and store markers for earthquake
	var markers = [];
	var topTenMarkers = [];

	// Use one infowindow for map.
	self.infoWindow = new google.maps.InfoWindow({
		content:"default"
	});

	// Access map in multiple functions
	self.map = null;
	self.geocoder = new google.maps.Geocoder();

	self.initializeTopTen = function(){
		var data = self.getEarthquakes({
	    	north: '90',
			south: '-90',
			east: '180',
			west: '-180'
		}, function(data){
			self.placeTopTenMarkersCallback(data);
			var earthquakeData = JSON.parse(JSON.stringify(data));
			var length = earthquakeData['earthquakes'].length;
			for(var i = 0; i < 10; ++i){
				$scope.topTenData.push({lat:earthquakeData['earthquakes'][i]['lat'], 
					lng:earthquakeData['earthquakes'][i]['lng'], 
					size:earthquakeData['earthquakes'][i]['magnitude']})
			}

			$scope.$apply();
		});
	};

	self.placeTopTenMarkersCallback = function(data){
		var earthquakeData = JSON.parse(JSON.stringify(data));

		// Clear old markers and set new ones with updated info.
		for(var i = 0; i < 10; ++i)
		{
			// Create markers for locations
			self.setMarker(new google.maps.LatLng(earthquakeData['earthquakes'][i]['lat'], earthquakeData['earthquakes'][i]['lng']),
				"<h3>INFO</h3>" +
				"<p>Magnitude: " + earthquakeData['earthquakes'][i]['magnitude'] + "</p>" +
				"<p>Depth: " + earthquakeData['earthquakes'][i]['depth'] + "</p>" +
				"<p>Source: " + earthquakeData['earthquakes'][i]['src'] + "</p>" +
				"<p>ID: " + earthquakeData['earthquakes'][i]['eqid'] + "</p>" +
				"<p>Time: " + earthquakeData['earthquakes'][i]['datetime'] + "</p>",
				topTenMarkers);

			// Set marker on map
			topTenMarkers[i].setMap(self.map);

			// Attach an info window to each marker
			google.maps.event.addListener(topTenMarkers[i], 'click', function() {
					self.infoWindow.setContent(this.title);
			    	self.infoWindow.open(self.map, this);
		  	});
		}
	};

	self.initialize = function(){
		var mapOptions = {
	  		center: new google.maps.LatLng(47.53, 122.30),
	  		zoom: 5,
	  		mapTypeId: google.maps.MapTypeId.ROADMAP  
		};

		self.map = new google.maps.Map(document.getElementById("map-canvas"), 
			mapOptions);

		self.initializeTopTen();
	};

	$scope.moveToMarker = function($index){
		self.map.panTo(topTenMarkers[$index].getPosition());
		$scope.selectedItem = $index;
	};

	self.clearMarkers = function(){
		// Clear old markers.
		for (var i = 0; i < markers.length; i++) {
		    markers[i].setMap(null);
		}
		markers = [];
	};

	self.setMarker = function(location, title, markerList){
		var newMark = new google.maps.Marker({ 
			position: location, 
			map: self.map,
			title: title
		});

		markerList.push(newMark);
	};

	self.getEarthquakes = function(data, callback) {
      var deferred = $.Deferred();
      // TODO: validate method(exists), and params
        $.ajax({
            url: 'http://api.geonames.org/earthquakesJSON',
            dataType: 'jsonp',
            data: $.extend({}, {userName: 'aconfee', lang: 'en'}, data),
            success: function(data) {
              deferred.resolve(data);
              if(!!callback) callback(data);
            },
            error: function (xhr, textStatus) {
              deferred.reject(xhr, textStatus);
              alert('Ooops, geonames server returned: ' + textStatus);
            }
        });
        return deferred.promise();
    };

    self.placeEarthquakeMarkersCallback = function(data){
    	var earthquakeData = JSON.parse(JSON.stringify(data));
		var length = earthquakeData['earthquakes'].length;

		// Error check
		if(length === 0) window.alert("No earthquakes near " + address);

		// Clear old markers and set new ones with updated info.
		self.clearMarkers();
		for(var i = 0; i < length; ++i)
		{
			// Create markers for locations
			self.setMarker(new google.maps.LatLng(earthquakeData['earthquakes'][i]['lat'], earthquakeData['earthquakes'][i]['lng']),
				"<h3>INFO</h3>" +
				"<p>Magnitude: " + earthquakeData['earthquakes'][i]['magnitude'] + "</p>" +
				"<p>Depth: " + earthquakeData['earthquakes'][i]['depth'] + "</p>" +
				"<p>Source: " + earthquakeData['earthquakes'][i]['src'] + "</p>" +
				"<p>ID: " + earthquakeData['earthquakes'][i]['eqid'] + "</p>" +
				"<p>Time: " + earthquakeData['earthquakes'][i]['datetime'] + "</p>",
				markers);

			// Set marker on map
			markers[i].setMap(self.map);

			// Attach an info window to each marker
			google.maps.event.addListener(markers[i], 'click', function() {
					self.infoWindow.setContent(this.title);
			    	self.infoWindow.open(self.map, this);
		  	});
		}
    };

	$scope.searchEarthquakes = function(){
		var address = $('#city').val();
		self.geocoder.geocode( { 'address': address}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {

	    	// Place map center at city
		    self.map.setCenter(results[0].geometry.location);

		    // // Place markers for earthquakes in area
		    var lat = results[0].geometry.location.lat();
		    var lng = results[0].geometry.location.lng();
		    var boundingBoxOffset = 2;

		    var data = self.getEarthquakes({
		    	north: (lat + boundingBoxOffset).toString(),
				south: (lat - boundingBoxOffset).toString(),
				east: (lng + boundingBoxOffset).toString(),
				west: (lng - boundingBoxOffset).toString()
			}, function(data){
				self.placeEarthquakeMarkersCallback(data);
			});

	    } else {
	        alert('Geocode was not successful for the following reason: ' + status);
	    }
	  });
	};

	// Add listener to wait for page load.
	google.maps.event.addDomListener(window, 'load', self.initialize);
}