(function() {
  angular.module('dashboard', [])

  .controller("weather", ['$scope', '$http', function($scope, $http) {
    $scope.weather,
      $scope.time,
      $scope.temp,
      $scope.min,
      $scope.max,
      $scope.min2,
      $scope.max2,
      $scope.min3,
      $scope.max3,
      $scope.min4,
      $scope.max4,
      $scope.min5,
      $scope.max5,
      $scope.min6,
      $scope.max6;

    // Get the Day
    var days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
    var d = new Date;
    var n = d.getDay();

    $scope.day = days[n];
    $scope.date = new Date;
    $scope.forecastDay1 = days[n + 1];
    $scope.forecastDay2 = days[n + 2];
    $scope.forecastDay3 = days[n + 3];
    $scope.forecastDay4 = days[n + 4];
    $scope.forecastDay5 = days[n + 5];
    $http.get("http://api.openweathermap.org/data/2.5/forecast/daily?q=paloalto,us&APPID=1c3673cc09eb008cb08f2075c97393ae&cnt=6").success(function(data) {
      $scope.weather = data;
      $scope.temp = Math.floor(data.list[0].temp.day * 9 / 5 - 459.67) + "°F";
      $scope.min = Math.floor(data.list[0].temp.min * 9 / 5 - 459.67);
      $scope.max = Math.floor(data.list[0].temp.max * 9 / 5 - 459.67);
      $scope.min2 = Math.floor(data.list[1].temp.min * 9 / 5 - 459.67);
      $scope.max2 = Math.floor(data.list[1].temp.max * 9 / 5 - 459.67);
      $scope.min3 = Math.floor(data.list[2].temp.min * 9 / 5 - 459.67);
      $scope.max3 = Math.floor(data.list[2].temp.max * 9 / 5 - 459.67);
      $scope.min4 = Math.floor(data.list[3].temp.min * 9 / 5 - 459.67);
      $scope.max4 = Math.floor(data.list[3].temp.max * 9 / 5 - 459.67);
      $scope.min5 = Math.floor(data.list[4].temp.min * 9 / 5 - 459.67);
      $scope.max5 = Math.floor(data.list[4].temp.max * 9 / 5 - 459.67);
      $scope.min6 = Math.floor(data.list[5].temp.min * 9 / 5 - 459.67);
      $scope.max6 = Math.floor(data.list[5].temp.max * 9 / 5 - 459.67);
    })

  }])

  .controller("reddit", ['$scope', '$http', function($scope, $http) {
    $scope.photos;
    $scope.reddit;
    $scope.title;
    $http.get("https://www.reddit.com/r/earthporn/.json").success(function(data) {
      $scope.reddit = data;
      $scope.photos = data.data.children[0].data.preview.images[0].source.url;
      $scope.title = data.data.children[0].data.title;
    });

  }])

  .controller("news", ['$scope', '$http', function($scope, $http) {
    $scope.news;
    $http.get("http://api.nytimes.com/svc/mostpopular/v2/mostviewed/all-sections/1/.json?api-key=da100d8e23d3f94fc1ff6deefe9742ea:2:70699191").success(function(data) {
      $scope.news = data;
    });
  }])

  .controller("ethereum", ['$scope', '$http', '$interval', function($scope, $http, $interval) {
    $scope.ether;
    
function etherUpdate(){
 $http.get("https://coinmarketcap-nexuist.rhcloud.com/api/eth").success(function(data) {
      $scope.ether = data;
   $scope.supply = (data.supply).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      $scope.market_cap = (data.market_cap.usd).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   $scope.price = (data.price.usd).toFixed(2);
   $scope.btc = (data.price.btc);
   if(+data.change < 0){
     $('#change').css('color', 'red');
   }
   if(+data.change > 0){
      $('#change').css('color', 'green');
   }
    }); }
    
    etherUpdate();
    $interval(function() { etherUpdate();}, 120000);

  }])

  .controller("clock", ['$scope', '$interval', function($scope, $interval) {
    $scope.time;

    function updateTime() {
      var currentDate = new Date(),
        realTime,
        currentSec = currentDate.getSeconds(),
        currentMillisec = currentDate.getMilliseconds(),
        currentMin = currentDate.getMinutes(),
        currentHr = currentDate.getHours();
      if (currentHr == 00) { //if midnight (00 hours) hour = 12
        currentHr = 12;
      } else if (currentHr >= 13) { //convert military hours at and over 1300 (1pm) to regular hours by subtracting 12. 
        currentHr -= 12;
      }
      if (currentMin < 10) {
        currentMin = "0" + currentMin;
      }
      if (currentDate.getHours() > 18) {
        $('#day').css('display', 'none');
        $('#night').css('display', 'block');
      }
      if (currentDate.getHours() >= 18 || currentDate.getHours() <= 5) {
        $('#day').css('display', 'none');
        $('#night').css('display', 'block');
      } else {
        $('#day').css('display', 'block');
        $('#night').css('display', 'none');
      }
      if (currentDate.getHours() < 12) {
        realTime = currentHr + ':' + currentMin + " AM";
      } else {
        realTime = currentHr + ':' + currentMin + " PM";
      }
      return realTime;
    }
   $interval(function() {
        $scope.time = updateTime();
    }, 1000);
  }])

})();
