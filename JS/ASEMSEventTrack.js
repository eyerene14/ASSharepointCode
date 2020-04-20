$(document).ready(function () {


});

$("#fleet1").on("change", function () {
    getEvent($("#fleet1").val());
});

$("#fleetDAG").on("change", function () {
    getEvent($("#fleetDAG").val());
});

$("#fleetPCAL").on("change", function () {
    getEvent($("#fleetPCAL").val());
});

$('#event').on("change", function () {
    getEventDetails($("#newEvent").val());
});

$('#pcalChangeEvent').on("change", function () {
    getEventDetails($("#pcalChangeEvent").val());
    document.getElementById("fleet1").selectedIndex = 0;
});

$('#dagChangeEvent').on("change", function () {
    getEventDetails($("#dagChangeEvent").val());
    document.getElementById("fleet1").selectedIndex = 0;
});

$("#changeDAG").on("click", function () {
    document.getElementById("fleetDAG").selectedIndex = 0;
    document.getElementById("pcalChangeEvent").children().remove().end();
    document.getElementById("dagChangeEvent").children().remove().end();
});

$("#changePCAL").on("click", function () {
    document.getElementById("fleetPCAL").selectedIndex = 0;
    document.getElementById("pcalChangeEvent").children().remove().end();
    document.getElementById("dagChangeEvent").children().remove().end();
});

$("#collapseOne").on("click", function () {
    $("#collapseTwo").collapse();
});

$("#collapseTwo").on("click", function () {
    $("#collapseOne").collapse();
});

//update AirbusBoeingEMSEventsArchive List Item
$("#updateEvent").on("click", function () {
    updateChangeForm($("#newEvent").val());
});


function getEvent(fleet) {

    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/AirbusBoeingEMSEventsArchive?$select=EventKey&$filter=(%20substringof(%27' + fleet + '%27,Fleet))&groupBy=Event&orderBy=Event';

    getListItems(url, function (data) {
        var numRecords = data.d.results.length;

        if (numRecords > 0) {
            $.each(data, function (i, item) {
                $("#newEvent").children().remove().end();
                $("#newEvent").append('<option id="eventDefault" value="">Select</option>');
                $("#dagChangeEvent").children().remove().end();
                $("#dagChangeEvent").append('<option id="eventDefault" value="">Select</option>');
                $("#pcalChangeEvent").children().remove().end();
                $("#pcalChangeEvent").append('<option id="eventDefault" value="">Select</option>');
                resetChangeForm();

                for (var i = 0; i < numRecords; i++) {

                    $("#newEvent").append('<option id= "' + data.d.results[i].EventKey + '" value="' + data.d.results[i].EventKey + '">' + data.d.results[i].EventKey + '</option>');
                    $("#dagChangeEvent").append('<option id= "' + data.d.results[i].EventKey + '" value="' + data.d.results[i].EventKey + '">' + data.d.results[i].EventKey + '</option>');
                    $("#pcalChangeEvent").append('<option id= "' + data.d.results[i].EventKey + '" value="' + data.d.results[i].EventKey + '">' + data.d.results[i].EventKey + '</option>');
                }

            })
            $("#newEvent").append('<option id= "Other" value="Other">Other</option>');
            $("#dagChangeEvent").append('<option id= "Other" value="Other">Other</option>');
            $("#pcalChangeEvent").append('<option id= "Other" value="Other">Other</option>');
        }
        else {
            alert("Select a fleet");
            $("#newEvent").children().remove().end();
            $("#newEvent").append('<option id="eventDefault" value="">Select</option>');
            $("#dagChangeEvent").children().remove().end();
            $("#dagChangeEvent").append('<option id="eventDefault" value="">Select</option>');
            $("#pcalChangeEvent").children().remove().end();
            $("#pcalChangeEvent").append('<option id="eventDefault" value="">Select</option>');
            resetChangeForm();
        }

    })

};

function getEventDetails(event) {

    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/AirbusBoeingEMSEventsArchive?$filter=EventKey%20eq%20%27' + event + '%27&orderBy=Event';

    getListItems(url, function (data) {
        var numRecords = data.d.results.length;

        if (numRecords > 0) {
            $.each(data, function (i, item) {
                resetChangeForm();

                for (var i = 0; i < numRecords; i++) {
                    $("#key_id").val(data.d.results[i].Id);
                    $("#formula").val(data.d.results[i].Formula);
                    var formulaHidden = data.d.results[i].Formula;
                    $("#newProfile").val(data.d.results[i].Profile);
                    $("#definition").val(data.d.results[i].EventDefinition);
                    var eventDefinitionHidden = data.d.results[i].EventDefinition;
                    $("#infoOnlyDef").val(data.d.results[i].Information);
                    var informationHidden = data.d.results[i].Information;
                    $("#cautionDef").val(data.d.results[i].Caution);
                    var cautionHidden = data.d.results[i].Caution;
                    $("#warningDef").val(data.d.results[i].Warning);
                    var warningHidden = data.d.results[i].Warning;
                    $("#alertDef").val(data.d.results[i].Alert);
                    var alertHidden = data.d.results[i].Alert;
                    $("#intervalDef").val(data.d.results[i].Interval);
                    var intervalHidden = data.d.results[i].Interval;
                    $("#hiddeninDAG").val(data.d.results[i].InDAG);
                    $("#hiddeninPCAL").val(data.d.results[i].InPCAL);

                        if(data.d.results[i].InDAG === 'Yes')
                        {
                            document.getElementById("inDAG1").selectedIndex = 1;
                        }
                        else if(data.d.results[i].InDAG === 'No')
                        {
                            document.getElementById("inDAG1").selectedIndex = 2;
                        }
                        else
                        {
                            document.getElementById("inDAG1").selectedIndex = 0;
                        }

                        if(data.d.results[i].InPCAL === 'Yes')
                        {
                            document.getElementById("inPCAL1").selectedIndex = 1;
                        }
                        else if(data.d.results[i].InPCAL === 'No')
                        {
                            document.getElementById("inPCAL1").selectedIndex = 2;
                        }
                        else
                        {
                            document.getElementById("inPCAL1").selectedIndex = 0;
                        }
                    //$('#inDAG1').children("option:selected").val(data.d.results[i].InDAG);
                    //$('#inDAG1').children("option:selected").val()
                    //$('#inDAG1').children("option:selected").val($("#hiddeninDAG").val())
                }

            })

        }
        else {
            alert("Select a fleet");
        }

    })

};

function resetChangeForm() {
    $("#key_id").val("");
    document.getElementById("newProfile").selectedIndex = 0;
    document.getElementById("gPFC").selectedIndex = 0;
    $("#formula").val("");
    $("#definition").val("");
    $("#infoOnlyDef").val("");
    $("#cautionDef").val("");
    $("#warningDef").val("");
    $("#alertDef").val("");
    $("#intervalDef").val("");
    document.getElementById("inDAG1").selectedIndex = 0;
    document.getElementById("inPCAL1").selectedIndex = 0;
}

function resetModalForm() {
    document.getElementById("inDAG2").selectedIndex = 0;
    document.getElementById("inPCAL2").selectedIndex = 0;
    document.getElementById("inDAG3").selectedIndex = 0;
    document.getElementById("inPCAL3").selectedIndex = 0;
}


function getListItems(url, success, failure) {

    $.ajax({
        url: url,
        method: "GET",
        headers: {
            "Accept": "application/json; odata=verbose"
        },
        cache: true,
        beforeSend: function () {
            //toggleCursor();
            $(".MessageLabel").text("");
        },
        async: true
        ,
        success: function (data) {
            console.log('data success');
            success(data);
            ////toggleCursor();
        },
        error: function (data) {
            console.log('data failure');
            ////toggleCursor();
            //$(".MessageLabel").text('Error getting list items').css({"color":"red","font-weight":"bold"});
            console.log('Error getting list items');
        }
    });
};

function updateChangeForm(eventKey) {

    var errorMessage = "Error inserting record id + consent: " + $("#key_id").val() + "  " + eventKey;
    updateListItem($("#key_id").val(), eventKey, "Item updated/saved", errorMessage);
}

function updateListItem(itemId, eventKey, success, failure) {
    var listItemType = 'Microsoft.SharePoint.DataService.AirbusBoeingEMSEventsArchiveItem';
    var url = "https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/AirbusBoeingEMSEventsArchive(" + itemId + ")";

    var item = {
        "__metadata": { "type": listItemType },
        "Formula": ($("#formula").val() == "") ? formulaHidden : $('#formula').val()
        , "EventDefinition": ($("#definition").val() == "") ? eventDefinitionHidden : $('#definition').val()
        , "Information": ($("#infoOnlyDef").val() == "") ? informationHidden : $('#infoOnlyDef').val()
        , "Caution": ($("#cautionDef").val() == "") ? cautionHidden : $('#cautionDef').val()
        , "Warning": ($("#warningDef").val() == "") ? warningHidden : $('#warningDef').val()
        , "Alert": ($("#alertDef").val() == "") ? alertHidden : $('#alertDef').val()
        , "Interval": ($("#intervalDef").val() == "") ? intervalHidden : $('#intervalDef').val()
        , "InDAG": $("#inDAG1 option:selected").text()
        , "InPCAL": $("#inPCAL1 option:selected").text()
    };

    //update List AirbusBoeingEMSEventsArchive Columns
    getListItems(url, function (data) {
        $.ajax({
            url: url,
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(item),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "X-HTTP-Method": "MERGE",
                "If-Match": "*"
            },
            success: function (data) {
                console.log('Success');
                window.location.href = window.location.href;
                alert("pause");
            },
            error:
                function (data) {
                    failure
                    alert(failure);
                }
        });
    })
    //window.location.reload();
};