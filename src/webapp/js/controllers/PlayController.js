var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
app.controller('PlayController', function ($scope,$sce, $http) {

    $http.get('/storedUrl').success(function(song)
    {
        $scope.url = $sce.trustAsResourceUrl(song)
    })
    var a = document.getElementById("myMediaElementID");
    //a.pause()
})
