logger.debug("Enetering GetHeroData");

let params = {
	infoTableName: "hero" /* STRING {"defaultValue":"InfoTable"} */,
	dataShapeName: "AutoARHero_DS" /* DATASHAPENAME */
};

// result: INFOTABLE
let result = Resources["InfoTableFunctions"].CreateInfoTableFromDataShape(params);

let VUFORIA_PREFIX_MOBILE = "vuforia-model:///"; 
// Provide your filter using the format as described in the help topic "Query Parameter for Query Services"
let query = {
 "filters": {
   "type": "EQ",
   "fieldName": "VIN",
   "value": vin
 }
};


// result: INFOTABLE dataShape: ""
// Warning: Potential Performance issue, since query filter is performed in Memory
let heroresult = Things["AutoARHeroPart_DT"].QueryDataTableEntries({
	maxItems: undefined /* NUMBER {"defaultValue":500} */,
	values: undefined /* INFOTABLE */,
	query: query /* QUERY */,
	source: undefined /* STRING */,
	tags: undefined /* TAGS */
});


if (heroresult.length > 0 ) {
  let cadRepo = me.CADRepo;
  
  // Create metadata file in the same locationas the Model
  
  me.GetExtendedMetadata({
        folder: heroresult[0].Folder /* STRING */,
        modelFileName: heroresult[0].Model /* STRING */
  });
    
  let rowObj = new Object();
  rowObj.VIN  = heroresult[0].VIN;
  rowObj.MTID  =  heroresult[0].MTID;
  rowObj.Model  = cadRepo +"/"+ heroresult[0].Folder +"/" + heroresult[0].Model;
  rowObj.MTDataset  =  VUFORIA_PREFIX_MOBILE + cadRepo +"/"+ heroresult[0].Folder +"/" + heroresult[0].MTDataset;
  rowObj.MTGuideView  = cadRepo +"/"+ heroresult[0].Folder +"/" + heroresult[0].MTGuideView;
  rowObj.Folder  = heroresult[0].Folder;
  rowObj.MTRx  = heroresult[0].MTRx;
  rowObj.MTRy  = heroresult[0].MTRy;
  rowObj.MTRz  = heroresult[0].MTRz;
  result.AddRow(rowObj);
}






