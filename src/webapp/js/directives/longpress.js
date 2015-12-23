app.directive('ngPress', function ($timeout) {
    return {
        restrict: 'A',
        link: function($scope, $elm, $attrs) {
            var promise;
            $elm.bind('mousedown', function(evt) { // <-- changed
                promise = $timeout(function(){
                    $scope.$eval($attrs.ngPress);
                    $scope.folder = false;

                }, 500)
            });

            $elm.bind('mouseup', function(evt) { // <-- changed
                $timeout.cancel(promise)
            });
        }
    };
});