(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "id",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "indicator",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "value",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "geo_code",
            dataType: tableau.dataTypeEnum.float
        }];

        var tableSchema = {
            id: "StatCanInd",
            alias: "Statcan Indicators",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://www150.statcan.gc.ca/n1/dai-quo/ssi/homepage/ind-hp.json", function(resp) {
            var feat = resp.results.indicators,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "id": feat[i].indicator_number,
                    "indicator": feat[i].title.en,
                    "value": feat[i].value.en,
                    "geo_code": feat[i].geo_code
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "USGS Earthquake Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
