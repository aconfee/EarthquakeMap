function SearchController($scope){
	var self = this;

	self.getGeoCode = function(name){
		if(name != ''){
			$.getJSON(/mod/gg.php?pc)
		}
	};

	self.createBoundingBox = function(geoCode){

	};

	self.getEarthquakeData = function(boundingBox){

	};

	self.moveToLocation = function(data){

	};

	$scope.queryEarthquakes = function(){
		var cityName = $('#city').val();
		self.getGeoCode(cityName);
	};
}