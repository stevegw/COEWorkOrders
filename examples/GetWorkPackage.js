logger.debug("Entering GetWorkPackage");


// CreateInfoTableFromDataShape(infoTableName:STRING("InfoTable"), dataShapeName:STRING):INFOTABLE(AutoARWorkordersAndInstructons_DS)
let result = Resources["InfoTableFunctions"].CreateInfoTableFromDataShape({
    infoTableName: "InfoTable",
    dataShapeName: "AutoARWorkPackage_DS"
});


let jsonArray = [];

let workorders = me.GetWorkOrders({
	vin: vin /* STRING {"defaultValue":"12345678910111213"} */
});




if ( workorders.length > 0 ) { 

    for (i = 0; i < workorders.length ; i++) {

        instructions = me.GetWorkInstruction({
            workid: workorders[i].WorkID /* STRING {"defaultValue":"WI000001"} */
        });
        
        let models =[];
        logger.debug ("instructions >>>>>>" + instructions.length);
        for(var j = 0; j < instructions.length; j++) {
            if (instructions[j].PartsList != null) {
                logger.debug ("PartsList.length >>>>>>" + instructions[j].PartsList.rows.length);
               for(var k = 0; k < instructions[j].PartsList.length; k++) {
                    var found = false;
                   // if (models.length != null) {
                      for(var l = 0; l < models.length; l++) {
                        if (models[l].src == instructions[j].PartsList[k].FileName) {
                            found = true;
                            break;
                        }
                       }  
                   // }
                    if (!found) {
                        models.push ({"model":instructions[j].PartsList[k].ModelName, "src":instructions[j].PartsList[k].FileName });
                    } 
                }   
           }
        }

        let newEntry = {
            WorkID: workorders[i].WorkID,
            Title: workorders[i].Title,
            Time: "Time Est.: " + workorders[i].Time,
            Difficulty: "Difficulty: " + workorders[i].Difficulty,
            Overview: "Overview: " + workorders[i].Overview,
            WorkInstructions: instructions,
            Models: models,
        };
        result.AddRow(newEntry);
       // jsonArray.push({"WorkOrder": workorders[i].WorkID , "WorkInstructions" : instructions});

    }
    
} else {
    
       // CreateInfoTableFromDataShape(infoTableName:STRING("InfoTable"), dataShapeName:STRING):INFOTABLE(AutoARWorkOrder_DS)
    result = Resources["InfoTableFunctions"].CreateInfoTableFromDataShape({
        infoTableName: "InfoTable",
        dataShapeName: "AutoARWorkPackage_DS"
    });
    // AutoARWorkOrder_DS entry object
    let newEntry = {
        WorkID: "NOWORKORDERS", // STRING [Primary Key]
        Title: "No work Orders for this item" , // STRING
        Overview: "-", // STRING
        Difficulty: "-", // STRING
        Time: "0", // STRING
        VIN: undefined // STRING
    };
	result.AddRow(newEntry);
    
}

//
//let params = {
//	table: result /* INFOTABLE */
//};
//
//// result: JSON
//result = Resources["InfoTableFunctions"].ToJSON(params);
//
//







