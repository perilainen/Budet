'use strict';

angular.module('myApp.view1', ['ngRoute', 'ngStorage','ng-fusioncharts','chart.js','ngDialog'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl',  function($scope, $localStorage,ngDialog,$http) {



  $scope.investeringar = 
  [
      {
        "id": 0,
        "belopp": 6000000,
        "antal": 1,
        "beskrivning": "tomt",
        "kategori":"byggnad",
        "years":50
        
      },
      {
        "id": 1,
        "belopp": 2000000,
        "antal": 1,
        "beskrivning": "hus",
        "kategori":"byggnad",
        "years":25
      },
      {
        "id": 2,
        "belopp": 10000,
        "antal": 2,
        "beskrivning": "dator",
        "kategori":"inventarier",
        "years":2
      },
      {
        "id": 3,
        "belopp": 150000,
        "antal": 1,
        "beskrivning": "bil",
        "kategori":"fordon",
        "years":5
      }
    ]

    $scope.inkomster = 
    [{
      "id":0,
      "belopp":7,
      "antal":1,
      "beskrivning": "besk1",
      "kategori": "kat1",
      "kostnad":0


    }

    ]
$scope.utgifter = 
    [{
      "id":0,
      "belopp":7,
      "antal":1,
      "beskrivning": "besk1",
      "kategori": "kat1"
    } 
    ]
    $scope.calcTotal = function(objekt){
    return objekt.antal*objekt.belopp;
  }

  $scope.createBudgetJson = function(){
    var obj = {
      "name":$scope.budgetNamn,
      "utgifter": $scope.utgifter,
              "inkomster": $scope.inkomster,
              "investeringar": $scope.investeringar

  };
console.log(obj);
  $http({
    method: 'PUT',
    url: '/api/saveBudget?user='+$scope.loggedInUser,//+'&jsonstring='+angular.toJson(obj),
    data:angular.toJson(obj),
    headers: {'Content-Type': 'application/json'}
  })
  }
$scope.userBudgets = [];
  $scope.loadBudgets = function(){
     $http({
      method: 'GET',
      url: '/api/budgets/'+$scope.loggedInUser
    }).then (function succesCallback(response){

      console.log(response.data)

      $scope.userBudgets = response.data;
    
    });

     console.log($scope.userBudgets)
    }

  $scope.checkBudgetsExist = function(){
    if ($scope.userBudgets.length>0){
      return false
    }
    else{
      return true
    }
  }    
    
  $scope.loadBudgetJson = function(){
    console.log("LAddar budget");
    ngDialog.open({template: 'view1/loadBudget.html', className: 'ngdialog-theme-default',
                  scope:$scope})

  };
  $scope.budgetNamn = "";
  
  $scope.deleteBudget = function(data){
    $http({
      method: 'DELETE',
      url: '/api/deleteBudget?user='+$scope.loggedInUser+'&objectid='+data.Objectid
    })
    $scope.loadBudgets();
  }

  $scope.loadToBudget = function(data){

    $http({
      method: 'GET',
      url: '/api/getBudget?user='+$scope.loggedInUser+'&budget='+data.Objectid
    }).then (function succesCallback(response){
      $scope.utgifter = response.data.utgifter;
    $scope.inkomster = response.data.inkomster;
    $scope.investeringar = response.data.investeringar;
    $scope.objectId = data.Objectid;
    console.log($scope.utgifter)
    console.log($scope.inkomster)
    console.log($scope.investeringar)
    })
    
  }
  
  $scope.logIn = function(){
    ngDialog.open({template: 'view1/login.html', className: 'ngdialog-theme-default',
                  scope:$scope})
  }
  $scope.login = function(){
    console.log("test")
    $scope.loggedInUser = this.text;
    $scope.loadBudgets();
  }
  
  $scope.calcPerYear = function(object){
    return object.belopp/object.years;
  }

  $scope.years = 10;

  $scope.getInvesteringarPerYear = function(){
    var values=[[]];
    var labels = [];

    for (var i=0;i<$scope.years+1;i++){
      var value = 0;
      var label = i;
      for (var ii = 0;ii<$scope.investeringar.length;ii++){
        if ($scope.investeringar[ii].years>=i){
          value = value + $scope.investeringar[ii].belopp/$scope.investeringar[ii].years;
        }

      }
      values[0].push(value);
      labels.push(label);

        
    }
    $scope.investeringaryearsvalues = values;
    $scope.investeringaryearslabels = labels;

  }
  $scope.investeringaryearsvalues = [];
  $scope.investeringaryearslabels =[];
  $scope.getInvesteringarPerYear();
  

  $scope.getDataSourceInvestering = function(){
    var values = [[]];

    var labels = [];
    for (var i = 0;i<$scope.investeringarKategori.length;i++){
      var label = $scope.investeringarKategori[i].kategori;
      var value = $scope.investeringarKategori[i].belopp;
     labels.push(label)
      values[0].push(value)
    }
    $scope.investeringLabel = labels;
    $scope.investeringvalue = values;    
  }

  $scope.getInvesteringKategori = function(){
  var res = alasql('SELECT kategori, sum(belopp*antal) AS belopp \
    FROM ? \
    GROUP BY kategori \
    ORDER BY bytes DESC',[$scope.investeringar]);
    $scope.investeringarKategori=res; 
  }


  $scope.investeringLabel=[];
  $scope.investeringvalue = [];
  
  
  $scope.getInvesteringKategori()
  $scope.getDataSourceInvestering()  
  $scope.investeringarKategori;



$scope.getDataSourceInkomst = function(){
    var values = [[]];
    var labels = [];
    for (var i = 0;i<$scope.inkomsterKategori.length;i++){
      var label = $scope.inkomsterKategori[i].kategori;
      var value = $scope.inkomsterKategori[i].belopp;
     labels.push(label)
      values[0].push(value)
    }
    $scope.inkomstLabel = labels;
    $scope.inkomstvalue = values;    
  }

  $scope.getInkomstKategori = function(){
  var res = alasql('SELECT kategori, sum(belopp*antal) AS belopp \
    FROM ? \
    GROUP BY kategori \
    ORDER BY bytes DESC',[$scope.inkomster]);
    $scope.inkomsterKategori=res; 
  }


  $scope.inkomstLabel=[];
  $scope.inkomstvalue = [];
  $scope.getInkomstKategori()
  $scope.getDataSourceInkomst()  
  $scope.inkomsterKategori;

$scope.getDataSourceKostnad = function(){
    var values = [[]];
    var labels = [];
    for (var i = 0;i<$scope.kostnaderKategori.length;i++){
      var label = $scope.kostnaderKategori[i].kategori;
      var value = $scope.kostnaderKategori[i].belopp;
     labels.push(label)
      values[0].push(value)
    }
    $scope.kostnadLabel = labels;
    $scope.kostnadvalue = values;    
  }

  $scope.getKostnadKategori = function(){
  var res = alasql('SELECT kategori, sum(belopp*antal) AS belopp \
    FROM ? \
    GROUP BY kategori \
    ORDER BY bytes DESC',[$scope.utgifter]);
    $scope.kostnaderKategori=res; 
  }


  $scope.kostnadLabel=[];
  $scope.kostnadvalue = [];
  $scope.getKostnadKategori()
  $scope.getDataSourceKostnad()  
  $scope.kostnaderKategori;



  $scope.inkomstfilter=''
  $scope.utgiftfilter=''
  $scope.investeringsfilter =''
  $scope.getTotalInvestering = function(){
    var total =0;
    for (var i=0;i<$scope.investeringar.length;i++){
      total +=$scope.investeringar[i].belopp*$scope.investeringar[i].antal
    }
    return total;
  }

  $scope.getTotalKostnad = function(){
    var total =0;
    for (var i=0;i<$scope.utgifter.length;i++){
      total +=$scope.utgifter[i].belopp*$scope.utgifter[i].antal
    }
    return total;
  }
$scope.getTotalInkomst = function(){
    var total =0;
    for (var i=0;i<$scope.inkomster.length;i++){
      total +=$scope.inkomster[i].belopp*$scope.inkomster[i].antal-$scope.inkomster[i].belopp*$scope.inkomster[i].antal*$scope.inkomster[i].kostnad/100;
    }
    return total;
  }


  $scope.expandInvesteringKategori = false;

  $scope.addInvestering = function(){

    $scope.max = Math.max.apply(Math,$scope.investeringar.map(function(item){return item.id;}));
    $scope.investeringar.push({"id":$scope.max+1,"points":null,"antal":1,"beskrivning":"","kategori":""});

  }
$scope.addInkomst = function(){

    $scope.max = Math.max.apply(Math,$scope.inkomster.map(function(item){return item.id;}));
    $scope.inkomster.push({"id":$scope.max+1,"points":null,"antal":1,"beskrivning":"","kategori":""});
  }

  $scope.addKostnad = function(){

    $scope.max = Math.max.apply(Math,$scope.utgifter.map(function(item){return item.id;}));
    $scope.utgifter.push({"id":$scope.max+1,"points":null,"antal":1,"beskrivning":"","kategori":""});

  }

  $scope.sortType     = 'beskrivning'; // set the default sort type
  $scope.sortReverse  = false;  // set the default sort order

  $scope.sortTypeKostnad = 'beskrivning';
  $scope.sortTypeKostnadReverse = false;

  $scope.sortTypeInkomst = 'beskrivning';
  $scope.sortTypeInkomstReverse = false;

  $scope.RemoveInvestering = function(item){
    var index = $scope.investeringar.indexOf(item);
    console.log(index)
    $scope.investeringar.splice(index,1)
  }
$scope.RemoveKostnad = function(item){
    var index = $scope.utgifter.indexOf(item);
    console.log(index)
    $scope.utgifter.splice(index,1)
  }
  $scope.RemoveInkomst = function(item){
    var index = $scope.inkomster.indexOf(item);
    console.log(index)
    $scope.inkomster.splice(index,1)
  }


});

