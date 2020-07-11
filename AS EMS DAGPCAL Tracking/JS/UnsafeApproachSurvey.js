$(document).ready(function () {
    getCurrentUser();
    $("#pmCommunicationUnfiguredHide").hide();
    $("#pmNotStableHide").hide();
    $("#pfAcknowledgeGoAroundHide").hide();
});

$("#fleet").on("change", function () {
    getFleetType($("#fleet").val());
});

$("#fullyConfigured").on("click", function () {
    if(document.querySelectorAll("input[id=fullyConfigured]:checked")[0].value == 'Yes'){
        $("#pmCommunicationUnfiguredHide").show();
    }
    else{
        $("#pmCommunicationUnfiguredHide").hide();
    }
});

$("#pm500ftHAT").on("click", function () {
    if(document.querySelectorAll("input[id=pm500ftHAT]:checked")[0].value == 'Yes'){
        $("#pmNotStableHide").show();
    }
    else{
        $("#pmNotStableHide").hide();
    }
});

$("#goAround500").on("click", function () {
    if(document.querySelectorAll("input[id=goAround500]:checked")[0].value == 'Yes'){
        $("#pfAcknowledgeGoAroundHide").show();
    }
    else{
        $("#pfAcknowledgeGoAroundHide").hide();
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
                $("#fleetModel").append('<option value="">Select</option>');
                $("#origin").children().remove().end();
                $("#origin").append('<option value="">Select</option>');
                $("#destination").children().remove().end();
                $("#destination").append('<option value="">Select</option>');

                const arrayDefine = [];
                for (var i = 0; i < numRecords; i++) {
                    if(!(arrayDefine.includes(data.d.results[i].Aircraft_type)))
                    {
                    var countAircraftTypes = arrayDefine.push(data.d.results[i].Aircraft_type);
                    }
                }

                arrayDefine.sort();
                arrayDefine.forEach(element =>  $("#fleetModel").append('<option value="' + element + '">' + element + '</option>'));

                const arrayDefine2 = [];
                for (var j = 0; j < numRecords; j++) {
                    if(!(arrayDefine2.includes(data.d.results[j].Airport_code)))
                    {
                    var countAirportCodes = arrayDefine2.push(data.d.results[j].Airport_code);
                    }
                }

                arrayDefine2.sort();
                arrayDefine2.forEach(oAirport =>  $("#origin").append('<option value="' + oAirport + '">' + oAirport + '</option>'));
                arrayDefine2.every(dAirport => $("#destination").append('<option value="' + dAirport + '">' + dAirport + '</option>'));
            })
        }
        else {
            alert("Select a fleet");
            $("#fleetModel").children().remove().end();
            $("#fleetModel").append('<option value="">Select</option>');
            $("#origin").children().remove().end();
            $("#origin").append('<option value="">Select</option>');
            $("#destination").children().remove().end();
            $("#destination").append('<option value="">Select</option>');
            resetChangeForm();
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

function addToSharepointList() {
    var count = 1;
    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/CUASurvey';
    var listItemType = 'Microsoft.SharePoint.DataService.CUASurveyItem';

    var item = {
        "__metadata": { "type": listItemType }
        , "GatekeepersName": ($("#gatekeepersName").val() == "") ? null : $('#gatekeepersName').val()
        , "EventID": ($("#eventID").val() == "") ? null : $('#eventID').val()
        , "ContactDate": ($("#contactDate").val() == "") ? null : $('#contactDate').val()
        , "Origin": ($("#origin").val() == "") ? null : $('#origin option:selected').text()
        , "Destination": ($("#destination").val() == "") ? null : $('#destination option:selected').text()
        , "LandingRunway": ($("#landingRunway").val() == "") ? null : $('#landingRunway').val()
        , "Fleet": ($("#fleet").val() == "") ? null : $('#fleet').val()
        , "FleetModel": ($("#fleetModel").val() == "") ? null : $('#fleetModel option:selected').text()
        , "ApproachType": ($("#approachType").val() == "") ? null : $('#approachType').val()
        , "TcpBriefA": $("#tcpBriefA").prop("checked")
        , "TcpBriefB": $("#tcpBriefB").prop("checked")
        , "TcpBriefC": $("#tcpBriefC").prop("checked")
        , "Airspace": (document.querySelectorAll("input[id=airspace]:checked")[0].value == "") ? null : document.querySelectorAll("input[id=airspace]:checked")[0].value
        , "Location": (document.querySelectorAll("input[id=location]:checked")[0].value == "") ? null : document.querySelectorAll("input[id=location]:checked")[0].value
        , "Conditions": ($("#conditions").val() == "") ? null : $('#conditions').val()
        , "Cabase": ($("#caBase").val() == "") ? null : $('#caBase').val()
        , "Fobase": ($("#foBase").val() == "") ? null : $('#foBase').val()
        , "Caloexperience": ($("#caLOExperience").val() == "") ? null : $('#caLOExperience').val()
        , "Foloexperience": ($("#foLOExperience").val() == "") ? null : $('#foLOExperience').val()
        , "Caroexperience": ($("#caROExperience").val() == "") ? null : $('#caROExperience').val()
        , "Carolandings": ($("#caROLandings").val() == "") ? null : $('#caROLandings').val()
        , "Foroexperience": ($("#foROExperience").val() == "") ? null : $('#foROExperience').val()
        , "Forolandings": ($("#foROLandings").val() == "") ? null : $('#foROLandings').val()
        , "Pilotflying": (document.querySelectorAll("input[id=pilotFlying]:checked")[0].value == "") ? null : document.querySelectorAll("input[id=pilotFlying]:checked")[0].value
        , "Pilotmonitoring": (document.querySelectorAll("input[id=pilotMonitoring]:checked")[0].value == "") ? null : document.querySelectorAll("input[id=pilotMonitoring]:checked")[0].value
        , "Pfgatesunderstanding": ($("#pfGatesUnderstanding").val() == "") ? null : $('#pfGatesUnderstanding').val()
        , "Pmgatesunderstanding": ($("#pmGatesUnderstanding").val() == "") ? null : $('#pmGatesUnderstanding').val()
        , "Errorchain": ($("#errorChain").val() == "") ? null : $('#errorChain').val()
        , "Unmitigatedthreats": ($("#unmitigatedThreats").val() == "") ? null : $('#unmitigatedThreats').val()
        , "Fullyconfigured": ($("#fullyConfigured").val() == "") ? null : $('#fullyConfigured').val()
        , "Pmcommunicationunfigured": ($("#pmCommunicationUnfigured").val() == "") ? null : $('#pmCommunicationUnfigured').val()
        , "Pfacknowledge": ($("#pfAcknowledge").val() == "") ? null : $('#pfAcknowledge').val()
        , "Pm500Fthat": ($("#pm500ftHAT").val() == "") ? null : $('#pm500ftHAT').val()
        , "Pmnotstable": ($("#pmNotStable").val() == "") ? null : $('#pmNotStable').val()
        , "Goaround500": ($("#goAround500").val() == "") ? null : $('#goAround500').val()
        , "Pfacknowledgegoaround": ($("#pfacknowledgegoaround").val() == "") ? null : $('#pfacknowledgegoaround').val()
        , "Whycontinue": ($("#whyContinue").val() == "") ? null : $('#whyContinue').val()
        , "Additionalfactors": ($("#additionalfactors").val() == "") ? null : $('#additionalfactors').val()
        , "Ccsummary": ($("#ccSummary").val() == "") ? null : $('#ccSummary').val()


        , "Fleet": ($("#fleet").val() == "") ? null : $('#fleet').val()
        , "InDAG": $("#inDAG3 option:selected").text()
        , "InfoOnlyPCAL": $("#infoOnlyPCAL option:selected").text()
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