$(document).ready(function () {
    getCurrentUser();

    populateTbodyTable();
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

function populateTbodyTable() {

    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/ScorecardSurvey?$orderby=Id%20desc';
    //var urlTest = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/CrewContactTrackingList?$filter=substringof(%27'+ year +'%27,ReportingMonth)&$top=10&$orderby=Id%20desc';

    getListItems(url, function (data) {
        var numRecords = data.d.results.length;

        if (numRecords > 0) {
            $.each(data, function (i, item) {

                for (var i = 0; i < 11; i++) {
                    //var userTitle = getUser(data.d.results[i].ModifiedById);
                    var createdDate = data.d.results[i].Created.slice(6,data.d.results[i].Created.length-2);

                    $("#previousSubmissionsTable").append("<tr>");
                    $("#previousSubmissionsTable").append("<td>" + data.d.results[i].Id + "</td>");
                    $("#previousSubmissionsTable").append("<td>" + data.d.results[i].CreatedByDisplayName + "</td>");
                    $("#previousSubmissionsTable").append("<td>" + data.d.results[i].Fleet + "</td>");
                    $("#previousSubmissionsTable").append("<td>" + Date(createdDate).slice(4,15) + "</td>");
                    $("#previousSubmissionsTable").append("<td>" + data.d.results[i].TailNo + "</td>");
                    $("#previousSubmissionsTable").append("<td>" + data.d.results[i].FlightNo + "</td>");
                    $("#previousSubmissionsTable").append("<td>" + data.d.results[i].Timeframe + "</td>");
                    //$("#previousSubmissionsTable").append("<td class='ml-1'>" + complete + "</td>");
                    $("#previousSubmissionsTable").append("<td>" + status + "</td>");
                    //$("#returnedData").append("<td><button class='btn btn-warning btn-sm' type='button' id='getIDButton' onclick='getData(" + data.d.results[i].Id + ")'>Get Details</button></td></tr>");
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
    //var count = document.getElementById("runningCount").value;
    var count = 1;
    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/ENGTechSvc_MEC_Request';
    //var listItemType = GetItemTypeForListName(listName);
    var listItemType = 'Microsoft.SharePoint.DataService.ENGTechSvc_MEC_RequestItem';

    var item = {
        "__metadata": { "type": listItemType }
        , "GatekeepersName": ($("#gatekeepersName").val() == "") ? null : $("#gatekeepersName").val()
        , "Fleet": ($("#fleet").val() == "") ? null : $("#fleet").val()
        , "FleetModel": ($("#fleetModel").val() == "") ? null : $('#fleetModel option:selected').text()
        , "Cause": ($("#cause").val() == "") ? null : $('#cause option:selected').text()
        , "ContactDate": ($("#contactDate").val() == "") ? null : $('#contactDate').val()
        , "FlightRecord": ($("#flightRecord").val() == "") ? null : $('#flightRecord').val()
        , "DurationOfBreak": ($("#flightRecord").val() == "") ? null : $('#flightRecord').val()

        , "TailNo": ($("#tail").val() == "") ? null : $("#tail").val()
        , "FlightNo": ($("#flightNo").val() == "") ? null : $("#flightNo").val()
        , "Vendor": ($("#outsideVendor").val() == "Other") ? $("#otherVendor").val() : $("#outsideVendor").val()
        , "VendorOther": ($("#otherVendor").val() == "") ? null : $("#otherVendor").val()
        , "Timeframe": ($("#dateFrom").val() == "") ? null : $("#dateFrom").val() + ' ' + $("#dateTo").val() 
        , "Urgent": ($("#urgent").prop("checked") == true) ? "true" : "false"
        , "RequestDescription": ($("#requestDescription").val() == "") ? null : $("#requestDescription").val()
        , "BrowserVendor": navigator.vendor
        , "BrowserUserAgent": navigator.userAgent
        , "BrowserAppName": navigator.appName
        , "Done": "false"
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
            saveToErrorList(JSON.stringify(item));
        }

    });
}