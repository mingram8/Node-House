var create_email = false;
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
app.controller('GoogleVoiceController', function ($scope, $http, $sce, $interval, $timeout, $controller) {
    $scope.switchButtons = {};

    $http.get('/getButtons').success(function (data) {
        $scope.buttons = data.buttons;
        $scope.totalButtons = data.folderButtons;
        for (var i in data.folderButtons) {
            $scope.switchButtons[i] = {}
        }
    });
    try {
        if (!('webkitSpeechRecognition' in window)) {
            // upgrade();
        } else {
            var recognition = new webkitSpeechRecognition();
            console.log(recognition)
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onstart = function () {
                recognizing = true;
            };

            recognition.onerror = function (event) {
                console.log(event)

                if (event.error == 'no-speech') {
                    ignore_onend = true;
                }
                if (event.error == 'audio-capture') {
                    ignore_onend = true;
                }
                if (event.error == 'not-allowed') {
                    ignore_onend = true;
                }
            };

            recognition.onend = function () {
                if (ignore_onend) {
                    $scope.startButton()
                    return;
                }
                if (!final_transcript) {
                    $scope.startButton()
                    return;
                }
                if (window.getSelection) {
                    $scope.startButton()
                    return;
                }
                //$scope.startButton()
                return;
            };

            recognition.onresult = function (event) {
                var interim_transcript = '';
                if (typeof(event.results) == 'undefined') {
                    console.log('nope')
                    return;
                }
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final_transcript += event.results[i][0].transcript;
                    } else {
                        interim_transcript += event.results[i][0].transcript;
                    }
                }
                console.log(interim_transcript)
                $http({method: 'post', url: '/sendVoice', data: {voice: interim_transcript}}).success(function (data) {
                });
                if (interim_transcript.indexOf('hey home') > -1 ||
                    interim_transcript.indexOf('hey homes') > -1 ||
                    interim_transcript.indexOf('hey how') > -1 ||
                    interim_transcript.indexOf('hey hun') > -1 ||
                    interim_transcript.indexOf('they home') > -1 ||
                    interim_transcript.indexOf('they have') > -1) {
                    if (interim_transcript.indexOf('damn hall lights') > -1 ||
                        interim_transcript.indexOf('damn highlights') > -1 ||
                        interim_transcript.indexOf('game highlights') > -1 ||
                        interim_transcript.indexOf('gym hall light') > -1 ||
                        interim_transcript.indexOf('gym highlights') > -1 ||
                        interim_transcript.indexOf('dim hall lights') > -1) {
                        $scope.dimAll(['hall', 'main'])
                    }
                }
                //final_transcript = capitalize(final_transcript);
                //final_span.innerHTML = linebreak(final_transcript);
                //interim_span.innerHTML = linebreak(interim_transcript);
                //if (final_transcript || interim_transcript) {
                //    showButtons('inline-block');
                //}
            };
        }

        $scope.dimAll = function (param) {
            var buttons = $scope.totalButtons[param[0]];
            for (var i = 0; i < buttons.length; i++) {
                if (buttons[i].type == 'light') {
                    $http.get('/brightness' + '/' + buttons[i].param[0] + '/' + buttons[i].param[1] + '/0');
                }
            }
        }
        $scope.startButton = function (event) {
            recognizing = true;
            final_transcript = '';
            recognition.lang = 'en-US';
            ignore_onend = false;
        }
        final_transcript = '';
        recognition.lang = 'en-US';
        recognition.start();
        ignore_onend = false;

    }
    catch(e) {}
});