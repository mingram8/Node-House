function rgbToHsl(r, g, b) {
	r /= 255, g /= 255, b /= 255;
	var max = Math.max(r, g, b), min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;

	if (max == min) {
		h = s = 0; // achromatic
	} else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}

	return [h, s, l];
}

function checkArray(arr, check) {
	for (var i = 0; i < arr.length; i++) {
		if (check === arr[i])
			return false
	}
	return true;
}
function capitalizeEachWord(str) {
	return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
}
function toBoolean(string) {
	if (string == "true")
		return true
			if (string == "false")
				return false
}
app.controller('HouseController', function ($scope, $http, $sce, $interval, $timeout) {
		$scope.currentSong = {playingExternal: false};
		$scope.date = new Date();
		$scope.lastframe = true;
		$scope.homePage = true;
		$scope.musicPage = false;
		$scope.bg = 3;
		$scope.color = 224;
		$scope.timer = 0;
		$scope.bedrooms = {}
		$scope.bedrooms = {};
		var month = new Date().getMonth();
		console.log(month)
		if (month ==11) {
		$scope.background = "url('images/christmas-1.gif') no-repeat"
		}
		if (month <2) {
		$scope.background = "url('images/snow-7.gif') no-repeat"
		}
		if (month >=2 && month < 5) {
		$scope.background = "url('images/spring-1.gif') no-repeat"
		}
		if (month >=5 && month <8) {
		$scope.background = "url('images/beach-1.gif') no-repeat"
		}
		if (month > 7 && month < 11){		
		  if (month == 8 && new Date().getDate() > 20) {
		$scope.background = "url('images/holloween-1.gif') no-repeat"
		  } else {
		$scope.background = "url('images/fall-1.gif') no-repeat"
		}
		}
		$scope.intercomOn = false;
		$scope.onceOver = false;
		$scope.intercom = false;
		$scope.interval;
		$scope.butler = false;
		$scope.switchButtons = {};
		$scope.timeNumber = 1000;
		/*How often the time function should fire */
		$scope.stockSpeed = 400;
		/*Speed of the stock ticker */

		$scope.currentPlayer = "a";
		var audio;
		var audio2;

		var client;
		var parts = [];

		$scope.bedtime = false;
		$scope.toggleFullScreen = function () {
			if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
				if (document.documentElement.requestFullscreen) {
					document.documentElement.requestFullscreen();
				} else if (document.documentElement.msRequestFullscreen) {
					document.documentElement.msRequestFullscreen();
				} else if (document.documentElement.mozRequestFullScreen) {
					document.documentElement.mozRequestFullScreen();
				} else if (document.documentElement.webkitRequestFullscreen) {
					document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
				}
			}
		}
		var slide = $(".musicSlider").slider({
orientation: "vertical",
range: "max",
max: 90,
min: 0,
slide: function (event, ui) {
$http.get("/setVolume/" + ui.value).success(function () {
	})
}


});
$scope.changeBg = function () {
	console.log("THINGS")
		if ($scope.bg == 1) {
			document.body.style.background = "url('images/snow-9.gif') no-repeat"
				$scope.background = "url('images/snow-7.gif') no-repeat"
				document.body.style.backgroundSize = "cover"
				$scope.bg++;
		}
		else if ($scope.bg == 2) {
			document.body.style.background = "url('images/snow-4.gif') no-repeat"
				$scope.background = "url('images/snow-4.gif') no-repeat"
				document.body.style.backgroundSize = "cover"
				$scope.bg++;
		}
		else if ($scope.bg == 3) {
			document.body.style.background = "url('images/beach-1.gif') no-repeat"
				$scope.background = "url('images/beach-1.gif') no-repeat"
				document.body.style.backgroundSize = "cover"
				$scope.bg++;
		}
		else if ($scope.bg == 4) {
			document.body.style.background = "url('images/fall-1.gif') no-repeat"
				$scope.background = "url('images/fall-1.gif') no-repeat"
				document.body.style.backgroundSize = "cover"
				$scope.bg++;
		}
		else if ($scope.bg == 5) {
			document.body.style.background = "url('images/holloween-1.gif') no-repeat"
				$scope.background = "url('images/holloween-1.gif') no-repeat"
				document.body.style.backgroundSize = "cover"
				$scope.bg++;
		}
		else if ($scope.bg == 6) {
			document.body.style.background = "url('images/christmas-1.gif') no-repeat"
				$scope.background = "url('images/christmas-1.gif') no-repeat"
				document.body.style.backgroundSize = "cover"
				$scope.bg++;
		}
		else if ($scope.bg == 7) {
			document.body.style.background = "url('images/christmas-3.gif') no-repeat"
				$scope.background = "url('images/christmas-3.gif') no-repeat"
				document.body.style.backgroundSize = "cover"
				$scope.bg++;
		}
		else if ($scope.bg == 8) {
			document.body.style.background = "url('images/spring-1.gif') no-repeat"
				$scope.background = "url('images/sprint-1.gif') no-repeat"
				document.body.style.backgroundSize = "cover"
				$scope.bg = 1;
		}
}
$scope.getSong = function () {

	$http.get('/getSong').success(function (data) {
			if (data.play === true) {
			$scope.currentSong.playingExternal = true;
			$scope.currentSong.track = data.song.track;
			$scope.playButton = data.paused
			}
			else {
			$scope.currentSong.playingExternal = false;

			}
			$scope.getWeather();

			})
}
$http.get('/getSong').success(function (data) {

		if (data.play === true) {
		$scope.currentSong.playingExternal = true;
		$scope.currentSong.track = data.song.track;
		}
		else {
		$scope.currentSong.playingExternal = false;

		}
		})


$scope.$watch('color', function () {
		console.log($scope.color)
		var color = $scope.color
		var r = parseInt(color.substr(1, 2), 16); // Grab the hex representation of red (chars 1-2) and convert to decimal (base 10).
		var g = parseInt(color.substr(3, 2), 16);
		var b = parseInt(color.substr(5, 2), 16);
		var hue = rgbToHsl(r, g, b)[0] * 255
		console.log(Math.floor(hue))
		})


$scope.openFolder = function (folder, fun, param) {
	if (folder == false) {
		$scope.folder = false;
		$scope.submit(fun)
	}
	else {
		$timeout.cancel($scope.folderTime);
		$scope.currentFolder = param;
		var path = [];
		$scope.folderButtons = $scope.totalButtons[param[0]];
		$timeout(function () {
				for (var i = 0; i < $scope.folderButtons.length; i++) {
				if ($scope.folderButtons[i].slider == true) {
				//var params = $scope.folderButtons[i].valu.split(',');
				path.push($scope.folderButtons[i]);
				$("#slider" + i).slider({
orientation: "vertical",
stuff: 'stuff',
value: $scope.data[$scope.folderButtons[i].param[0]][$scope.folderButtons[i].param[1]].brightness,
slide: function (event, ui) {
var i = event.target.id.split('slider')[1]
if (ui.value == 100) {
$http.get('/makeWhite/' + path[i].param[0] + '/' + path[i].param[1]).success(function () {
	});
}
$http.get('/brightness/' + path[i].param[0] + '/' + path[i].param[1] + '/' + ui.value).success(function () {
	})
}

})
				$("#sliderColor" + i).slider({
orientation: "vertical",
stuff: 'stuff',
min: 1,
max: 254,
value: $scope.data[$scope.folderButtons[i].param[0]][$scope.folderButtons[i].param[1]].color,
slide: function (event, ui) {
var i = event.target.id.split('sliderColor')[1]
$http.get('/changeLights/' + path[i].param[0] + '/' + path[i].param[1] + '/' + ui.value).success(function () {
	})
}

})
}
}
}, 400)
$scope.folder = !$scope.folder
$scope.folderTime = $timeout(function () {
		$scope.folder = false;
		}, 7000);
return false;

}
return false;
}

/**
 * These functions control the music player under the 5 day forecast.
 * Pretty self explanatory.
 *
 */
$scope.killSong = function () {
	if ($scope.timeOut)
		clearTimeout($scope.timeOut)
			$http.get('/stopSong').success(function (data) {
					$scope.currentSong.playingExternal = false;

					});
}
$scope.pause = function () {
	$http.get('/pressPause', function () {
			});
	$scope.playButton = true;

}
$scope.play = function () {
	$http.get('/pressPlay', function () {
			});
	$scope.playButton = false;

}
$scope.rewind = function () {
	$http.get('/pressRewind', function () {
			});

}
$scope.forward = function () {
	$http.get('/pressForward', function () {
			});

}
/**
 * This is what does the date and time ontop of the temperature div
 * It also moves the stock ticker and keeps the ticker on the bottom
 * of the div.
 *
 */
$scope.bigInterval = $interval(function () {
		var elem = document.getElementById('stocks');
		if (parseInt(css(elem, 'left'), 10) == parseInt(-120 * $scope.totalStocks)) {
		elem.style.left = parseInt(120 * $scope.totalStocks) + 'px';
		translate(elem, (parseInt(-120 * $scope.totalStocks)), $scope.stockSpeed)
		}
		$scope.date = new Date();
		$scope.hours = $scope.date.getHours();
		$scope.minutes = $scope.date.getMinutes();
		$scope.day = $scope.date.getDate();
		$scope.month = $scope.date.getMonth();
		$scope.seconds = $scope.date.getSeconds();
		$scope.milliSeconds = $scope.date.getMilliseconds();

		var g = document.getElementsByClassName("houseButton");
		for (var i = 0; i < g.length; i++) {
		g[i].style.width = (( window.innerWidth * .45 ) / 3) + 'px'
		}

		if ($scope.hours < 10) {
		$scope.hours = "0" + $scope.hours
		}
		if ($scope.minutes < 10) {
			$scope.minutes = "0" + $scope.minutes
		}

		document.getElementsByClassName('stockTicker')[0].style.width = (parseInt(css(document.getElementsByClassName('temperature')[0], 'width'))) - 7 + 'px'
			document.getElementsByClassName('stockTicker')[0].style.top = (parseInt(css(document.getElementsByClassName('temperature')[0], 'height')) - 20) + 'px'
}, 4000)


$http({method: 'post', url: '/getHouse', data: {name: 'house'}}).success(function (data) {
		$scope.coffee = toBoolean(data.kitchen.coffee.on);
		$scope.data = data;
		if ($scope.bedroom == false) {
		$scope.bedroom = toBoolean(data.bedroom.hall.on);
		}
		$scope.bedroomSlider = data.bedroom.hall.brightness;
		$http.get('/getButtons').success(function (data) {
			$scope.buttons = data.buttons;
			$scope.totalButtons = data.folderButtons;
			for (var i in data.folderButtons) {
			var flag = false;
			$scope.switchButtons[i] = {}
			for (var x = 0; x < data.folderButtons[i].length; x++) {
			if (toBoolean($scope.data[i][data.folderButtons[i][x].param[1]].on) == true) {
			$scope[i] = true;
			flag = true;
			}

			$scope.switchButtons[i][data.folderButtons[i][x].param[1]] = toBoolean($scope.data[i][data.folderButtons[i][x].param[1]].on);
			}
			if (flag == false)
			$scope[i] = false;
			}
			});
		$scope.hallSlider = data.hall.main.brightness;
		if ($scope.currentFolder === "bedroom")
			$(".slider").slider("option", "value", data.bedroom.hall.brightness);

		if ($scope.currentFolder === "foyer")
			$(".slider").slider("option", "value", data.hall.main.brightness);

		if (data.volume != undefined) {
			$(".musicSlider").slider("option", "value", data.volume);
		}

});
/**
 * This loops through all the checks. If you did them all at once
 * a stall could cause problems. I just like this way more.
 */
$scope.timeFunction = function () {
	$http({method: 'post', url: '/getHouse', data: {name: 'house'}}).success(function (data) {
			$scope.coffee = toBoolean(data.kitchen.coffee.on);
			$scope.fan = toBoolean(data.misc.fan.on);

			$scope.data = data;
			$http.get('/getButtons').success(function (data) {
				for (var i in data.folderButtons) {
				var flag = false;
				for (var x = 0; x < data.folderButtons[i].length; x++) {
				if (toBoolean($scope.data[i][data.folderButtons[i][x].param[1]].on) == true) {
				$scope[i] = true;
				flag = true;
				}
				$scope.switchButtons[i][data.folderButtons[i][x].param[1]] = toBoolean($scope.data[i][data.folderButtons[i][x].param[1]].on);
				}
				if (flag == false)
				$scope[i] = false;
				}
				console.log($scope.switchButtons)
				});

	})
	$scope.getSong();


}


$timeout(function () {
		$scope.timeFunction()
		}, 1000);


/**
 * Load the stock bar
 */
$scope.getStocks = function () {
	$http.get('/getStocks').success(function (data) {
			var n = 0;
			var arr = [];
			for (i in data) {
			arr.push({name: i.toUpperCase(), price: data[i]})
			n++;
			}
			if ($scope.totalStocks == undefined) {
			translate(elem, (-120 * n), $scope.stockSpeed);

			}
			$scope.stocks = arr;
			$scope.totalStocks = n

			/*
			   If I am not sleeping, start the loop again
			 */
			if ($scope.bedtime == false) {
			$timeout(function () {
				$scope.timeFunction()
				}, $scope.timeNumber);
			}
	});
}
/**
 * These toggle the home page (button page) and
 * the music page (search bar and such)
 */
$scope.goHome = function () {
	$scope.homePage = true;
	$scope.musicPage = false;
}
$scope.music = function () {
	$scope.homePage = false;
	$scope.musicPage = true;
}
/**
 * This is my sleep function. It plays white noise and
 * halts the other timers (except the clock) on this tablet
 * so that it doesn't disrupt my white noise. It also
 * turns off my bedroom lights.
 */
$scope.getMusic = function () {
	if ($scope.bedtime == false && $scope.onceOver == true) {
		$http.get('/toggleLights/bedroom/hall/off');
		$http.get('/toggleLights/bedroom/lamp/off');
		audio.play();
		audio2.play();
		$scope.interval = $interval(function () {
				if ($scope.currentPlayer == "a") {
				audio.pause()
				audio.currentTime = 1000;
				audio.play();
				$scope.currentPlayer = "b";
				}
				else {
				audio2.pause()
				audio2.currentTime = 1000;
				audio2.play();
				$scope.currentPlayer = "a";

				}
				}, 100000)
		//audio2.play();
		$scope.bedtime = true;
	}
	else if ($scope.bedtime == false && $scope.onceOver == false) {
		$http.get('/toggleLights/bedroom/hall/off');
		$http.get('/toggleLights/bedroom/lamp/off');
		audio = document.createElement("audio");
		audio.id = "playback";
		audio.preload = "auto";
		audio2 = document.createElement("audio");
		audio2.id = "playback";
		audio2.preload = "auto";
		audio.src = "/playWhiteNoise";
		audio2.src = "/playWhiteNoise";
		audio.play();
		audio2.play();
		$scope.interval = $interval(function () {
				if ($scope.currentPlayer == "a") {
				audio.pause()
				audio.currentTime = 0;
				audio.play();
				$scope.currentPlayer = "b";
				}
				else {
				audio2.pause()
				audio2.currentTime = 0;
				audio2.play();
				$scope.currentPlayer = "a";

				}

				console.log('starting over')
				}, 100000)
		$scope.onceOver = true;
		$scope.bedtime = true;
	}


	else {
		$scope.timeFunction();
		$scope.timeNumber = 1000;
		$http.get('/toggleLights/bedroom/hall/on');
		$http.get('/toggleLights/bedroom/lamp/on');
		//client.close();
		audio.pause();
		audio2.pause();
		$interval.cancel($scope.interval);
		// $interval.cancel($scope.interval2);
		audio.currentTime = 0;
		audio2.currentTime = 0;
		$scope.onceOver = true;
		$scope.bedtime = false;
	}
}
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();


/**
 * I had an intercom. The mics on my tablet are too shitty to
 * really use so I removed it. But the functions are still
 * floating around. This is one of them.
 *
 */

/**
 * I had an intercom. The mics on my tablet are too shitty to
 * really use so I removed it. But the functions are still
 * floating around. This is one of them.
 *
 * This plays whatever sounds got picked up by loadSound()
 *
 */
function process(Data) {
	source = context.createBufferSource(); // Create Sound Source
	context.decodeAudioData(Data, function (buffer) {
			console.log(buffer)
			source.buffer = buffer;
			source.connect(context.destination);
			source.start(context.currentTime);
			})
}


/**
 * Get weather. Will also grab sunset and sunrise in case
 * you want to do something with it. It is almost always
 * better to do that on the server but if you wanted
 * to turn to night mode or something.
 *
 * This is also where I change my backgrounds according to time
 * or precipitation.
 */
$scope.getWeather = function () {
	$http.get('/getWeather').success(function (data) {
			console.log(data)
			try {
			$scope.weather = {}
			$scope.weather.temp = JSON.parse(data.weather.precip).current_observation.temp_f
			$scope.weather.celcius = JSON.parse(data.weather.precip).current_observation.temp_c
 			console.log($scope.weather)
			data.weather.precip = JSON.parse(data.weather.precip).current_observation.weather; 
			if (data.weather.precip == "Light Rain" && new Date().getHours() < 17) {
			document.body.style.background = "url('images/rain-1.gif') no-repeat"
			document.body.style.backgroundSize = "cover"
			}
			else if (data.weather.precip == "Light Rain" && new Date().getHours() >= 17) {
			document.body.style.background = "url('images/rain-3.gif') no-repeat"
			document.body.style.backgroundSize = "cover"
			}
			if (data.weather.precip == "Heavy Rain") {
			document.body.style.background = "url('images/rain-2.gif') no-repeat"
			document.body.style.backgroundSize = "cover"
			}
			if (data.weather.precip == "Rain") {
			document.body.style.background = "url('images/rain-1.gif') no-repeat"
			document.body.style.backgroundSize = "cover"
			}
			if (data.weather.precip == "Snow" && new Date().getHours() < 17) {
				document.body.style.background = "url('images/snow-2.gif') no-repeat"
					document.body.style.backgroundSize = "cover"
			}
			if (data.weather.precip == "Snow" && new Date().getHours() > 17) {
				document.body.style.background = "url('images/snow-10.gif') no-repeat"
					document.body.style.backgroundSize = "cover"
			}
			if (data.weather.precip == "Heavy Snow" && new Date().getHours() < 17) {
				document.body.style.background = "url('images/snow-4.gif') no-repeat"
					document.body.style.backgroundSize = "cover"
			}
			if (data.weather.precip == "Heavy Snow" && new Date().getHours() > 17) {
				document.body.style.background = "url('images/snow-3.gif') no-repeat"
					document.body.style.backgroundSize = "cover"
			}	
	}
	catch(e){
	}	
	try{ $scope.weather = JSON.parse(data.forecast).query.results.channel.item.condition;
		console.log($scope.weather)
		try {
			data.weather.precip = JSON.parse(data.weather.precip).current_observation.weather;
		}
		catch (e) {
		}
		if (new Date().getHours() > 19 || new Date().getHours() < 7) {
			document.body.style.background = "url('images/Black.jpg') no-repeat"
				document.body.style.backgroundSize = "cover"
		}
		else {
			document.body.style.background = $scope.background;
			document.body.style.backgroundSize = "cover"
		}
		if (data.weather.precip == "Light Rain" && new Date().getHours() < 17) {
			document.body.style.background = "url('images/rain-1.gif') no-repeat"
				document.body.style.backgroundSize = "cover"
		}
		else if (data.weather.precip == "Light Rain" && new Date().getHours() >= 17) {
			document.body.style.background = "url('images/rain-3.gif') no-repeat"
				document.body.style.backgroundSize = "cover"
		}
		if (data.weather.precip == "Heavy Rain") {
			document.body.style.background = "url('images/rain-2.gif') no-repeat"
				document.body.style.backgroundSize = "cover"
		}
		if (data.weather.precip == "Rain") {
			document.body.style.background = "url('images/rain-1.gif') no-repeat"
				document.body.style.backgroundSize = "cover"
		}
		if (data.weather.precip == "Snow" && new Date().getHours() < 17) {
			document.body.style.background = "url('images/snow-2.gif') no-repeat"
				document.body.style.backgroundSize = "cover"
		}
		if (data.weather.precip == "Snow" && new Date().getHours() > 17) {
			document.body.style.background = "url('images/snow-10.gif') no-repeat"
				document.body.style.backgroundSize = "cover"
		}
		if (data.weather.precip == "Heavy Snow" && new Date().getHours() < 17) {
			document.body.style.background = "url('images/snow-4.gif') no-repeat"
				document.body.style.backgroundSize = "cover"
		}
		if (data.weather.precip == "Heavy Snow" && new Date().getHours() > 17) {
			document.body.style.background = "url('images/snow-3.gif') no-repeat"
				document.body.style.backgroundSize = "cover"
		}
		/*
		   Yahoo doesn't give weather in Celcius so convert it.
		 */
		$scope.weather.celcius = ((parseInt($scope.weather.temp) - 32) * (5 / 9)).toFixed(2);
      console.log($scope.weather)
		$scope.forecast = JSON.parse(data.forecast).query.results.channel.item.forecast
	$scope.forecast = $scope.forecast.splice(0,5)	
	console.log($scope.forecast)
				
		/*
			   The / causes problems when it is thunderstorms/cloudy since it tries to fit it on on one line.
			   Add a space so it will put it on two lines.
			 */
			for (var i=0; i < data.weather.weather.item.forecast.length; i++) {
				if (data.weather.weather.item.forecast[i].text.indexOf('/') !=-1) {
					var stuff = data.weather.weather.item.forecast[i].text.split('/');
					var str = '';
					str = stuff[0] + '/ '+stuff[1]
						data.weather.weather.item.forecast[i].text = str;
				}
			}
	} catch(e){}
	$scope.getStocks();

});

}
/**
 * Actual engine that moves the stock ticker.
 *
 * @param elem
 * @param x
 * @param y
 */
function translate(elem, x, y) {
	var left = parseInt(css(elem, 'left'), 10),
	    top = parseInt(css(elem, 'top'), 10),
	    dx = left - x,
	    dy = top - y,
	    i = 1,
	    count = 400,
	    delay = 60;

	function loop() {
		if (i >= count) {
			return;
		}
		i += 1;
		elem.style.left = ( left - ( dx * i / count ) ).toFixed(0) + 'px';
		elem.style.top = ( top - ( dy * i / count ) ).toFixed(0) + 'px';
		setTimeout(loop, delay);
	}

	loop();
}

function css(element, property) {
	return window.getComputedStyle(element, null).getPropertyValue(property);
}

/**
 * I thought this might fix stuff, it does not. Left it because
 * I am lazy.
 *
 * @param param
 * @param on
 */
$scope.submitLight = function (param, on) {
	if (on == true) {
		$http.get('/toggleLights' + '/' + param[0] + '/' + param[1] + '/on');
	}
	else {
		$http.get('/toggleLights' + '/' + param[0] + '/' + param[1] + '/off');

	}
}
$scope.dimAll = function (param) {
	var buttons = $scope.totalButtons[param[0]];
	for (var i = 0; i < buttons.length; i++) {
		if (buttons[i].type == 'light') {
			$http.get('/brightness/' + '/' + buttons[i].param[0] + '/' + buttons[i].param[1] + '/0');
		}
	}
}

$interval(function(){
		$http.get('http://192.168.86.119:2002/butlerOn').success(function(data){
	$scope.intercom = data
})},800);
/**
 * Tried to do a long click to toggle them all. It works about 70% of the time
 * It sends the correct commands but the lights do not react fast enough or mongo
 * doesn't save fast enough. Haven't figured it out.
 *
 * @param param
 */
$scope.submitAll = function (param) {
	var buttons = $scope.totalButtons[param[0]];
	console.log($scope[param[0]])
		if ($scope[param[0]] == true) {
			for (var i = 0; i < buttons.length; i++) {
				if (buttons[i].type == 'light') {
					$scope.submitLight(buttons[i].param, false)
				}
				else if (buttons[i].type == 'radio') {
					$http({
method: 'post',
url: '/codeSend',
data: {device: buttons[i].param}
}).success(function (data) {

	});
}
}
}
else {
	for (var i = 0; i < buttons.length; i++) {
		console.log(buttons[i].type)
			if (buttons[i].type == 'light') {
				$scope.submitLight(buttons[i].param, true)
			}
			else if (buttons[i].type == 'radio') {
				$http({
method: 'post',
url: '/codeSend',
data: {device: buttons[i].param}
}).success(function (data) {

	});
}
}
}

$scope.timeFunction();
}
/**
 * Item is really the param that gets sent from the buttons.
 *
 * Check if it is one of the custom ones, a light, or radio.
 * A light will have a brightness setting, a radio will not.
 *
 * @param item
 */
$scope.submit = function (item) {
	console.log(item)
		if (item == "musicPage") {
			$scope.music();
		}
		else if (item[0] == "bedtime") {
			$scope.getMusic();
		}
		else if (item[0] == "intercom") {
			if ($scope.intercom == undefined || $scope.intercom == false) {
				record();
				$scope.intercom = true;
			}
			else {
				stopRecord();
				$scope.intercom = false;
			}
		}
		else if ($scope.data[item[0]][item[1]].brightness == undefined) {
			$http({method: 'post', url: '/codeSend', data: {device: item}}).success(function (data) {

					});
		}
		else if ($scope.data[item[0]][item[1]].brightnes != 'n') {
			console.log($scope.switchButtons)
				console.log($scope.switchButtons[item[0]][item[1]])
				/* This might seem counter intuitive, but the switch is set before
				   this function evalutes.
				 */
				if ($scope.switchButtons[item[0]][item[1]] == true) {
					$http.get('/toggleLights' + '/' + item[0] + '/' + item[1] + '/on');
				}
				else {
					$http.get('/toggleLights' + '/' + item[0] + '/' + item[1] + '/off');
				}
		}


}

/**
 * Kicks some functions off
 */
$scope.getWeather()
	$scope.getStocks();
	var elem = document.getElementById('stocks');
	/**
	 * This sets the position of the stock bar to the bottom of the temperature div
	 *
	 */

	document.getElementsByClassName('stockTicker')[0].style.width = (parseInt(css(document.getElementsByClassName('temperature')[0], 'width'))) - 7 + 'px'
	document.getElementsByClassName('stockTicker')[0].style.top = (parseInt(css(document.getElementsByClassName('temperature')[0], 'height')) - 20) + 'px'


	})
;
