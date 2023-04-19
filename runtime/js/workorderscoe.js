

class WorkOrderscoe {

    UIContainerWI ;
    WorkOrders;
    SelectedWorkOrder;

    constructor( vuforiaScope, wowidth, woheight , wiwidth, wiheight , wobottom , wibottom ,  left , modelid ) {
        // Not using the topoffset, leftoffset yet
        this.vuforiaScope  = vuforiaScope;
        this.wowidth = wowidth;
        this.woheight = woheight;
        this.wiwidth = wiwidth;
        this.wiheight = wiheight;
        this.wobottom = wobottom;
        this.wibottom = wibottom;
        this.left = left;
        this.modelid = modelid;
        this.UIContainerWI = undefined;
        
    }


    doAction = function (actionid , workorders , workinstructions) {

        let PanelQuery = 'body > ion-side-menus > ion-side-menu-content > ion-nav-view > ion-view > ion-content > twx-widget > twx-widget-content > \n' +
		'twx-container-content > twx-widget:nth-child(2) > twx-widget-content > div > twx-container-content';
        let PanelSelector = document.querySelector(PanelQuery); 


        if (actionid == 'GetWorkOrders') {
            this.getWorkOrders (workorders ,PanelSelector); 
        }
        else if (actionid == 'GetWorkInstructions') {
            if (this.UIContainerWI != undefined) {
                try {
                    PanelSelector.removeChild(this.UIContainerWI);
                } catch (error) {
                    
                }

            }
            this.UIContainerWI = this.getWorkInstructionsSteps (workinstructions ,PanelSelector); 
        }
        else  {
            // add more functions here with else if 
        }

    }

    getWorkOrders = function (workorders , panelSelector) {


        this.WorkOrders = workorders; 
        let UIContainerWO = document.createElement('div');
        UIContainerWO.id = 'ui-container-wo';
        UIContainerWO.className = 'uicontainer'; 
        UIContainerWO.style.width = "1px";
        UIContainerWO.style.height = "1px";
        UIContainerWO.style.top = this.top;
        UIContainerWO.style.left = this.left; 

        var WorkOrderHeaderPanel = document.createElement('div');
        WorkOrderHeaderPanel.id = 'workorder-header-panel'; 
        WorkOrderHeaderPanel.className = 'workorderheaderpanel';    
        WorkOrderHeaderPanel.style.width = this.wowidth;
        WorkOrderHeaderPanel.style.height = this.woheight; 
        WorkOrderHeaderPanel.style.bottom = this.wobottom;
        WorkOrderHeaderPanel.style.left = this.left; 

        var WorkOrderButton = document.createElement('img');
        WorkOrderButton.className ="wo-button";
        WorkOrderButton.style.height = "40px";
        WorkOrderButton.style.width = "40px";
        WorkOrderButton.style.bottom = this.wobottom;
        WorkOrderButton.style.left = this.left; 
        WorkOrderButton.src = "extensions/images/workorderscoe_wo.png";
      
        var WorkOrderPicklist = document.createElement('div');
        WorkOrderPicklist.id = 'workorder-picklist-panel'; 
        WorkOrderPicklist.className = 'workorderpicklistpanel';   
        //WorkOrderPicklist.innerHTML = "Work Orders"; 
        WorkOrderPicklist.style.width = this.wowidth;
        WorkOrderPicklist.style.height = this.woheight; 
        WorkOrderPicklist.style.bottom = "1px" ;
        WorkOrderPicklist.style.left = this.left; 
   
    

        //let selectArray = ["W0001", "W0002", "W0003", "W0004"];
        let selectArray = workorders;

        let WorkOrderList = document.createElement("select");
        WorkOrderList.id = "workorderslist";
        WorkOrderList.className = 'workorderpicklist'; 
          
        WorkOrderPicklist.appendChild(WorkOrderList);

        let listscope = this.vuforiaScope;
        function listSelection (e) {
            //alert('value ' + this.value);

            listscope.selectedwoField =  this.value;
            listscope.$parent.fireEvent('workorderselected');
            listscope.$parent.$applyAsync();
        }
        
        //Create and append the options
        for (var i = 0; i < selectArray.length; i++) {
        var option = document.createElement("option");
        option.value = selectArray[i].WorkID;
        option.text = selectArray[i].Title;
        WorkOrderList.appendChild(option);

        }

        WorkOrderList.addEventListener("change",  listSelection );
        WorkOrderHeaderPanel.appendChild(WorkOrderPicklist);
        
        var CloseButton = document.createElement('img');
        CloseButton.className ="woclosebutton";
        CloseButton.style.height = "40px";
        CloseButton.style.width = "40px";
        CloseButton.style.bottom = this.wobottom;
        CloseButton.style.left = this.left; 
        CloseButton.src = "extensions/images/widgetcoe_close.png";
        CloseButton.addEventListener("click",  () => { 

            try { 
                //this.markupCanvas.vuforiaScope.$parent.fireEvent('markCancelled');
            } catch (ex) {

            }

            panelSelector.removeChild(UIContainerWO);
    
        });

        WorkOrderHeaderPanel.appendChild(WorkOrderButton);
        UIContainerWO.appendChild(WorkOrderHeaderPanel);
        panelSelector.appendChild(UIContainerWO);


    }

    getAffectedParts = function  (step , workinstructions) {

        // let partsList = workinstructions[step-1].PartsList;
        // let propertyname = partsList[0].MetadataPropertyName;
        // let uniquepartid = partsList[0].MetadataID;
        // let displayname = partsList[0].DisplayName;
        // let modelName =   partsList[0].ModelName; //this.modelid;

        let affectedParts = [];
        workinstructions[step-1].PartsList.forEach(element => {


            var found = false;
            for(var i = 0; i < workinstructions.length; i++) {
                if (workinstructions[i].path == element.MetadataID) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                affectedParts.push ({"model":element.ModelName,"path":element.MetadataID});
            }
 
        });

        return affectedParts;

        //return {"model" : modelName , "path" : uniquepartid  };
    }
    

    getSelectStepPart = function  (step , workinstructions) {

        let partsList = workinstructions[step-1].PartsList;
        let propertyname = partsList[0].MetadataPropertyName;
        let uniquepartid = partsList[0].MetadataID;
        let displayname = partsList[0].DisplayName;
        let modelName =   partsList[0].ModelName; //this.modelid;

        return {"model" : modelName , "path" : uniquepartid  };
    }

    getWorkOrderSummary = function (panelSelector ,uiContainerWI) {
 
        let selectedIndex = 0;
        for (var i = 0; i < this.WorkOrders.length; i++) {
            
            if ( this.vuforiaScope.selectedwoField === this.WorkOrders[i].WorkID) {
                selectedIndex = i; 
                break;
            };
            
        }


        let UIContainerWOS = document.createElement('div');
        UIContainerWOS.id = 'wi-uicontainer';
        UIContainerWOS.className = 'wi-uicontainer'; 
        UIContainerWOS.style.width = "1px";
        UIContainerWOS.style.height = "1px";
        UIContainerWOS.style.bottom = this.wibottom;
        UIContainerWOS.style.left = this.left;

        var WOSummaryPanel = document.createElement('div');
        WOSummaryPanel.id = 'wi-instruction-panel';   
        WOSummaryPanel.className = 'wi-instructionpanel';  
        WOSummaryPanel.style.width = this.wiwidth;
        WOSummaryPanel.style.height = this.wiheight; 
        WOSummaryPanel.style.bottom = this.wibottom;
        WOSummaryPanel.style.left = this.left;

        var CloseButton = document.createElement('img');
        CloseButton.className ="wi-closebutton";
        //CloseButton.style.bottom = this.wibottom;
        CloseButton.style.right = "0px";
        CloseButton.src = "extensions/images/widgetcoe_close.png";
        CloseButton.addEventListener("click",  () => { 
            try { 
                panelSelector.removeChild(WOSummaryTimeContainer);
            } catch (ex) {

            }
            
        });

        var WOSummaryTitlePanel = document.createElement('div');
        WOSummaryTitlePanel.id = 'wos-type';  
        WOSummaryTitlePanel.innerHTML = "Work Order Summary for: " + this.WorkOrders[selectedIndex].Title;
        WOSummaryTitlePanel.className ='wi-type';

        var WOSummaryDetailPanel = document.createElement('div');
        WOSummaryDetailPanel.id = 'wos-instructionsteps'; 
        WOSummaryDetailPanel.className = 'wos-text';  
        WOSummaryDetailPanel.innerHTML = this.WorkOrders[selectedIndex].Overview;  

        var WOSummaryDifficultyPanel = document.createElement('div');
        WOSummaryDifficultyPanel.id = 'wos-text-diff'; 
        WOSummaryDifficultyPanel.className = 'wi-type'; 
        WOSummaryDifficultyPanel.innerHTML = "Difficulty:" +this.WorkOrders[selectedIndex].Difficulty;
        
        var SelectButton = document.createElement('img');
        SelectButton.className ="wi-closebutton";
        //CloseButton.style.bottom = this.wibottom;
        SelectButton.style.right = "0px";
        SelectButton.src = "extensions/images/workorderscoe_wi.png";
        SelectButton.addEventListener("click",  () => { 
            try { 
                panelSelector.removeChild(UIContainerWOS);

            } catch (ex) {
                console.log("error in selection button " + ex);
            }

            panelSelector.appendChild(uiContainerWI);

            
        });
        
        var WOSummaryTimePanel = document.createElement('div');
        WOSummaryTimePanel.id = 'wos-text-time'; 
        WOSummaryTimePanel.className = 'wi-type'; 
        WOSummaryTimePanel.innerHTML = "Estimated Time:" +this.WorkOrders[selectedIndex].Time;   

        let WOSummaryTimeContainer = document.createElement('div');
        WOSummaryTimeContainer.id = 'wos-navcontainer';
        WOSummaryTimeContainer.className = 'wi-navcontainer'; 

        WOSummaryTimeContainer.appendChild(WOSummaryDifficultyPanel);

        WOSummaryTimeContainer.appendChild(WOSummaryTimePanel);
        WOSummaryTimeContainer.appendChild(SelectButton);


                //panelSelector.appendChild(UIContainerWI);
        // fire currect step selected
        //this.vuforiaScope.affectedpartsField = this.getAffectedParts( currentStep, workinstructions);
        //this.vuforiaScope.$parent.fireEvent('workinstructionselected');
        //this.vuforiaScope.$parent.$applyAsync();

        WOSummaryPanel.appendChild(CloseButton);
        WOSummaryPanel.appendChild(WOSummaryTitlePanel);
        WOSummaryPanel.appendChild(WOSummaryDetailPanel);  
        WOSummaryPanel.appendChild(WOSummaryTimeContainer); 
        
        UIContainerWOS.appendChild(WOSummaryPanel); 

        panelSelector.appendChild(UIContainerWOS);



    }
    getWorkInstructionsSteps = function (workinstructions ,panelSelector) {

        let UIContainerWI = document.createElement('div');
        UIContainerWI.id = 'wi-uicontainer';
        UIContainerWI.className = 'wi-uicontainer'; 
        UIContainerWI.style.width = "1px";
        UIContainerWI.style.height = "1px";
        UIContainerWI.style.bottom = this.wibottom;
        UIContainerWI.style.left = this.left;

        var InstructionPanel = document.createElement('div');
        InstructionPanel.id = 'wi-instruction-panel';   
        InstructionPanel.className = 'wi-instructionpanel';  
        InstructionPanel.style.width = this.wiwidth;
        InstructionPanel.style.height = this.wiheight; 
        InstructionPanel.style.bottom = this.wibottom;
        InstructionPanel.style.left = this.left;

        let InstructionCloseContainer = document.createElement('div');
        InstructionCloseContainer.id = 'wi-navcontainer';
        InstructionCloseContainer.className = 'wi-closecontainer'; 


      
        var CloseButton = document.createElement('img');
        CloseButton.className ="wi-closebutton";
        //CloseButton.style.bottom = this.wibottom;
        CloseButton.style.right = "0px";
        CloseButton.src = "extensions/images/widgetcoe_close.png";
        CloseButton.addEventListener("click",  () => { 
            try { 
                //this.markupCanvas.vuforiaScope.$parent.fireEvent('markCancelled');
            } catch (ex) {

            }
            panelSelector.removeChild(UIContainerWI);
        });
       

  
        let currentStep = 1; 
        var InstructionHeaderLabelPanel = document.createElement('div');
        InstructionHeaderLabelPanel.id = 'wi-type';  
        InstructionHeaderLabelPanel.innerHTML = workinstructions[currentStep-1].StepType;//"This is the header text"; 
        InstructionHeaderLabelPanel.className ='wi-type';

        var InstructionStepPanel = document.createElement('div');
        InstructionStepPanel.id = 'wi-instructionsteps'; 
        InstructionStepPanel.className = 'wi-steps';  
        let steps = workinstructions.length ;
        InstructionStepPanel.innerHTML = currentStep +" OF " + steps;  

        var InstructionTextLabelPanel = document.createElement('div');
        InstructionTextLabelPanel.id = 'wi-text'; 
        InstructionTextLabelPanel.className = 'wi-text'; 
        InstructionTextLabelPanel.innerHTML = workinstructions[currentStep-1].StepDetail;//"This is the work instruction text"; 

        let InstructionNavContainer = document.createElement('div');
        InstructionNavContainer.id = 'wi-navcontainer';
        InstructionNavContainer.className = 'wi-navcontainer'; 

        var InstructionNavPanel = document.createElement('div');
        InstructionNavPanel.id = 'wi-nav'; 
        //InstructionNavPanel.className = 'wi-nav'; 

        var BackButton = document.createElement('img');
        BackButton.src = "extensions/images/widgetcoe_back.png";   
        BackButton.className = 'wi-backbutton';   
        BackButton.style.left = '0px'; 

        BackButton.addEventListener("click",  () => { 

            try { 

                if (currentStep != 1 ) { 
                    currentStep--;
                } else {
                    currentStep = workinstructions.length ;
                }

                InstructionHeaderLabelPanel.innerHTML = workinstructions[currentStep-1].StepType;//"This is the header text";
                InstructionTextLabelPanel.innerHTML = workinstructions[currentStep-1].StepDetail;//"This is the work instruction text";  
                InstructionStepPanel.innerHTML = currentStep +" OF " + steps; 
                
                this.vuforiaScope.outgoingdataField = this.getSelectStepPart(currentStep, workinstructions);
                this.vuforiaScope.$parent.fireEvent('workinstructionselected');
                this.vuforiaScope.$parent.$applyAsync();


            } catch (ex) {

            }
    
        });
        

        var NextButton = document.createElement('img');
        NextButton.src = "extensions/images/widgetcoe_next.png";   
        NextButton.className = 'wi-nextbutton';   
        NextButton.style.right = '0px'; 
        NextButton.addEventListener("click",  () => { 

            try { 

                if (currentStep -1  < workinstructions.length -1 ) { 
                    currentStep++;
                } else {
                    currentStep = 1;
                }

                InstructionHeaderLabelPanel.innerHTML = workinstructions[currentStep-1].StepType;//"This is the header text";
                InstructionTextLabelPanel.innerHTML = workinstructions[currentStep-1].StepDetail;//"This is the work instruction text";  
                InstructionStepPanel.innerHTML = currentStep +" OF " + steps; 

                this.vuforiaScope.affectedpartsField = this.getAffectedParts(currentStep , workinstructions);
                this.vuforiaScope.$parent.fireEvent('workinstructionselected');
                this.vuforiaScope.$parent.$applyAsync();

            } catch (ex) {

            }
    
        });
        
        InstructionCloseContainer.appendChild(InstructionStepPanel);
        InstructionCloseContainer.appendChild(CloseButton);
  
        //Append the button to the div  
        InstructionNavContainer.appendChild(BackButton); 
        InstructionNavContainer.appendChild(NextButton); 

        InstructionPanel.appendChild(InstructionCloseContainer);
        InstructionPanel.appendChild(InstructionHeaderLabelPanel);  
        InstructionPanel.appendChild(InstructionTextLabelPanel);  
        InstructionPanel.appendChild(InstructionNavContainer);  
        UIContainerWI.appendChild(InstructionPanel);


        // this should probably reworked 

        this.getWorkOrderSummary( panelSelector , UIContainerWI );


        return UIContainerWI;
    }











}




 
