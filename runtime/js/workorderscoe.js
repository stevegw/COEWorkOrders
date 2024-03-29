

class WorkOrderscoe {

    UIContainerWI ;
    WorkOrders;
    SelectedWorkOrder;
    PanelSelector ; 
    CurrentWorkID;

//scope.wowidthField, scope.woheightField , scope.wiwidthField, scope.wiheightField , scope.wobottomoffsetField , scope.wibottomoffsetField ,scope.leftoffsetField , scope.modelidField
    constructor( vuforiaScope ) {
        // Not using the topoffset, leftoffset yet
        try {
            this.thxappkey =  config.appKey //"a9e0c42a-266d-4c4e-86ed-d346825540ae";
        } catch (error) {
            console.log("using default appKey");
            this.thxappkey =  "a9e0c42a-266d-4c4e-86ed-d346825540ae";
        }
        
        this.wowidth = vuforiaScope.wowidthField;
        this.woheight = vuforiaScope.woheightField;
        this.wiwidth = vuforiaScope.wiwidthField;
        this.wiheight = vuforiaScope.wiheightField;
        this.wobottom = vuforiaScope.wobottomoffsetField;
        this.wibottom = vuforiaScope.wibottomoffsetField;
        this.left = vuforiaScope.leftoffsetField;
        this.modelid = vuforiaScope.modelidField;
        this.UIContainerWI = undefined;
        
    }

    writetoConsole = function(message) {
        try {
            
            if ( config.debugToConsole) {
                console.log(message);
              }
        } catch (error) {
            console.log(message);
            console.log("Note the debugToConsole property in the config file was not able to be read - error=" +error);
        }

    }

    doAction (actionid, scope ) {

        let PanelQuery = 'body > ion-side-menus > ion-side-menu-content > ion-nav-view > ion-view > ion-content > twx-widget > twx-widget-content > \n' +
		'twx-container-content > twx-widget:nth-child(2) > twx-widget-content > div > twx-container-content';
       
        let BottomPanelQuery = 'body > ion-side-menus > ion-side-menu-content > ion-nav-view > ion-view > ion-content > twx-widget > twx-widget-content > \n' +
	    'twx-container-content > twx-widget:nth-child(2) > twx-widget-content > div > twx-container-content > div.panel.undefined.bottom';
        this.PanelSelector = document.querySelector(BottomPanelQuery); 

        if (actionid == 'GetHeroFromID') {
            let selectedWOIndex = 0; // for now allows select first work order when starting
            this.getHeroFromID(scope ); 
        }
        else if (actionid == 'GetWorkPackageFromID') {
            let selectedWOIndex = 0; // for now allows select first work order when starting
            this.getWorkPackageFromID(scope ); 
        }

        else if (actionid == 'GetWorkPackageAsSXSL') {
            let selectedWOIndex = 0; // for now allows select first work order when starting
            this.getSXSLdataAsURL(scope ); 
        }
        

        // else if (actionid == 'GetWorkPackage') {
        //     let selectedWOIndex = 0; // for now allows select first work order when starting
        //     this.getWorkPackage (workpackage , selectedWOIndex  ); 
        // }
        else if (actionid == 'BuildWorkPackage') {
            let selectedWOIndex = 0; // for now allows select first work order when starting

            if (this.CurrentWorkID != scope.workpackagedataField[0].WorkID) {
                this.buildWorkPackage (selectedWOIndex  , scope);
            }
            
        }

        else if (actionid == 'GetWorkOrders') {
            this.getWorkOrders(scope.workordersField); 
        }
        else if (actionid == 'GetWorkInstructions') {
            if (this.UIContainerWI != undefined) {
                try {
                    this.PanelSelector.removeChild(this.UIContainerWI);
                } catch (error) {
                    
                }

            }
            this.UIContainerWI = this.getWorkInstructionsSteps (scope.workinstructionsField , scope ); 
        }
        else  {
            // add more functions here with else if 
        }

    }

    getHeroFromID  (scope) {

        if (scope.heroidField != null && scope.heroidField != '') {
            this.writetoConsole("WorkPackage ID="+scope.heroidField );

            let heroid = scope.heroidField ;
            let http = scope.http;
            let URL = '/Thingworx/Things' + '/AutoARServiceHelper/Services/GetHeroData';
            let self = this;
            try {
            let headers = {
                Accept: 'application/json',
                "Content-Type": 'application/json',
                appKey: this.thxappkey
              };
              
              // Body
              let params = {
                "vin": heroid
              };
              let rc = this.writetoConsole;
              let vs = scope;
              http.post(URL, params, {
                headers: headers,
              })
              .then(
                function (data) {
                  if (data && data.data) {
    
                    rc("GetHeroData data.data >>>" + JSON.stringify(data.data.rows));
                    if (data.data.rows.length > 0 ) {
    
                        vs.heromodelField = data.data.rows[0].Model;
                        vs.heromtdatasetField = data.data.rows[0].MTDataset;
                        vs.heromtguideviewField = data.data.rows[0].MTGuideView;
                        vs.heromtidField = data.data.rows[0].MTID;
                        vs.herofolderField = data.data.rows[0].Folder;
                        vs.herorxField = data.data.rows[0].MTRx;
                        vs.heroryField = data.data.rows[0].MTRy;
                        vs.herorzField = data.data.rows[0].MTRz;
    
                        vs.$parent.fireEvent('herodatareturned');
    
                    }
                  }
                },
                function (status) {
                  vs.messageField = "Thingworx AutoARServiceHelper:GetHeroData service failed!"+ "\n" + "The status returned was:  "+ status + "\n" ; 
                  vs.$parent.fireEvent('message');
                  vs.$parent.fireEvent('failure');
                }
                
              )
            } catch (e) {
                    vs.messageField = 'Check application key or if server is running or error was ' + e  ; 
                    vs.$parent.fireEvent('message');
                    vs.$parent.fireEvent('failure');
            }

        }


    }

    getWorkPackageFromID (scope) {

        this.writetoConsole("WorkPackage/Hero ID="+scope.heroidField);

        let heroid = scope.heroidField;
        let http = scope.http;
        let URL = '/Thingworx/Things' + '/AutoARServiceHelper/Services/GetWorkPackage';
        let headers = {
            Accept: 'application/json',
            "Content-Type": 'application/json',
            appKey: this.thxappkey
          };
          
          // Body
          let params = {
            "vin": heroid
          };
          let rc = this.writetoConsole;
          let vs = scope;
          http.post(URL, params, {
            headers: headers,
          })
          .then(
            function (data) {
              if (data && data.data) {

                rc("GetWorkPackageData data.data >>>" + JSON.stringify(data.data));

                if (data.data.rows.length > 0 ) {

                    let wpout = [];
                    for (let index = 0; index < data.data.rows[0].WorkInstructions.rows.length; index++) {
                        const element = data.data.rows[0].WorkInstructions.rows[index];
                        wpout.push(element);
                        
                    }

                    vs.workpackagedataField = data.data.rows;
                    vs.$parent.fireEvent('workpackagereturned');
                    vs.$parent.$applyAsync();

                }
              }
            },
            function (status) {
    
                vs.messageField = "Thingworx AutoARServiceHelper:GetWorkPackage service failed!"+ "\n" + "The status returned was:  "+ status + "\n" ; 
                vs.$parent.fireEvent('message');
                vs.$parent.fireEvent('failure');
            }
          )



    }

    getSXSLdataAsURL (scope) {

        this.writetoConsole("WorkPackage/Hero ID="+scope.heroidField);

        let heroid = scope.heroidField;
        let http = scope.http;
        let URL = '/Thingworx/Things' + '/AutoARServiceHelper/Services/GetWorkPackageAsSXSL';
        let headers = {
            Accept: 'application/json',
            "Content-Type": 'application/json',
            appKey: this.thxappkey
          };
          
          // Body
          let params = {
            "vin": heroid
          };
          let rc = this.writetoConsole;
          let vs = scope;
          http.post(URL, params, {
            headers: headers,
          })
          .then(
            function (data) {
              if (data && data.data && data.data.rows.length > 0  ) {

                    vs.sxsldataField = data.data.rows[0].result;
                    vs.$parent.fireEvent('sxslurlreturned');
                    vs.$parent.$applyAsync();
                    rc('sxslurlreturned url=' + vs.sxsldataField  );
                
              }
            },
            function (status) {
    
                vs.messageField = "Thingworx AutoARServiceHelper:GetWorkPackageAsSXSL service failed!"+ "\n" + "The status returned was:  "+ JSON.stringify(status) + "\n" ; 
                vs.$parent.fireEvent('message');
                vs.$parent.fireEvent('failure');
            }
          )



    }

    buildWorkPackage ( selectedWOIndex  , scope) {

        let WPVISIBLE = true;
        let workpackage = scope.workpackagedataField
        this.CurrentWorkID = scope.workpackagedataField[0].WorkID;
        let currentStep = 1; 
        let steps = scope.workpackagedataField[selectedWOIndex].WorkInstructions.rows.length ;

        let WPContainer = document.createElement('div');
        WPContainer.id = 'wi-uicontainer';
        WPContainer.className = 'wi-uicontainer'; 
        WPContainer.style.bottom = this.wibottom;

        let WPInstructionsPanel = document.createElement('div');
        WPInstructionsPanel.id = 'wi-instructionpanel';
        WPInstructionsPanel.className = 'wi-instructionpanel'; 

        WPContainer.appendChild(WPInstructionsPanel);

        let WPHeaderContainer = document.createElement('div');
        WPHeaderContainer.id = 'wi-headercontainer';
        WPHeaderContainer.className = 'wi-headercontainer'; 
        
        let WPInstructionSteps = document.createElement('div');
        WPInstructionSteps.id = 'wi-instructionsteps';
        WPInstructionSteps.className = 'wi-instructionsteps'; 

        let WPCloseButton = document.createElement('img');
        WPCloseButton.src = "extensions/images/workorderscoe_hidewp.png"; 
        WPCloseButton.id = 'wi-closebutton';
        WPCloseButton.className = 'wi-closebutton'; 

        let WPOpenButton = document.createElement('img');
        WPOpenButton.src = "extensions/images/workorderscoe_showwp.png"; 
        WPOpenButton.id = 'wp-showbutton';
        WPOpenButton.className = 'wp-showbutton'; 

        WPCloseButton.addEventListener("click",  () => { 

            this.PanelSelector.removeChild(WPContainer);
            WPVISIBLE = false;
            this.PanelSelector.appendChild(WPOpenButton);
            
        });

        WPOpenButton.addEventListener("click",  () => { 

            this.PanelSelector.removeChild(WPOpenButton);
            WPVISIBLE = true;
            this.PanelSelector.appendChild(WPContainer);
            
        });

        WPHeaderContainer.appendChild(WPInstructionSteps);
        WPHeaderContainer.appendChild(WPCloseButton);

        let WPDetailsContainer = document.createElement('div');
        WPDetailsContainer.id = 'wi-details';
        WPDetailsContainer.className = 'wi-details'; 

        let WPDetailsLabel1 = document.createElement('div');
        WPDetailsLabel1.id = 'wi-label1';
        WPDetailsLabel1.className = 'wi-label1'; 

        let WPDetailsLabel2 = document.createElement('div');
        WPDetailsLabel2.id = 'wi-label2';
        WPDetailsLabel2.className = 'wi-label2'; 

        let WPDetailsLabel3 = document.createElement('div');
        WPDetailsLabel3.id = 'wi-label3';
        WPDetailsLabel3.className = 'wi-label3'; 

        WPDetailsContainer.appendChild(WPDetailsLabel1);
        WPDetailsContainer.appendChild(WPDetailsLabel2);
        WPDetailsContainer.appendChild(WPDetailsLabel3);

        let WPText = document.createElement('div');
        WPText.id = 'wi-text';
        WPText.className = 'wi-text'; 

        let WPBackForwardContainer = document.createElement('div');
        WPBackForwardContainer.id = 'wi-backforwardcontainer';
        WPBackForwardContainer.className = 'wi-backforwardcontainer'; 

        let WPBackButton = document.createElement('img');
        WPBackButton.id = 'wi-backbutton';
        WPBackButton.className = 'wi-backbutton'; 
        WPBackButton.src = "extensions/images/workorderscoe_back.png"; 

        if (currentStep == 1)  {
            WPBackButton.style.visibility = "hidden";
        }
        WPBackButton.addEventListener("click",  () => { 
            try { 


                if (currentStep > 1 ) { 
                    currentStep--;
                } 
                if (currentStep === 1)  {
                    WPBackButton.style.visibility = "hidden";
                    WOButton.style.visibility = "visible";
                    WOSelectcontainerContainer.style.visibility = "visible";
                }

                WPInstructionSteps.innerText = (currentStep ) +" OF " + (steps); 
                WPDetailsLabel1.innerText = workpackage[selectedWOIndex].WorkInstructions.rows[currentStep-1].Label1;
                WPDetailsLabel2.innerText = workpackage[selectedWOIndex].WorkInstructions.rows[currentStep-1].Label2;
                WPDetailsLabel3.innerText = workpackage[selectedWOIndex].WorkInstructions.rows[currentStep-1].Label3;
                WPText.innerText = workpackage[selectedWOIndex].WorkInstructions.rows[currentStep-1].StepDetail;        

                scope.affectedpartsField = this.getAffectedParts(currentStep , workpackage[selectedWOIndex].WorkInstructions );
                scope.$parent.fireEvent('workinstructionselected');
                scope.$parent.$applyAsync();

            } catch (ex) {
                console.log("Error in click event back button >>" + ex);
            }
    
        });

        let WPForwardButton = document.createElement('img');
        WPForwardButton.id = 'wi-nextbutton';
        WPForwardButton.className = 'wi-nextbutton'; 
        WPForwardButton.src = "extensions/images/workorderscoe_next.png"; 
        WPForwardButton.addEventListener("click",  () => { 

            try { 

                if (currentStep   < workpackage[selectedWOIndex].WorkInstructions.rows.length ) { 
                    currentStep++;
                    WPBackButton.style.visibility = "visible";
                } else {
                    currentStep = 1;
                    WPBackButton.style.visibility = "hidden";
                }
                if (currentStep > 1) {
                    WOButton.style.visibility = "hidden";
                    WOSelectcontainerContainer.style.visibility = "hidden";
                } else {
                    WOButton.style.visibility = "visible";
                    WOSelectcontainerContainer.style.visibility = "visible";
                }
                WPInstructionSteps.innerText = (currentStep ) +" OF " + (steps); 
                WPDetailsLabel1.innerText = workpackage[selectedWOIndex].WorkInstructions.rows[currentStep-1].Label1;
                WPDetailsLabel2.innerText = workpackage[selectedWOIndex].WorkInstructions.rows[currentStep-1].Label2;
                WPDetailsLabel3.innerText = workpackage[selectedWOIndex].WorkInstructions.rows[currentStep-1].Label3;    
                WPText.innerText = workpackage[selectedWOIndex].WorkInstructions.rows[currentStep-1].StepDetail; 

                scope.affectedpartsField = this.getAffectedParts(currentStep , workpackage[selectedWOIndex].WorkInstructions.rows);
                scope.$parent.fireEvent('workinstructionselected');
                scope.$parent.$applyAsync();

            } catch (ex) {
                console.log("Error in click event forward button >>" + ex);
            }
    
        });

        WPBackForwardContainer.appendChild(WPBackButton);
        WPBackForwardContainer.appendChild(WPForwardButton);

        let WPButtonBarContainer = document.createElement('div');
        WPButtonBarContainer.id = 'wi-buttonbarcontainer';
        WPButtonBarContainer.className = 'wi-buttonbarcontainer'; 

        let WOButton = document.createElement('img');
        WOButton.id = 'wo-workorders-img';
        WOButton.className = 'wo-workorders-img'; 
        WOButton.src = "extensions/images/workorderscoe_wo.png"; 


        let WOSelectcontainerContainer = document.createElement('div');
        WOSelectcontainerContainer.id = 'wo-selectcontainer';
        WOSelectcontainerContainer.className = 'wo-selectcontainer'; 

        let WorkOrderLabel = document.createElement("label");
        WorkOrderLabel.className = 'wo-selectlabel'; 
        WorkOrderLabel.innerHTML = "Work Order:";

        let WorkOrderList = document.createElement("select");
        WorkOrderList.id = "wo-picklistpanel";
        WorkOrderList.className = 'wo-picklistpanel'; 
        let listscope = scope;

        function listSelection (e) {

            selectedWOIndex = this.value;
            listscope.selectedwoField =  workpackage[selectedWOIndex].WorkID;
            listscope.$parent.fireEvent('workorderselected');
            listscope.$parent.$applyAsync();

            console.log("selected WorkID " + workpackage[selectedWOIndex].WorkID);
            currentStep = 1; 
            steps = workpackage[selectedWOIndex].WorkInstructions.rows.length ;
            WPInstructionSteps.innerText = (currentStep) +" OF " + (steps); 
            WPDetailsLabel1.innerText = workpackage[selectedWOIndex].WorkInstructions.rows[currentStep-1].Label1;
            WPDetailsLabel2.innerText = workpackage[selectedWOIndex].WorkInstructions.rows[currentStep-1].Label2;
            WPDetailsLabel3.innerText = workpackage[selectedWOIndex].WorkInstructions.rows[currentStep-1].Label3;
            WPText.innerText = workpackage[selectedWOIndex].WorkInstructions.rows[currentStep-1].StepDetail;  
            
            let modelsJSON = workpackage[selectedWOIndex].Models; 


            try {


                for (let index = 0; index < modelsJSON.array.length; index++) {
                    const element = modelsJSON.array[index];
                    scope.data.widgetRegister.addWidget({
                        originalWidget: "twx-dt-model",
                        id: element.model,
                        src: "/Thingworx/FileRepositories/AutoARRepo"+element.src ,  //"app/resources/Uploaded/remote-control.pvz",
                        x: "0",
                        y:"0",
                        z:"0",
                        rx: element.MTRx,
                        ry: element.MTRy,
                        rz: element.MTRz,
                        visible : "false",
                        events:[{name:"modelLoaded", value: "someExample()"}]
                      })
                        console.log("Model" + element.src);
                    
                }
                
            } catch (error) {
                console.log("Issues with widgetRegister error=" + error);
            }
    



        }
        
        //Create and append the options
        let option = document.createElement("option");
        option.value = "None";
        option.text = "None";
        WorkOrderList.appendChild(option);

        for (let i = 0; i < workpackage.length; i++) {
            let option = document.createElement("option");
            option.value = i;
            option.text = workpackage[i].Title;
            WorkOrderList.appendChild(option);

        }

        WorkOrderList.addEventListener("change",  listSelection );

        WOSelectcontainerContainer.appendChild(WorkOrderLabel);
        WOSelectcontainerContainer.appendChild(WorkOrderList);
        WPButtonBarContainer.appendChild(WOSelectcontainerContainer);

        WPInstructionsPanel.appendChild(WPHeaderContainer);
        WPInstructionsPanel.appendChild(WPDetailsContainer);
        WPInstructionsPanel.appendChild(WPText);
        WPInstructionsPanel.appendChild(WPBackForwardContainer);
        WPInstructionsPanel.appendChild(WPButtonBarContainer);

        this.PanelSelector.appendChild(WPContainer);
 
        return WPContainer;



    }


    getWorkOrders (workorders ,scope ) {

        this.WorkOrders = workorders; 
        let UIContainerWO = document.createElement('div');
        UIContainerWO.id = 'ui-container-wo';
        UIContainerWO.className = 'uicontainer'; 
        UIContainerWO.style.width = "1px";
        UIContainerWO.style.height = "1px";
        UIContainerWO.style.top = this.top;
        UIContainerWO.style.left = this.left; 

        let WorkOrderHeaderPanel = document.createElement('div');
        WorkOrderHeaderPanel.id = 'workorder-header-panel'; 
        WorkOrderHeaderPanel.className = 'workorderheaderpanel';    
        WorkOrderHeaderPanel.style.width = this.wowidth;
        WorkOrderHeaderPanel.style.height = this.woheight; 
        WorkOrderHeaderPanel.style.bottom = this.wobottom;
        WorkOrderHeaderPanel.style.left = this.left; 

        let WorkOrderButton = document.createElement('img');
        WorkOrderButton.className ="wo-button";
        WorkOrderButton.style.height = "40px";
        WorkOrderButton.style.width = "40px";
        WorkOrderButton.style.bottom = this.wobottom;
        WorkOrderButton.style.left = this.left; 
        WorkOrderButton.src = "extensions/images/workorderscoe_wo.png";
      
        let WorkOrderPicklist = document.createElement('div');
        WorkOrderPicklist.id = 'workorder-picklist-panel'; 
        WorkOrderPicklist.className = 'workorderpicklistpanel';   

        WorkOrderPicklist.style.width = this.wowidth;
        WorkOrderPicklist.style.height = this.woheight; 
        WorkOrderPicklist.style.bottom = "1px" ;
        WorkOrderPicklist.style.left = this.left; 

        let selectArray = workorders;

        let WorkOrderList = document.createElement("select");
        WorkOrderList.id = "workorderslist";
        WorkOrderList.className = 'workorderpicklist'; 
          
        WorkOrderPicklist.appendChild(WorkOrderList);

        let listscope = scope;

        function listSelection (e) {
            //alert('value ' + this.value);

            listscope.selectedwoField =  this.value;
            listscope.$parent.fireEvent('workorderselected');
            listscope.$parent.$applyAsync();
        }
        
        //Create and append the options
        let option = document.createElement("option");
        option.value = "None";
        option.text = "None";

        for (let i = 0; i < selectArray.length; i++) {

            option.value = selectArray[i].WorkID;
            option.text = selectArray[i].Title;
            WorkOrderList.appendChild(option);

        }

        WorkOrderList.addEventListener("change",  listSelection );
        WorkOrderHeaderPanel.appendChild(WorkOrderPicklist);
        
        let CloseButton = document.createElement('img');
        CloseButton.className ="woclosebutton";
        CloseButton.style.height = "40px";
        CloseButton.style.width = "40px";
        CloseButton.style.bottom = this.wobottom;
        CloseButton.style.left = this.left; 
        CloseButton.src = "extensions/images/workorders_close.png";
        CloseButton.addEventListener("click",  () => { 
            this.PanelSelector.removeChild(UIContainerWO);
        });

        WorkOrderHeaderPanel.appendChild(WorkOrderButton);
        UIContainerWO.appendChild(WorkOrderHeaderPanel);
        this.PanelSelector.appendChild(UIContainerWO);


    }

    getAffectedParts  (step , workinstructions ) {

        let affectedParts = [];
        let models =[];

        if (workinstructions[step-1].PartsList != null) {
            workinstructions[step-1].PartsList.rows.forEach(element => {
                let found = false;
                for(let i = 0; i < affectedParts.length; i++) {
                    if (affectedParts[i].path == element.MetadataID) {
                        found = true;
                        break;
                    }
                }
    
                if (!found) {
                    affectedParts.push ({"model":element.ModelName,"path":element.MetadataID});
                }

                found = false;
                for(let i = 0; i < models.length; i++) {
                    if (models[i].src == element.FileName) {
                        found = true;
                        break;
                    }
                }
    
                if (!found) {
                    models.push ({"model":element.ModelName, "src":element.FileName });
                }

            });

        } 

        
        return affectedParts;
    }
    

    getSelectStepPart (step , workinstructions) {

        let partsList = workinstructions[step-1].PartsList;
        let propertyname = partsList[0].MetadataPropertyName;
        let uniquepartid = partsList[0].MetadataID;
        let displayname = partsList[0].DisplayName;
        let modelName =   partsList[0].ModelName; //this.modelid;

        return {"model" : modelName , "path" : uniquepartid  };
    }

    getWorkOrderSummary (uiContainerWI , scope) {
 
        let found =  document.getElementById("wos-uicontainer");

        if (found != undefined) {
            this.PanelSelector.removeChild(found);
        }

        let found2 =  document.getElementById("wi-uicontainer");

        if (found2 != undefined) {
            this.PanelSelector.removeChild(found2);
        }


        let selectedIndex = 0;
        for (let i = 0; i < this.WorkOrders.length; i++) {
            
            if ( scope.selectedwoField === this.WorkOrders[i].WorkID) {
                selectedIndex = i; 
                break;
            };
            
        }


        let WOContainer = document.createElement('div');
        WOContainer.id = 'wo-uicontainer';
        WOContainer.className = 'wo-uicontainer'; 
        WOContainer.style.bottom = this.wibottom;
        WOContainer.style.left = this.left;

        let WOSummaryPanel = document.createElement('div');
        WOSummaryPanel.id = 'wo-summarypanel';   
        WOSummaryPanel.className = 'wo-summarypanel';  
        WOSummaryPanel.style.height = this.wiheight; 
        WOSummaryPanel.style.bottom = this.wibottom;
        WOSummaryPanel.style.left = this.left;


        let WOSummaryHeaderContainer = document.createElement('div');
        WOSummaryHeaderContainer.id = 'wo-headercontainer';
        WOSummaryHeaderContainer.className = 'wo-headercontainer'; 



        let WOCloseButton = document.createElement('img');
        WOCloseButton.className ="wi-closebutton";

        WOCloseButton.style.right = "0px";
        WOCloseButton.src = "extensions/images/workorderscoe_close.png";
        WOCloseButton.addEventListener("click",  () => { 
            try { 
                this.PanelSelector.removeChild(WOContainer);
            } catch (ex) {

            }
            
        });

        let WOSummaryTitle = document.createElement('div');
        WOSummaryTitle.id = 'wo-summarytitle';  
        WOSummaryTitle.innerText = "Work Order Summary: " + this.WorkOrders[selectedIndex].Title;
        WOSummaryTitle.className ='wo-summarytitle';

        WOSummaryHeaderContainer.appendChild(WOSummaryTitle);
        WOSummaryHeaderContainer.appendChild(WOCloseButton);

        let WOSummaryDetailPanel = document.createElement('div');
        WOSummaryDetailPanel.id = 'wo-detailspanel'; 
        WOSummaryDetailPanel.className = 'wo-detailspanel';  
        WOSummaryDetailPanel.innerText = this.WorkOrders[selectedIndex].Overview;  


        let WOSummaryTimeContainer = document.createElement('div');
        WOSummaryTimeContainer.id = 'wo-timecontainer';
        WOSummaryTimeContainer.className = 'wo-timecontainer'; 

        let WOSummaryDifficultyPanel = document.createElement('div');
        WOSummaryDifficultyPanel.id = 'wo-difficulty'; 
        WOSummaryDifficultyPanel.className = 'wo-difficulty'; 
        WOSummaryDifficultyPanel.innerText = "Level:" +this.WorkOrders[selectedIndex].Difficulty;

        
        let WOSummaryGotoStepsPanel = document.createElement('div');
        WOSummaryGotoStepsPanel.id = 'wi-instructionsteps'; 
        WOSummaryGotoStepsPanel.className = 'wi-type';  
        WOSummaryGotoStepsPanel.style.right = "0px";
        WOSummaryGotoStepsPanel.innerText = "Goto steps >";  
        
        let SelectButton = document.createElement('img');
        SelectButton.className ="wi-steps";
        SelectButton.style.right = "0px";
        SelectButton.src = "extensions/images/workorderscoe_steps.png";
        SelectButton.addEventListener("click",  () => { 
            try { 
                this.PanelSelector.removeChild(UIContainerWOS);

            } catch (ex) {
                console.log("error in selection button " + ex);
            }

            this.PanelSelector.appendChild(uiContainerWI);
            
        });
        
        let WOSummaryTimePanel = document.createElement('div');
        WOSummaryTimePanel.id = 'wos-text-time'; 
        WOSummaryTimePanel.className = 'wi-type'; 
        WOSummaryTimePanel.innerText = "Est. Time:" +this.WorkOrders[selectedIndex].Time;   



        WOSummaryTimeContainer.appendChild(WOSummaryDifficultyPanel);
        WOSummaryTimeContainer.appendChild(WOSummaryTimePanel);
        WOSummaryTimeContainer.appendChild(WOSummaryGotoStepsPanel);
        WOSummaryTimeContainer.appendChild(SelectButton);

        

        WOSummaryPanel.appendChild(WOSummaryHeaderContainer);
        WOSummaryPanel.appendChild(WOSummaryDetailPanel);  
        WOSummaryPanel.appendChild(WOSummaryTimeContainer); 
        
        WOContainer.appendChild(WOSummaryPanel); 

        let WOBackForwardContainer = document.createElement('div');
        WOBackForwardContainer.id = 'wi-backforwardcontainer';
        WOBackForwardContainer.className = 'wi-backforwardcontainer'; 

        let WOBackButton = document.createElement('img');
        WOBackButton.id = 'wi-backbutton';
        WOBackButton.className = 'wi-backbutton'; 
        WOBackButton.src = "extensions/images/workorderscoe_back.png"; 


        let WOForwardButton = document.createElement('img');
        WOForwardButton.id = 'wi-nextbutton';
        WOForwardButton.className = 'wi-nextbutton'; 
        WOForwardButton.src = "extensions/images/workorderscoe_next.png"; 

        WOBackForwardContainer.appendChild(WOBackButton);
        WOBackForwardContainer.appendChild(WOForwardButton);
        WOContainer.appendChild(WOBackForwardContainer); 

        this.PanelSelector.appendChild(WOContainer);

    }
    getWorkInstructionsSteps (workinstructions , scope ) {

        let currentStep = 1; 
        let steps = workinstructions.length ;

        let WIContainer = document.createElement('div');
        WIContainer.id = 'wi-uicontainer';
        WIContainer.className = 'wi-uicontainer'; 
        WIContainer.style.height = this.height;
        WIContainer.style.bottom = this.wibottom;

        let WIInstructionsPanel = document.createElement('div');
        WIInstructionsPanel.id = 'wi-instructionpanel';
        WIInstructionsPanel.className = 'wi-instructionpanel'; 

        WIContainer.appendChild(WIInstructionsPanel);

        let WIHeaderContainer = document.createElement('div');
        WIHeaderContainer.id = 'wi-headercontainer';
        WIHeaderContainer.className = 'wi-headercontainer'; 
        
        let WIInstructionSteps = document.createElement('div');
        WIInstructionSteps.id = 'wi-steps';
        WIInstructionSteps.className = 'wi-steps'; 
        WIInstructionSteps.innerText = currentStep +" OF " + steps; 

        let WICloseButton = document.createElement('img');
        WICloseButton.id = 'wi-closebutton';
        WICloseButton.className = 'wi-closebutton'; 
        WICloseButton.addEventListener("click",  () => { 
            this.PanelSelector.removeChild(WIContainer);
        });


        let WIDetailsContainer = document.createElement('div');
        WIDetailsContainer.id = 'wi-details';
        WIDetailsContainer.className = 'wi-details'; 

        let WIDetailsType = document.createElement('div');
        WIDetailsType.id = 'wi-type';
        WIDetailsType.className = 'wi-text'; 
        WIDetailsType.innerText = workinstructions[currentStep-1].StepType

        let WIDetailsText = document.createElement('div');
        WIDetailsText.id = 'wi-text';
        WIDetailsText.className = 'wi-text'; 
        WIDetailsText.innerText = workinstructions[currentStep-1].StepDetail;

        WIDetailsContainer.appendChild(WIDetailsType);
        WIDetailsContainer.appendChild(WIDetailsText);

        let WIBackForwardContainer = document.createElement('div');
        WIBackForwardContainer.id = 'wi-backforwardcontainer';
        WIBackForwardContainer.className = 'wi-backforwardcontainer'; 

        let WIBackButton = document.createElement('img');
        WIBackButton.id = 'wi-backbutton';
        WIBackButton.className = 'wi-backbutton'; 
        WIBackButton.src = "extensions/images/workorderscoe_back.png"; 
        WIBackButton.addEventListener("click",  () => { 
            try { 

                if (currentStep != 1 ) { 
                    currentStep--;
                } else {
                    currentStep = workinstructions.length ;
                }
                WIInstructionSteps.innerText = currentStep +" OF " + steps; 
                WIDetailsType.innerText = workinstructions[currentStep-1].StepType;//"This is the header text";
                WIDetailsText.innerText = workinstructions[currentStep-1].StepDetail;//"This is the work instruction text";  

                scope.outgoingdataField = this.getAffectedParts(currentStep, workinstructions );
                scope.$parent.fireEvent('workinstructionselected');
                scope.$parent.$applyAsync();

            } catch (ex) {

            }
    
        });

        let WIForwardButton = document.createElement('img');
        WIForwardButton.id = 'wi-nextbutton';
        WIForwardButton.className = 'wi-nextbutton'; 
        WIForwardButton.src = "extensions/images/workorderscoe_next.png"; 
        WIForwardButton.addEventListener("click",  () => { 

            try { 

                if (currentStep -1  < workinstructions.length -1 ) { 
                    currentStep++;
                } else {
                    currentStep = 1;
                }

                WIInstructionSteps.innerText = currentStep +" OF " + steps; 
                WIDetailsType.innerText = workinstructions[currentStep-1].StepType;//"This is the header text";
                WIDetailsText.innerText = workinstructions[currentStep-1].StepDetail;//"This is the work instruction text";  

                scope.affectedpartsField = this.getAffectedParts(currentStep , workinstructions);
                scope.$parent.fireEvent('workinstructionselected');
                scope.$parent.$applyAsync();

            } catch (ex) {

            }
    
        });

        WIBackForwardContainer.appendChild(WIBackButton);
        WIBackForwardContainer.appendChild(WIForwardButton);

        WIInstructionsPanel.appendChild(WIHeaderContainer);
        WIInstructionsPanel.appendChild(WIDetailsContainer);
        WIInstructionsPanel.appendChild(WIBackForwardContainer);


        let WOButtonbar = document.createElement('div');
        WOButtonbar.id = 'wo-buttonbarcontainer';
        WOButtonbar.className = 'wo-buttonbarcontainer'; 

        let WOButton = document.createElement('img');
        WOButton.id = 'wo-workorders-img';
        WOButton.className = 'wo-workorders-img'; 
        WOButton.src = "extensions/images/workorderscoe_wo.png"; 


        let WorkOrderLabel = document.createElement("label");
        WorkOrderLabel.htmlFor = "Work Order:";

        let WorkOrderList = document.createElement("select");
        WorkOrderList.id = "workorderslist";
        WorkOrderList.className = 'workorderpicklist'; 
        let listscope = scope;
        function listSelection (e) {
            //alert('value ' + this.value);

            listscope.selectedwoField =  this.value;
            listscope.$parent.fireEvent('workorderselected');
            listscope.$parent.$applyAsync();
        }
        
        let selectArray = [];
        //Create and append the options
        let option = document.createElement("option");
        option.text = "None";
        option.value = "None";
        WorkOrderList.appendChild(option);

        for (let i = 0; i < selectArray.length; i++) {
            
            option.value = selectArray[i].WorkID;
            option.text = selectArray[i].Title;
            WorkOrderList.appendChild(option);

        }

        this.getWorkOrderSummary(  WIContainer , scope );


        return WIContainer;
    }




}




 
