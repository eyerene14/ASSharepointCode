$(document).ready(function () {
    getCurrentUser();
    $("#pmCommunicationUnfiguredHide").hide();
    $("#pmNotStableHide").hide();
    $("#pfAcknowledgeGoAroundHide").hide();
    $("#insertStatus").hide();

    getCUASurveyResults();
    //getEventId($("#eventIDRedirect").val());
});


$("#fleet").on("change", function () {
    getFleetType($("#fleet").val());
});

$("#fullyConfigured").on("click", function () {
    if (document.querySelectorAll("input[id=fullyConfigured]:checked")[0].value == 'Yes') {
        $("#pmCommunicationUnfiguredHide").show();
    }
    else {
        $("#pmCommunicationUnfiguredHide").hide();
    }
});

$("#pm500ftHAT").on("click", function () {
    if (document.querySelectorAll("input[id=pm500ftHAT]:checked")[0].value == 'Yes') {
        $("#pmNotStableHide").show();
    }
    else {
        $("#pmNotStableHide").hide();
    }
});

$("#goAround500").on("click", function () {
    if (document.querySelectorAll("input[id=goAround500]:checked")[0].value == 'Yes') {
        $("#pfAcknowledgeGoAroundHide").show();
    }
    else {
        $("#pfAcknowledgeGoAroundHide").hide();
    }
});

$("#submitForm").on("click", function () {
    if ($("#fleet").val() == "") {

    }
    else if ($("#fleetModel").val() == "") { }
    else if ($("#approachType").val() == "") { }
    else if ($("#origin").val() == "") { }
    else if ($("#destination").val() == "") { }
    else {
        addToSharepointList();
    }
});

function getCurrentUser() {

    var userid = _spPageContextInfo.userId;

    var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/getuserbyid(" + userid + ")";

    var requestHeaders = { "accept": "application/json;odata=verbose" };

    $.ajax({
        url: requestUri,
        contentType: "application/json;odata=verbose",
        headers: requestHeaders,
        success: onSuccess,
        error: onError
    });


}

function onSuccess(data, request) {
    var loginName = data.d.Title;
    var email = data.d.Email;
    var count = 0;
    //alert("Consent from co-pilot must be received before we can fullfill requests");

    // to set the "hello username" into the page
    $("#gatekeepersName").val(loginName);
    $("#gatekeepersEmail").val(email);
    document.getElementById("gatekeepersName").innerHTML = loginName;
    document.getElementById("gatekeepersEmail").innerHTML = email;
}

function onError(error) {
    alert(error);
}

function getFleetType(fleet) {

    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/FLICS_DeparturesByFleetType?$filter=(%20substringof(%27' + fleet + '%27,Aircraft_manufacturer))&groupBy=Aircraft_type&$orderby=Aircraft_type%20asc';

    getListItems(url, function (data) {
        var numRecords = data.d.results.length;

        if (numRecords > 0) {
            $.each(data, function (i, item) {
                $("#fleetModel").children().remove().end();
                $("#fleetModelRedirect").children().remove().end();
                $("#fleetModel").append('<option value="">Select</option>');
                $("#origin").children().remove().end();
                $("#originRedirect").children().remove().end();
                $("#origin").append('<option value="">Select</option>');
                $("#destination").children().remove().end();
                $("#destinationRedirect").children().remove().end();
                $("#destination").append('<option value="">Select</option>');

                const arrayDefine = [];
                for (var i = 0; i < numRecords; i++) {
                    if (!(arrayDefine.includes(data.d.results[i].Aircraft_type))) {
                        var countAircraftTypes = arrayDefine.push(data.d.results[i].Aircraft_type);
                    }
                }

                arrayDefine.sort();
                arrayDefine.forEach(element => $("#fleetModel").append('<option value="' + element + '">' + element + '</option>'));

                const arrayDefine2 = [];
                for (var j = 0; j < numRecords; j++) {
                    if (!(arrayDefine2.includes(data.d.results[j].Airport_code))) {
                        var countAirportCodes = arrayDefine2.push(data.d.results[j].Airport_code);
                    }
                }

                arrayDefine2.sort();
                arrayDefine2.forEach(oAirport => $("#origin").append('<option value="' + oAirport + '">' + oAirport + '</option>'));
                arrayDefine2.every(dAirport => $("#destination").append('<option value="' + dAirport + '">' + dAirport + '</option>'));
            })
        }
        else {
            $("#fleetModel").children().remove().end();
            $("#fleetModel").append('<option value="">Select</option>');
            $("#origin").children().remove().end();
            $("#origin").append('<option value="">Select</option>');
            $("#destination").children().remove().end();
            $("#destination").append('<option value="">Select</option>');
        }
    })
};

/*
function getEventId() {

    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/CUASurveyTest?$filter=(%20substringof(%27' + eventId + '%27,EventID))&groupBy=EventID&$orderby=EventID%20asc';

    getListItems(url, function (data) {
        var numRecords = data.d.results.length;

        if (numRecords > 0) {
            $.each(data, function (i, item) {

                for (var i = 0; i < numRecords; i++) {
                }
            })
        };
    })
};
*/

function getCUASurveyResults() {

    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/CUASurvey?$orderby=Id%20desc';

    getListItems(url, function (data) {
        var numRecords = data.d.results.length;

        if (numRecords > 0) {
            $.each(data, function (i, item) {

                for (var i = 0; i < 1; i++) {
                    $("#key_id").val(data.d.results[i].Id);
                    document.getElementById("gatekeepersNameRedirect").innerHTML = data.d.results[i].GatekeepersName;
                    document.getElementById('fleetRedirect').innerHTML = data.d.results[i].Fleet;
                    document.getElementById('fleetModelRedirect').innerHTML = data.d.results[i].FleetModel;
                    document.getElementById('approachTypeRedirect').innerHTML = data.d.results[i].ApproachType;
                    document.getElementById('contactDateRedirect').innerHTML = data.d.results[i].ContactDate;
                    document.getElementById('eventIDRedirect').innerHTML = data.d.results[i].EventID;
                    document.getElementById('conditionsRedirect').innerHTML = data.d.results[i].Conditions;
                    document.getElementById('originRedirect').innerHTML = data.d.results[i].Origin;
                    document.getElementById('destinationRedirect').innerHTML = data.d.results[i].Destination;
                    document.getElementById('landingRunwayRedirect').innerHTML = data.d.results[i].LandingRunway;
                    if (data.d.results[i].Freighter == 'true') {
                        $("#freighterRedirect").prop("checked", data.d.results[i].Freighter);
                    }
                    if (data.d.results[i].TcpBriefA == 'true') {
                        $("#tcpBriefARedirect").prop("checked", data.d.results[i].TcpBriefA);
                    }
                    if (data.d.results[i].TcpBriefB == 'true') {
                        $("#tcpBriefBRedirect").prop("checked", data.d.results[i].TcpBriefB);
                    }
                    if (data.d.results[i].TcpBriefC == 'true') {
                        $("#tcpBriefCRedirect").prop("checked", data.d.results[i].TcpBriefC);
                    }
                    if (data.d.results[i].TcpBriefD == 'true') {
                        $("#tcpBriefDRedirect").prop("checked", data.d.results[i].TcpBriefD);
                    }
                    document.getElementById('airspaceRedirect').innerHTML = data.d.results[i].Airspace;
                    document.getElementById('locationRedirect').innerHTML = data.d.results[i].Location;
                    document.getElementById('pilotFlyingRedirect').innerHTML = data.d.results[i].Pilotflying;
                    document.getElementById('pilotMonitoringRedirect').innerHTML = data.d.results[i].Pilotmonitoring;
                    document.getElementById('caBaseRedirect').innerHTML = data.d.results[i].Cabase;
                    document.getElementById('foBaseRedirect').innerHTML = data.d.results[i].Fobase;
                    document.getElementById('caLOExperienceRedirect').innerHTML = data.d.results[i].Caloexperience;
                    document.getElementById('foLOExperienceRedirect').innerHTML = data.d.results[i].Foloexperience;
                    document.getElementById('caROExperienceRedirect').innerHTML = data.d.results[i].Caroexperience;
                    document.getElementById('caROLandingsRedirect').innerHTML = data.d.results[i].Carolandings;
                    document.getElementById('foROExperienceRedirect').innerHTML = data.d.results[i].Foroexperience;
                    document.getElementById('foROLandingsRedirect').innerHTML = data.d.results[i].Forolandings;
                    document.getElementById('pfGatesUnderstandingRedirect').innerHTML = data.d.results[i].Pfgatesunderstanding;
                    document.getElementById('pmGatesUnderstandingRedirect').innerHTML = data.d.results[i].Pmgatesunderstanding;
                    document.getElementById('errorChainRedirect').innerHTML = data.d.results[i].Errorchain;
                    document.getElementById('unmitigatedThreatsLabelRedirect').innerHTML = data.d.results[i].Unmitigatedthreats;
                    //data.d.results[i].Unmitigatedthreats.map(option => $("unmitigatedThreatsLabelRedirect").val(option));
                    document.getElementById('fullyConfiguredRedirect').innerHTML = data.d.results[i].Fullyconfigured;
                    document.getElementById('pmCommunicationRedirect').innerHTML = data.d.results[i].Pmcommunicationunfigured;
                    document.getElementById('pfAcknowledgeRedirect').innerHTML = data.d.results[i].Pfacknowledge;
                    document.getElementById('pm500ftHATRedirect').innerHTML = data.d.results[i].Pm500Fthat;
                    document.getElementById('pmNotStableRedirect').innerHTML = data.d.results[i].Pmnotstable;
                    document.getElementById('goAround500Redirect').innerHTML = data.d.results[i].Goaround500;
                    document.getElementById('pfAcknowledgeGoAroundRedirect').innerHTML = data.d.results[i].Pfacknowledgegoaround;
                    document.getElementById('whyContinueRedirect').innerHTML = data.d.results[i].Whycontinue;
                    document.getElementById('additionalFactorsRedirect').innerHTML = data.d.results[i].Additionalfactors;
                    document.getElementById('ccSummaryRedirect').innerHTML = data.d.results[i].Ccsummary;
                }
            })
        }
        else {
        }
    })
};

function getCUASurveyResultsTest() {

    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/CUASurveyTest?$orderby=Id%20desc';

    getListItems(url, function (data) {
        var numRecords = data.d.results.length;

        if (numRecords > 0) {
            $.each(data, function (i, item) {

                for (var i = 0; i < 1; i++) {
                    $("#key_id").val(data.d.results[i].Id);
                    document.getElementById("gatekeepersNameRedirect").innerHTML = data.d.results[i].GatekeepersName;
                    document.getElementById('fleetRedirect').value = data.d.results[i].Fleet;
                    $("#fleetModelRedirect").children().remove().end();
                    $("#fleetModelRedirect").append('<option value="' + data.d.results[i].FleetModel + '">' + data.d.results[i].FleetModel + '</option>')
                    document.getElementById('fleetModelRedirect').value = data.d.results[i].FleetModel;
                    document.getElementById('approachTypeRedirect').value = data.d.results[i].ApproachType;
                    document.getElementById('contactDate').value = data.d.results[i].ContactDate;
                    document.getElementById('eventIDRedirect').value = data.d.results[i].EventID;
                    document.getElementById('conditionsRedirect').value = data.d.results[i].Conditions;
                    $("#originRedirect").children().remove().end();
                    $("#originRedirect").append('<option value="' + data.d.results[i].Origin + '">' + data.d.results[i].Origin + '</option>')
                    document.getElementById('originRedirect').value = data.d.results[i].Origin;
                    $("#destinationRedirect").children().remove().end();
                    $("#destinationRedirect").append('<option value="' + data.d.results[i].Destination + '">' + data.d.results[i].Destination + '</option>')
                    document.getElementById('destinationRedirect').value = data.d.results[i].Destination;
                    document.getElementById('landingRunwayRedirect').value = data.d.results[i].LandingRunway;
                    $("#freighterRedirect").prop("checked", data.d.results[i].Freighter);
                    $("#tcpBriefARedirect").prop("checked", data.d.results[i].TcpBriefA);
                    $("#tcpBriefBRedirect").prop("checked", data.d.results[i].TcpBriefB);
                    $("#tcpBriefCRedirect").prop("checked", data.d.results[i].TcpBriefC);
                    $("#tcpBriefDRedirect").prop("checked", data.d.results[i].TcpBriefD);
                    document.getElementById('airspaceRedirect').innerHTML = data.d.results[i].Airspace;
                    document.getElementById('locationRedirect').innerHTML = data.d.results[i].Location;
                    document.getElementById('caBaseRedirect').value = data.d.results[i].Cabase;
                    document.getElementById('foBaseRedirect').value = data.d.results[i].Fobase;
                    document.getElementById('caLOExperienceRedirect').value = data.d.results[i].Caloexperience;
                    document.getElementById('foLOExperienceRedirect').value = data.d.results[i].Foloexperience;
                    document.getElementById('caROExperienceRedirect').value = data.d.results[i].Caroexperience;
                    document.getElementById('caROLandingsRedirect').value = data.d.results[i].Carolandings;
                    document.getElementById('foROExperienceRedirect').value = data.d.results[i].Foroexperience;
                    document.getElementById('foROLandingsRedirect').value = data.d.results[i].Forolandings;
                    document.getElementById('pilotFlyingRedirect').innerHTML = data.d.results[i].Pilotflying;
                    document.getElementById('pilotMonitoringRedirect').innerHTML = data.d.results[i].Pilotmonitoring;
                    document.getElementById('pfGatesUnderstandingRedirect').value = data.d.results[i].Pfgatesunderstanding;
                    document.getElementById('pmGatesUnderstandingRedirect').value = data.d.results[i].Pmgatesunderstanding;
                    document.getElementById('errorChainRedirect').value = data.d.results[i].Errorchain;
                    data.d.results[i].Unmitigatedthreats.map(option => $("unmitigatedThreatsLabelRedirect").val(option));
                    data.d.results[i].Unmitigatedthreats.map(option => $("#unmitigatedThreatsRedirect").val(option));
                    document.getElementById('fullyConfiguredRedirect').innerHTML = data.d.results[i].Fullyconfigured;
                    document.getElementById('pmCommunicationRedirect').innerHTML = data.d.results[i].Pmcommunicationunfigured;
                    document.getElementById('pfAcknowledgeRedirect').innerHTML = data.d.results[i].Pfacknowledge;
                    document.getElementById('pm500ftHATRedirect').innerHTML = data.d.results[i].Pm500Fthat;
                    document.getElementById('pmNotStableRedirect').innerHTML = data.d.results[i].Pmnotstable;
                    document.getElementById('goAround500Redirect').innerHTML = data.d.results[i].Goaround500;
                    document.getElementById('pfAcknowledgeGoAroundRedirect').innerHTML = data.d.results[i].Pfacknowledgegoaround;
                    document.getElementById('ccSummaryRedirect').value = data.d.results[i].Ccsummary;
                    data.d.results[i].Whycontinue.map(option => $("#whycontinue").val(option));
                    data.d.results[i].Additionalfactors.map(option => $("#additionalfactors").val(option));
                }
            })
        }
        else {
        }
    })
};

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

function addToSharepointListTest() {
    var count = 1;
    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/CUASurveyTest';
    var listItemType = 'Microsoft.SharePoint.DataService.CUASurveyTestItem';
    var ut = ""; $('#unmitigatedThreats option:selected').toArray().map(item => ut += item.text + ", ")
    var wc = ""; $('#whyContinue option:selected').toArray().map(item => wc += item.text + ", ")
    var af = ""; $('#additionalFactors option:selected').toArray().map(item => af += item.text + ", ")

    var item = {
        "__metadata": { "type": listItemType }
        , "GatekeepersName": ($("#gatekeepersName").val() == "") ? null : $('#gatekeepersName').val()
        , "EventID": ($("#eventID").val() == "") ? null : $('#eventID').val()
        , "ContactDate": ($("#contactDate").val() == "") ? null : $('#contactDate').val()
        , "Origin": ($("#origin").val() == "") ? null : $('#origin option:selected').text()
        , "Destination": ($("#destination").val() == "") ? null : $('#destination option:selected').text()
        , "LandingRunway": ($("#landingRunway").val() == "") ? null : $('#landingRunway').val()
        , "Freighter": $("#freighter").prop("checked")
        , "Fleet": ($("#fleet").val() == "") ? null : $('#fleet').val()
        , "FleetModel": ($("#fleetModel").val() == "") ? null : $('#fleetModel option:selected').text()
        , "ApproachType": ($("#approachType").val() == "") ? null : $('#approachType').val()
        , "TcpBriefA": $("#tcpBriefA").prop("checked")
        , "TcpBriefB": $("#tcpBriefB").prop("checked")
        , "TcpBriefC": $("#tcpBriefC").prop("checked")
        , "TcpBriefD": $("#tcpBriefD").prop("checked")
        , "Airspace": (document.querySelectorAll("input[id=airspace]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=airspace]:checked")[0].value
        , "Location": (document.querySelectorAll("input[id=location]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=location]:checked")[0].value
        , "Conditions": ($("#conditions").val() == "Conditions") ? null : $('#conditions').val()
        , "Cabase": ($("#caBase").val() == "C.A.") ? null : $('#caBase').val()
        , "Fobase": ($("#foBase").val() == "F.O.") ? null : $('#foBase').val()
        , "Caloexperience": ($("#caLOExperience").val() == "C.A.") ? null : $('#caLOExperience').val()
        , "Foloexperience": ($("#foLOExperience").val() == "F.O.") ? null : $('#foLOExperience').val()
        , "Caroexperience": ($("#caROExperience").val() == "C.A. (hrs)") ? null : $('#caROExperience').val()
        , "Carolandings": ($("#caROLandings").val() == "C.A.") ? null : $('#caROLandings').val()
        , "Foroexperience": ($("#foROExperience").val() == "F.O. (hrs)") ? null : $('#foROExperience').val()
        , "Forolandings": ($("#foROLandings").val() == "F.O.") ? null : $('#foROLandings').val()
        , "Pilotflying": (document.querySelectorAll("input[id=pilotFlying]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=pilotFlying]:checked")[0].value
        , "Pilotmonitoring": (document.querySelectorAll("input[id=pilotMonitoring]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=pilotMonitoring]:checked")[0].value
        , "Pfgatesunderstanding": ($("#pfGatesUnderstanding").val() == "") ? null : $('#pfGatesUnderstanding').val()
        , "Pmgatesunderstanding": ($("#pmGatesUnderstanding").val() == "") ? null : $('#pmGatesUnderstanding').val()
        , "Errorchain": ($("#errorChain").val() == "") ? null : $('#errorChain').val()
        , "Unmitigatedthreats": ut.substring(0, ut.length - 2)
        , "Fullyconfigured": (document.querySelectorAll("input[id=fullyConfigured]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=fullyConfigured]:checked")[0].value
        , "Pmcommunicationunfigured": (document.querySelectorAll("input[id=pmCommunicationUnfigured]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=pmCommunicationUnfigured]:checked")[0].value
        , "Pfacknowledge": (document.querySelectorAll("input[id=pfAcknowledge]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=pfAcknowledge]:checked")[0].value
        , "Pm500Fthat": (document.querySelectorAll("input[id=pm500ftHAT]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=pm500ftHAT]:checked")[0].value
        , "Pmnotstable": (document.querySelectorAll("input[id=pmNotStable]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=pmNotStable]:checked")[0].value
        , "Goaround500": (document.querySelectorAll("input[id=goAround500]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=goAround500]:checked")[0].value
        , "Pfacknowledgegoaround": (document.querySelectorAll("input[id=pfAcknowledgeGoAround]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=pfAcknowledgeGoAround]:checked")[0].value
        , "Whycontinue": wc.substring(0, wc.length - 2)
        , "Additionalfactors": af.substring(0, af.length - 2)
        , "Ccsummary": ($("#ccSummary").val() == "") ? null : $('#ccSummary').val()
    }//end item

    var errorMessage = "Error inserting record number: " + count;
    insertIntoListTest(url, item, "Item added/saved", errorMessage);
    /*window.location.reload();
    $("#tBody1").append("Saved to Human Factors by Flight List");*/
}

function insertIntoListTest(url, item, successMsg, failMsg, source) {
    console.log(JSON.stringify(item));
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
            //alert('success');
            if (successMsg != '') {
                console.log(successMsg);
                console.log(JSON.stringify(item));
                alert(JSON.stringify(item));
                $("#insertStatus").show();
                $("#insertStatus").html("Request sent!").css({ "color": "green", "font-weight": "bold", "font-size": "18px" });
                location.href = _spPageContextInfo.webAbsoluteUrl + '/SitePages/CUASurveyRedirect.aspx';
            };
            //window.location.reload();
        },
        error: function (data) {
            alert('fail');
            if (failMsg != '') {
                alert(failMsg);
                console.log(failMsg);
                console.log(JSON.stringify(item));
                alert(JSON.stringify(item));
                //toggleCursor();
                $("#insertStatus").show();
                $("#insertStatus").html("Request NOT entered!").css({ "color": "red", "font-weight": "bold", "font-size": "18px" });
            }
        }

    });
}


function addToSharepointList() {
    var count = 1;
    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/CUASurvey';
    var listItemType = 'Microsoft.SharePoint.DataService.CUASurveyItem';

    var ut = ""; $('#unmitigatedThreats option:selected').toArray().map(item => ut += item.text + ", ")
    var wc = ""; $('#whyContinue option:selected').toArray().map(item => wc += item.text + ", ")
    var af = ""; $('#additionalFactors option:selected').toArray().map(item => af += item.text + ", ")

    var item = {
        "__metadata": { "type": listItemType }
        , "GatekeepersName": ($("#gatekeepersName").val() == "") ? null : $('#gatekeepersName').val()
        , "EventID": ($("#eventID").val() == "") ? null : $('#eventID').val()
        , "ContactDate": ($("#contactDate").val() == "") ? null : $('#contactDate').val()
        , "Origin": ($("#origin").val() == "") ? null : $('#origin option:selected').text()
        , "Destination": ($("#destination").val() == "") ? null : $('#destination option:selected').text()
        , "LandingRunway": ($("#landingRunway").val() == "") ? null : $('#landingRunway').val()
        , "Freighter": $("#freighter").prop("checked")
        , "Fleet": ($("#fleet").val() == "") ? null : $('#fleet').val()
        , "FleetModel": ($("#fleetModel").val() == "") ? null : $('#fleetModel option:selected').text()
        , "ApproachType": ($("#approachType").val() == "") ? null : $('#approachType').val()
        , "TcpBriefA": $("#tcpBriefA").prop("checked")
        , "TcpBriefB": $("#tcpBriefB").prop("checked")
        , "TcpBriefC": $("#tcpBriefC").prop("checked")
        , "TcpBriefD": $("#tcpBriefD").prop("checked")
        , "Airspace": (document.querySelectorAll("input[id=airspace]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=airspace]:checked")[0].value
        , "Location": (document.querySelectorAll("input[id=location]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=location]:checked")[0].value
        , "Conditions": ($("#conditions").val() == "Conditions") ? null : $('#conditions').val()
        , "Cabase": ($("#caBase").val() == "C.A.") ? null : $('#caBase').val()
        , "Fobase": ($("#foBase").val() == "F.O.") ? null : $('#foBase').val()
        , "Caloexperience": ($("#caLOExperience").val() == "C.A.") ? null : $('#caLOExperience').val()
        , "Foloexperience": ($("#foLOExperience").val() == "F.O.") ? null : $('#foLOExperience').val()
        , "Caroexperience": ($("#caROExperience").val() == "C.A. (hrs)") ? null : $('#caROExperience').val()
        , "Carolandings": ($("#caROLandings").val() == "C.A.") ? null : $('#caROLandings').val()
        , "Foroexperience": ($("#foROExperience").val() == "F.O. (hrs)") ? null : $('#foROExperience').val()
        , "Forolandings": ($("#foROLandings").val() == "F.O.") ? null : $('#foROLandings').val()
        , "Pilotflying": (document.querySelectorAll("input[id=pilotFlying]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=pilotFlying]:checked")[0].value
        , "Pilotmonitoring": (document.querySelectorAll("input[id=pilotMonitoring]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=pilotMonitoring]:checked")[0].value
        , "Pfgatesunderstanding": ($("#pfGatesUnderstanding").val() == "") ? null : $('#pfGatesUnderstanding').val()
        , "Pmgatesunderstanding": ($("#pmGatesUnderstanding").val() == "") ? null : $('#pmGatesUnderstanding').val()
        , "Errorchain": ($("#errorChain").val() == "") ? null : $('#errorChain').val()
        , "Unmitigatedthreats": ut.substring(0, ut.length - 2)
        , "Fullyconfigured": (document.querySelectorAll("input[id=fullyConfigured]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=fullyConfigured]:checked")[0].value
        , "Pmcommunicationunfigured": (document.querySelectorAll("input[id=pmCommunicationUnfigured]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=pmCommunicationUnfigured]:checked")[0].value
        , "Pfacknowledge": (document.querySelectorAll("input[id=pfAcknowledge]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=pfAcknowledge]:checked")[0].value
        , "Pm500Fthat": (document.querySelectorAll("input[id=pm500ftHAT]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=pm500ftHAT]:checked")[0].value
        , "Pmnotstable": (document.querySelectorAll("input[id=pmNotStable]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=pmNotStable]:checked")[0].value
        , "Goaround500": (document.querySelectorAll("input[id=goAround500]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=goAround500]:checked")[0].value
        , "Pfacknowledgegoaround": (document.querySelectorAll("input[id=pfAcknowledgeGoAround]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=pfAcknowledgeGoAround]:checked")[0].value
        , "Whycontinue": wc.substring(0, wc.length - 2)
        , "Additionalfactors": af.substring(0, af.length - 2)
        , "Ccsummary": ($("#ccSummary").val() == "") ? null : $('#ccSummary').val()
    }//end item

    var errorMessage = "Error inserting record number: " + count;
    insertIntoList(url, item, "Item added/saved", errorMessage);
    /*window.location.reload();
    $("#tBody1").append("Saved to Human Factors by Flight List");*/
}

function insertIntoList(url, item, successMsg, failMsg, source) {
    console.log(JSON.stringify(item));
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
            //alert('success');
            if (successMsg != '') {
                $("#insertStatus").show();
                $("#insertStatus").html("Request sent!").css({ "color": "green", "font-weight": "bold", "font-size": "18px" });
                location.href = _spPageContextInfo.webAbsoluteUrl + '/SitePages/CUASurveyRedirect.aspx';
            };
            console.log(successMsg);
            console.log(JSON.stringify(item));
        },
        error: function (data) {
            if (navigator.vendor == 'Apple Computer, Inc.') {
                location.href = _spPageContextInfo.webAbsoluteUrl + '/SitePages/CUASurveyRedirect.aspx';
                $("#safariMessage").show();
            }
            else {
                location.href = _spPageContextInfo.webAbsoluteUrl + '/SitePages/FormErrorRedirect.aspx';
            }
            if (failMsg != '') {
                alert(failMsg);
                console.log(failMsg);
                console.log(JSON.stringify(item));
                //toggleCursor();
                $("#insertStatus").show();
                $("#insertStatus").html("Request NOT entered!").css({ "color": "red", "font-weight": "bold", "font-size": "18px" });
            }
        }

    });
}