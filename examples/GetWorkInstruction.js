logger.debug("Entering GetWorkInstruction");


// Provide your filter using the format as described in the help topic "Query Parameter for Query Services"
let query = {
 "filters": {
   "type": "EQ",
   "fieldName": "WorkID",
   "value": workid
 }
};


// result: INFOTABLE dataShape: ""
// Warning: Potential Performance issue, since query filter is performed in Memory
let wiresult = Things["AutoARWorkInstruction_DT"].QueryDataTableEntries({
	maxItems: undefined /* NUMBER {"defaultValue":500} */,
	values: undefined /* INFOTABLE */,
	query: query /* QUERY */,
	source: undefined /* STRING */,
	tags: undefined /* TAGS */
});

let params = {
	infoTableName: undefined /* STRING {"defaultValue":"InfoTable"} */,
	dataShapeName: "AutoARWorkInstruction_DS"  /* DATASHAPENAME */
};

// result: INFOTABLE
let result = Resources["InfoTableFunctions"].CreateInfoTableFromDataShape(params);


let woquery = {
 "filters": {
   "type": "EQ",
   "fieldName": "WorkID",
   "value": workid
 }
};

// result: INFOTABLE dataShape: ""
// Warning: Potential Performance issue, since query filter is performed in Memory
let woresult = Things["AutoARWorkOrder_DT"].QueryDataTableEntries({
	maxItems: undefined /* NUMBER {"defaultValue":500} */,
	values: undefined /* INFOTABLE */,
	query: woquery /* QUERY */,
	source: undefined /* STRING */,
	tags: undefined /* TAGS */
});



let rowObject = new Object();
rowObject.WorkID = woresult[0].WorkID;
rowObject.StepNumber = 0;
rowObject.StepDetail = "Overview: "+woresult[0].Overview;
rowObject.Label1 =  "Work Order: "+woresult[0].Title;
rowObject.Label2 =  "Difficulty: "+woresult[0].Difficulty;
rowObject.Label3 = "Time Est.: "+ woresult[0].Time;
result.AddRow(rowObject);

for (i=0; i< wiresult.length; i++) {
    
    let afpartid = wiresult[i].AffectedPartsID;
    // result: INFOTABLE dataShape: ""
    let partsList = Things["AutoARAffectedParts_DT"].GetParts({
        affectedPartID: afpartid /* STRING */
    });

   // logger.debug("partsList...."+ partsList.ToJSON());
    
    let models = [];
    
    //{"model":"myModel","path":"/456/68"}
    for (j=0; j< partsList.length; j++) {
        models.push({"model": partsList[j].ModelName,"path": partsList[j].MetadataID});
    }

    let rowObject = new Object();
    rowObject.WorkID = wiresult[i].WorkID;
    rowObject.StepNumber = wiresult[i].StepNumber;
    rowObject.StepDetail = wiresult[i].StepDetail;
    rowObject.PartsList = partsList;
    rowObject.Label1 =  wiresult[i].Label1;
    rowObject.Label2 =  "";
    rowObject.Label3 =  "";
    rowObject.AffectedPartsID = afpartid;
    rowObject.Models = models;
    result.AddRow(rowObject);
 
}














