// Initializer is called immediately and all variables are contained. 
(function MapInitializer(){
	var self = this;

	// Store earthquake location data
	var data = [
		{lat:-40.397, lng:190.644}, 
		{lat:-30.397, lng:160.644}
	];

	// Create and store markers for earthquake
	var markers = [];

	// Access map in multiple functions
	self.map = null;

	self.setPositions = function(){
		for(var i = 0; i < data.length; ++i){
			var marker = new google.maps.Marker({ 
				position: new google.maps.LatLng(data[i].lat, data[i].lng), 
				map: self.map 
			});

			markers.push(marker);
		}
	};

	self.initialize = function(){
		var mapOptions = {
	  		center: new google.maps.LatLng(-34.397, 150.644),
	  		zoom: 5,
	  		mapTypeId: google.maps.MapTypeId.ROADMAP  
		};

		self.map = new google.maps.Map(document.getElementById("map-canvas"), 
			mapOptions);

		self.setPositions();
	};

	self.moveToMarker = function(index){
		self.map.panTo(markers[index].getPosition());
	};

	// Add listener to wait for page load.
	google.maps.event.addDomListener(window, 'load', self.initialize);
}())