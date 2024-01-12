logger.debug("Entering AutoARAffectedParts_DT:GetParts");

// Provide your filter using the format as described in the help topic "Query Parameter for Query Services"
let query = {
 "filters": {
   "type": "EQ",
   "fieldName": "AffectedPartID",
   "value": affectedPartID
 }
};

// result: INFOTABLE dataShape: ""
// Warning: Potential Performance issue, since query filter is performed in Memory
let result = me.QueryDataTableEntries({
	maxItems: undefined /* NUMBER {"defaultValue":500} */,
	query: query /* QUERY */,
	values: undefined /* INFOTABLE */,
	source: undefined /* STRING */,
	tags: undefined /* TAGS */
});