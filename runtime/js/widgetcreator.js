
class WidgetRegister {



    constructor(renderer , injector , scope ) {
         // Get $compiler to add elements as angular compiled DOM object! see injectWidget()
      this.injector = injector;
      this.$compile = this.injector.get("$compile");
      this.renderer = renderer;
      this.scope = scope;
      // Define default widgets Tags and function binding and later add custom 
      this.runningOnHololens = false;

      this.widgets = {
        "twx-dt-target"         : this.twxDtTarget.bind(this),
        //"twx-dt-tracker"        : this.twxDtTracker.bind(this),
        //"twx-dt-target-spatial" : this.twxDtTarget.bind(this),
        //"twx-dt-target-image"   : this.twxDtTarget.bind(this),
        //"twx-dt-target-model"   : this.twxDtTarget.bind(this),
        //"twx-dt-target-area"    : this.twxDtTarget.bind(this),
        "twx-dt-image"          : this.twxDtImage.bind(this),
        "twx-dt-label"          : this.twxDtLabel.bind(this),
        "twx-dt-sensor"         : this.twxDtSensor.bind(this),
        "twx-dt-model"          : this.twxDtModel.bind(this),
        "twx-dt-3dbutton"       : this.twxDt3dButton.bind(this),
        "twx-dt-3dpanel"        : this.twxDt3dPanel.bind(this),
        "twx-dt-3dvideo"        : this.twxDt3dVideo.bind(this),
        "twx-dt-3dimage-button" : this.twxDt3dImageButton.bind(this),
        "twx-dt-3dpress-button" : this.twxDt3dPressButton.bind(this),
        "twx-dt-3dtoggle-button": this.twxDt3dToggleButton.bind(this),
        "twx-dt-group"          : this.twxDtGroup.bind(this),
        // Current Implementation of Wayfinder doesn't allow init of widget. Because it use afterEnter Event in isolatedScope :(
        "twx-dt-wayfinder"      : this.twxDtWayfinder.bind(this),
        "twx-dt-3dleaderline"   : this.twxDt3dLeaderline.bind(this)
      }
    }

    addWidget(widgetDefs = [], insertPos = undefined) {
      // create an array if just one object is provided
      if(!Array.isArray(widgetDefs)){
        widgetDefs = [widgetDefs]
      }


      widgetDefs.forEach(initProps=> {
        if(typeof initProps.id === "undefined") {
          console.error("You need to define a unique identifier(id) for your widget. Nothing has been created!")
          return
        }
        
        // Execute the specific built function of selected widgetTag
        if(typeof this.widgets[initProps.originalWidget] !== "undefined") {
          let myWidget = this.widgets[initProps.originalWidget](initProps);
          this.injectWidget(myWidget,insertPos);
        }
        else {
          console.error("The selected widget tag is not registered, please check originalWidget property or load extension first!")
        }
      })
    }

    registerWidget(widgetTag,runtimeTemplate,defaults={}) {
      if (typeof runtimeTemplate !== "undefined") {
        let self = this;
        this.widgets[widgetTag] = function (initProps) {
          let props = self.builtWidgetDefaults(initProps, defaults);
          let result = runtimeTemplate(props);
          return self.builtWidget(widgetTag, result, props);
        }
      }
      else
        console.error("widget need to be a JSON object containing, runtimeTemplate, defaults and WidgetTag ")
    }

    // Not working right now, Targets get init on experience load and can't added later (with current know how)
    twxDtTarget(initProps) {
    let defaults = {
      markerId: '',
      width: 0.0254,
      istracked: false,
      trackingIndicator: true,
      stationary: true,
      url: "app/resources/Default/thing_code_phantom.png"
    }
    
    let props = this.builtWidgetDefaults(initProps,defaults);
    
    let runtimeTemplate = `<twx-dt-target id="${props.id}" src="{{'vuforia-vumark:///vumark?id=' + me.markerId}}" guide-src="app/resources/Default/thing_code_phantom.png" size="{{me.width}}" x="{{me.x}}" y="{{me.y}}" z="{{me.z}}" rx="{{me.rx}}" ry="{{me.ry}}" rz="{{me.rz}}"  istracked="{{me.istracked}}" trackingIndicator="{{me.trackingIndicator}}" stationary="{{me.stationary}}"><twx-dt-image id="${props.id}-image" sx = "{{me.width*4.51}}" sy = "{{me.width*4.51}}" sz = "{{me.width*4.51}}" x="{{me.x}}" y="{{me.y}}" z="{{me.z}}" rx="{{me.rx}}" ry="{{me.ry}}" rz="{{me.rz}}" hidden="{{!me.trackingIndicator}}" billboard="{{me.billboard}}" occlude="{{me.occlude}}" decal="{{me.decal}}" shader="recogniser;active f {{pulse}}"  src="img/recognised.png?name=sampler0 img/recognised2.png?name=sampler1" trackingIndicator="{{me.trackingIndicator}}" stationary="{{me.stationary}}"></twx-dt-image></twx-dt-target>`

      return this.builtWidget('twx-dt-target', runtimeTemplate, props);
    }

    twxDtLabel(initProps) {
      // Widget Defaults for props which are not defined by user or is a global default like x = 0
      let defaults = {
        text: "Label",
        textprops: ''
      }

      // Add the defaults configured specific for this widget to initProps but only if nothing is defined 
      let props = this.builtWidgetDefaults(initProps, defaults);

      // The angular element which is the heart of our Widget 
      let runtimeTemplate = `<twx-dt-label id="${props.id}" text="{{me.text}}" height="{{me.height}}" width="{{me.width}}" class="basic-3d-state-formatting {{me.class}}"
      enablestateformatting="{{me.enableStateFormatting}}" stateformatvalue="{{me.stateFormatValue}}" stateformat="{{me.stateFormat}}" fontfamily="{{me.fontFamily}}" textattrs="{{me.textprops}}" fontcolor="{{me.fontColor}}"
      fontoutlinecolor="{{me.fontOutlineColor}}" sx="{{me.scale}}" sy="{{me.scale}}" sz="{{me.scale}}" x="{{me.x}}" y="{{me.y}}" z="{{me.z}}" rx="{{me.rx}}" ry="{{me.ry}}" rz="{{me.rz}}"
      hidden="{{app.fn.getThreeStateBoolInv(me.visible)}}" billboard="{{me.billboard}}" occlude="{{me.occlude}}" decal="{{me.decal}}" experimental-one-sided="{{me.experimentalOneSided}}" opacity="{{me.opacity}}" 
      pivot="{{me.pivot}}" shader="{{me.shader}}"></twx-dt-label>`;

      // Return the finished HTML DOM Element
      return this.builtWidget('twx-dt-label', runtimeTemplate, props);
    }

    twxDtImage(initProps) {
      let runtimeTemplate = `<twx-dt-image id="${initProps.id}" ng-src="{{me.src | trustUrl}}"
      src="" height="{{me.height}}" width="{{me.width}}" class="basic-3d-state-formatting {{me.class}}" sx="{{me.scale}}"
      sy="{{me.scale}}" sz="{{me.scale}}" x="{{me.x}}" y="{{me.y}}" z="{{me.z}}" rx="{{me.rx}}" ry="{{me.ry}}" rz="{{me.rz}}" hidden="{{app.fn.getThreeStateBoolInv(me.visible)}}" billboard="{{me.billboard}}"
      occlude="{{me.occlude}}" decal="{{me.decal}}" experimental-one-sided="{{me.experimentalOneSided}}" opacity="{{me.opacity}}" pivot="{{me.pivot}}" shader="{{me.shader}}">#leaderlines#</twx-dt-image>`;
      return this.builtWidget('twx-dt-image', runtimeTemplate, initProps);
    }

    twxDtSensor(initProps) {
      let defaults = {
        text: '###',
        font: 'Arial',
        fontsize: '40px',
        canvasheight: 128.0,
        canvaswidth: 128.0,
        imagex: 0,
        imagey: 0,
        imageattrs: '',
        textx: 64,
        texty: 94,
        textattrs: 'fill:rgba(255, 255, 255, 1);textbaseline:middle;textalign:center',
        billboard: true,
        canvasgrowthoverride: 'image+text',
        src: 'app/resources/Default/vu_gauge1.svg',
        textprops: ''
      }
    
    let props = this.builtWidgetDefaults(initProps,defaults)
    
    let runtimeTemplate = `<twx-dt-sensor id="${props.id}" sx="{{me.scale.split(\' \')[0] || me.scale}}" sy="{{me.scale.split(\' \')[1] || me.scale}}" sz="{{me.scale.split(\' \')[2] || me.scale}}" x="{{me.x}}" y="{{me.y}}" z="{{me.z}}" rx="{{me.rx}}" ry="{{me.ry}}" rz="{{me.rz}}"
      hidden="{{app.fn.getThreeStateBoolInv(me.visible)}}" billboard="{{me.billboard}}" occlude="{{me.occlude}}" decal="{{me.decal}}" experimental-one-sided="{{me.experimentalOneSided}}"  opacity="{{me.opacity}}" 
      pivot="{{me.pivot}}" hidden="{{app.fn.getThreeStateBoolInv(me.visible)}}" ng-src="{{me.src | trustUrl}}" src="{{me.src}}" shader="{{me.shader}}" height="{{me.height}}" width="{{me.width}}" 
      canvasheight="{{me.canvasheight}}" canvaswidth="{{me.canvaswidth}}" imageattrs="{{app.fn.buildImageAttrs(me.imagex,me.imagey,me.imageattrs)}}" textattrs="{{app.fn.buildTextAttrs(me.textx,me.texty,me.font,me.fontsize,me.textattrs)}}"
      canvasgrowthoverride="{{me.canvasgrowthoverride}}" textx="{{me.textx}}" texty="{{me.texty}}" imagex="{{me.imagex}}" imagey="{{me.imagey}}" text="{{me.text}}" interactable-hint="true">#leaderlines#</twx-dt-sensor>`;
    
      return this.builtWidget('twx-dt-sensor', runtimeTemplate, props);
    }

    twxDtModel(initProps) {
      let defaults = {
        forceHidden: false,
        translucent: false,
        sequence: '',
        services: ['forward', 'play', 'playAll', 'reset', 'rewind', 'stop']
      }

      let props = this.builtWidgetDefaults(initProps, defaults)

      let runtimeTemplate = `<twx-dt-model id="${props.id}" ng-src='{{me.src | trustUrl}}' src="{{me.src}}"  sx="{{me.scale.split(' ')[0] || me.scale}}" sy="{{me.scale.split(' ')[1] || me.scale}}" sz="{{me.scale.split(' ')[2] || me.scale}}" x="{{me.x}}" y="{{me.y}}" z="{{me.z}}" rx="{{me.rx}}" ry="{{me.ry}}" rz="{{me.rz}}" hidden={{app.fn.getThreeStateBoolInv(me.visible)}}  force-hidden="{{me.forceHidden}}" occlude="{{me.occlude}}" decal="{{me.decal}}" opacity="{{me.opacity}}" phantom="{{!me.translucent}}"  shader="{{me.shader}}" sequenceList="{{me.sequenceList}}" sequence="{{me.sequence}}" showSequenceInCanvas="{{me.showSequenceInCanvas}}" steps="{{me.steps}}" currentStep="{{me.currentStep}}" stepName="{{me.stepName}}" stepDescription="{{me.stepDescription}}" playing="{{me.playing}}" sequencePartIds="{{me.sequencePartIds}}" ><twx-container-content></twx-container-content></twx-dt-model>`;

      return this.builtWidget('twx-dt-model', runtimeTemplate, props);
    }

    twxDt3dButton(initProps) {
      let defaults = {
        height: 0.045,
        width: 0.16,
        fontColor: 'rgba(65, 65, 65, 1);',
        buttonColor: 'rgba(235, 235, 235, 1);'
      }

      let props = this.builtWidgetDefaults(initProps, defaults);

      let runtimeTemplate = `<twx-dt-3dbutton id="${props.id}" text="{{me.text}}" ng-src="{{me.src | trustUrl}}" src="" height="{{me.height}}" width="{{me.width}}"
      fontcolor="{{me.fontColor.endsWith(\';\')? me.fontColor.slice(0, -1): me.fontColor}}" fontOutlineColor="{{me.fontColor.endsWith(\';\')? me.fontColor.slice(0, -1): me.fontColor}}" 
      color="{{me.color.endsWith(\';\')? me.color.slice(0, -1): me.color}}" backercolor="{{me.color.endsWith(\';\')? me.color.slice(0, -1): me.color}}"
      x="{{me.x}}" y="{{me.y}}" z="{{me.z}}" rx="{{me.rx}}" ry="{{me.ry}}" rz="{{me.rz}}" hidden="{{app.fn.getThreeStateBoolInv(me.visible)}}" shader="ButtonFullEffects"
      backervisibility="{{me.backervisibility}}" interactable-hint="true"></twx-dt-3dbutton>`;
      return this.builtWidget('twx-dt-3dbutton', runtimeTemplate, props);
    }

    twxDt3dPanel(initProps) {
      let defaults = {
        tagalong: false,
        width: 0.3,
        height: 0.3,
        snap: 0.5,
        offsetz: 0.6,
        offsetx: 0,
        buttonColor: 'rgba(38,97,148,1);',
        panelColor: 'rgba(20, 0, 0, 1);',
        shader: 'ButtonEdge',
        services: ['show','hide']
      }
      let props = this.builtWidgetDefaults(initProps,defaults)

      const pinBtnPosSize = widget3dUtils.getPanelPinButtonRelativePositionAndSize(Number(props.width), Number(props.height));

      const pinBtnSrc = widget3dUtils.getRuntimeTagalongIcon(props.tagalong);

      let runtimeTemplate = `<ng-panel3d
            id-field=${props.id}
            isholo-field=true
            shader-field={{me.shader}}
            visible-field={{me.visible}}
            width-field={{me.width}}
            height-field={{me.height}}
            tagalong-field=me.tagalong
            billboard-field={{me.billboard}}
            delegate-field="delegate"
          >
            <twx-dt-group
              id=${props.id}
              panelColor="{{me.panelColor}}"
              x="{{me.x}}" y="{{me.y}}" z="{{me.z}}"
              rx="{{me.rx}}" ry="{{me.ry}}" rz="{{me.rz}}"
              sx=1 sy=1 sz=1
              shader=""
              hidden="{{app.fn.getThreeStateBoolInv(me.visible)}}"
              billboard={{me.billboard}}
              tagalong={{me.tagalong}}
              tagalong-snapping-distance="{{me.snap}}"
              tagalong-offset="{{me.offsetx}} {{me.offsetz}}"
            >
              <twx-dt-model
                id=${props.id}-panel
                src='${widget3dUtils.BoxPrimitiveTemplate}'
                opacity="1"
                hidden=-1
                x=0 y=0 z=-0.01
                rx=0 ry=0 rz=0
                sx={{me.width}} sy={{me.height}} sz=1
                decal="false"
                shader="{{me.shader}}"
              >
                <twx-dt-modelitem
                  id=${props.id}-panel-model-item"
                  for=${props.id}-panel
                  occurrence="/"
                  color="{{app.fn.sanitizeRgbColor(me.panelColor)}}"
                >
                </twx-dt-modelitem>
              </twx-dt-model>
              <ng-toggle3d
                id="${props.id}-pin"
                id-field="${props.id}-pin"
                isholo-field=true
                height-field=${pinBtnPosSize.size}
                width-field=${pinBtnPosSize.size}
                font-field="{{me.fontColor.endsWith(&apos;;&apos;)? me.fontColor.slice(0, -1): me.fontColor}}"
                text-field=""
                textnotpressed-field=""
                src-field=${widget3dUtils.getRuntimeTagalongIcon(true)}
                srcnotpressed-field=${widget3dUtils.getRuntimeTagalongIcon(false)}
                pressed-field="me.tagalong"
                disabled-field=false
                delegate-field="delegate"
                color-field={{app.fn.sanitizeRgbColor(me.buttonColor)}}
              >
                <twx-dt-3dbutton
                  id="${props.id}-pin"
                  class="toggle3dWidget"
                  text=""
                  src=${pinBtnSrc}
                  height=${pinBtnPosSize.size} width=${pinBtnPosSize.size}
                  fontcolor="{{me.fontColor.endsWith(&apos;;&apos;)? me.fontColor.slice(0, -1): me.fontColor}}"
                  fontoutlinecolor="{{me.fontColor.endsWith(&apos;;&apos;)? me.fontColor.slice(0, -1): me.fontColor}}"
                  color="{{app.fn.sanitizeRgbColor(me.buttonColor)}}"
                  backercolor="{{app.fn.sanitizeRgbColor(me.buttonColor)}}"
                  x=${pinBtnPosSize.x} y=${pinBtnPosSize.y} z=${pinBtnPosSize.z}
                  rx=0 ry=0 rz=0
                  hidden=-1
                  interactable-hint="true"
                  backervisibility="false"
                >
                </twx-dt-3dbutton>
              </ng-toggle3d>
              <twx-container-content>#children#</twx-container-content>
            </twx-dt-group>
          </ng-panel3d>`;
      
      return this.builtWidget('twx-dt-3dpanel', runtimeTemplate, props);
    }

    
    // Group Widget normaly used by the 3D panel widget. It works pretty well as stand alone.
    // This Widget is able to get nested!
    twxDtGroup(initProps) {
      let runtimeTemplate = `<twx-dt-group id="${initProps.id}" x="{{me.x}}" y="{{me.y}}" z="{{me.z}}"
        rx="{{me.rx}}" ry="{{me.ry}}" rz="{{me.rz}}" sx=1 sy=1 sz=1 shader=""
        hidden="{{app.fn.getThreeStateBoolInv(me.visible)}}" billboard={{me.billboard}}>
        <twx-container-content>#children#</twx-container-content>
      </twx-dt-group>`;
      return this.builtWidget('twx-dt-group', runtimeTemplate, initProps);
    }

    twxDtTracker(initProps) {
      let runtimeTemplate = `<twx-dt-tracker id="${initProps.id}" enabletrackingevents="${initProps.enabletrackingevents}"><twx-container-content></twx-container-content></twx-dt-tracker>`;
      this.injectWidget(runtimeTemplate, document.querySelector("twx-dt-view"));
      //return this.builtWidget('twx-dt-tracker', runtimeTemplate, initProps);
    }

    twxDt3dVideo(initProps) {
      let defaults = {
        snap: 0.5,
        offsetz: 0.6,
        offsetx: 0,
        tagalong: false,
        width: 0.22,
        height: 0.186,
        hideControls: false,
        preload: true,
        isPlaying: false,
        buttonColor: 'rgba(38,97,148,1);',
        panelColor: 'rgba(20, 0, 0, 1);',
        shader: 'ButtonEdge',
        services: ['play','pause','stop','skipahead','skipback']
      }
      let props = this.builtWidgetDefaults(initProps,defaults);

      let height = Number(props.height);
      let width = Number(props.width);
      
      // Calculate new position for buttons:
      let pinBtnPosSize = widget3dUtils.getPanelPinButtonRelativePositionAndSize(width, height);
      let mediaBtnsPosSize = widget3dUtils.getPanelMediaControlButtonsRelativePositionsAndSize(width, height);

      // Calculate new position for image:
      let imageWidth = width - widget3dUtils.PanelEdgeMinMargin * 2;
      let imageHeight = height - widget3dUtils.PanelEdgeMinMargin * 2;
      let hideControls = props.hideControls === 'true' || props.hideControls === true;
      if (!hideControls) {
        imageHeight -= widget3dUtils.PanelChildWidgetsMinMargin + mediaBtnsPosSize.size;
      }

      let yLocImage = height / 2 - widget3dUtils.PanelEdgeMinMargin - imageHeight / 2;

      const pinBtnSrc = widget3dUtils.getRuntimeTagalongIcon(props.tagalong);

      const buttonsHidden = "'{{app.fn.isTrue(me.hideControls) ? true : -1}}'";
      let runtimeTemplate = `<ng-video3d id-field="${props.id}" isholo-field="true" src-field="{{me.src | trustUrl}}" height-field={{me.height}}
      width-field={{me.width}} showcontrols-field="{{!app.fn.isTrue(me.hideControls)}}" playing-field="me.isPlaying"
      tagalong-field=me.tagalong buttons-size-field=${mediaBtnsPosSize.size} delegate-field="delegate">
      <twx-dt-group id="${props.id}" x={{me.x}} y={{me.y}} z={{me.z}} rx={{me.rx}} ry={{me.ry}} rz={{me.rz}} sx=1 sy=1
        sz=1 hidden="{{app.fn.getThreeStateBoolInv(me.visible)}}" shader="ButtonEdge" opacity=1 tagalong={{me.tagalong}} tagalong-snapping-distance="{{me.snap}}"
        tagalong-offset="{{me.offsetx}} {{me.offsetz}}">
        <twx-dt-model id="${props.id}-panel" x=0 y=0 z=-0.01 rx=0 ry=0 rz=0
          sx="{{me.width}}" sy="{{me.height}}" sz=1 hidden=-1 decal="false" shader="ButtonEdge" src='${widget3dUtils.BoxPrimitiveTemplate}'>
          <twx-dt-modelitem id="${props.id}-model-item" for="${props.id}-panel" occurrence="/"
            color="{{app.fn.sanitizeRgbColor(me.panelColor)}}">
          </twx-dt-modelitem>
        </twx-dt-model>
        <twx-dt-video id="${props.id}-video" src="{{me.src | trustUrl}}" height=${imageHeight} width=${imageWidth} x=0
          y=${yLocImage} z=0 rx=0 ry=0 rz=0 sx=1 sy=1 sz=1 hidden=-1 preload="{{me.preload}}" interactable-hint="true"
          decal="false" pivot="5" shader="Default">
        </twx-dt-video>
        <ng-press3d id="${props.id}-next" id-field="${props.id}-next" isholo-field="true"
          height-field=${mediaBtnsPosSize.size} width-field=${mediaBtnsPosSize.size}
          color="{{app.fn.sanitizeRgbColor(me.buttonColor)}}" text-field=""
          src-field="app/resources/Default/3D_Video_Skip_Ahead.png" disabled-field=false
          color-field={{app.fn.sanitizeRgbColor(me.buttonColor)}}>
          <twx-dt-3dbutton id="${props.id}-next" src="app/resources/Default/3D_Video_Skip_Ahead.png" text=""
            height=${mediaBtnsPosSize.size} width=${mediaBtnsPosSize.size}
            color="{{app.fn.sanitizeRgbColor(me.buttonColor)}}"
            backercolor="{{app.fn.sanitizeRgbColor(me.buttonColor)}}" x=${mediaBtnsPosSize.xSkipA}
            y=${mediaBtnsPosSize.y} z=0 rx=0 ry=0 rz=0 hidden=${buttonsHidden} interactable-hint="true"
            backervisibility="false"></twx-dt-3dbutton>
        </ng-press3d>
        <ng-press3d id="${props.id}-prev" id-field="${props.id}-prev" isholo-field="true"
          height-field=${mediaBtnsPosSize.size} width-field=${mediaBtnsPosSize.size}
          color="{{app.fn.sanitizeRgbColor(me.buttonColor)}}" text-field=""
          src-field="app/resources/Default/3D_Video_Skip_Back.png" disabled-field=false
          color-field={{app.fn.sanitizeRgbColor(me.buttonColor)}}>
          <twx-dt-3dbutton id="${props.id}-prev" src="app/resources/Default/3D_Video_Skip_Back.png" text=""
            height=${mediaBtnsPosSize.size} width=${mediaBtnsPosSize.size}
            color="{{app.fn.sanitizeRgbColor(me.buttonColor)}}"
            backercolor="{{app.fn.sanitizeRgbColor(me.buttonColor)}}" x=${mediaBtnsPosSize.xSkipB}
            y=${mediaBtnsPosSize.y} z=0 rx=0 ry=0 rz=0 hidden=${buttonsHidden} interactable-hint="true"
            backervisibility="false"></twx-dt-3dbutton>
        </ng-press3d>
        <ng-press3d id="${props.id}-stop" id-field="${props.id}-stop" isholo-field="true"
          height-field=${mediaBtnsPosSize.size} width-field=${mediaBtnsPosSize.size}
          color="{{app.fn.sanitizeRgbColor(me.buttonColor)}}" text-field=""
          src-field="app/resources/Default/3D_Video_Stop.png" disabled-field=false
          color-field={{app.fn.sanitizeRgbColor(me.buttonColor)}}>
          <twx-dt-3dbutton id="${props.id}-stop" src="app/resources/Default/3D_Video_Stop.png" text=""
            height=${mediaBtnsPosSize.size} width=${mediaBtnsPosSize.size}
            color="{{app.fn.sanitizeRgbColor(me.buttonColor)}}"
            backercolor="{{app.fn.sanitizeRgbColor(me.buttonColor)}}" x=${mediaBtnsPosSize.xStop}
            y=${mediaBtnsPosSize.y} z=0 rx=0 ry=0 rz=0 hidden=${buttonsHidden} interactable-hint="true"
            backervisibility="false"></twx-dt-3dbutton>
        </ng-press3d>
        <ng-toggle3d id="${props.id}-play" id-field="${props.id}-play" isholo-field="true"
          height-field=${mediaBtnsPosSize.size} width-field=${mediaBtnsPosSize.size}
          color="{{app.fn.sanitizeRgbColor(me.buttonColor)}}" text-field="" textnotpressed-field=""
          src-field="app/resources/Default/3D_Video_Pause.png"
          srcnotpressed-field="app/resources/Default/3D_Video_Play.png" pressed-field="me.isPlaying"
          disabled-field=false delegate-field="delegate" color-field={{app.fn.sanitizeRgbColor(me.buttonColor)}}>
          <twx-dt-3dbutton id="${props.id}-play" text="" src="app/resources/Default/3D_Video_Play.png"
            height=${mediaBtnsPosSize.size} width=${mediaBtnsPosSize.size}
            color="{{app.fn.sanitizeRgbColor(me.buttonColor)}}"
            backercolor="{{app.fn.sanitizeRgbColor(me.buttonColor)}}" x=${mediaBtnsPosSize.xPlay}
            y=${mediaBtnsPosSize.y} z=0 rx=0 ry=0 rz=0 hidden=${buttonsHidden} interactable-hint="true"
            backervisibility="false"></twx-dt-3dbutton>
        </ng-toggle3d>
        <ng-toggle3d id="${props.id}-pin" id-field="${props.id}-pin" isholo-field="true"
          height-field=${pinBtnPosSize.size} width-field=${pinBtnPosSize.size}
          font-field="{{me.fontColor.endsWith(&apos;;&apos;)? me.fontColor.slice(0, -1): me.fontColor}}" text-field=""
          textnotpressed-field="" src-field=${widget3dUtils.getRuntimeTagalongIcon(true)}
          srcnotpressed-field=${widget3dUtils.getRuntimeTagalongIcon(false)} pressed-field="me.tagalong"
          disabled-field=false delegate-field="delegate" color-field={{app.fn.sanitizeRgbColor(me.buttonColor)}}>
          <twx-dt-3dbutton id="${props.id}-pin" class="toggle3dWidget" text="" src=${pinBtnSrc}
            height=${pinBtnPosSize.size} width=${pinBtnPosSize.size}
            fontcolor="{{me.fontColor.endsWith(&apos;;&apos;)? me.fontColor.slice(0, -1): me.fontColor}}"
            fontoutlinecolor="{{me.fontColor.endsWith(&apos;;&apos;)? me.fontColor.slice(0, -1): me.fontColor}}"
            color="{{app.fn.sanitizeRgbColor(me.buttonColor)}}"
            backercolor="{{app.fn.sanitizeRgbColor(me.buttonColor)}}" x=${pinBtnPosSize.x} y=${pinBtnPosSize.y}
            z=${pinBtnPosSize.z} rx=0 ry=0 rz=0 hidden=-1 interactable-hint="true" backervisibility="false">
          </twx-dt-3dbutton>
        </ng-toggle3d>
      </twx-dt-group>
    </ng-video3d>`
      
      return this.builtWidget('twx-dt-3dvideo', runtimeTemplate, props);
    }

    twxDt3dImageButton(initProps) {
      let defaults = {
        height: 0.04,
        width: 0.04,
        text: '',
        src: 'app/resources/Default/toggleMissing.png',
        textNotPressed: '',
        srcNotPressed: '',
        pressed: false,
        fontColor: 'rgba(255, 255, 255, 1);',
        color: 'rgba(28, 97, 148, 1);',
        disabled: false,
        services: ['set','reset']
      }

      let props = this.builtWidgetDefaults(initProps,defaults);

      let runtimeTemplate = `<ng-toggle3d id-field="${props.id}" isholo-field="true" height-field={{me.height}} width-field={{me.width}}
      font-field="{{app.fn.sanitizeRgbColor(me.fontColor)}}" text-field={{me.text}}
      textnotpressed-field={{me.textNotPressed}} smallicon-field="false" multilinetext-field="false"
      src-field={{me.src}} srcnotpressed-field={{me.srcNotPressed}} pressed-field="me.pressed"
      disabled-field="me.disabled" delegate-field="delegate" color-field={{app.fn.sanitizeRgbColor(me.color)}}>
      <twx-dt-3dbutton id="${props.id}" text="" height="{{me.height}}" width="{{me.width}}"
        fontcolor="{{app.fn.sanitizeRgbColor(me.fontColor)}}"
        fontoutlinecolor="{{app.fn.sanitizeRgbColor(me.fontColor)}}" color="{{app.fn.sanitizeRgbColor(me.color)}}"
        backercolor="{{app.fn.sanitizeRgbColor(me.color)}}" x="{{me.x}}" y="{{me.y}}" z="{{me.z}}" rx="{{me.rx}}"
        ry="{{me.ry}}" rz="{{me.rz}}" hidden={{app.fn.getThreeStateBoolInv(me.visible)}} shader="ButtonFullEffects"
        interactable-hint="true" backervisibility="false">
      </twx-dt-3dbutton></ng-toggle3d>`;
      // use replace click here to be more align with other widgets so you can pass also click as event and it gets parsed to pressed
      return this.builtWidget('twx-dt-3dimage-button', runtimeTemplate, props).replace(' name="click" ', ' name="pressed" ')
    }

    twxDt3dPressButton(initProps) {
      let defaults = {
        height: 0.04,
        width: 0.04,
        text: 'Button',
        src: '',
        fontColor: 'rgba(255, 255, 255, 1);',
        color: 'rgba(28, 97, 148, 1);',
        disabled: false,
        fontsize: "120"
      }

      let props = this.builtWidgetDefaults(initProps,defaults);

      let runtimeTemplate = `<ng-press3d id-field="${props.id}" isholo-field="true" height-field={{me.height}}
        width-field={{me.width}} font-field="{{app.fn.sanitizeRgbColor(me.fontColor)}}" text-field={{me.text}}
        src-field={{me.src}} disabled-field="me.disabled" color-field={{app.fn.sanitizeRgbColor(me.color)}}>
        <twx-dt-3dbutton id="${props.id}" class="press3dWidget" text="" height="{{me.height}}"
          width="{{me.width}}" fontcolor="{{app.fn.sanitizeRgbColor(me.fontColor)}}"
          fontoutlinecolor="{{app.fn.sanitizeRgbColor(me.fontColor)}}" color="{{app.fn.sanitizeRgbColor(me.color)}}"
          backercolor="{{app.fn.sanitizeRgbColor(me.color)}}" x="{{me.x}}" y="{{me.y}}" z="{{me.z}}" rx="{{me.rx}}"
          ry="{{me.ry}}" rz="{{me.rz}}" hidden="{{app.fn.getThreeStateBoolInv(me.visible)}}" shader="ButtonFullEffects"
          interactable-hint="true" backervisibility="false">
        </twx-dt-3dbutton>
      </ng-press3d>`;
      // use replace click here to be more align with other widgets so you can pass also click as event and it gets parsed to pressed
      return this.builtWidget('twx-dt-3dpress-button', runtimeTemplate, props).replace(' name="click" ', ' name="pressed" ')
    }

    twxDt3dToggleButton(initProps) {
      let defaults = {
        height: 0.04,
        width: 0.04,
        text: '',
        src: 'app/resources/Default/toggleOn.png',
        textNotPressed: '',
        srcNotPressed: 'app/resources/Default/toggleOff.png',
        pressed: false,
        fontColor: 'rgba(255, 255, 255, 1);',
        color: 'rgba(28, 97, 148, 1);',
        disabled: false,
        services: ['set','reset']
      }

      let props = this.builtWidgetDefaults(initProps,defaults);

      let runtimeTemplate = `<ng-toggle3d id-field="${props.id}" isholo-field="true" height-field={{me.height}}
        width-field={{me.width}} font-field="{{app.fn.sanitizeRgbColor(me.fontColor)}}" text-field={{me.text}}
        textnotpressed-field={{me.textNotPressed}} src-field={{me.src}} srcnotpressed-field={{me.srcNotPressed}}
        pressed-field="me.pressed" disabled-field="me.disabled" delegate-field="delegate" color-field={{app.fn.sanitizeRgbColor(me.color)}}>
        <twx-dt-3dbutton
          id="${props.id}" text="" height="{{me.height}}" width="{{me.width}}" fontcolor="{{app.fn.sanitizeRgbColor(me.fontColor)}}"
          fontoutlinecolor="{{app.fn.sanitizeRgbColor(me.fontColor)}}" color="{{app.fn.sanitizeRgbColor(me.color)}}"
          backercolor="{{app.fn.sanitizeRgbColor(me.color)}}" x="{{me.x}}" y="{{me.y}}" z="{{me.z}}" rx="{{me.rx}}" ry="{{me.ry}}" rz="{{me.rz}}"
          hidden="{{app.fn.getThreeStateBoolInv(me.visible)}}" shader="ButtonFullEffects" interactable-hint="true" backervisibility="false">
        </twx-dt-3dbutton>
      </ng-toggle3d>`;
      // use replace click here to be more align with other widgets so you can pass also click as event and it gets parsed to pressed
      return this.builtWidget('twx-dt-3dtoggle-button', runtimeTemplate, props).replace(' name="click" ', ' name="pressed" ')
    }

    twxDtWayfinder(initProps) {
      let defaults = {
        ribbonColor: '#FFA500',
        eventRadius: 0.25,
        wayfinderDisplayBoundary: 0.5,
        autoAdvance: false,
        looping: false,
        showRibbon: true,
        showWaypoints: true,
        showLabels: true,
        labelsOnTop: false,
        enabled: true,
        showReticle: true,
        selectedWaypointIndex: 0,
        waypointsData: [],
        services: ['next','previous']
      }

      let props = this.builtWidgetDefaults(initProps,defaults);
      let runtimeTemplate = '';

      /* this.renderer.setShader("navfogged", 
      `attribute vec3 vertexPosition;
      attribute vec2 vertexTexCoord;
      varying vec2 texCoord;
      varying float dist;
      uniform mat4 modelViewProjectionMatrix;
      uniform mat4 modelViewMatrix;
      uniform mat4 modelMatrix;
      uniform mat4 normalMatrix;

      void main() {
        vec4 vertexNormal=vec4(0.,0.,1.,0.);
        vec4 vp = vec4(vertexPosition, 1.0);
        gl_Position = modelViewProjectionMatrix * vp;
        texCoord = vertexTexCoord;
        vec3 vv = vec3(modelViewMatrix * vp);
        dist = length(vv);
      }`, `precision mediump float;
      varying vec2 texCoord;
      varying float dist;
      uniform sampler2D img;
      uniform float fade;
      uniform float r;
      uniform float g;
      uniform float b;
      uniform vec4 surfaceColor;

      void main(void) {
        gl_FragColor = vec4(r,g,b, 1.);
      }`); */

      const forholo = this.runningOnHololens;
      const reticleTagalongDistance = 1;
      const waypointLabelStyle = 'padding: 4em;';
      const bracketsImagePath = 'img/wayfinder_frame.png';
      const waypointImagePath = 'img/waypoint_placeholder.svg';

      const screenOverlayElements = `
        <div
          ng-show="wayfinderReticleVisibility"
          style="height: 100vh; width: 100vw; top: 0vh; position: absolute; pointer-events: none;"
        >
          <img
            id="wayfinder_frame"
            src="${bracketsImagePath}"
            style="width: 144px; height: 144px; margin-left:-72px; margin-top:-72px; top: 50%; left: 50%; pointer-events: none; position:absolute;"
          />
          <img
            id="wayfinder_circle"
            src="{{app.fn.getWayfinderIconSource('wayfinder_circle',me.ribbonColor)}}"
            style="width: 48px; height: 48px; margin-left:-24px; margin-top:-24px; top: 50%; left: 50%; pointer-events: none; position:absolute;"
          />
          <img
            id="wayfinder_icon"
            src="{{app.fn.getWayfinderIconSource('wayfinder_icon',me.ribbonColor)}}"
            style="width: 20px; height: 24px; margin-left:-10px; margin-top:-12px; top: 50%; left: 50%; pointer-events: none; position:absolute;"
          />
        </div>
        <div
          ng-show="wayfinderOffscreenIndicatorVisibility"
          style="height: 100vh; width: 100vw; top: 0vh; position: absolute; pointer-events: none;"
        >
          <img
            id="wayfinder_arrow"
            src="{{app.fn.getWayfinderIconSource('wayfinder_arrow',me.ribbonColor)}}"
            style="width: 24px; height: 24px; margin-left:-12px; margin-top:-12px; transform: {{wayfinderOffscreenIndicatorRotation}}; top: {{wayfinderOffscreenIndicatorTop}}; left: {{wayfinderOffscreenIndicatorLeft}}; pointer-events: none; position:absolute;"
          />
        </div>
      `;

      // Bad practise :( guys!!!
      const vs1g = `
        <script name="navfogged" type="x-shader/x-vertex"> 
          attribute vec3 vertexPosition;
          attribute vec2 vertexTexCoord;
          varying vec2 texCoord;
          varying float dist;
          uniform mat4 modelViewProjectionMatrix;
          uniform mat4 modelViewMatrix;
          uniform mat4 modelMatrix;
          uniform mat4 normalMatrix;

          void main() {
            vec4 vertexNormal=vec4(0.,0.,1.,0.);
            vec4 vp = vec4(vertexPosition, 1.0);
            gl_Position = modelViewProjectionMatrix * vp;
            texCoord = vertexTexCoord;
            vec3 vv = vec3(modelViewMatrix * vp);
            dist = length(vv);
          }
          </script>
      `;
      const ps1g = `
        <script name="navfogged" type="x-shader/x-fragment">
          precision mediump float;
          varying vec2 texCoord;
          varying float dist;
          uniform sampler2D img;
          uniform float fade;
          uniform float r;
          uniform float g;
          uniform float b;
          uniform vec4 surfaceColor;

          void main(void) {
            gl_FragColor = vec4(r,g,b, 1.);
          }
        </script>
      `;

      const ribbonElements = `
        <div ng-repeat="obj in wayfinderHelper.ribbonSphereObjects">
          <twx-dt-model
            id="{{obj.name}}"
            x=0 y=0 z=0
            rx=0 ry=0 rz=0
            opacity=1.0
            src="{{obj.src}}"
            decal=true
            hidden=true
            shader="navfogged"
          >
          </twx-dt-model>
        </div>
      `;
      const ctrl = `
      <div ng-wayfinder 
        id-field=${props.id}
        isholo-field=${forholo}
        enabled-field="me.enabled"
        showwaypoints-field={{me.showWaypoints}}
        showribbon-field={{me.showRibbon}}
        showreticle-field={{me.showReticle}}
        wayfinderdisplayboundary-field={{me.wayfinderDisplayBoundary}}
        eventradius-field={{me.eventRadius}}
        autoadvance-field={{me.autoAdvance}}
        looping-field={{me.looping}}
        waypointsdata-field="me.waypointsData"
        selectedwaypointindex-field="me.selectedWaypointIndex"
        selectedwaypointdata-field="me.selectedWaypointData"
        ribboncolor-field={{me.ribbonColor}}
        showlabels-field={{me.showLabels}}
        reticle-tagalong-distance-field = ${reticleTagalongDistance}
        delegate-field="delegate"
      >
      </div>`;

      const waypointElementsForMobileAndPreview = `
        <twx-dt-image
          id="activeWaypointImage"
          src="${waypointImagePath}"
          opacity=1.0
          sx=1 sy=1 sz=1
          hidden=true
          decal=true
          billboard=true
          shader=""
        >
        </twx-dt-image>
        <twx-dt-label
          id="activeWaypointLabel"
          class="waypoint-label"
          y=0.09
          text=""
          style="${waypointLabelStyle}"
          sx=1 sy=1 sz=1
          hidden=true
          billboard=true
          decal={{me.labelsOnTop}}
          opacity=1.0
        >
        </twx-dt-label>
      `;
      const waypointElementsForHoloLens = `
          <twx-dt-group
            id ="activeWaypoint"
            hidden=true
          >
            ${waypointElementsForMobileAndPreview}
          </twx-dt-group>
        `;

      const guideElementsForHoloLens = `
          <twx-dt-group
            id="wayPointGuide"
            tagalong=2 tagalong-snapping-distance=0 tagalong-offset="0 ${reticleTagalongDistance}"
            hidden=true
          >
            <twx-dt-image
              id="wayPointGuideBrackets"
              height=0.09 width=0.09
              src="${bracketsImagePath}"
              hidden=-1
              decal=true
            >
            </twx-dt-image>
            <twx-dt-image
              id="wayPointGuideCompass"
              height=0.04
              z=-0.001
              src="{{app.fn.getWayfinderIconSource('wayfinder_arrow',me.ribbonColor)}}"
              hidden=-1
              decal=true
            >
            </twx-dt-image>
            <twx-dt-image
              id="wayPointGuideCircle"
              height=0.04 width=0.04
              z=-0.001
              src="{{app.fn.getWayfinderIconSource('wayfinder_circle',me.ribbonColor)}}"
              hidden=-1
              decal=true
            >
            </twx-dt-image>
            <twx-dt-image
              id="wayPointGuideIcon"
              height=0.02
              z=-0.002
              src="{{app.fn.getWayfinderIconSource('wayfinder_icon',me.ribbonColor)}}"
              hidden=-1
              decal=true
            >
            </twx-dt-image>
            <twx-dt-image
              id="wayPointGuidePlaceholder"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
              z=-0.0003
              height=0.0001
              hidden=-1
              decal=false
            >
            </twx-dt-image>
          </twx-dt-group>
        `;

      if (forholo) {
        runtimeTemplate = (
          ctrl +
          waypointElementsForHoloLens +
          guideElementsForHoloLens +
          // these are required just for preview:
          screenOverlayElements +
          ribbonElements
        );
      } else {
        runtimeTemplate = ctrl + waypointElementsForMobileAndPreview + screenOverlayElements + ribbonElements;
      }

      return this.builtWidget('twx-dt-wayfinder', runtimeTemplate, props);
    }

    twxDt3dLeaderline(initProps) {
      let defaults = {
        x: 0,
        y: 0,
        z: 0,
        color: 'rgb(0,255,255)',
        thickness: '0.8',
        kneeJointLength: 0
      }

      let props = this.builtWidgetDefaults(initProps,defaults);

      let runtimeTemplate = `<twx-dt-3dleaderline
            id="${props.id}"
            x={{me.x}}
            y={{me.y}}
            z={{me.z}}
            from="{{me.originWidgetId}}"
            to={{me.destinationWidgetId}}
            occurrence="{{me.occurrence}}"
            knee-joint-length={{me.kneeJointLength}}
            thickness={{me.thickness}}
            color="{{me.color}}"
          >
          </twx-dt-3dleaderline>`;

        return this.builtWidget('twx-dt-3dLeaderline', runtimeTemplate, props);
    }

    builtWidgetDefaults(initProps, defaults) {
      for(let prop in defaults) {
        if(typeof initProps[prop] === "undefined")
        initProps[prop] = defaults[prop]
      }
      return initProps;
    }

    builtEvents(allEvents=[]) {
      if(Array.isArray(allEvents)) {
        let events = "";
        allEvents.forEach(evt => {
          events+= `<twx-widget-event name="${evt.name}" ${typeof evt.value === "string" ? 'value="'+evt.value+'"': ""}></twx-widget-event>`
        })
        return events;
      }
      else
        return "";
    }

    builtServices(allServices=[]) {
      if(Array.isArray(allServices)) {
        let services = "";
        allServices.forEach(srv => {
          services+= `<twx-widget-service name="${srv}"></twx-widget-service>`
        })
        return services;
      }
      else
        return "";
    }

    builtInitProperties(template, initProps) {
      let templStr = new String(template)
      let re = new RegExp(/\bme.(\w+)/gm);
      let m;
      let propsArray = [];
      do {
        m = re.exec(template);
        if (m)
          propsArray.push(m[1]);
      } while (m);
      //let propsArray = Array.from(templStr.matchAll(/\bme.(\w+)/gm), m => m[1]); //propsArray = template.match(/\b(?<=me.)\w+/gm);  //This is the old regex producing errors on iOS
      let properties = {};
      properties.widgetName = {
        value: initProps.id,
        datatype: "string"
      }
      // Remove duplicates like scale
      propsArray.forEach((prop) => {
        if (typeof properties[prop] === "undefined") {
          properties[prop] = {};
          // Check if we have input Values for init and if so add it to value
          if (typeof initProps[prop] !== "undefined") {
            properties[prop].value = initProps[prop];
          } else {
            properties[prop].value = undefined
          }

          //Studio default datatype Number
          if (prop === "src" || prop === "sequence")
            properties[prop].datatype = "resource_url";
          else if (['x', 'y', 'z', 'rx', 'ry', 'rz', 'width', 'height', 'opacity'].includes(prop)) {
            properties[prop].datatype = "number";
          } else if (['visible', 'billboard', 'occlude', 'decal', 'experimentalOneSided', 'tagalong', 'enableStateFormatting'].includes(prop)) {
            properties[prop].datatype = "boolean";
          } else if (['scale', 'shader', 'text', 'class'].includes(prop)) {
            properties[prop].datatype = "string";
          } else if (['pivot'].includes(prop)) {
            properties[prop].datatype = "select";
          } else {
            properties[prop].datatype = "string";
          }

          if (properties[prop].value == undefined) {
            switch (prop) {
              //Numbers
              case 'x':
              case 'y':
              case 'z':
              case 'rx':
              case 'ry':
              case 'rz':
                properties[prop].value = 0.0;
                break;
              case 'opacity':
                properties[prop].value = 1;
                break;
              case 'height':
              case 'width':
                properties[prop].value = '';
                break;
              case 'pivot':
                properties[prop].value = "5";
                break;
              case 'visible':
                properties[prop].value = true;
                break;
              case 'billboard':
              case 'occlude':
              case 'decal':
              case 'experimentalOneSided':
              case 'enableStateFormatting':
                properties[prop].value = false;
                break;
              case 'scale':
                properties[prop].value = "1.0";
                break;
              case 'shader':
              case 'src':
                properties[prop].value = '';
                break;
              case 'stateFormatValue':
                properties[prop].value = 'text';
                break;
              default:
                break;
            }
          }
        }
      });

      let propertiesStr = "";
      for (let name in properties) {
        let prop = properties[name];
        propertiesStr += `<twx-widget-property name="${name}" datatype="${prop.datatype}" ${(prop.value === '' ? ' value' : (prop.value != undefined ? ` value="` + prop.value +`"` : ''))}></twx-widget-property>`
      }
      return propertiesStr;
    }

    builtChildren(includedWdgs) {
      let children = "";
      if(includedWdgs != "undefined") {
        includedWdgs.forEach(wdg=>{children += this.widgets[wdg.originalWidget](wdg)})
        return children;
      }
    }

    builtWidget(tagName, runtimeTemplate, initProps) {
      try {
        if(typeof initProps.children !== "undefined") {
          var gotOnlyParentProps = runtimeTemplate.substring(0,runtimeTemplate.indexOf('#children#')) // We don't want to let the parent get all properties from children so make a sub string to only get parents attributes
          runtimeTemplate = runtimeTemplate.replace("#children#", this.builtChildren(initProps.children));
        }
        // Introduce leaderlines for easier use a bit different as children in Panels and to be sure they are only as valid for 3DGauges and 3DImages this small changed if here
        if(typeof initProps.leaderlines !== "undefined" && (initProps.originalWidget === "twx-dt-sensor" || initProps.originalWidget === "twx-dt-image")) {
          var gotOnlyParentProps = runtimeTemplate.substring(0,runtimeTemplate.indexOf('#leaderlines#')) // We don't want to let the parent get all properties from children so make a sub string to only get parents attributes
          initProps.leaderlines.forEach(line => {
            line.originalWidget = "twx-dt-3dleaderline";
            line.originWidgetId = initProps.id;
            // See twxDtLeaderLine.design.js in delegate getKneeJointLengthForWidget for more info!
            if(typeof line.kneeJointLength !== "undefined")
              line.kneeJointLength = (initProps.width ? initProps.width : 0.1) * (initProps.scale ? initProps.scale : 1.0) / 2.0 * 1.5; 
          })
          runtimeTemplate = runtimeTemplate.replace("#leaderlines#", "<twx-container-content>" + this.builtChildren(initProps.leaderlines) +"</twx-container-content>");
        }
    
        let myWidget = '<twx-widget widget-id="' + initProps.id + '" original-widget="' + tagName + '" widget-name="' + initProps.id + '">' + this.builtEvents(initProps.events) + this.builtServices(initProps.services) + this.builtInitProperties(initProps.children ? gotOnlyParentProps : runtimeTemplate, initProps) + '<twx-widget-content>' + runtimeTemplate + '</twx-widget-content></twx-widget>';
        return myWidget;
      }
      catch(e) {
        console.log("XXX builtWidget " + e);
      }
    }

    injectWidget(widget, insertPos) {
      // This is a default config of studio not 100% sure why, but to be align with ootb
      widget = angular.element(twx.app.isPreview() ? widget.replace(/<twx-dt-modelitem /ig, '<twx-dt-modelitem ng-if="$root.thingViewReady !== false" ') : widget);

      angular.element(insertPos ? insertPos : document.querySelector("#tracker1 > twx-container-content")).append(widget);
      this.$compile(widget)(angular.element(document.querySelector("#tracker1")).scope());
      try{
      if(widget) {
        let models = widget.find("twx-dt-model")
        for(let i = 0; i < models.length; i++){
          let model = models[i];
          if(model.id.endsWith("-panel") && model.getAttribute("src") == '{"type":"box","height":1,"width":1,"depth":0.01}') {
            // This fix an error with panel widgets (buffer geometry) is not rendered correctly!
            setTimeout(()=>{
              //console.log(model.getAttribute("src"))
              //if(window.twx.app.isPreview())
              this.renderer.setProperties(model.id, {shader: "ButtonEdge"});
              this.renderer.setTranslation(model.id,0,0,-0.01);
              this.renderer.setScale(model.id,model.getAttribute("sx"),model.getAttribute("sy"),1);
              this.scope.$applyAsync();
            },0);
          }
        }
      }
    }catch(e){console.log(e)}
      /*if(widget) {
        let models = widget.find("twx-dt-model")
        for(let i = 0; i < models.length; i++){
          let model = models[i];
          console.log(model)
          if(model.id.endsWith("-panel")) {
            console.log(model.id)
            // try to recompile panels till they get init with shader me.shader which results in very bad behavoir!
            this.$compile(angular.element(model))(angular.element(document.querySelector("#tracker1")).scope());
          }
        }
      }*/
    //console.log("XXX: injectWidget #2")
    }

  }
