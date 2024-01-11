//
// This service is used to build dummay data to help explore the use model
//
logger.debug("Entering BuildData ");

let lorumData = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

// CreateInfoTableFromDataShape(infoTableName:STRING("InfoTable"), dataShapeName:STRING):INFOTABLE(AutoARVinCode_DS)
let result = Resources["InfoTableFunctions"].CreateInfoTableFromDataShape({
    infoTableName: "InfoTable",
    dataShapeName: "AutoARVinCode_DS"
});


// VIN
// OBDCode
// OBDDescription
// WorkID
// Example VIN JT6HF10U3Y0133607
// 	 VIN Description: 2000 Lexus RX 300
// Example OBDData P0171,P0172
// P0300 = Random/Multiple Cylinder Misfire Detected
//
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Utility functions
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    logger.debug("makeid=" + result.toUpperCase() );  
    return result.toUpperCase();
}


function CreateHeroPart ( folder  , mtid, dataset, guideview , model , vin ,rx,ry,rz) {
    
    logger.debug("CreateHeroPart vin="+vin + "folder="+ "mtid="+  mtid);
    let HPValues = Things["AutoARHeroPart_DT"].CreateValues();
    HPValues.VIN = vin; 
    HPValues.Folder = folder;
    HPValues.MTID = mtid;
    HPValues.MTDataset =  dataset; 
    HPValues.MTGuideView =  guideview; 
    HPValues.Model = model; 
        HPValues.MTRx = rx; 
        HPValues.MTRy = ry; 
        HPValues.MTRz = rz; 

    let hpresultid =  Things["AutoARHeroPart_DT"].AddOrUpdateDataTableEntry({
        sourceType: undefined /* STRING */,
        values: HPValues /* INFOTABLE */,
        location: undefined /* LOCATION */,
        source: undefined /* STRING */,
        tags: undefined /* TAGS */
    });

}


function CreateWi (workID  , stepDetail , stepNumber , label1) {
    let WiValues = Things["AutoARWorkInstruction_DT"].CreateValues();
    WiValues.WorkID = workID;
    WiValues.StepNumber = stepNumber;
    WiValues.Label1= label1;
    WiValues.Label2= "";
    WiValues.Label3 = "";
    WiValues.StepDetail = stepDetail;

    let affectedPartsID  =  makeid(10);
    WiValues.AffectedPartsID = affectedPartsID;  
    
    let winresultid =  Things["AutoARWorkInstruction_DT"].AddOrUpdateDataTableEntry({
        sourceType: undefined /* STRING */,
        values: WiValues /* INFOTABLE */,
        location: undefined /* LOCATION */,
        source: undefined /* STRING */,
        tags: undefined /* TAGS */
    });
    
    return affectedPartsID;
}

//Heroid

function createAffectedPart (id, metadataID, metadataPropertyName, modelName, displayName , partName , fileName  ) {
    
	let afValues = Things["AutoARAffectedParts_DT"].CreateValues();
	afValues.AffectedPartID = id;
    afValues.MetadataID = metadataID;
    afValues.MetadataPropertyName = metadataPropertyName;
    afValues.ModelName = modelName; 
    afValues.DisplayName = displayName;     // redundant maybe this can from the metadata 
    afValues.PartName = partName;  // redundant maybe this can from the metadata 
    afValues.FileName = fileName; 
    let vinresultid = Things["AutoARAffectedParts_DT"].AddOrUpdateDataTableEntry({
        sourceType: undefined /* STRING */,
        values: afValues /* INFOTABLE */,
        location: undefined /* LOCATION */,
        source: undefined /* STRING */,
        tags: undefined /* TAGS */
    });
    
}

function createWorkOrder (id, title,overview,difficulty,time , vin) {
    
    let WOValues = Things["AutoARWorkOrder_DT"].CreateValues();
    WOValues.WorkID = id;
    WOValues.Title = title;
    WOValues.Overview = overview;
    WOValues.Difficulty = difficulty;
    WOValues.Time = time; 
    WOValues.VIN = vin;  
    
    let woresultid =  Things["AutoARWorkOrder_DT"].AddOrUpdateDataTableEntry({
        sourceType: undefined /* STRING */,
        values: WOValues /* INFOTABLE */,
        location: undefined /* LOCATION */,
        source: undefined /* STRING */,
        tags: undefined /* TAGS */
    });

me.PurgeDataTableEntries();
Things["AutoARWorkInstruction_DT"].PurgeDataTableEntries();
Things["AutoARHeroPart_DT"].PurgeDataTableEntries();
Things["AutoARWorkOrder_DT"].PurgeDataTableEntries();
Things["AutoARAffectedParts_DT"].PurgeDataTableEntries();

// create some useable data


    
   // create 5 steps for the work id and an affectedID for 3 Affected Parts

    let affectedPartsID1 = CreateWi(id,'Please make sure all safety option have been worked through.',1,'Safety');
    // id, metadataID, metadataPropertyName, modelName, displayName , partName , fileName 
    createAffectedPart(affectedPartsID1, "/0/0/3/0/1", "path", "modelAffected1" , "7547489.PRT" ,  "7547489.PRT" , "/Polaris/AffectedParts/polaris_toy_low.pvz"  );  
    createAffectedPart(affectedPartsID1,  "/0/0/3/0/2", "path", "modelAffected1" , "7547489.PRT" , "7547489.PRT" , "/Polaris/AffectedParts/polaris_toy_low.pvz" );  
    createAffectedPart(affectedPartsID1, "/0/0/3/0/3", "path", "modelAffected1" , "7547489.PRT" , "7547489.PRT" , "/Polaris/AffectedParts/polaris_toy_low.pvz" ); 
    createAffectedPart(affectedPartsID1, "/0/0/3/0/4", "path", "modelAffected1" , "7547489.PRT" , "7547489.PRT" , "/Polaris/AffectedParts/polaris_toy_low.pvz" ); 
    let affectedPartsID2 = CreateWi(id,'The Tool requirements are. gloves,wench and flashlight. ' + lorumData,2,'Tool requirements');
    createAffectedPart(affectedPartsID2,  "/0/0/3/0/0/", "path", "modelAffected1" , "1522872.PRT" , "1522872.PRT" , "/Polaris/AffectedParts/polaris_toy_low.pvz"   );  
    createAffectedPart(affectedPartsID2, "/0/0/3/0/0/0", "path", "modelAffected1" , "1522842.PRT" ,  "1522842.PRT" , "/Polaris/AffectedParts/polaris_toy_low.pvz"   );  
    createAffectedPart(affectedPartsID2, "/0/0/3/0/0/2", "path", "modelAffected1" , "5414622.PRT" ,  "5414622.PRT" , "/Polaris/AffectedParts/polaris_toy_low.pvz"   );  
    let affectedPartsID3 = CreateWi(id,'The work required to be done is check off items 1,2,3. '+ lorumData,4,'work to be done');
    createAffectedPart(affectedPartsID3, "/0/0/11/0/0/32", "path", "modelAffected1" , "5453551.PRT" , "5453551.PRT" ,"/Polaris/AffectedParts/polaris_toy_low.pvz"  ); 
    createAffectedPart(affectedPartsID3, "/0/0/11/0/0/0/0", "path", "modelAffected1" , "5439786.PRT" , "5439786.PRT" ,"/Polaris/AffectedParts/polaris_toy_low.pvz"   );  
    let affectedPartsID4 = CreateWi(id,'The evaluation is to explore if the component has been insatlled correctly. ',3,'Evaluation');
	createAffectedPart(affectedPartsID4,  "/0/0/5/1/0/5/0", "path", "modelAffected1" , "7044771_BODY.PRT" ,  "7044771_BODY.PRT" ,"/Polaris/AffectedParts/polaris_toy_low.pvz" );  
    createAffectedPart(affectedPartsID4, "/0/0/5/1/0/9/0", "path", "modelAffected1" , "7044897_ROD.PRT" ,  "7044897_ROD.PRT" ,"/Polaris/AffectedParts/polaris_toy_low.pvz" ); 
    createAffectedPart(affectedPartsID4, "/0/0/5/1/0/7", "path", "modelAffected1" , "7044640.PRT" ,  "7044640.PRT" ,"/Polaris/AffectedParts/polaris_toy_low.pvz" );  
    let affectedPartsID5 = CreateWi(id,'The final inspection to to review the work and checkoff all required items.',5,'Inspection');
    // createAffectedPart(affectedPartsID5, "/5/8/26/14", "path", "modelAffected" , "RECT.PRT" ); this part will expose issues with its Model Bounds 
    createAffectedPart(affectedPartsID5, "/0/0/11/0/0/35", "path", "modelAffected1" , "5453553.PRT", "5453553.PRT" ,"/Polaris/AffectedParts/polaris_toy_low.pvz"  ); 
    createAffectedPart(affectedPartsID5, "/0/0/11/0/0/30/0/0", "path", "modelAffected1" , "5439782.PRT" , "5439782.PRT" ,"/Polaris/AffectedParts/polaris_toy_low.pvz"  );  

}



let vin = "12345678910111213";
// folder  , mtid, dataset, guideview , model 
CreateHeroPart('Ford'  , 'Ford_F150', 'Ford_F150',  'Ford_F150_viewpoint_0001.png', 'Ford_F150.pvz' , vin ,0,0,0);

createWorkOrder( 'WI000001', "Battery sensor Install ", "Gather Tools and Saftey instructions and install sensor "+ lorumData, "Low" , Math.floor(Math.random() * 10) + 1 , vin); 
createWorkOrder( 'WI000002', "Headlight Install", "Gather Tools and Saftey instructions and install headelight " + lorumData, "Med" , Math.floor(Math.random() * 10) + 1 , vin); 
createWorkOrder( 'WI000003', "Tail Light Install", "Gather Tools and Saftey instructions and isnatll tail light "+ lorumData, "Medium" , Math.floor(Math.random() * 10) + 1 , vin ); 
createWorkOrder( 'WI000004', "Rewire internal dashboard light", "Gather Tools and Saftey instruction and rewire dashboard lighting" + lorumData, "High" , Math.floor(Math.random() * 10) + 1 , vin); 
createWorkOrder( 'WI000005', "Inspect Brake Hydraulics", "Gather Tools and Saftey instruction and do inspection "+ lorumData, "High" , Math.floor(Math.random() * 10) + 1 , vin ); 
//



// *****************************************************************************************************************************************
//
// Polaris Data
//
// *****************************************************************************************************************************************


vin = "00123456789101112";
// folder  , mtid, dataset, guideview , model 
CreateHeroPart('Ford'  , 'Ford_F150', 'Ford_F150',  'F150_GUIDE.png', 'Ford_F150.pvz' , vin ,0,0,0);


createWorkOrder( 'WI000006', "Battery sensor Install "       , "Gather Tools and Saftey instructions and install sensor         " + lorumData, "Low"    , Math.floor(Math.random() * 10) + 1 , vin); 
createWorkOrder( 'WI000007', "Headlight Install"             , "Gather Tools and Saftey instructions and install headelight     " +lorumData, "Med"    , Math.floor(Math.random() * 10) + 1 , vin); 
createWorkOrder( 'WI000008', "Tail Light Install"            , "Gather Tools and Saftey instructions and instll tail light      " + lorumData, "Medium" , Math.floor(Math.random() * 10) + 1 , vin ); 
createWorkOrder( 'WI000009', "Rewire internal dashboard light", "Gather Tools and Saftey instruction and rewire dashboard lighting" +lorumData, "High"  , Math.floor(Math.random() * 10) + 1 , vin); 
createWorkOrder( 'WI000010', "Inspect Brake Hydraulics"      , "Gather Tools and Saftey instruction and do inspection            " + lorumData, "High"  , Math.floor(Math.random() * 10) + 1 , vin ); 
//
//   



// *****************************************************************************************************************************************
//
// Ender Pro Data
//
// *****************************************************************************************************************************************


vin = "00012345678910111";
// folder  , mtid, dataset, guideview , model 
CreateHeroPart('Creality'  , 'EnderProMain_Low', 'EnderProMain_Low',  'EnderProMain_Low_GuideView_0000_2.png', 'EnderProMain_Low.pvz' , vin , 0,0,0);

createWorkOrder( 'WI000101', "Battery sensor Install "       , "Gather Tools and Saftey instructions and install sensor         " +lorumData, "Low"    , Math.floor(Math.random() * 10) + 1 , vin); 
createWorkOrder( 'WI000102', "Headlight Install"             , "Gather Tools and Saftey instructions and install headelight     " +lorumData, "Med"    , Math.floor(Math.random() * 10) + 1 , vin); 
createWorkOrder( 'WI000103', "Tail Light Install"            , "Gather Tools and Saftey instructions and instll tail light      ", "Medium" , Math.floor(Math.random() * 10) + 1 , vin ); 
createWorkOrder( 'WI000104', "Rewire internal dashboard light", "Gather Tools and Saftey instruction and rewire dashboard lighting" +lorumData, "High"  , Math.floor(Math.random() * 10) + 1 , vin); 
createWorkOrder( 'WI000105', "Inspect Brake Hydraulics"      , "Gather Tools and Saftey instruction and do inspection            ", "High"  , Math.floor(Math.random() * 10) + 1 , vin ); 
//
//  




// *****************************************************************************************************************************************
//
// Polaris Data
//
// *****************************************************************************************************************************************


vin = "00012345678910222";
// folder  , mtid, dataset, guideview , model 
CreateHeroPart('Polaris'  , 'toy_polaris_mt', 'toy_polaris_mt',  'toy_polaris_mt_GuideView_0000_2.png', 'toy_polaris_mt.pvz' , vin ,0,0,0);

createWorkOrder( 'WI000101', "Battery sensor Install "       , "Gather Tools and Saftey instructions and install sensor         " +lorumData, "Low"    , Math.floor(Math.random() * 10) + 1 , vin); 
createWorkOrder( 'WI000102', "Headlight Install"             , "Gather Tools and Saftey instructions and install headelight     " +lorumData, "Med"    , Math.floor(Math.random() * 10) + 1 , vin); 
createWorkOrder( 'WI000103', "Tail Light Install"            , "Gather Tools and Saftey instructions and instll tail light      ", "Medium" , Math.floor(Math.random() * 10) + 1 , vin ); 
createWorkOrder( 'WI000104', "Rewire internal dashboard light", "Gather Tools and Saftey instruction and rewire dashboard lighting" +lorumData, "High"  , Math.floor(Math.random() * 10) + 1 , vin); 
createWorkOrder( 'WI000105', "Inspect Brake Hydraulics"      , "Gather Tools and Saftey instruction and do inspection            ", "High"  , Math.floor(Math.random() * 10) + 1 , vin ); 
//
// 




function createWorkOrder_WI000131 (id, title,overview,difficulty,time , vin) {
    
    let WOValues = Things["AutoARWorkOrder_DT"].CreateValues();
    WOValues.WorkID = id;
    WOValues.Title = title;
    WOValues.Overview = overview;
    WOValues.Difficulty = difficulty;
    WOValues.Time = time; 
    WOValues.VIN = vin;  
    
    let woresultid =  Things["AutoARWorkOrder_DT"].AddOrUpdateDataTableEntry({
        sourceType: undefined /* STRING */,
        values: WOValues /* INFOTABLE */,
        location: undefined /* LOCATION */,
        source: undefined /* STRING */,
        tags: undefined /* TAGS */
    });
    
 // create 5 steps for the work id and an affectedID for 3 Affected Parts

    let affectedPartsID31 = CreateWi(id,'Please make sure all safety option have been worked through.',1,'Safety');
    // id, metadataID, metadataPropertyName, modelName, displayName , partName , fileName 
    createAffectedPart(affectedPartsID31, "/0/0/5/1/0/6", "path", "modelAffected1" , "7044472_BODY.PRT" ,  "7044472_BODY.PRT" , "/Polaris/AffectedParts/polaris_toy_low.pvz"  );  
    createAffectedPart(affectedPartsID31,  "/0/0/5/1/0/8", "path", "modelAffected1" , "7044640.PRT" , "7044640.PRT" , "/Polaris/AffectedParts/polaris_toy_low.pvz" );  
    createAffectedPart(affectedPartsID31, "/0/0/5/1/0/4", "path", "modelAffected1" , "7044554_ROD.PRT" , "7044554_ROD.PRT" , "/Polaris/AffectedParts/polaris_toy_low.pvz" ); 
    createAffectedPart(affectedPartsID31, "/0/0/3/0/5/2", "path", "modelAffected1" , "5414622.PRT" , "5414622.PRT" , "/Polaris/AffectedParts/polaris_toy_low.pvz" ); 
   
    let affectedPartsID32 = CreateWi(id,'The Tool requirements are. gloves,wench and flashlight. Remove Wheel' + lorumData,2,'Tool requirements');
    createAffectedPart(affectedPartsID32, "/0/0/3/0/5/2", "path", "modelAffected1" , "5414622.PRT" , "5414622.PRT" , "/Polaris/AffectedParts/polaris_toy_low.pvz" ); 
   
    
    let affectedPartsID33 = CreateWi(id,'The work required to be done is check off items 1,2,3. '+ lorumData,4,'work to be done');
    createAffectedPart(affectedPartsID31, "/0/0/5/1/0/4", "path", "modelAffected1" , "7044554_ROD.PRT" , "7044554_ROD.PRT" , "/Polaris/AffectedParts/polaris_toy_low.pvz" ); 

    let affectedPartsID34 = CreateWi(id,'The evaluation is to explore if the component has been insatlled correctly. ',3,'Evaluation');
    createAffectedPart(affectedPartsID34,  "/0/0/5/1/0/8", "path", "modelAffected1" , "7044640.PRT" , "7044640.PRT" , "/Polaris/AffectedParts/polaris_toy_low.pvz" );  

    let affectedPartsID35 = CreateWi(id,'The final inspection to to review the work and checkoff all required items.',5,'Inspection');
    createAffectedPart(affectedPartsID35, "/0/0/5/1/0/6", "path", "modelAffected1" , "7044472_BODY.PRT" ,  "7044472_BODY.PRT" , "/Polaris/AffectedParts/polaris_toy_low.pvz"  );  

}

vin = "00012345678910333";
// folder  , mtid, dataset, guideview , model 

//CreateHeroPart('Polaris'  , 'toy_polaris_mt', 'toy_polaris_mt',  'toy_polaris_mt_GuideView_0000_2.png', 'toy_polaris_mt.pvz' , vin);
//CreateHeroPart('Polaris'  , 'ServiceSeq_ST_Med_reduced', 'ServiceSeq_ST_Med_reduced',  'ServiceSeq_ST_Med_reduced_GuideView_0000_2.png', 'ServiceSeq_ST_Med_reduced.pvz' , vin);
CreateHeroPart('Polaris'  ,'polaris_toy_low', 'polaris_toy_low',  'polaris_toy_low_GuideView_0000_2.png', 'polaris_toy_low.pvz' , vin , 0,0,0);
createWorkOrder_WI000131( 'WI000131', "Battery sensor Install "       , "Gather Tools and Saftey instructions and install sensor         " +lorumData, "Low"    , Math.floor(Math.random() * 10) + 1 , vin); 



// *****************************************************************************************************************************************
//
// CRV Data
//
// *****************************************************************************************************************************************

function createWorkOrderDTC_B1028 (id, title,overview,difficulty,time , vin) {
    
    let WOValues = Things["AutoARWorkOrder_DT"].CreateValues();
    WOValues.WorkID = id;
    WOValues.Title = title;
    WOValues.Overview = overview;
    WOValues.Difficulty = difficulty;
    WOValues.Time = time; 
    WOValues.VIN = vin;  
    
    let woresultid =  Things["AutoARWorkOrder_DT"].AddOrUpdateDataTableEntry({
        sourceType: undefined /* STRING */,
        values: WOValues /* INFOTABLE */,
        location: undefined /* LOCATION */,
        source: undefined /* STRING */,
        tags: undefined /* TAGS */
    });
    
 // create 5 steps for the work id and an affectedID for 3 Affected Parts

    let apDTC_B1028_1 = CreateWi(id,'Please make sure all safety options have been worked through. and check connections',1,'Safety');
    // id, metadataID, metadataPropertyName, modelWidgetName (the widget will be created i.e. modelAffected1,2,3 etc one for each pvz) , displayName , partName , fileName 
    createAffectedPart(apDTC_B1028_1,  "/134", "path", "ap_rear_wiper_motor" , "REAR_WIPER_MOTOR.PRT" , "REAR_WIPER_MOTOR.PRT" , "/Crv/AffectedPart/rear_wiper_motor.pvz" );
    createAffectedPart(apDTC_B1028_1,  "/68/35", "path", "tailgate_wireharness" , "CONN_MOTOR.PRT" , "CONN_MOTOR.PRT" , "/Crv/AffectedPart/tailgate_wireharness.pvz" ); 
    createAffectedPart(apDTC_B1028_1,  "/68/85/@@PV-AUTO-ID@@004", "path", "tailgate_wireharness" , "W-5" , "W-5" , "/Crv/AffectedPart/tailgate_wireharness.pvz" ); 
    createAffectedPart(apDTC_B1028_1,  "/68/85/@@PV-AUTO-ID@@007", "path", "tailgate_wireharness" , "W-8" , "W-8" , "/Crv/AffectedPart/tailgate_wireharness.pvz" ); 
    createAffectedPart(apDTC_B1028_1,  "/68/85/@@PV-AUTO-ID@@006", "path", "tailgate_wireharness" , "W-7" , "W-7" , "/Crv/AffectedPart/tailgate_wireharness.pvz" ); 
    createAffectedPart(apDTC_B1028_1,  "/68/85/@@PV-AUTO-ID@@009", "path", "tailgate_wireharness" , "W-10" , "W-10" , "/Crv/AffectedPart/tailgate_wireharness.pvz" );   
    createAffectedPart(apDTC_B1028_1,  "/68/85/@@PV-AUTO-ID@@008", "path", "tailgate_wireharness" , "W-10" , "W-10" , "/Crv/AffectedPart/tailgate_wireharness.pvz" );   
    createAffectedPart(apDTC_B1028_1,  "/68/37", "path", "tailgate_wireharness" , "TAILGATE_HANDLE_SWITCH.PRT" , "TAILGATE_HANDLE_SWITCH.PRT" , "/Crv/AffectedPart/tailgate_wireharness.pvz" );   
    createAffectedPart(apDTC_B1028_1,  "/68/26", "path", "tailgate_wireharness" , "TLIGHT_LICENSEPLATE.PRT" , "LIGHT_LICENSEPLATE.PRT" , "/Crv/AffectedPart/tailgate_wireharness.pvz" );   
    createAffectedPart(apDTC_B1028_1,  "/68/43", "path", "tailgate_wireharness" , "TAILGATE_LATCH_SWITCH.PRT" , "TAILGATE_LATCH_SWITCH.PRT" , "/Crv/AffectedPart/tailgate_wireharness.pvz" );   
    createAffectedPart(apDTC_B1028_1,  "/68/45", "path", "tailgate_wireharness" , "TAILGATE_RELEASE_ACTUATOR.PRT" , "TAILGATE_RELEASE_ACTUATOR.PRT" , "/Crv/AffectedPart/tailgate_wireharness.pvz" );   
    createAffectedPart(apDTC_B1028_1,  "/68/36", "path", "tailgate_wireharness" , "CAMERA_REAR.PRT" , "CAMERA_REAR.PRT" , "/Crv/AffectedPart/tailgate_wireharness.pvz" );   
    createAffectedPart(apDTC_B1028_1,  "/115", "path", "ap_underDashFuseRelayBox" , "UNDERDASHFUSERELAYBOX.PRT" , "UNDERDASHFUSERELAYBOX.PRT" , "/Crv/AffectedPart/underDashFuseRelayBox.pvz" ); 
    
   
    let apDTC_B1028_2 = CreateWi(id,'Clear the DTCs with the HDS. Turn the ignition switch OFF, and then back ON (11). Operate the rear window wiper for 15 seconds or more, then turn the rear window wiper switch OFF. Does the rear window wiper stop in the normal park position?',2,'Clear registers');
    createAffectedPart(apDTC_B1028_2,  "/138", "path", "ap_gauge_control_unit" , "GAUGE_CONTROL_UNIT.PRT" , "GAUGE_CONTROL_UNIT.PRT" , "/Crv/AffectedPart/gauge_control_unit.pvz" ); 
    createAffectedPart(apDTC_B1028_2,  "/134", "path", "ap_rear_wiper_motor" , "REAR_WIPER_MOTOR.PRT" , "REAR_WIPER_MOTOR.PRT" , "/Crv/AffectedPart/rear_wiper_motor.pvz" );
    createAffectedPart(apDTC_B1028_2,  "/68/35", "path", "tailgate_wireharness" , "CONN_MOTOR.PRT" , "CONN_MOTOR.PRT" , "/Crv/AffectedPart/tailgate_wireharness.pvz" ); 
    createAffectedPart(apDTC_B1028_2,  "/68/85/@@PV-AUTO-ID@@004", "path", "tailgate_wireharness" , "W-5" , "W-5" , "/Crv/AffectedPart/tailgate_wireharness.pvz" ); 
    createAffectedPart(apDTC_B1028_2,  "/68/85/@@PV-AUTO-ID@@007", "path", "tailgate_wireharness" , "W-8" , "W-8" , "/Crv/AffectedPart/tailgate_wireharness.pvz" ); 
    createAffectedPart(apDTC_B1028_2,  "/68/85/@@PV-AUTO-ID@@006", "path", "tailgate_wireharness" , "W-7" , "W-7" , "/Crv/AffectedPart/tailgate_wireharness.pvz" ); 
    createAffectedPart(apDTC_B1028_2,  "/68/85/@@PV-AUTO-ID@@009", "path", "tailgate_wireharness" , "W-10" , "W-10" , "/Crv/AffectedPart/tailgate_wireharness.pvz" );   
    createAffectedPart(apDTC_B1028_2,  "/68/85/@@PV-AUTO-ID@@008", "path", "tailgate_wireharness" , "W-10" , "W-10" , "/Crv/AffectedPart/tailgate_wireharness.pvz" );   


    let apDTC_B1028_3 = CreateWi(id,'Do the rear window wiper motor test (see page 22-217).',3,'Is the rear window wiper motor OK?');
    createAffectedPart(apDTC_B1028_3,  "/138", "path", "ap_gauge_control_unit" , "GAUGE_CONTROL_UNIT.PRT" , "GAUGE_CONTROL_UNIT.PRT" , "/Crv/AffectedPart/gauge_control_unit.pvz" ); 
    createAffectedPart(apDTC_B1028_3,  "/68/37", "path", "tailgate_wireharness" , "TAILGATE_HANDLE_SWITCH.PRT" , "TAILGATE_HANDLE_SWITCH.PRT" , "/Crv/AffectedPart/tailgate_wireharness.pvz" );   
    createAffectedPart(apDTC_B1028_3,  "/68/43", "path", "tailgate_wireharness" , "TAILGATE_LATCH_SWITCH.PRT" , "TAILGATE_LATCH_SWITCH.PRT" , "/Crv/AffectedPart/tailgate_wireharness.pvz" );   
    createAffectedPart(apDTC_B1028_3,  "/68/45", "path", "tailgate_wireharness" , "TAILGATE_RELEASE_ACTUATOR.PRT" , "TAILGATE_RELEASE_ACTUATOR.PRT" , "/Crv/AffectedPart/tailgate_wireharness.pvz" );   


    let apDTC_B1028_4 = CreateWi(id,'Operate the rear window wiper for 15 seconds or more, then turn the rear window wiper switch OFF. Does the rear window wiper stop in the normal park position?',4,'Baseline');
    createAffectedPart(apDTC_B1028_4,  "/115", "path", "ap_underDashFuseRelayBox" , "UNDERDASHFUSERELAYBOX.PRT" , "UNDERDASHFUSERELAYBOX.PRT" , "app/resources/Uploaded/underDashFuseRelayBox.pvz" ); 
    createAffectedPart(apDTC_B1028_4,  "/42/63/@@PV-AUTO-ID@@002", "path", "roof_wireharness2" , "W-3" , "W-3" , "app/resources/Uploaded/roof_wireharness2.pvz" ); 
    createAffectedPart(apDTC_B1028_4,  "/42/63/@@PV-AUTO-ID@@001", "path", "roof_wireharness2" , "W-2" , "W-2" , "app/resources/Uploaded/roof_wireharness2.pvz" ); 
    createAffectedPart(apDTC_B1028_4,  "/42/63/@@PV-AUTO-ID@@000", "path", "roof_wireharness2" , "W-1" , "W-1" , "app/resources/Uploaded/roof_wireharness2.pvz" ); 
    createAffectedPart(apDTC_B1028_4,  "/42/54", "path", "roof_wireharness2" , "CONNF2.PRT" , "CONNF2.PRT" , "app/resources/Uploaded/roof_wireharness2.pvz" ); 
    createAffectedPart(apDTC_B1028_4,  "/42/55", "path", "roof_wireharness2" , "CONNF2.PRT" , "CONNF2.PRT" , "app/resources/Uploaded/roof_wireharness2.pvz" ); 
    createAffectedPart(apDTC_B1028_4,  "/42/56", "path", "roof_wireharness2" , "CONNF2.PRT" , "CONNF2.PRT" , "app/resources/Uploaded/roof_wireharness2.pvz" ); 

    
    let apDTC_B1028_5 = CreateWi(id,'Turn the ignition switch OFF, and then back ON',5,'Baseline');
    createAffectedPart(apDTC_B1028_5,  "/42/63/@@PV-AUTO-ID@@002", "path", "ap_gauge_control_unit" , "GAUGE_CONTROL_UNIT.PRT" , "GAUGE_CONTROL_UNIT.PRT" , "/Crv/AffectedPart/gauge_control_unit.pvz" ); 

}



let crvVin = "123456789";
CreateHeroPart('Crv'  , 'crv_outer', 'crv_outer-360',  'crv_outer_GuideView_0000_2.png', 'crv_outer.pvz' , crvVin , 0,0,0);
createWorkOrderDTC_B1028( 'WIB1028', "Rear Window Wiper Motor. As Signal Error" , "Rear Window Wiper Motor (As) Signal Error : If you are troubleshooting multiple DTCs, be sure to follow the instructions in B-CAN System Diagnosis Test Mode A" , "Medium"    , Math.floor(Math.random() * 10) + 1 , crvVin); 
//createWorkOrderDTC_1079( 'WIB1028', "Check Rear wiper operation"             , "Operate the rear window wiper for 15 seconds or more, then turn the rear window wiper switch OFF. Does the rear window wiper stop in the normal park position?", "Med"    , Math.floor(Math.random() * 10) + 1 , vin); 
//createWorkOrderDTC_1175( 'WIB1028', "Check DTC"            , "Check for DTCs with the HDS. Is DTC B1028 indicated?", "Medium" , Math.floor(Math.random() * 10) + 1 , vin ); 

//





// *****************************************************************************************************************************************
//
// F10 Front END
//
// *****************************************************************************************************************************************

function createWorkOrderF150_FrontEnd (id, title,overview,difficulty,time , vin) {
    
    let WOValues = Things["AutoARWorkOrder_DT"].CreateValues();
    WOValues.WorkID = id;
    WOValues.Title = title;
    WOValues.Overview = overview;
    WOValues.Difficulty = difficulty;
    WOValues.Time = time; 
    WOValues.VIN = vin;  
    
    let woresultid =  Things["AutoARWorkOrder_DT"].AddOrUpdateDataTableEntry({
        sourceType: undefined /* STRING */,
        values: WOValues /* INFOTABLE */,
        location: undefined /* LOCATION */,
        source: undefined /* STRING */,
        tags: undefined /* TAGS */
    });
    
 // create some steps for the work id and an affectedID for Affected Parts

    let apF150Front_end_1 = CreateWi(id,'Check connections on this component.',1,'Connection check 1');
    // id, metadataID, metadataPropertyName, modelWidgetName (the widget will be created i.e. modelAffected1,2,3 etc one for each pvz) , displayName , partName , fileName 
    createAffectedPart(apF150Front_end_1,  "/1/17/1/1/9/1/1/1/29/2", "path", "FrontEngineHarness" , "8U5T-14A464-LA/2-SLV ASY WIR CONN FEM" , "8U5T-14A464-LA/2-SLV ASY WIR CONN FEM" , "/F150FRONTEND/AffectedPart/FrontEngineHarness.pvz" ); 
    //createAffectedPart(apF150Front_end_1,  "/1/17/1/1/9/1/1/1/28/1", "path", "FrontEngineHarness" , "ML3T-12A581-GB055MB-01/2-ML3T-12A581-GB055MB-01" , "ML3T-12A581-GB055MB-01/2-ML3T-12A581-GB055MB-01" , "/F150FRONTEND/AffectedPart/FrontEngineHarness.pvz" );  
    //createAffectedPart(apF150Front_end_1,  "/1/17/1/1/9/1/1/1/28/6", "path", "FrontEngineHarness" , "9L3T-14A464-B/2-SLV ASY-WIR CONN MLE" , "9L3T-14A464-B/2-SLV ASY-WIR CONN MLE" , "/F150FRONTEND/AffectedPart/FrontEngineHarness.pvz" );  

    let apF150Front_end_2 = CreateWi(id,'Look here at main end.',2,'Connection check 2');
    // id, metadataID, metadataPropertyName, modelWidgetName (the widget will be created i.e. modelAffected1,2,3 etc one for each pvz) , displayName , partName , fileName 
    //createAffectedPart(apF150Front_end_2,  "1/17/1/1/9/1/1/1/28/9", "path", "FrontEngineHarness" , "MU5T-14N003-E/4-CVR WIR CONN" , "MU5T-14N003-E/4-CVR WIR CONN" , "/F150FRONTEND/AffectedPart/FrontEngineHarness.pvz" ); 
    createAffectedPart(apF150Front_end_2,  "/1/17/1/1/9/1/1/1/1/23", "path", "FrontEngineHarness" , "JU5T-14A459-C/3-SLV WIR CONN MLE" , "JU5T-14A459-C/3-SLV WIR CONN MLE" , "/F150FRONTEND/AffectedPart/FrontEngineHarness.pvz" );  

    let apF150Front_end_3 = CreateWi(id,'Look here at the conection',3,'Connection check 3');
    // id, metadataID, metadataPropertyName, modelWidgetName (the widget will be created i.e. modelAffected1,2,3 etc one for each pvz) , displayName , partName , fileName 
    createAffectedPart(apF150Front_end_3,  "/1/17/1/1/9/1/1/1/1/21", "path", "FrontEngineHarness" , "FU5T-14A459-E/2-SLV WIR CONN MLE" , "FU5T-14A459-E/2-SLV WIR CONN MLE" , "/F150FRONTEND/AffectedPart/FrontEngineHarness.pvz" );  

}



let F150FrontEndVin = "F150123456789";
CreateHeroPart('F150FRONTEND'  , 'F150_Front_End_MT_Med', 'F150_Front_End_MT_Med',  'F150_Front_End_MT_Med_GuideView_0000_2', 'F150_Front_End_MT_Med.pvz' , F150FrontEndVin , -90 , 0, 0);
createWorkOrderF150_FrontEnd( 'WIF150FE', "MU connection error" , "This is a functional error consistent with loose connection" , "Easy"    , Math.floor(Math.random() * 10) + 1 , F150FrontEndVin); 
//createWorkOrderDTC_1079( 'WIB1028', "Check Rear wiper operation"             , "Operate the rear window wiper for 15 seconds or more, then turn the rear window wiper switch OFF. Does the rear window wiper stop in the normal park position?", "Med"    , Math.floor(Math.random() * 10) + 1 , vin); 
//createWorkOrderDTC_1175( 'WIB1028', "Check DTC"            , "Check for DTCs with the HDS. Is DTC B1028 indicated?", "Medium" , Math.floor(Math.random() * 10) + 1 , vin ); 

//








