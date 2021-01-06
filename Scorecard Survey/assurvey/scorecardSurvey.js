$(document).ready(function () {
    getCurrentUser();

    populateTbodyTable();
    //$("#contactDateNull").hide(); on the html script section
    //$("#contributingFactorNull").hide(); on the html script section

});

$("#flightRecord").on("change", function () {
    if ($("#contactDate").val() == "" || $("#contactDate").val() == null) {
        document.getElementById("submitForm").disabled = true;
        $("#contactDateNull").show();
    }
});

$("#contactDate").on("change", function () {
    if ($("#contactDate").val() == "" || $("#contactDate").val() == null) {
        document.getElementById("submitForm").disabled = true;
        $("#contactDateNull").show();
    }
    else {
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


$("#submitForm").click(function() {

    alert(
        $("#fleet").val() + ' ' +
        $("#fleetModel").val() + ' ' +
        $("#cause").val() + ' ' +
        $("#contactDate").val() + ' ' +
        $("#flightRecord").val() + ' ' +
        $("#durationOfBreak").val() + ' ' +
        $("#lastTrainingEvent").val() + ' ' +
        document.querySelectorAll("input[id=contributingFactor]:checked")[0].value
    );

    saveToTestList();
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

    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/ScorecardSurveyTest?$filter=Id%20eq%20' + id + '%20';

    getListItems(url, function (data) {
        var numRecords = data.d.results.length;

        if (numRecords > 0) {
            $.each(data, function (i, item) {

                for (var i = 0; i < numRecords; i++) {
                    //var userTitle = getUser(data.d.results[i].ModifiedById);

                    $("#key").val(data.d.results[i].Id);
                    $('#fleet').val(data.d.results[i].Fleet);
                    $('#fleetModel').val(data.d.results[i].FleetModel);
                    $('#cause').val(data.d.results[i].Cause);
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
    });
}

function populateTbodyTable() {

    //var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/ScorecardSurvey?$orderby=Id%20desc';
    var urlTest = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/ScorecardSurveyTest?$orderby=Id%20desc';
    //var urlTest = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/CrewContactTrackingList?$filter=substringof(%27'+ year +'%27,ReportingMonth)&$top=10&$orderby=Id%20desc';

    getListItems(urlTest, function (data) {
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
                    $("#previousSubmissionsTable").append("<td><button class='btn btn-warning btn-sm' type='button' id='getIDButton' onclick='getData(" + data.d.results[i].Id + ")'>Edit</button></td></tr>");
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

function saveToTestList() {

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

    alert(
        'saveToTestList: ' + JSON.stringify(item)
    );

    var errorMessage = "IJ Test Error";
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
            alert('insertIntoList: beforeSend' + successMsg);
            $("#insertStatus").show();
            $("#insertStatus").html("Request sent!").css({ "color": "green", "font-weight": "bold", "font-size": "18px" });
            saveToErrorList(JSON.stringify(item));
        },
        headers: {
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function (data) {
            alert('success');
            /*if (successMsg != '') {
                $("#insertStatus").show();
                $("#insertStatus").html("Request sent!").css({ "color": "green", "font-weight": "bold", "font-size": "18px" });
                location.href = _spPageContextInfo.webAbsoluteUrl + '/SitePages/FormSuccessRedirect.aspx';
            };
            console.log(successMsg);
            console.log(JSON.stringify(item));*/
        },
        error: saveToErrorList
    });
}

function saveToErrorList(jsonVersionOfItem, request) {
    alert('Failed to Save Form: saveToErrorList');

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
        , "UsersName": $("#gatekeepersName").val()
        , "UsersEmail": $("#gatekeepersEmail").val()
        , "ItemData": jsonVersionOfItem
    }//end item

    var errorMessage = "Error inserting record number: " + count;
    logging(item);
    /*window.location.reload();
    $("#tBody1").append("Saved to Human Factors by Flight List");*/

}
function logging(data) {

    var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/ListData.svc/FormErrorLog";

    var requestHeaders = {
        "accept": "application/json;odata=verbose",
        "X-RequestDigest": $("#__REQUESTDIGEST").val()
    };

    $.ajax({
        url: requestUri,
        type: "POST",
        contentType: "application/json;odata=verbose",
        headers: requestHeaders,
        data: JSON.stringify(data),
        success: loggingSuccess,
        error: loggingError
    });
}

function loggingSuccess(data, request) {
    alert('Inserted to Error Log');
    //var loginName = data.d.Title;
    //var email = data.d.Email;
    //var count = 0;
    //alert("Consent from co-pilot must be received before we can fullfill requests");
}

function loggingError(error) {
    alert('FAIL: Inserted to Error Log');
    location.href = _spPageContextInfo.webAbsoluteUrl + '/SitePages/FormErrorRedirect.aspx';
    //alert(error);
}
