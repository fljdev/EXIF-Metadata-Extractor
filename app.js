var app = angular.module('app', ['angularReverseGeocode']);

app.controller('Ctrl',  function($scope) {

  $scope.inputChange = function(e) {

    file = e.files[0];
    EXIF.getData(file, function() {
      //alert(EXIF.pretty(this));
      $scope.lat = EXIF.getTag(this, "GPSLatitude");
      $scope.latRef = EXIF.getTag(this, "GPSLatitudeRef");
      $scope.lon = EXIF.getTag(this, "GPSLongitude");
      $scope.lonRef = EXIF.getTag(this, "GPSLongitudeRef");
      $scope.dateTaken = EXIF.getTag(this, "DateTimeOriginal");
      $scope.make = EXIF.getTag(this, "Make");
      $scope.model = EXIF.getTag(this, "Model");
      $scope.phoneDetails = ($scope.make + " "+ $scope.model);

   $scope.latDec=($scope.lat[0] + ($scope.lat[1]/60) + ($scope.lat[2]/3600));
   $scope.lonDec=(  $scope.lon[0] + (  $scope.lon[1]/60) + (  $scope.lon[2]/3600));

    if($scope.latRef==='S'){
       $scope.latDec *= -1;
    }
    if($scope.lonRef==='W'){
       $scope.lonDec *=-1;
    }

    $scope.$apply();
  });
  };
});


(function () {
    angular.module('angularReverseGeocode', [])
    .directive('reverseGeocode', function () {
        return {
            restrict: 'E',
            template: '<div></div>',
            link: function (scope, element, attrs) {

                function updateLocation(scope, element, attrs) {
                  var geocoder = new google.maps.Geocoder();
                  var latlng = new google.maps.LatLng(scope.latDec, scope.lonDec);
                  geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                      if (status == google.maps.GeocoderStatus.OK) {
                          if (results[0]) {
                              la = scope.latDec;
                              lo = scope.lonDec;
                              address = results[0].formatted_address;
                              element.text(results[0].formatted_address);
                              addressStringer();
                              fillFields();

                          } else {
                              element.text('Location not found');
                          }
                      } else {
                          // element.text('Geocoder failed due to: ' + status);
                          element.text('');
                      }
                  });
                }

                scope.$watchCollection('[latDec,lonDec]', function(){
                  updateLocation(scope, element, attrs);
                });
            },
            replace: true
        };
    });
})();

function addressStringer(){
  res = address.split(',');
  addressLine1 = res[0].trim();
  city = res[1].trim();
  country = res[3].trim();
  stateZip = res[2];
  zipStripped = stateZip.split(' ');
  state = zipStripped[1];
  zip = zipStripped[2];
}

function fillFields(){
    document.getElementById('address1').value = addressLine1;
    document.getElementById('address1').readOnly = true;
    document.getElementById('city').value = city;
    document.getElementById('city').readOnly = true;
    document.getElementById('zip').value = zip;
    document.getElementById('zip').readOnly = true;
    document.getElementById('state').value = state;
    document.getElementById('state').readOnly = true;
    initMap();
}

function initFields(){
  document.getElementById('address1').readOnly = true;
  document.getElementById('city').readOnly = true;
  document.getElementById('zip').readOnly = true;
  document.getElementById('state').readOnly = true;
}

function initMap() {
    var map;
    var myLatLng = {lat: la, lng: lo};

    map = new google.maps.Map(document.getElementById('map'), {
      center: myLatLng,
      zoom: 14
     //mapTypeId: google.maps.MapTypeId.HYBRID
    });

   var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      title: 'Scene of accident!'
   });

   confirmationDelay();

  }

function confirmationDelay (){
  myVar = setTimeout(confirmation, 5500);
}

function checkForm(){
  a = document.getElementById('address1').value;
  c = document.getElementById('city').value;
  z = document.getElementById('zip').value;
  s = document.getElementById('state').value;
  if(a ==""||c==""||z==""||s==""){
    alert("No Blank Fields allowed, please fix!");
  }else{
    verification();
  }
}

function verification(){

 if(imageData){
   alert("The location of your loss has been added to your file"+"\n\n"+
         "Address: "+addressLine1+"\n"+
         "City   : "+city+"\n"+
         "Zip    : "+zip+"\n"+
         "State  : "+state);
 }else{
   var add = document.getElementById('address1').value;
   var cit = document.getElementById('city').value;
   var zi = document.getElementById('zip').value;
   var stat = document.getElementById('state').value;

   alert("The location of your loss has been added to your file"+"\n\n"+
         "Address: "+add+"\n"+
         "City   : "+cit+"\n"+
         "Zip    : "+zi+"\n"+
         "State  : "+stat);
  }

}

function waitForAllFields(){
  document.getElementById("mySubmit").disabled = false;
}
  function confirmation(){
    document.getElementById("mySubmit").disabled = true;
    var txt;
    var r = confirm("Does this look like the correct address?");
    if (r == true) {
        alert("Excellent, your claim is ready to be submitted!");
        document.getElementById("mySubmit").disabled = false;
        imageData = true;
    } else {
        alert("Ok, please update all fields!");
        document.getElementById('address1').value = "";
        document.getElementById('address1').readOnly = false;
        document.getElementById('city').value = "";
        document.getElementById('city').readOnly = false;
        document.getElementById('zip').value = "";
        document.getElementById('zip').readOnly = false;
        document.getElementById('state').value = "";
        document.getElementById('state').readOnly = false;

        imageData = false;

        waitForAllFields();
    }
    document.getElementById("demo").innerHTML = txt;
  }

  function disableSubmit(){
      document.getElementById("mySubmit").disabled = true;
  }
