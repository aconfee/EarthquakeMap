// Initializer is called immediately and all variables are contained. 
function MapInitializer($scope){
	var self = this;
	$scope.selectedItem = 0;

	// Store earthquake location data
	$scope.data = [
		{name:"thing1", lat:-40.397, lng:190.644, size:10}, 
		{name:"thing2", lat:-30.397, lng:160.644, size:5}, 
		{name:"thing3", lat:-20.397, lng:100.644, size:7}, 
		{name:"thing4", lat:-35.397, lng:120.644, size:8}
	];

	// Create and store markers for earthquake
	var markers = [];

	// Access map in multiple functions
	self.map = null;
	self.geocoder = new google.maps.Geocoder();

	self.setPositions = function(){
		for(var i = 0; i < $scope.data.length; ++i){
			var marker = new google.maps.Marker({ 
				position: new google.maps.LatLng($scope.data[i].lat, $scope.data[i].lng), 
				map: self.map 
			});

			markers.push(marker);
		}
	};

	self.initialize = function(){
		var mapOptions = {
	  		center: new google.maps.LatLng($scope.data[0].lat, $scope.data[0].lng),
	  		zoom: 5,
	  		mapTypeId: google.maps.MapTypeId.ROADMAP  
		};

		self.map = new google.maps.Map(document.getElementById("map-canvas"), 
			mapOptions);

		self.setPositions();
	};

	$scope.moveToMarker = function($index){
		self.map.panTo(markers[$index].getPosition());
		$scope.selectedItem = $index;
	};


	$scope.search = function(){
		var address = $('#city').val();
		self.geocoder.geocode( { 'address': address}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {

	    	// Place map center at city
		    self.map.setCenter(results[0].geometry.location);

		    // // Place markers for earthquakes in area
		    var lat = results[0].geometry.location.lat();
		    var lng = results[0].geometry.location.lng();

		    var n = lat + 1;
		    var s = lat - 1;
		    var e = lng + 1;
		    var w = lng - 1;
		    var earthquakeData;

		    var data =jeoquery.getGeoNames('earthquakes', {north: n.toString(),
		    										south: s.toString(),
		    										east: e.toString(),
		    										west: w.toString()
		    									}, function(data){
		    										earthquakeData = JSON.parse(JSON.stringify(data));
		    										console.log(earthquakeData);

		    										for(var i = 0; i < 10; ++i)
		    										{
		    											var newMark = new google.maps.Marker({ 
															position: new google.maps.LatLng(earthquakeData['earthquakes'][i]['lat'], earthquakeData['earthquakes'][i]['lng']), 
															map: self.map 
														});

														//console.log(earthquakeData[i].lat);
														//console.log(newMark);

														markers.push(newMark);
														//console.log(markers);
		    										}

		    										for (var i = 0; i < markers.length; i++) {
													    markers[i].setMap(self.map);
													    //console.log(markers);
													}
		    									});

	    } else {
	        alert('Geocode was not successful for the following reason: ' + status);
	    }
	  });
	}

	// Add listener to wait for page load.
	google.maps.event.addDomListener(window, 'load', self.initialize);
}