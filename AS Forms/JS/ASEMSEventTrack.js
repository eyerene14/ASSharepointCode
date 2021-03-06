$(document).ready(function () {
    $("#gpfcText").hide();
    $('#gpfcLabel').hide();
    $("#gpfcText1").hide();
    $('#gpfcLabel1').hide();
    $('#noInDAGDataTracked').hide();
    $('#noInPCALDataTracked').hide();
    $("#profileOther").hide();
    $('#dagSectionOther').hide();
    $('#newEventFleet').children("option:selected").val("");
    $('#fleetDAG').children("option:selected").val("");
    $('#fleetPCAL').children("option:selected").val("");
    $('#GreyInfo').hide();
    $('#GreyInfo2').hide();
    $('#dagGreyInfo').hide();
    $('#dagGreyCaution').hide();
    $('#dagGreyWarning').hide();
    $('#dagGreyAlert').hide();
    $('#pcalGreyInfo').hide();
    $('#pcalGreyCaution').hide();
    $('#pcalGreyWarning').hide();
    $('#pcalGreyAlert').hide();
    $('#eventsTable').hide();
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
    getEventDetails($("#event").val());
});

$('#dagModalEvent').on("change", function () {
    resetDAGModal();
    getDAGModalDAGSection($('#dagModalEvent').val())
    //document.getElementById("fleet1").selectedIndex = 0;
});

$('#pcalModalEvent').on("change", function () {
    resetPCALModal();
    getPCALModalEventDetails($("#pcalModalEvent").val());
    //document.getElementById("fleet1").selectedIndex = 0;
});

//this resets fleet and event field to 'Select' when fleet or event are changed
$("#changeDAG").on("click", function () {
    document.getElementById("fleetDAG").selectedIndex = 0;
    document.getElementById("dagModalEvent").selectedIndex = 0;
    document.getElementById("dagModalEvent").children().remove().end();
    resetDAGModal();
});

//this resets fleet and event field to 'Select' when fleet or event are changed
$("#changePCAL").on("click", function () {
    document.getElementById("fleetPCAL").selectedIndex = 0;
    document.getElementById("pcalModalEvent").selectedIndex = 0;
    document.getElementById("pcalModalEvent").children().remove().end();
    resetPCALModal();
});

//update item in AirbusBoeingEMSEventsArchive List
$("#updateEvent").on("click", function () {
    updateChangeForm($("#event").val());
});

//add new item in AirbusBoeingEMSEventsArchive List
$("#addEvent").on("click", function () {

    if (document.getElementById("fleet1").selectedIndex == 0) {
        $('#errorMessageNewEvent').show();
        $('#errorMessageNewEvent').val("Please select a fleet");
    }
    else if (document.getElementById("newEventProfile").selectedIndex == 0) {
        $('#errorMessageNewEvent').show();
        $('#errorMessageNewEvent').val("Please select a profile");
    }
    else {
        saveNewEventForm($("#newEvent").val());
    }
});

$("#inDAGBtn").on("click", function () {
    if (document.getElementById("fleetDAG").selectedIndex == 0) {
        $('#errorMessageNewEvent').show();
        $('#errorMessageNewEvent').val("Please select a fleet");
    }
    else if (document.getElementById("dagModalEvent").selectedIndex == 0) {
        $('#errorMessageNewEvent').show();
        $('#errorMessageNewEvent').val("Please select an event");
    }
    else if (document.getElementById("inDAG2").selectedIndex == 0 ||
        document.getElementById("infoOnlyDAG").selectedIndex == 0 ||
        document.getElementById("cautionDAG").selectedIndex == 0 ||
        document.getElementById("warningDAG").selectedIndex == 0 ||
        document.getElementById("alertDAG").selectedIndex == 0 ||
        document.getElementById("whyChangeDAG").selectedIndex == "" ||
        document.getElementById("perWhomDAG").selectedIndex == ""
    ) {
        $('#errorMessageNewEvent').show();
        $('#errorMessageNewEvent').val("Please select all dropdown options");
    }
    else {
        addToListFromDAGModal();
    }

});

$("#inPCALBtn").on("click", function () {
    if (document.getElementById("fleetPCAL").selectedIndex == 0) {
        $('#errorMessageNewEvent').show();
        $('#errorMessageNewEvent').val("Please select a fleet");
    }
    else if (document.getElementById("pcalModalEvent").selectedIndex == 0) {
        $('#errorMessageNewEvent').show();
        $('#errorMessageNewEvent').val("Please select an event");
    }
    else if (document.getElementById("inPCAL3").selectedIndex == 0 ||
        document.getElementById("infoOnlyPCAL").selectedIndex == 0 ||
        document.getElementById("cautionPCAL").selectedIndex == 0 ||
        document.getElementById("warningPCAL").selectedIndex == 0 ||
        document.getElementById("alertPCAL").selectedIndex == 0 ||
        document.getElementById("whyChangePCAL").selectedIndex == "" ||
        document.getElementById("perWhomPCAL").selectedIndex == ""
    ) {
        $('#errorMessageNewEvent').show();
        $('#errorMessageNewEvent').val("Please select all dropdown options");
    }
    else {
        addToListFromPCALModal();
    }
});

//show and hide Global Parameter Fleet Constant Drop down and open text box for name in new Event Form
$('#gPFC').on("change", function () {
    $('#gpfcText').show();
    $('#gpfcLabel').show();
    $('#gpfcLabel').text($('#gPFC').children("option:selected").text());
    $('#gPFClabel').hide();
    $('#gPFC').hide();
});

$('#gPFC1').on("change", function () {
    $('#gpfcText1').show();
    $('#gpfcLabel1').show();
    $('#gpfcLabel1').text($('#gPFC1').children("option:selected").text());
    $('#gPFC1label').hide();
    $('#gPFC1').hide();
});

$('#newEventProfile').on("change", function () {
    if ($('#newEventProfile').children("option:selected").text() == 'Other') {
        $('#newEventProfile').hide();
        $('#profileOther').show();
        $('#profileOther').on("change", function () {
            $('#newEventProfile').children("option:selected").val($('#profileOther').val());
        });
    }
});

$('#dagSection').on("change", function () {
    if ($('#dagSection').children("option:selected").text() == 'Other') {
        $('#dagSection').hide();
        $('#dagSectionOther').show();
    }
    else if (document.getElementById("dagSection").selectedIndex != 0) {
        getDAGModalEventDetails($("#dagModalEvent").val(), $("#dagSection").children("option:selected").val());
    }
    $('#dagSectionMultiple').hide();
});

$('#fleetReporting').on("click", function () {
    $('#eventsTable').show();
    $('#inDAGPCALTable').hide();
});

function getEvent(fleet) {

    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/AirbusBoeingEMSEventsArchive?$select=EventKey&$filter=(%20substringof(%27' + fleet + '%27,Fleet))&$orderby=EventKey%20asc';

    getListItems(url, function (data) {
        var numRecords = data.d.results.length;

        if (numRecords > 0) {
            $.each(data, function (i, item) {
                $("#event").children().remove().end();
                $("#event").append('<option id="eventDefault" value="">Select</option>');
                $("#dagModalEvent").children().remove().end();
                $("#dagModalEvent").append('<option id="eventDefault" value="">Select</option>');
                $("#pcalModalEvent").children().remove().end();
                $("#pcalModalEvent").append('<option id="eventDefault" value="">Select</option>');
                resetChangeForm();
                resetDAGModal();
                resetPCALModal();

                for (var i = 0; i < numRecords; i++) {

                    $("#event").append('<option id= "' + data.d.results[i].EventKey + '" value="' + data.d.results[i].EventKey + '">' + data.d.results[i].EventKey + '</option>');
                    $("#dagModalEvent").append('<option id= "' + data.d.results[i].EventKey + '" value="' + data.d.results[i].EventKey + '">' + data.d.results[i].EventKey + '</option>');
                    $("#pcalModalEvent").append('<option id= "' + data.d.results[i].EventKey + '" value="' + data.d.results[i].EventKey + '">' + data.d.results[i].EventKey + '</option>');
                }

            })
        }
        else {
            alert("Select a fleet");
            $("#event").children().remove().end();
            $("#event").append('<option id="eventDefault" value="">Select</option>');
            $("#dagModalEvent").children().remove().end();
            $("#dagModalEvent").append('<option id="eventDefault" value="">Select</option>');
            $("#pcalModalEvent").children().remove().end();
            $("#pcalModalEvent").append('<option id="eventDefault" value="">Select</option>');
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
                    $("#newProfile").val(data.d.results[i].Profile);
                    $("#definition").val(data.d.results[i].EventDefinition);
                    $("#infoOnlyDef").val(data.d.results[i].Information);
                    $("#cautionDef").val(data.d.results[i].Caution);
                    $("#warningDef").val(data.d.results[i].Warning);
                    $("#alertDef").val(data.d.results[i].Alert);
                    $("#intervalDef").val(data.d.results[i].Interval);
                    $("#fullEMSPath").val(data.d.results[i].FullEMSPath);
                    /*$("#hiddeninDAG").val(data.d.results[i].InDAG);
                    $("#hiddeninPCAL").val(data.d.results[i].InPCAL);*/
                    //GlobalParam/Fleet Constant
                    if (data.d.results[i].ParameterDescription === 'Yes') {
                        document.getElementById("gPFC").selectedIndex = 1;
                    }
                    else if (data.d.results[i].ParameterDescription === 'No') {
                        document.getElementById("gPFC").selectedIndex = 2;
                    }
                    else {
                        document.getElementById("gPFC").selectedIndex = 0;
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
};//End of getEventDetails method

function getDAGModalDAGSection(event) {

    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/DAGandPCALChangeTracking?select=DAGSection&$filter=EventKey%20eq%20%27' + event + '%27&$orderby=Id%20desc';
    getListItems(url, function (data) {
        var numRecords = data.d.results.length;
        resetDAGModal();
        $("#dagSectionMultiple").text("");

        if (numRecords = 1) {
            $.each(data, function (i, item) {
                var i = 0;
                getDAGModalEventDetails(data.d.results[i].EventKey, data.d.results[i].DAGSection);
                $("#hiddeninPCAL").val(data.d.results[i].InPCAL);
            })//.each
        }//if
        else if (numRecords => 1) {
            $.each(data, function (i, item) {
                //inPCAL
                if (data.d.results[0].InPCAL === 'Yes') {
                    document.getElementById("inPCAL2").selectedIndex = 1;
                }
                else if (data.d.results[0].InPCAL === 'No') {
                    document.getElementById("inPCAL2").selectedIndex = 2;
                }
                else if ($("#pcalGreyCaution").val() != '') {
                    document.getElementById("inPCAL2").selectedIndex = 1;
                    $("#hiddeninPCAL").val("Yes");
                }
                else {
                    document.getElementById("inPCAL2").selectedIndex = 0;
                }
                $("#hiddeninDAG").val(data.d.results[i].InDAG);
                $("#hiddeninPCAL").val(data.d.results[i].InPCAL);
                //inDAG
                if (data.d.results[0].InDAG === 'Yes') {
                    document.getElementById("inDAG2").selectedIndex = 1;
                }
                else if (data.d.results[0].InDAG === 'No') {
                    document.getElementById("inDAG2").selectedIndex = 2;
                }

                else {
                    document.getElementById("inDAG2").selectedIndex = 0;
                }

                const arrayDefine = [];
                for (var i = 0; i < numRecords; i++) {
                    var arrayFilter = arrayDefine.push(data.d.results[i].DAGSection);
                    var dup = arrayDefine.filter(a => a === data.d.results[i].DAGSection);
                    //if (data.d.results[i].DAGSection != 'null') {
                    if (dup.length <= 1) {
                        $('#dagSectionMultiple').show();
                        $("#dagSectionMultiple").append(data.d.results[i].DAGSection + " ");
                        $("#queryNotesDAG").val(data.d.results[i].DAGSection + " ");
                    }
                } //for
            })//.each
            $('#noInDAGDataTracked').hide();
        }//else if

    })//getListItems  

}; //End of getDAGModalEventDetails method

function getDAGModalEventDetails(event, dagSection) {

    if (dagSection) {
        var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/DAGandPCALChangeTracking?$filter=((EventKey%20eq%20%27' + event + '%27)%20and%20(DAGSection%20eq%20%27' + dagSection + '%27))&$orderby=Id%20desc';
    }
    else {
        var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/DAGandPCALChangeTracking?$filter=EventKey%20eq%20%27' + event + '%27&$orderby=Id%20desc';
    }
    getListItems(url, function (data) {
        var numRecords = data.d.results.length;

        if (numRecords > 0) {
            $.each(data, function (i, item) {

                for (var i = 0; i < 1; i++) {
                    $("#key_id").val(data.d.results[i].Id);
                    //inDAG
                    if (data.d.results[i].InDAG === 'Yes') {
                        document.getElementById("inDAG2").selectedIndex = 1;
                    }
                    else if (data.d.results[i].InDAG === 'No') {
                        document.getElementById("inDAG2").selectedIndex = 2;
                    }
                    else {
                        document.getElementById("inDAG2").selectedIndex = 0;
                    }
                    //inPCAL 
                    if ($("#hiddeninPCAL").val() === 'Yes') {
                        document.getElementById("inPCAL2").selectedIndex = 1;
                    }
                    else if ($("#hiddeninPCAL").val() === 'No') {
                        document.getElementById("inPCAL2").selectedIndex = 2;
                    }
                    else {
                        document.getElementById("inPCAL2").selectedIndex = 0;
                    }

                    if ($("#pcalGreyCaution").val() != '') {
                        document.getElementById("inPCAL2").selectedIndex = 1;
                    }

                    //Info Only in DAG Report?
                    if (data.d.results[i].InfoOnlyDAG === 'Yes') {
                        document.getElementById("infoOnlyDAG").selectedIndex = 1;
                    }
                    else if (data.d.results[i].InfoOnlyDAG === 'No') {
                        document.getElementById("infoOnlyDAG").selectedIndex = 2;
                    }
                    else if (data.d.results[i].InfoOnlyDAG === 'n/a') {
                        document.getElementById("infoOnlyDAG").selectedIndex = 3;
                    }
                    else {
                        document.getElementById("infoOnlyDAG").selectedIndex = 0;
                    }
                    //Caution in DAG Report?
                    if (data.d.results[i].CautionDAG === 'Yes') {
                        document.getElementById("cautionDAG").selectedIndex = 1;
                    }
                    else if (data.d.results[i].CautionDAG === 'No') {
                        document.getElementById("cautionDAG").selectedIndex = 2;
                    }
                    else if (data.d.results[i].CautionDAG === 'n/a') {
                        document.getElementById("cautionDAG").selectedIndex = 3;
                    }
                    else {
                        document.getElementById("cautionDAG").selectedIndex = 0;
                    }
                    //Warning in DAG Report?
                    if (data.d.results[i].WarningDAG === 'Yes') {
                        document.getElementById("warningDAG").selectedIndex = 1;
                    }
                    else if (data.d.results[i].WarningDAG === 'No') {
                        document.getElementById("warningDAG").selectedIndex = 2;
                    }
                    else if (data.d.results[i].WarningDAG === 'n/a') {
                        document.getElementById("warningDAG").selectedIndex = 3;
                    }
                    else {
                        document.getElementById("warningDAG").selectedIndex = 0;
                    }
                    //Alert DAG in DAG Report?
                    if (data.d.results[i].AlertDAG === 'Yes') {
                        document.getElementById("alertDAG").selectedIndex = 1;
                    }
                    else if (data.d.results[i].AlertDAG === 'No') {
                        document.getElementById("alertDAG").selectedIndex = 2;
                    }
                    else if (data.d.results[i].AlertDAG === 'n/a') {
                        document.getElementById("alertDAG").selectedIndex = 3;
                    }
                    else {
                        document.getElementById("alertDAG").selectedIndex = 0;
                    }
                    if (data.d.results[i].InPCAL === 'Yes' || data.d.results[i].InPCAL === 'No') {
                        $("#pcalGreyInfo").text(data.d.results[i].InfoOnlyPCAL);
                        $("#pcalGreyCaution").text(data.d.results[i].CautionPCAL);
                        $("#pcalGreyWarning").text(data.d.results[i].WarningPCAL);
                        $("#pcalGreyAlert").text(data.d.results[i].AlertPCAL);
                        $('#GreyInfo').show();
                        $('#pcalGreyInfo').show();
                        $('#pcalGreyCaution').show();
                        $('#pcalGreyWarning').show();
                        $('#pcalGreyAlert').show();
                        $("#notesPCAL").val(data.d.results[i].Notes);
                        $("#ccCheck").prop("checked", data.d.results[i].CrewContactRequired);
                        $("#animationRequired").prop("checked", data.d.results[i].AnimationRequired);
                        $("#googleEarthRequired").prop("checked", data.d.results[i].GoogleEarthRequired);
                        $("#whyChangePCAL").val(data.d.results[i].WhyChangePCAL);
                        $("#perWhomPCAL").val(data.d.results[i].PerWhomPCAL);
                    }
                    $("#queryNotesDAG").val(data.d.results[i].QueryNotesDAG);
                    $("#whyChangeDAG").val(data.d.results[i].WhyChangeDAG);
                }
            })
            $('#noInDAGDataTracked').hide();
        }
        else {
            resetDAGModalNotSection();
            $('#noInDAGDataTracked').show();
        }
    })
}; //End of getDAGModalEventDetails method

function getPCALModalEventDetails(event) {

    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/DAGandPCALChangeTracking?$filter=EventKey%20eq%20%27' + event + '%27&$orderby=Id%20desc';
    getListItems(url, function (data) {
        var numRecords = data.d.results.length;

        if (numRecords > 0) {
            $.each(data, function (i, item) {
                resetPCALModal();

                for (var i = 0; i < 1; i++) {
                    //$("#key_id").val(data.d.results[i].Id);
                    //inDAG
                    $("#notesPCAL").val(data.d.results[i].Notes);
                    $("#ccCheck").prop("checked", data.d.results[i].CrewContactRequired);
                    $("#animationRequired").prop("checked", data.d.results[i].AnimationRequired);
                    $("#googleEarthRequired").prop("checked", data.d.results[i].GoogleEarthRequired);
                    $("#whyChangePCAL").val(data.d.results[i].WhyChangePCAL);
                    $("#perWhomPCAL").val(data.d.results[i].PerWhomPCAL);
                    $("#queryNotesDAG").val(data.d.results[i].QueryNotesDAG);
                    if (data.d.results[i].InDAG === 'Yes') {
                        document.getElementById("inDAG3").selectedIndex = 1;
                    }
                    else if (data.d.results[i].InDAG === 'No') {
                        document.getElementById("inDAG3").selectedIndex = 2;
                    }
                    else {
                        document.getElementById("inDAG3").selectedIndex = 0;
                    }
                    //inPCAL
                    if (data.d.results[i].InPCAL === 'Yes') {
                        document.getElementById("inPCAL3").selectedIndex = 1;
                    }
                    else if (data.d.results[i].InPCAL === 'No') {
                        document.getElementById("inPCAL3").selectedIndex = 2;
                    }
                    else {
                        document.getElementById("inPCAL3").selectedIndex = 0;
                    }
                    //Info Only in DAG Report?
                    if (data.d.results[i].InfoOnlyPCAL === 'Yes') {
                        document.getElementById("infoOnlyPCAL").selectedIndex = 1;
                    }
                    else if (data.d.results[i].InfoOnlyPCAL === 'No') {
                        document.getElementById("infoOnlyPCAL").selectedIndex = 2;
                    }
                    else if (data.d.results[i].InfoOnlyPCAL === 'n/a') {
                        document.getElementById("infoOnlyPCAL").selectedIndex = 3;
                    }
                    else {
                        document.getElementById("infoOnlyPCAL").selectedIndex = 0;
                    }
                    //Caution in DAG Report?
                    if (data.d.results[i].CautionPCAL === 'Yes') {
                        document.getElementById("cautionPCAL").selectedIndex = 1;
                    }
                    else if (data.d.results[i].CautionPCAL === 'No') {
                        document.getElementById("cautionPCAL").selectedIndex = 2;
                    }
                    else if (data.d.results[i].CautionPCAL === 'n/a') {
                        document.getElementById("cautionPCAL").selectedIndex = 3;
                    }
                    else {
                        document.getElementById("cautionPCAL").selectedIndex = 0;
                    }
                    //Warning in DAG Report?
                    if (data.d.results[i].WarningPCAL === 'Yes') {
                        document.getElementById("warningPCAL").selectedIndex = 1;
                    }
                    else if (data.d.results[i].WarningPCAL === 'No') {
                        document.getElementById("warningPCAL").selectedIndex = 2;
                    }
                    else if (data.d.results[i].WarningPCAL === 'n/a') {
                        document.getElementById("warningPCAL").selectedIndex = 3;
                    }
                    else {
                        document.getElementById("warningPCAL").selectedIndex = 0;
                    }
                    //Alert DAG in DAG Report?
                    if (data.d.results[i].AlertPCAL === 'Yes') {
                        document.getElementById("alertPCAL").selectedIndex = 1;
                    }
                    else if (data.d.results[i].AlertPCAL === 'No') {
                        document.getElementById("alertPCAL").selectedIndex = 2;
                    }
                    else if (data.d.results[i].WarningPCAL === 'n/a') {
                        document.getElementById("alertPCAL").selectedIndex = 3;
                    }
                    else {
                        document.getElementById("alertPCAL").selectedIndex = 0;
                    }
                    if (data.d.results[i].InDAG == 'Yes') {
                        $("#dagGreyInfo").text(data.d.results[i].InfoOnlyDAG);
                        $("#dagGreyCaution").text(data.d.results[i].CautionDAG);
                        $("#dagGreyWarning").text(data.d.results[i].WarningDAG);
                        $("#dagGreyAlert").text(data.d.results[i].AlertDAG);
                        $('#GreyInfo2').show();
                        $('#dagGreyInfo').show();
                        $('#dagGreyCaution').show();
                        $('#dagGreyWarning').show();
                        $('#dagGreyAlert').show();
                    }
                }
            }) // end of .each
            $('#noInPCALDataTracked').hide();
        }//end of if
        else {
            $('#noInPCALDataTracked').show();
            resetPCALModal();
        }
    })
}; //End of getDAGModalEventDetails method

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
    document.getElementById("gPFC").selectedIndex = 0;
    document.getElementById("newProfile").selectedIndex = 0;
    //document.getElementById("inDAG1").selectedIndex = 0;
    //document.getElementById("inPCAL1").selectedIndex = 0;
}

function resetDAGModal() {
    document.getElementById("inDAG2").selectedIndex = 0;
    document.getElementById("inPCAL2").selectedIndex = 0;
    document.getElementById("dagSection").selectedIndex = 0;
    document.getElementById("infoOnlyDAG").selectedIndex = 0;
    document.getElementById("cautionDAG").selectedIndex = 0;
    document.getElementById("warningDAG").selectedIndex = 0;
    document.getElementById("alertDAG").selectedIndex = 0;
    $("#hiddeninPCAL").val("");
    $('#dagSectionOther').hide();
    $('#dagSection').show();
    $('#dagSectionMultiple').hide();
    $("#dagSectionMultiple").text("");
    $('#pcalGreyInfo').hide();
    $('#GreyInfo').hide();
    $('#pcalGreyCaution').hide();
    $('#pcalGreyWarning').hide();
    $('#pcalGreyAlert').hide();
    $('#noInDAGDataTracked').hide();
    $("#whyChangeDAG").val("");
    $("#queryNotesDAG").val("");
    $("#perWhomDAG").val("");
    $("#notesPCAL").val("");
    $("#ccCheck").prop("checked", false);
    $("#animationRequired").prop("checked", false);
    $("#googleEarthRequired").prop("checked", false);
    $("#whyChangePCAL").val("");
    $("#perWhomPCAL").val("");
}

function resetDAGModalNotSection() {
    document.getElementById("inDAG2").selectedIndex = 0;
    document.getElementById("infoOnlyDAG").selectedIndex = 0;
    document.getElementById("cautionDAG").selectedIndex = 0;
    document.getElementById("warningDAG").selectedIndex = 0;
    document.getElementById("alertDAG").selectedIndex = 0;
    $('#dagSectionOther').hide();
    $('#dagSection').show();
    $('#dagSectionMultiple').hide();
    $("#dagSectionMultiple").text("");
    $('#GreyInfo').hide();
    $('#noInDAGDataTracked').hide();
    $("#whyChangeDAG").val("");
    $("#queryNotesDAG").val("");
    $("#perWhomDAG").val("");
}

function resetPCALModal() {
    document.getElementById("inDAG3").selectedIndex = 0;
    document.getElementById("inPCAL3").selectedIndex = 0;
    document.getElementById("infoOnlyPCAL").selectedIndex = 0;
    document.getElementById("cautionPCAL").selectedIndex = 0;
    document.getElementById("warningPCAL").selectedIndex = 0;
    document.getElementById("alertPCAL").selectedIndex = 0;
    $('#dagGreyInfo').hide();
    $('#GreyInfo').hide();
    $('#dagGreyCaution').hide();
    $('#dagGreyWarning').hide();
    $('#dagGreyAlert').hide();
    $('#noInPCALDataTracked').hide();
    $("#notesPCAL").val("");
    $("#ccCheck").prop("checked", false);
    $("#animationRequired").prop("checked", false);
    $("#googleEarthRequired").prop("checked", false);
    $("#whyChangePCAL").val("");
    $("#perWhomPCAL").val("");
    $("#queryNotesDAG").val("");
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
        "Formula": ($("#formula").val() == "") ? null : $('#formula').val()
        , "EventDefinition": ($("#definition").val() == "") ? null : $('#definition').val()
        , "Information": ($("#infoOnlyDef").val() == "") ? null : $('#infoOnlyDef').val()
        , "Caution": ($("#cautionDef").val() == "") ? null : $('#cautionDef').val()
        , "Warning": ($("#warningDef").val() == "") ? null : $('#warningDef').val()
        , "Alert": ($("#alertDef").val() == "") ? null : $('#alertDef').val()
        , "Interval": ($("#intervalDef").val() == "") ? null : $('#intervalDef').val()
        , "FullEMSPath": ($("#fullEMSPath").val() == "") ? null : $('#fullEMSPath').val()
        , "ParameterDescription": ($("#gPFC option:selected").text() == "") ? null :$("#gPFC option:selected").text()
        , "GlobalParameterFleetConstant": ($("#gpfcText").val() == "") ? null : $("#gpfcText").val()
        //, "InDAG": $("#inDAG1 option:selected").text()
        //, "InPCAL": $("#inPCAL1 option:selected").text()
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
                saveNewEventForm();
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

//After a save button 'Add New EMS Event to Log' data added to AirbusBoeingEMSEventsArchive List
function saveNewEventForm() {
    var count = 1;
    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/AirbusBoeingEMSEventsArchive';
    var listItemType = 'Microsoft.SharePoint.DataService.AirbusBoeingEMSEventsArchiveItem';

    var item = {
        "__metadata": { "type": listItemType }
        , "Fleet": ($("#newEventFleet option:selected").val() == "") ? null : $("#newEventFleet option:selected").text()
        , "Event": ($("#newEvent").val() == "") ? "?" : $('#newEvent').val()
        , "EventKey": 'P' + $("#newEventProfile").val() + ': ' + $('#newEvent').val()
        , "Profile": ($('#newEventProfile').children("option:selected").val() == "Other") ? $('#profileOther').val() : $('#newEventProfile').children("option:selected").val()
        , "Formula": ($("#formula1").val() == "") ? null : $('#formula1').val()
        , "EventDefinition": ($("#definition1").val() == "") ? null : $('#definition1').val()
        , "Information": ($("#infoOnlyDef1").val() == "") ? null : $('#infoOnlyDef1').val()
        , "Caution": ($("#cautionDef1").val() == "") ? null : $('#cautionDef1').val()
        , "Warning": ($("#warningDef1").val() == "") ? null : $('#warningDef1').val()
        , "Alert": ($("#alertDef1").val() == "") ? null : $('#alertDef1').val()
        , "Interval": ($('#intervalDef1').val() == "") ? null : $('#intervalDef1').val()
        , "FullEMSPath": ($('#fullEMSPath1').val() == "") ? null :$('#fullEMSPath1').val()
        , "ParameterDescription": ($("#gPFC1 option:selected").text() == "") ? null :$("#gPFC1 option:selected").text()
        , "GlobalParameterFleetConstant": ($("#gpfcText1").val() == "") ? null : $("#gpfcText1").val() 
        //, "InDAG": $("#inDAG4 option:selected").text()
        //, "InPCAL": $("#inPCAL4 option:selected").text()
    }//end item

    var errorMessage = "Error inserting record number: " + count;
    insertIntoList(url, item, "Item added/saved", errorMessage);
    /*window.location.reload();
    $("#tBody1").append("Saved to Human Factors by Flight List");*/
}

function addToListFromDAGModal() {
    var count = 1;
    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/DAGandPCALChangeTracking';
    var listItemType = 'Microsoft.SharePoint.DataService.DAGandPCALChangeTrackingItem';

    var item = {
        "__metadata": { "type": listItemType }
        , "Fleet": ($("#fleetDAG").val() == "") ? null : $('#fleetDAG').val()
        , "EventKey": ($("#dagModalEvent").val() == "") ? null : $('#dagModalEvent').val()
        , "InDAG": $("#inDAG2 option:selected").text()
        , "InPCAL": $("#inPCAL2 option:selected").text()
        , "DAGSection": ($("#dagSection").val() == "Other") ? $('#dagSectionOther').val() : $('#dagSection option:selected').text()
        , "InfoOnlyDAG": $("#infoOnlyDAG option:selected").text()
        , "CautionDAG": $("#cautionDAG option:selected").text()
        , "WarningDAG": $("#warningDAG option:selected").text()
        , "AlertDAG": $("#alertDAG option:selected").text()
        , "InfoOnlyPCAL": $("#pcalGreyInfo").text()
        , "CautionPCAL": $("#pcalGreyCaution").text()
        , "WarningPCAL": $("#pcalGreyWarning").text()
        , "AlertPCAL": $("#pcalGreyAlert").text()
        , "WhyChangeDAG": ($("#whyChangeDAG").val() == "") ? null : $('#whyChangeDAG').val()
        , "QueryNotesDAG": ($("#queryNotesDAG").val() == "") ? null : $('#queryNotesDAG').val()
        , "PerWhomDAG": ($("#perWhomDAG").val() == "") ? null : $('#perWhomDAG').val()
        , "Notes": ($("#notesPCAL").val() == "") ? null : $('#notesPCAL').val()
        , "CrewContactRequired": $("#ccCheck").prop("checked")
        , "AnimationRequired": $("#animationRequired").prop("checked")
        , "GoogleEarthRequired": $("#googleEarthRequired").prop("checked")
        , "WhyChangePCAL": ($("#whyChangePCAL").val() == "") ? null : $('#whyChangePCAL').val()
        , "PerWhomPCAL": ($("#perWhomPCAL").val() == "") ? null : $('#perWhomPCAL').val()
    }//end item

    var errorMessage = "Error inserting record number: " + count;
    insertIntoList(url, item, "Item added/saved", errorMessage);
    /*window.location.reload();
    $("#tBody1").append("Saved to Human Factors by Flight List");*/
}

function addToListFromPCALModal() {
    var count = 1;
    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/DAGandPCALChangeTracking';
    var listItemType = 'Microsoft.SharePoint.DataService.DAGandPCALChangeTrackingItem';

    var item = {
        "__metadata": { "type": listItemType }
        , "Fleet": ($("#fleetPCAL").val() == "") ? null : $('#fleetPCAL').val()
        , "EventKey": ($("#pcalModalEvent").val() == "") ? null : $('#pcalModalEvent').val()
        , "InDAG": $("#inDAG3 option:selected").text()
        , "InPCAL": $("#inPCAL3 option:selected").text()
        , "InfoOnlyPCAL": $("#infoOnlyPCAL option:selected").text()
        , "CautionPCAL": $("#cautionPCAL option:selected").text()
        , "WarningPCAL": $("#warningPCAL option:selected").text()
        , "AlertPCAL": $("#alertPCAL option:selected").text()
        , "InfoOnlyDAG": $("#dagGreyInfo").text()
        , "CautionDAG": $("#dagGreyCaution").text()
        , "WarningDAG": $("#dagGreyWarning").text()
        , "AlertDAG": $("#dagGreyAlert").text()
        , "WhyChangePCAL": ($("#whyChangePCAL").val() == "") ? null : $('#whyChangePCAL').val()
        , "PerWhomPCAL": ($("#perWhomPCAL").val() == "") ? null : $('#perWhomPCAL').val()
        , "Notes": ($("#notesPCAL").val() == "") ? null : $('#notesPCAL').val()
        , "CrewContactRequired": $("#ccCheck").prop("checked")
        , "AnimationRequired": $("#animationRequired").prop("checked")
        , "GoogleEarthRequired": $("#googleEarthRequired").prop("checked")
        , "QueryNotesDAG": ($("#queryNotesDAG").val() == "") ? null : $('#queryNotesDAG').val()
    }//end item

    var errorMessage = "Error inserting record number: " + count;
    insertIntoList(url, item, "Item added/saved", errorMessage);
    /*window.location.reload();
    $("#tBody1").append("Saved to Human Factors by Flight List");*/
}

function insertIntoList(url, item, successMsg, failMsg, source) {

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json;odata=verbose",
        data: JSON.stringify(item),
        beforeSend: function () {
            //toggleCursor();
            $(".MessageLabel").text("");
        },
        headers: {
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function (data) {
            alert('success');
            if (successMsg != '') {
                console.log(successMsg);
                $("#attachmentStatus").html("Request sent! Please refresh page to see details below.").css({ "color": "green", "font-weight": "bold", "font-size": "18px" });
                each();
            };
            //window.location.reload();
        },
        error: function (data) {
            alert('fail');
            if (failMsg != '') {
                console.log(failMsg);
                console.log(data);
                //toggleCursor();
                alert(failMsg);
            }
        }

    });
}

function fleetReporting(fleet) {

    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/DAGandPCALChangeTracking?$filter=(%20substringof(%27' + fleet + '%27,Fleet))&groupBy=Event&$orderby=Id%20desc';

    getListItems(url, function (data) {
        var numRecords = data.d.results.length;
        $("#table").children().remove();

        if (numRecords > 0) {
            $.each(data, function (i, item) {
                const arrayDefine = [];
                for (var i = 0; i < numRecords; i++) {
                    var arrayFilter = arrayDefine.push(data.d.results[i].EventKey);
                    var dup = arrayDefine.filter(a => a === data.d.results[i].EventKey);
                    if (dup.length <= 1) {
                        $("#table").append('<tr>');
                        $("#table").append('<td><b>' + data.d.results[i].EventKey + '</b></td>');
                        $("#table").append('<td>' + data.d.results[i].InDAG + '</td>');
                        $("#table").append('<td>' + data.d.results[i].InfoOnlyDAG + '</td>');
                        $("#table").append('<td>' + data.d.results[i].CautionDAG + '</td>');
                        $("#table").append('<td>' + data.d.results[i].WarningDAG + '</td>');
                        $("#table").append('<td>' + data.d.results[i].AlertDAG + '</td>');
                        $("#table").append('<td>' + data.d.results[i].InPCAL + '</td>');
                        $("#table").append('<td>' + data.d.results[i].InfoOnlyPCAL + '</td>');
                        $("#table").append('<td>' + data.d.results[i].CautionPCAL + '</td>');
                        $("#table").append('<td>' + data.d.results[i].WarningPCAL + '</td>');
                        $("#table").append('<td>' + data.d.results[i].AlertPCAL + '</td>');
                        $("#table").append('</tr>');
                    }
                }
            })

        }
    })
};

function eventsReporting(event) {

    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/AirbusBoeingEMSEventsArchive?$filter=EventKey%20eq%20%27' + event + '%27&orderBy=Event';

    getListItems(url, function (data) {
        var numRecords = data.d.results.length;
        $("#tableEvent").children().remove();

        if (numRecords > 0) {
            $.each(data, function (i, item) {
                const arrayDefine = [];
                for (var i = 0; i < numRecords; i++) {
                    var arrayFilter = arrayDefine.push(data.d.results[i].EventKey);
                    var dup = arrayDefine.filter(a => a === data.d.results[i].EventKey);
                    if (dup.length <= 1) {
                        $("#table").append('<tr>');
                        $("#table").append('<td><b>' + data.d.results[i].EventKey + '</b></td>');
                        $("#table").append('<td>' + data.d.results[i].InDAG + '</td>');
                        $("#table").append('<td>' + data.d.results[i].InfoOnlyDAG + '</td>');
                        $("#table").append('<td>' + data.d.results[i].CautionDAG + '</td>');
                        $("#table").append('<td>' + data.d.results[i].WarningDAG + '</td>');
                        $("#table").append('<td>' + data.d.results[i].AlertDAG + '</td>');
                        $("#table").append('<td>' + data.d.results[i].InPCAL + '</td>');
                        $("#table").append('<td>' + data.d.results[i].InfoOnlyPCAL + '</td>');
                        $("#table").append('<td>' + data.d.results[i].CautionPCAL + '</td>');
                        $("#table").append('<td>' + data.d.results[i].WarningPCAL + '</td>');
                        $("#table").append('<td>' + data.d.results[i].AlertPCAL + '</td>');
                        $("#table").append('</tr>');
                    }
                }
            })

        }
    })
};