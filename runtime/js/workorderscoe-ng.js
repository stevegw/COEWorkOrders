if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports) {
  module.exports = 'workorderscoe-ng';
}

(function () {
  'use strict';

  var widgetcoeModule = angular.module('workorderscoe-ng', []);
  widgetcoeModule.directive('ngWorkorderscoe', ['$timeout', '$interval', '$http', '$window', '$injector', ngWorkorderscoe]);

  function ngWorkorderscoe($timeout, $interval, $http, $window, $injector) {

    return {
      restrict: 'EA',
      scope: {
        workordersField : '=',
        workinstructionsField : '=',
        actionidField : '@',
        autolaunchField: '@',
        widthField : '@',
        heightField : '@',
        topoffsetField : '@',
        leftoffsetField : '@',
        modelidField : '@',
        delegateField: '='     // This a special field used to pass events like start 
      },
      template: '<div></div>',
      link: function (scope, element, attr) {

        var lastUpdated = 'unknown';
        let workorderscoe = undefined ;

        scope.renderer = $window.cordova ? vuforia : $injector.get('threeJsTmlRenderer');
                     
        var executeWidget = function(actionid) {
          console.log('do the custom activities here');
          if (workorderscoe == undefined) {
            try {
              workorderscoe = new WorkOrderscoe(scope,scope.workordersField , scope.actionidField , scope.widthField, scope.heightField , scope.topoffsetField ,scope.leftoffsetField , scope.modelidField);
            }catch(ex) {
              console.log('Creating the class WorkOrderscoe - somethimg when wrong! The exception >>'+ ex);
            }
          }
          $timeout(workorderscoe.doAction(actionid),50); 
          
        };
        var start = function() {
          console.log('Starting');
          scope.$parent.fireEvent('started');
          executeWidget();
        }
        var stop = function() {
          console.log('Stopping');
          scope.$parent.fireEvent('stopped');
          if (workorderscoe != undefined) {
   
          }
        }


        scope.$watch('workordersField', function () {
          console.log('dataField='+ scope.workordersField);
          if (scope.workordersField != undefined && scope.workordersField != '') {
            if (scope.autolaunchField == "true") {
              start();
            }
          }

        });

        scope.$watch('workinstructionsField', function () {
          console.log('dataField='+ scope.workinstructionsField);
          if (scope.workinstructionsField != undefined && scope.workinstructionsField != '') {
            
          }

        });

        scope.$watch('delegateField', function (delegate) {
          if (delegate) {
            delegate.displaywo = function () {
              executeWidget("GetWorkOrders");

            };
            delegate.displaywi = function () {
              executeWidget("GetWorkInstructions");
              
            };
            delegate.start = function () { 
              start(); 
            };
            delegate.stop = function () { 
              stop(); 
            };
          }
        });



        // Use this initially to see if your extension get deployed
        // If you don't see this message its not deployed
        // Comment out once you have it working
        scope.$watch( function() {
          console.log("workorderscoe Any watch "); 
        });
      }
    };
  }

}());
