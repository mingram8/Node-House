var create_email = false;
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
app.controller('GoogleVoiceController', function ($scope, $http, $sce, $interval, $timeout, $controller) {
    //$scope.results = '';
    //function wait(){
    //    setTimeout(function(){}, 500);
    //}
    //
    //$http({method:'post', url:'/sendSpeech', data:{speech:window.location.href}}).success(function(data){
    //
    //})
    //
    //try {
    //    var recognition = new webkitSpeechRecognition();
    //}
    //catch(e)
    //{
    //
    //}
    //if (recognition != undefined) {
    //    recognition.lang = "en-US";
    //    recognition.continuous = true;
    //    recognition.interimResults = true;
    //    recognition.onresult = function (event) {
    //        $scope.final = '';
    //        $scope.results = ''
    //        results = ''
    //        final = false;
    //        for (var i = event.resultIndex; i < event.results.length; ++i) {
    //            if (event.results[i].isFinal) {
    //                $scope.final += event.results[i][0].transcript;
    //                final = true;
    //            } else {
    //                $scope.results += event.results[i][0].transcript;
    //                console.log($scope.results)
    //                if ($scope.results.indexOf('play') == -1) {
    //                    $http({
    //                        method: 'post',
    //                        url: '/sendSpeech',
    //                        data: {speech: $scope.results}
    //                    }).success(function (data) {
    //                        if (data == true) {
    //                            $scope.newRecog()
    //                        }
    //                    })
    //                }
    //            }
    //        }
    //        if (final == true) {
    //            $scope.final = $scope.capitalize($scope.final)
    //            $scope.final = $scope.linebreak($scope.final);
    //
    //
    //            $http({method: 'post', url: '/sendSpeech', data: {speech: $scope.final}}).success(function (data) {
    //                if (data == true) {
    //                    $scope.newRecog()
    //                }
    //            })
    //        }
    //        else {
    //            console.log('no')
    //        }
    //    }
    //    recognition.start();
    //    recognition.onend = function () {
    //        recognition.start();
    //    };
    //
    //}
    //$scope.newRecog = function() {
    //    try {
    //        var recognition = new webkitSpeechRecognition();
    //    }
    //    catch(e)
    //    {
    //
    //    }
    //    if (recognition != undefined) {
    //        recognition.lang = "en-US";
    //        recognition.continuous = true;
    //        recognition.interimResults = true;
    //        recognition.onresult = function (event) {
    //            $scope.final = '';
    //            $scope.results = ''
    //            results = ''
    //            final = false;
    //            for (var i = event.resultIndex; i < event.results.length; ++i) {
    //                if (event.results[i].isFinal) {
    //                    $scope.final += event.results[i][0].transcript;
    //                    final = true;
    //                } else {
    //                    $scope.results += event.results[i][0].transcript;
    //                    console.log($scope.results)
    //                    if ($scope.results.indexOf('play') == -1) {
    //                        $http({
    //                            method: 'post',
    //                            url: '/sendSpeech',
    //                            data: {speech: $scope.results}
    //                        }).success(function (data) {
    //                            if (data == true) {
    //                                $scope.newRecog()
    //                            }
    //                        })
    //                    }
    //                }
    //            }
    //            if (final == true) {
    //                $scope.final = $scope.capitalize($scope.final)
    //                $scope.final = $scope.linebreak($scope.final);
    //
    //
    //                $http({method: 'post', url: '/sendSpeech', data: {speech: $scope.final}}).success(function (data) {
    //                    if (data == true) {
    //                        $scope.newRecog()
    //                    }
    //                })
    //            }
    //            else {
    //                console.log('no')
    //            }
    //        }
    //        recognition.start();
    //        recognition.onend = function () {
    //            console.log('fuuuck')
    //            recognition.start();
    //        };
    //
    //    }
    //}
    //var two_line = /\n\n/g;
    //var one_line = /\n/g;
    //$scope.linebreak = function(s) {
    //    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
    //}
    //var first_char = /\S/;
    //
    //$scope.capitalize = function(s) {
    //    return s.replace(first_char, function(m) { return m.toUpperCase(); });
    //}
});