

class WorkOrderscoe {

    constructor( vuforiaScope, width, height , top , left , modelid ) {
        // Not using the topoffset, leftoffset yet
        this.vuforiaScope  = vuforiaScope;
        this.width = width;
        this.height = height;
        this.top = top;
        this.left = left;
        this.modelid = modelid;
    }


    doAction = function (actionid , workorders , workinstructions) {
        if (actionid == 'GetWorkOrders') {
            this.getWorkOrders (workorders); 
        }
        else if (actionid == 'GetWorkInstructions') {
           this.getWorkInstructionsSteps (workinstructions); 
        }
        else  {
            // add more functions here with else if 
        }

    }

    getWorkOrders = function (workorders) {

        let PanelQuery = 'body > ion-side-menus > ion-side-menu-content > ion-nav-view > ion-view > ion-content > twx-widget > twx-widget-content > \n' +
		'twx-container-content > twx-widget:nth-child(2) > twx-widget-content > div > twx-container-content';
        let PanelSelector = document.querySelector(PanelQuery); 
        let UIContainerWO = document.createElement('div');
        UIContainerWO.id = 'ui-container-wo';
        UIContainerWO.className = 'uicontainer'; 
        UIContainerWO.style.width = "1px";
        UIContainerWO.style.height = "1px";
        UIContainerWO.style.top = this.top;
        UIContainerWO.style.left = this.left;

        var WorkOrderPanel = document.createElement('div');
        WorkOrderPanel.id = 'workorder-panel';   
        WorkOrderPanel.className = 'workorderpanel';  

        var WorkOrderHeaderPanel = document.createElement('div');
        WorkOrderHeaderPanel.id = 'workorder-header-panel'; 
        WorkOrderHeaderPanel.className = 'workorderheaderpanel';    
        WorkOrderHeaderPanel.style.width = this.width;
        WorkOrderHeaderPanel.style.height = this.height; 
   
      
        var WorkOrderPicklist = document.createElement('div');
        WorkOrderPicklist.id = 'workorder-picklist-panel'; 
        WorkOrderPicklist.className = 'workorderpicklistpanel';   
        WorkOrderPicklist.innerHTML = "Work Orders"; 
        WorkOrderPicklist.style.top = '50px';
        WorkOrderPicklist.style.left = '15px'; 


        //let selectArray = ["W0001", "W0002", "W0003", "W0004"];
        let selectArray = workorders;

        let WorkOrderList = document.createElement("select");
        WorkOrderList.id = "workorderslist";
        WorkOrderList.className = 'workorderpicklist';   
        WorkOrderPicklist.appendChild(WorkOrderList);

        let listscope = this.vuforiaScope;
        function listSelection (e) {
            //alert('value ' + this.value);
            listscope.selectedwofield =  this.value;
            listscope.$parent.fireEvent('workorderselected');

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
        CloseButton.className ="closebutton";
        CloseButton.style.height = "40px";
        CloseButton.style.width = "40px";
        //CloseButton.style.position = "absolute";
        CloseButton.style.top = "0px";
        CloseButton.style.right = "0px";
        CloseButton.src = "extensions/images/widgetcoe_close.png";
        CloseButton.addEventListener("click",  () => { 

            try { 
                //this.markupCanvas.vuforiaScope.$parent.fireEvent('markCancelled');
            } catch (ex) {

            }

            PanelSelector.removeChild(UIContainerWO);
    
        });

        WorkOrderHeaderPanel.appendChild(CloseButton);


    
        UIContainerWO.appendChild(WorkOrderHeaderPanel);
        PanelSelector.appendChild(UIContainerWO);


    }

    getAffectedParts = function  (step , workinstructions) {

        // let partsList = workinstructions[step-1].PartsList;
        // let propertyname = partsList[0].MetadataPropertyName;
        // let uniquepartid = partsList[0].MetadataID;
        // let displayname = partsList[0].DisplayName;
        // let modelName =   partsList[0].ModelName; //this.modelid;

        let affectedParts = [];
        workinstructions[step-1].PartsList.forEach(element => {
            affectedParts.push ({"model":element.ModelName,"path":element.MetadataID});
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

    getWorkInstructionsSteps = function (workinstructions) {




        let PanelQuery = 'body > ion-side-menus > ion-side-menu-content > ion-nav-view > ion-view > ion-content > twx-widget > twx-widget-content > \n' +
		'twx-container-content > twx-widget:nth-child(2) > twx-widget-content > div > twx-container-content';
        let PanelSelector = document.querySelector(PanelQuery); 
  

        let UIContainerWI = document.createElement('div');
        UIContainerWI.id = 'ui-container-wi';
        UIContainerWI.className = 'uicontainer'; 
        UIContainerWI.style.width = "1px";
        UIContainerWI.style.height = "1px";
        UIContainerWI.style.top = this.top;
        UIContainerWI.style.left = this.left;

        var InstructionPanel = document.createElement('div');
        InstructionPanel.id = 'instruction-panel';   
        InstructionPanel.className = 'instructionpanel';  
        InstructionPanel.style.width = this.width;
        InstructionPanel.style.height = this.height; 
        InstructionPanel.style.top = "50px";
        InstructionPanel.style.left = this.left;
      
        var InstructionContentPanel = document.createElement('div');
        InstructionContentPanel.id = 'instruction-content-panel';   
        InstructionContentPanel.className = 'instructioncontentpanel';  
        InstructionContentPanel.style.height = this.height;;

        var CloseButton = document.createElement('img');
        CloseButton.className ="closebutton";
        CloseButton.style.height = "40px";
        CloseButton.style.width = "40px";
        CloseButton.style.position = "absolute";
        CloseButton.style.top = "0px";
        CloseButton.style.right = "0px";
        CloseButton.src = "extensions/images/widgetcoe_close.png";
        CloseButton.addEventListener("click",  () => { 

            try { 
                //this.markupCanvas.vuforiaScope.$parent.fireEvent('markCancelled');
            } catch (ex) {

            }

            PanelSelector.removeChild(UIContainerWI);
    
        });
        InstructionContentPanel.appendChild(CloseButton);

        var InstructionHeaderPanel = document.createElement('div');
        InstructionHeaderPanel.id = 'instruction-header-panel'; 
        InstructionHeaderPanel.className = 'instructionheaderpanel';    
 
      
        var InstructionStepPanel = document.createElement('div');
        InstructionStepPanel.id = 'instruction-step-panel'; 
        InstructionStepPanel.className = 'instructionsteppanel';   
        
        let steps = workinstructions.length ;
        let currentStep = 1; 
        InstructionStepPanel.innerHTML = currentStep +" OF " + steps; 

        var InstructionTextPanel = document.createElement('div');
        InstructionTextPanel.id = 'instruction-text-panel';  
        InstructionTextPanel.className = 'instructiontextpanel';

        var InstructionHeaderLabelPanel = document.createElement('div');
        InstructionHeaderLabelPanel.id = 'instruction-header-label-panel';  
        InstructionHeaderLabelPanel.innerHTML = workinstructions[currentStep-1].StepType;//"This is the header text"; 
        InstructionHeaderLabelPanel.className ='instructionheaderlabelpanel';

        var InstructionTextLabelPanel = document.createElement('div');
        InstructionTextLabelPanel.id = 'instruction-text-label-panel'; 
        InstructionTextLabelPanel.className = 'instructiontextlabelpanel'; 
        InstructionTextLabelPanel.innerHTML = workinstructions[currentStep-1].StepDetail;//"This is the work instruction text"; 

        var InstructionActionPanel = document.createElement('div');
        InstructionActionPanel.id = 'instruction-action-panel'; 
        InstructionActionPanel.className = 'instructionactionpanel'; 

        var BackButton = document.createElement('img');
        BackButton.src = "extensions/images/widgetcoe_back.png";   
        BackButton.className = 'backbutton';   
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
        
        //Append the button to the div  
        InstructionActionPanel.appendChild(BackButton); 
    
        var NextButton = document.createElement('img');
        NextButton.src = "extensions/images/widgetcoe_next.png";   
        NextButton.className = 'nextbutton';   
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
        
        //Append the button to the div  
        InstructionActionPanel.appendChild(NextButton);   
        //Append the div to the higher level div  
        InstructionPanel.appendChild(InstructionContentPanel);   
   
        InstructionContentPanel.appendChild(InstructionActionPanel);
        //Append the div to the higher level div  
        InstructionContentPanel.appendChild(InstructionStepPanel);   
        InstructionContentPanel.appendChild(InstructionHeaderLabelPanel);  
        InstructionContentPanel.appendChild(InstructionTextLabelPanel);    
        UIContainerWI.appendChild(InstructionPanel);
        PanelSelector.appendChild(UIContainerWI);
        // fire currect step selected
        this.vuforiaScope.affectedpartsField = this.getAffectedParts( currentStep, workinstructions);
        this.vuforiaScope.$parent.fireEvent('workinstructionselected');
        this.vuforiaScope.$parent.$applyAsync();
    }











}




 
