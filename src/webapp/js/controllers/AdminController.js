app.controller('AdminController', function ($scope, $http, $sce, $interval, $timeout) {

    $scope.users = [];
    $scope.info = '';
    $scope.addNewUser = false;
    $scope.google = false;
    $scope.stocksShow = false;
    $scope.dash =false;
    $scope.stocks = [];
    $scope.dashButtons = [];
    $scope.dashShow = true;
    $scope.gmail = ''
    $scope.removeUser = function () {
        $http({method: 'post', url: '/removeUser', data: {username: $scope.user}}).success(function () {
            $scope.returnUsers();
        })
    }
    $scope.removeStock = function(i) {
        $scope.stocks.splice(i,1);
        $scope.writeStocks()
    }
    $scope.removeButton = function(i){
        $scope.dashButtons.splice(i,1);
        $scope.writeButtons()
    }
    $scope.removeLight = function(i) {
        $scope.lightBoxes.splice(i,1);
        $scope.writeLights()
    }
    $scope.removeRoom = function(obj) {
        delete $scope.house[obj];
    }
    $scope.removeZone = function(obj, zone) {
        delete $scope.house[obj][zone];
    }
    $scope.removeField = function(obj, zone,field) {
        delete $scope.house[obj][zone][field];
    }
    $scope.returnUsers = function () {
        $http.get('/getUsers').success(function (data) {
            $scope.users = data;
            $scope.user = $scope.users[0];
        });
    }
    $scope.returnStocks = function() {
        $http.get('/returnStocks').success(function(data){
            $scope.stocks = data;
        })
    }
    $scope.returnButtons = function() {
        $http.get('/returnDashButtons').success(function(data){
            if (data == 'none')
                $scope.dashShow = false;
            else
            $scope.dashButtons = data;
        })
    }
    $scope.returnLights = function() {
        $http.get('/returnLights').success(function(data){
                $scope.lightBoxes = data.boxes;
        })
    }
    $scope.returnHouse = function() {
        $http({method:'post', url:'/returnHouse', data: {name: 'house'}}).success(function(data){
            $scope.house = data;
            $scope.volume = $scope.house['volume'];
            delete $scope.house['name'];
            delete $scope.house['_id'];
            delete $scope.house['__v'];
            delete $scope.house['volume'];
        })
    }
    $scope.addUser = function (username, password, password1, role) {
        if (password === password1) {
            var data = {
                username: username,
                password: password,
                role: role
            }
            $http({method: 'post', url: '/users', data: data}).success(function (data) {
                document.getElementById('info').style.color = "white";
                $scope.info = data.message
                $scope.returnUsers();

            });
        }

        else {
            document.getElementById('info').style.color = "red";
            $scope.info = "Passwords do not match"
        }
    }
    $scope.writeGoogle = function (gmail,gpassword,androidId) {
        $http({
            method: 'post',
            url: '/writeConfig',
            data: {file: 'google', gmail: gmail, password: gpassword, androidId: androidId}
        }).success(function (data) {
            $scope.info = data.message;
        })

    }
    $scope.writeWeather = function (city, state, zipcode, wuKey) {
        $http({
            method: 'post',
            url: '/writeConfig',
            data: {
                file: 'weather',
                city: city,
                state: state,
                zipcode: zipcode,
                weather_underground_key: wuKey
            }
        }).success(function (data) {
            $scope.info = data.message;
        })

    }
    $scope.writeStocks = function() {
        console.log($scope.stocks)
        $http({
            method: 'post',
            url: '/writeArrayConfig',
            data: {
                file: 'stocks',
                array: $scope.stocks
            }
        }).success(function (data) {
            $scope.returnStocks();
            $scope.info = data.message;
        })
    }
    $scope.writeButtons = function() {
        for (var i=0; i < $scope.dashButtons.length; i++) {
            try{
                $scope.dashButtons[i].zone = $scope.dashButtons[i].zone.split(',');
            } catch(e){}
        }
        $http({
            method: 'post',
            url: '/writeArrayConfig',
            data: {
                file: 'dash',
                array: $scope.dashButtons
            }
        }).success(function (data) {
            $scope.info = data.message;
            $scope.returnButtons();

        })
    }
    $scope.writeLights = function() {
        $http({
            method: 'post',
            url: '/writeConfig',
            data: {
                file: 'lights',
                boxes: $scope.lightBoxes
            }
        }).success(function (data) {
            $scope.info = data.message;
            $scope.returnLights();

        })
    }
    $scope.writeHouse = function() {
        $scope.house.volume = $scope.volume;
        $http({
            method: 'post',
            url: '/updateHouseExternal',
            data: $scope.house
        }).success(function (data) {
            $scope.info = data;
            delete $scope.house.volume;
        })
    }
    $scope.addStock = function() {
        $scope.stocks.push('');
    }
    $scope.addButton = function() {
        $scope.dashButtons.push({id:'',box:0,zone:['kitchen','counter'], type:'light'})

    }
    $scope.addLight = function() {
        $scope.lightBoxes.push({box_ip:'',box_port:8899})

    }
    $scope.addRoom = function() {
        $scope.house.newRoom = {}
    }
    $scope.addZone = function(obj){
        $scope.house[obj].newZone = {}
    }
    $scope.addField = function(obj,zone) {
        $scope.house[obj][zone].newField = "value"
    }

    $scope.changeKey = function(oldname, key, obj, field) {
        if (field != undefined){
            if (oldname != field) {
                $scope.house[key][obj][field] = angular.extend($scope.house[key][obj][oldname]);
                delete $scope.house[key][obj][oldname]
            }
        }
        else if (obj != undefined){
            if (oldname != obj) {
                $scope.house[key][obj] = angular.extend($scope.house[key][oldname]);
                delete $scope.house[key][oldname]
            }
        }
        else if (key != undefined){
            if (oldname != key) {
                $scope.house[key] = angular.extend($scope.house[oldname]);
                delete $scope.house[oldname]
            }
        }
    }
    $scope.returnUsers();
    $scope.returnStocks();
    $scope.returnButtons();
    $scope.returnLights();
    $scope.returnHouse();

});