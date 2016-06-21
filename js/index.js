(function() {
  angular.module('dashboard', [])

  .controller("weather", ['$scope', '$http', '$interval', function($scope, $http, $interval) {

    function weatherUpdate() {
      // Get the Day
    var days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
    var d = new Date,
        n = d.getDay();
    $scope.forecastDays = [];
    
    // Populate Forecast Scope
    for(var day=1;day<6;day++){
  $scope.forecastDays[0] = days[n];
  $scope.forecastDays[day] = days[n + day];
    }
    $scope.date = new Date;
    
      $http.get("http://api.openweathermap.org/data/2.5/forecast/daily?q=paloalto,us&APPID=1c3673cc09eb008cb08f2075c97393ae&cnt=6").success(function(data) {
        $scope.weather = data;
        $scope.min = [];
        $scope.max = [];
        for(var i in data.list){
          $scope.min[i] = Math.floor(data.list[i].temp.min * 9 / 5 - 459.67);
          $scope.max[i] = Math.floor(data.list[i].temp.max * 9 / 5 - 459.67);
        }
        $scope.temp = Math.floor(data.list[0].temp.day * 9 / 5 - 459.67) + "°F";
      })
    }
    weatherUpdate();
    $interval(function() {
      weatherUpdate();
    }, 120000);

  }])

  .controller("reddit", ['$scope', '$http', '$interval', function($scope, $http, $interval) {

    function redditUpdate() {
      $http.get("https://www.reddit.com/r/earthporn/.json").success(function(data) {
        $scope.reddit = data;
        $scope.photos = data.data.children[0].data.preview.images[0].source.url;
        $scope.title = data.data.children[0].data.title;
      });
    }
    redditUpdate();
    $interval(function() {
      redditUpdate();
    }, 120000);
  }])

  .controller("news", ['$scope', '$http', '$interval', function($scope, $http, $interval) {

    function newsUpdate() {
      $http.get("http://api.nytimes.com/svc/mostpopular/v2/mostviewed/all-sections/1/.json?api-key=da100d8e23d3f94fc1ff6deefe9742ea:2:70699191").success(function(data) {
        $scope.news = data;
      });
    }
    newsUpdate();
    $interval(function() {
      newsUpdate();
    }, 120000);

  }])

  .controller("ethereum", ['$scope', '$http', '$interval', function($scope, $http, $interval) {

    function etherUpdate() {
      $http.get("https://coinmarketcap-nexuist.rhcloud.com/api/eth").success(function(data) {
        $scope.ether = data;
        $scope.supply = (data.supply).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $scope.market_cap = (data.market_cap.usd).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $scope.price = (data.price.usd).toFixed(2);
        $scope.btc = (data.price.btc);
        if (+data.change < 0) {
          $('#change').css('color', 'red');
        }
        if (+data.change > 0) {
          $('#change').css('color', 'green');
        }
      });
    }

    etherUpdate();
    $interval(function() {
      etherUpdate();
    }, 120000);

  }])

  .controller("clock", ['$scope', '$interval', function($scope, $interval) {

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
