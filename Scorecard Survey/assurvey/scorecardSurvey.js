$(document).ready(function () {
    getCurrentUser();

    populateTbodyTable();
    $("#contactDateNull").hide();
    $("#contributingFactorNull").hide();
    
});

$("#flightRecord").on("change", function () {
    if ($("#contactDate").val() == "" || $("#contactDate").val() == null){
        document.getElementById("submitForm").disabled = true;
        $("#contactDateNull").show();
    }       
});
$("#contactDate").on("change", function () {
    if ($("#contactDate").val() == "" || $("#contactDate").val() == null){
        document.getElementById("submitForm").disabled = true;
        $("#contactDateNull").show();
    }
    else{
        document.getElementById("submitForm").disabled = false;
        $("#contactDateNull").hide();
    }       
});

$("#fleet").on("click", function () {
    if ($("#fleet").val() == "Airbus") {
        $("#fleetModel").children().remove().end();
        $("#fleetModel").append('<option value=""></option>');
        $("#fleetModel").append('<option value="319">319</option>');
        $("#fleetModel").append('<option value="320">320</option>');
        $("#fleetModel").append('<option value="321">321</option>');
    }
    else if ($("#fleet").val() == "Boeing") {
        $("#fleetModel").children().remove().end();
        $("#fleetModel").append('<option value=""></option>');
        $("#fleetModel").append('<option value="700">700</option>');
        $("#fleetModel").append('<option value="800">800</option>');
        $("#fleetModel").append('<option value="800">800SFP</option>');
        $("#fleetModel").append('<option value="900">900</option>');
        $("#fleetModel").append('<option value="900">Freighter</option>');
    }
});

$("#submitForm").on("click", function () {
    if ($("#fleet").val() == "") {
        document.getElementById("submitForm").disabled = true;
    }
    else if ($("#fleetModel").val() == "") {
        document.getElementById("submitForm").disabled = true;
    }
    else if ($("#cause").val() == "") {
        document.getElementById("submitForm").disabled = true;
    }
    else if ($("#contactDate").val() == "") {
        document.getElementById("submitForm").disabled = true;
    }
    else if ($("#flightRecord").val() == "") { 
        document.getElementById("submitForm").disabled = true;
}
    else if ($("#durationOfBreak").val() == "") {
        document.getElementById("submitForm").disabled = true; 
        $("#contributingFactorNull").append('Please enter # of months');
        $("#contributingFactorNull").show();  
    }
    else if ($("#lastTrainingEvent").val() == "") {
        document.getElementById("submitForm").disabled = true; 
        $("#contributingFactorNull").append('Please enter # of months');
        $("#contributingFactorNull").show();       
    }
    else if (document.querySelectorAll("input[id=contributingFactor]:checked")[0] == undefined){
        document.getElementById("submitForm").disabled = true;
        $("#contributingFactorNull").append('Please select a contributing factor');
        $("#contributingFactorNull").show();
    }
    else {
        document.getElementById("submitForm").disabled = true; 
        saveToList();
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

function getData(id) {

    var url = 'https://alaskaair.sharepoint.com/sites/QXFOQA/_vti_bin/ListData.svc/ScorecardSurvey?$filter=Id%20eq%20' + id + '%20';

    getListItems(url, function (data) {
        var numRecords = data.d.results.length;

        if (numRecords > 0) {
            $.each(data, function (i, item) {

                for (var i = 0; i < numRecords; i++) {
                    //var userTitle = getUser(data.d.results[i].ModifiedById);

                    $("#key").val(data.d.results[i].Id);
                    $('#fleet select').val(data.d.results[i].Fleet);
                    $('#fleetModel select').val(data.d.results[i].FleetModel);
                    $('#cause select').val(data.d.results[i].Cause);
                    $("#contactDate").val(data.d.results[i].ContactDate);
                    $("#flightRecord").val(data.d.results[i].FlightRecord);
                    $("#durationOfBreak").val(data.d.results[i].DurationOfBreak);
                    $("#lastTrainingEvent").val(data.d.results[i].LastTrainingEvent);
                    document.getElementById('contributingFactor').innerHTML = data.d.results[i].ContributingFactor;

                    /*
                    if ($('#gatekeeperPOC').children() != data.d.results[i].GatekeeperPOC) {
                        $('#gatekeeperPOC select').val("Jon Dodd");
                    }*/
                }
            })

        }
        else {
            $("#hiddenFormData").append("<tr><td><b>No records for given month</b></td></tr>")
        }
    });
    $(".gkf").show();
    $("#btnCancel").show();
    $("#approvedPDRsTable").hide();
}

function populateTbodyTable() {

    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/ScorecardSurvey?$orderby=Id%20desc';
    //var urlTest = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/CrewContactTrackingList?$filter=substringof(%27'+ year +'%27,ReportingMonth)&$top=10&$orderby=Id%20desc';

    getListItems(url, function (data) {
        var numRecords = data.d.results.length;

        if (numRecords > 0) {
            $.each(data, function (i, item) {

                for (var i = 0; i < 11; i++) {
                    //var userTitle = getUser(data.d.results[i].ModifiedById);
                    var createdDate = data.d.results[i].Created.slice(6, data.d.results[i].Created.length - 2);

                    $("#previousSubmissionsTable").append("<tr>");
                    $("#previousSubmissionsTable").append("<td>" + data.d.results[i].Id + "</td>");
                    $("#previousSubmissionsTable").append("<td>" + data.d.results[i].GatekeepersName + "</td>");
                    //$("#previousSubmissionsTable").append("<td>" + data.d.results[i].CreatedByDisplayName + "</td>");
                    $("#previousSubmissionsTable").append("<td>" + data.d.results[i].Fleet + "</td>");
                    $("#previousSubmissionsTable").append("<td>" + data.d.results[i].FleetModel + "</td>");
                    $("#previousSubmissionsTable").append("<td>" + Date(createdDate).slice(4, 15) + "</td>");
                    $("#previousSubmissionsTable").append("<td>" + data.d.results[i].Cause + "</td>");
                    $("#previousSubmissionsTable").append("<td>" + data.d.results[i].ContactDate + "</td>");
                    $("#previousSubmissionsTable").append("<td>" + data.d.results[i].FlightRecord + "</td>");
                    //$("#previousSubmissionsTable").append("<td class='ml-1'>" + complete + "</td>");
                    $("#previousSubmissionsTable").append("<td>" + status + "</td>");
                    $("#previousSubmissionsTable").append("<td><button class='btn btn-warning btn-sm' type='button' id='getIDButton' onclick='getData(" + data.d.results[i].Id + ")'>View</button></td></tr>");
                }

                //$("#tbody").append("<tr>");
            })
        }
        else {
            $("#previousSubmissionsTable").append("<tr><td><b>No records for given month</b></td></tr>")
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

function saveToErrorList(itemData) {
    //var count = document.getElementById("runningCount").value;
    var count = 1;
    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/FormErrorLog';
    //var listItemType = GetItemTypeForListName(listName);
    var listItemType = 'Microsoft.SharePoint.DataService.FormErrorLogItem';

    var item = {
        "__metadata": { "type": listItemType }
        , "BrowserVendor": navigator.vendor
        , "BrowserUserAgent": navigator.userAgent
        , "BrowserAppName": navigator.appName
        , "ListsName": "ScorecardSurvey"
        , "UsersName": ($("#gatekeepersName").val() == "") ? null : $("#gatekeepersName").val()
        , "UsersEmail": ($("#gatekeepersEmail").val() == "") ? null : $("#gatekeepersEmail").val()
        , "ItemData": itemData
    }//end item


    var errorMessage = "Error inserting record number: " + count;
    insertIntoList(url, item, "Item added/saved", errorMessage);
    /*window.location.reload();
    $("#tBody1").append("Saved to Human Factors by Flight List");*/

}

//This saves the request into the sharepoint list
function saveToList() {

    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/ScorecardSurvey';
    //var listItemType = GetItemTypeForListName(listName);
    var listItemType = 'Microsoft.SharePoint.DataService.ScorecardSurveyItem';

    var item = {
        "__metadata": { "type": listItemType }
        , "GatekeepersName": ($("#gatekeepersName").val() == "") ? null : $("#gatekeepersName").val()
        , "Fleet": ($("#fleet").val() == "") ? null : $("#fleet").val()
        , "FleetModel": ($("#fleetModel").val() == "") ? null : $('#fleetModel option:selected').text()
        , "Cause": ($("#cause").val() == "") ? null : $('#cause option:selected').text()
        , "ContactDate": ($("#contactDate").val() == "") ? null : $('#contactDate').val()
        , "FlightRecord": ($("#flightRecord").val() == "") ? null : $('#flightRecord').val()
        , "DurationOfBreak": ($("#durationOfBreak").val() == "") ? 0 : $('#durationOfBreak').val()
        , "LastTrainingEvent": ($("#lastTrainingEvent").val() == "") ? null : $('#lastTrainingEvent').val()
        , "ContributingFactor": (document.querySelectorAll("input[id=contributingFactor]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=contributingFactor]:checked")[0].value
        , "BrowserVendor": navigator.vendor
        , "BrowserUserAgent": navigator.userAgent
        , "BrowserAppName": navigator.appName
    }//end item


    var errorMessage = "Error inserting record number: " + count;
    insertIntoList(url, item, "Item added/saved", errorMessage);
    /*window.location.reload();
    $("#tBody1").append("Saved to Human Factors by Flight List");*/

}

function saveToListTest() {

    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/ScorecardSurveyTest';
    //var listItemType = GetItemTypeForListName(listName);
    var listItemType = 'Microsoft.SharePoint.DataService.ScorecardSurveyTestItem';

    var item = {
        "__metadata": { "type": listItemType }
        , "GatekeepersName": ($("#gatekeepersName").val() == "") ? null : $("#gatekeepersName").val()
        , "Fleet": ($("#fleet").val() == "") ? null : $("#fleet").val()
        , "FleetModel": ($("#fleetModel").val() == "") ? null : $('#fleetModel option:selected').text()
        , "Cause": ($("#cause").val() == "") ? null : $('#cause option:selected').text()
        , "ContactDate": ($("#contactDate").val() == "") ? null : $('#contactDate').val()
        , "FlightRecord": ($("#flightRecord").val() == "") ? null : $('#flightRecord').val()
        , "DurationOfBreak": ($("#durationOfBreak").val() == "") ? 0 : $('#durationOfBreak').val()
        , "LastTrainingEvent": ($("#lastTrainingEvent").val() == "") ? null : $('#lastTrainingEvent').val()
        , "ContributingFactor": (document.querySelectorAll("input[id=contributingFactor]:checked")[0] == undefined) ? null : document.querySelectorAll("input[id=contributingFactor]:checked")[0].value
        , "BrowserVendor": navigator.vendor
        , "BrowserUserAgent": navigator.userAgent
        , "BrowserAppName": navigator.appName
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
                location.href = _spPageContextInfo.webAbsoluteUrl + '/SitePages/FormSuccessRedirect.aspx';
            };
            console.log(successMsg);
            console.log(JSON.stringify(item));
        },
        error: function (data) {
            if (navigator.vendor == 'Apple Computer, Inc.') {
                location.href = _spPageContextInfo.webAbsoluteUrl + '/SitePages/FormSuccessRedirect.aspx';
                $("#safariMessage").show();
            }
            else {
                location.href = _spPageContextInfo.webAbsoluteUrl + '/SitePages/FormErrorRedirect.aspx';
                document.write("<div class='container'><div class='col  align-self-center'><label class='col-form-label' for='scorecard Survey'>Scorecard Survey Error</label></div></div>");
                document.write(JSON.stringify(item));
            }
            if (failMsg != '') {
                alert(failMsg);
                console.log(failMsg);
                console.log(JSON.stringify(item));
                //toggleCursor();
                $("#insertStatus").show();
                $("#insertStatus").html("Request NOT entered!").css({ "color": "red", "font-weight": "bold", "font-size": "18px" });
            }
            saveToErrorList(JSON.stringify(item));
        }

    });
}