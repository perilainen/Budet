'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl',  function($scope) {
  $scope.investeringar =   [
      {
        "id": 0,
        "belopp": 6,
        "antal": 1,
        "beskrivning": "daniel",
        "kategori":"test"
      },
      {
        "id": 1,
        "belopp": 10,
        "antal": 1,
        "beskrivning": "alex",
        "kategori":"test"
      },
      {
        "id": 2,
        "belopp": 2,
        "antal": 1,
        "beskrivning": "samir",
        "kategori":"test"
      },
      {
        "id": 3,
        "belopp": 6,
        "antal": 1,
        "beskrivning": "per",
        "kategori":"test"
      }
    ]

  /*$scope.getInvesteringKategori =function(){
    var kategorier = []
    for (var i = 0;i<$scope.investeringar.length;i++){
      var curr = $scope.investeringar[i]
      var kategori = curr.kategori
      var belopp = curr.belopp
      console.log(kategori in kategorier)
      if (!kategorier.indexOf(kategori)>=0){
        kategorier.push({kategori:belopp})
        //kategorier.push("kategori)
        console.log(kategorier)
      }
      console.log(kategorier)
      kategorier[kategori]+= belopp;
      console.log(kategorier)
    }
    return kategorier
  }*/
  $scope.investeringarKategori = alasql('SELECT kategori, sum(belopp) AS belopp \
FROM ? \
GROUP BY kategori \
ORDER BY bytes DESC',[$scope.investeringar]);
  $scope.getInvesteringKategori = function(){
  var res = alasql('SELECT kategori, sum(belopp*antal) AS belopp \
FROM ? \
GROUP BY kategori \
ORDER BY bytes DESC',[$scope.investeringar]);
    $scope.investeringarKategori=res;
  return res;
  }

  $scope.investeringsfilter =''
  $scope.getTotalInvestering = function(){
    var total =0;
    for (var i=0;i<$scope.investeringar.length;i++){
      total +=$scope.investeringar[i].belopp*$scope.investeringar[i].antal
    }
    console.log(total)
    return total;
  }

  $scope.addInvestering = function(){

    $scope.max = Math.max.apply(Math,$scope.investeringar.map(function(item){return item.id;}));
    $scope.investeringar.push({"id":$scope.max+1,"points":null,"antal":1,"beskrivning":"","kategori":""});

  }
  $scope.sortType     = 'beskrivning'; // set the default sort type
  $scope.sortReverse  = false;  // set the default sort order

  $scope.RemoveInvestering = function(item){
    var index = $scope.investeringar.indexOf(item);
    console.log(index)
    $scope.investeringar.splice(index,1)
  }

  $scope.kostnader = [
      {
        "belopp": 0,
        "points": 6,
        "sign": 6,
        "beskrivning": "daniel"
      }
    ]


  $scope.inkomster = [
      {
        "belopp": 0,
        "points": 6,
        "sign": 6,
        "beskrivning": "daniel"
      }
    ]


});

