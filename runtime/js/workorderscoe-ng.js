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
        workpackageField : '=',
        workordersField : '=',
        workinstructionsField : '=',
        affectedpartsField: '=',
        selectedwoField: '=',
        selectedwiField: '=',
        actionidField : '@',
        autolaunchField: '@',
        wowidthField : '@',
        woheightField : '@',
        wobottomoffsetField : '@',
        wiwidthField : '@',
        wiheightField : '@',
        wibottomoffsetField : '@',
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
          console.log('Working on action ' + actionid);
          if (workorderscoe == undefined) {
            try {
              let widgetRegister = new WidgetRegister( scope.renderer , $injector , scope );
              workorderscoe = new WorkOrderscoe(scope, widgetRegister,  scope.wowidthField, scope.woheightField , scope.wiwidthField, scope.wiheightField , scope.wobottomoffsetField , scope.wibottomoffsetField ,scope.leftoffsetField , scope.modelidField);
            }catch(ex) {
              console.log('Creating the class WorkOrderscoe - somethimg when wrong! The exception >>'+ ex);
            }
          }


          workorderscoe.doAction(actionid, scope.workpackageField,  scope.workordersField, scope.workinstructionsField);
          
          
          // else {
          //    

          // }
  
          
        };
        // var start = function() {
        //   console.log('Starting');
        //   scope.$parent.fireEvent('started');
        //   executeWidget();
        // }
        var stop = function() {
          console.log('Stopping');
          scope.$parent.fireEvent('stopped');
          if (workorderscoe != undefined) {
   
          }
        }
        //
        // workPackageField has both a WO id and Title plus WorkInstrunction steps 
        // Step 0 holds all the details of the Work Order 
        // This is to makes it easy to work with and step through from baisc work order summary to each step
        //
        scope.$watch('workpackageField', function () {
          console.log('dataField='+ scope.workpackageField);
          if (scope.workpackageField != undefined && scope.workpackageField != '') {
            scope.$parent.fireEvent("workpackagereceieved");
            scope.$parent.$applyAsync();


            // let widgetRegister = new WidgetRegister( scope.renderer , $injector , scope );

            // widgetRegister.addWidget({
            //   originalWidget: "twx-dt-model",
            //   id: "model-1",
            //   src: "/Thingworx/FileRepositories/AutoARRepo/Ford/F150_MODEL.pvz" ,  //"app/resources/Uploaded/remote-control.pvz",
            //   y:"1",
            //   z:"2",
            //   events:[{name:"modelLoaded", value: "someExample()"}]
            // })


          }

        });

        scope.$watch('workordersField', function () {
          console.log('workordersField='+ scope.workordersField);
          if (scope.workordersField != undefined && scope.workordersField != '') {
            scope.$parent.fireEvent("workordersreceieved");
            scope.$parent.$applyAsync();
          }

        });

        scope.$watch('workinstructionsField', function () {
          console.log('workinstructionsField='+ scope.workinstructionsField);
          if (scope.workinstructionsField != undefined && scope.workinstructionsField != '') {
            scope.$parent.fireEvent("workinstructionsreceieved");
            scope.$parent.$applyAsync();
          }

        });


        scope.$watch('delegateField', function (delegate) {
          if (delegate) {
            delegate.displaywp = function () {
              executeWidget("GetWorkPackage");

            };
            delegate.displaywo = function () {
              executeWidget("GetWorkOrders");

            };
            delegate.displaywi = function () {
              executeWidget("GetWorkInstructions") ;
              
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
          //console.log("workorderscoe Any watch "); 
        });
      }
    };
  }

}());
