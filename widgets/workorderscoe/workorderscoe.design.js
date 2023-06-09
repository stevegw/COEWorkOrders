// This widget definition will get combined into combined-widgets.js file along with all other widget definitions
// use of anonymous func ensures nothing here leaks into global scope
(function() {
  function twxWorkorderscoe() {
    return {
      // Required, this will be used as the top level tag when it's dropped on the Canvas
      // use a custom prefix to so the name won't collide with other widgets
      elementTag: 'twx-workorderscoe',

      // Text displayed for the widget in the Palette
      label: 'WorkOrders COE',

      // category to assign the widget to, this value will be used by the
      // project definition to filter which widgets are valid for that type of project
      category: 'ar',

      // list of groups this widget will be included in the widget palette
      // standard value are Containers, Input, and Other
      groups : ["COE Extension"],
      
      // avoids showing this widget in Studio; when duplicating this template, remove or change to true
      isVisibleInPalette: true,

      // List of properties that will be displayed in the widget properties panel once it's been dropped on the Canvas
      properties: [
        {
          name: 'workpackage',
          label: 'WorkPackage Incoming data',
          datatype: 'json',
          default: {},
          isBindingTarget: true,
          isBindingSource: false,
          showInput: false
        },

        {
          name: 'affectedparts',
          label: 'Affected Parts data',
          datatype: 'string',
          default: '',
          isBindingTarget: false,
          isBindingSource: true,
          showInput: false
        },   
        {
          name: 'autolaunch',
          label: 'Auto do start',
          datatype: 'boolean',
          default: false,
          isBindingTarget: true,
          isBindingSource: false,
          showInput: true
        },
        {
          name: 'selectedwo',
          label: 'Selected WorkOrder',
          datatype: 'string',
          default: '',
          isBindingTarget: true,
          isBindingSource: true,
          showInput: false
        },
        {
          name: 'selectedwi',
          label: 'Selected WorkInstruction',
          datatype: 'string',
          default: '',
          isBindingTarget: true,
          isBindingSource: true,
          showInput: false
        },  
        {
          name: 'wowidth',
          label: 'wo width',
          datatype: 'string',
          default: '40vw',
          isBindingTarget: true,
          isBindingSource: false,
          showInput: true
        },
        {
          name: 'woheight',
          label: 'wo height',
          datatype: 'string',
          default: '60vh',
          isBindingTarget: true,
          isBindingSource: false,
          showInput: true
        },
        {
          name: 'wiwidth',
          label: 'wi width',
          datatype: 'string',
          default: '40vw',
          isBindingTarget: true,
          isBindingSource: false,
          showInput: true
        },
        {
          name: 'wiheight',
          label: 'wi height',
          datatype: 'string',
          default: '60vh',
          isBindingTarget: true,
          isBindingSource: false,
          showInput: true
        },

        {
          name: 'wobottomoffset',
          label: 'wo bottom offset',
          datatype: 'string',
          default: '1px',
          isBindingTarget: true,
          isBindingSource: false,
          showInput: true
        },
        {
          name: 'wibottomoffset',
          label: 'wi bottom offset',
          datatype: 'string',
          default: '50px',
          isBindingTarget: true,
          isBindingSource: false,
          showInput: true
        },
        {
          name: 'leftoffset',
          label: 'left offset',
          datatype: 'string',
          default: '1px',
          isBindingTarget: true,
          isBindingSource: false,
          showInput: true
        }
      ],

      services: [
        {
          name: 'displaywp',
          label: 'Display WorkPackage'
        },
        {
          name: 'stop',
          label: 'Stop'
        }
      ],

      // List of events that will displayed in the widget properties panel
      events: [


        {
          name: 'workpackagereceieved',
          label: 'WorkPackage Receieved'
        },
        {
          name: 'completed',
          label: 'Completed action'
        }
      ],

      dependencies: {
        files         : ['js/workorderscoe-ng.js','js/workorderscoe.js', 'js/widgetcreator.js', 'images/workorderscoe_steps.png', 'images/workorderscoe_wo.png', 'images/images/workorderscoe_wi.png' , 'images/workorderscoe_close.png' ,'images/workorderscoe_back.png' ,'images/workorderscoe_next.png' ,'images/workorderscoe_expand.png' , 'images/workorderscoe_showwp.png' , 'images/workorderscoe_hidewp.png'],
        angularModules: ['workorderscoe-ng']
      },

      // HTML to render when the widget is dropped on the Canvas
      designTemplate: function () {
        return '<div class="workorderscoeWidget"></div>';
      },
  
      runtimeTemplate: function (props) {
        var tmpl = '<div ng-workorderscoe workpackage-field="me.workpackage"   affectedparts-field="me.affectedparts"  selectedwo-field="me.selectedwo" selectedwi-field="me.selectedwi" autolaunch-field={{me.autolaunch}}  incomingid-field={{me.incomingid}} wowidth-field={{me.wowidth}} woheight-field={{me.woheight}} wiwidth-field={{me.wiwidth}} wiheight-field={{me.wiheight}} wobottomoffset-field={{me.wobottomoffset}} wibottomoffset-field={{me.wibottomoffset}} leftoffset-field={{me.leftoffset}}  delegate-field="delegate"></div>' ; 
        return tmpl;
      }
    };
  }

  // registers the widget in Studio so that it gets displayed in the Widget Palette, it will only show up in the
  // Widget Palette for views that this widget is registered for (as determined by category property)
  twxAppBuilder.widget('twxWorkorderscoe', twxWorkorderscoe);

}());
