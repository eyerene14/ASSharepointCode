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
        $("#fleetModel").append('<option value="">Select</option>');
        $("#fleetModel").append('<option value="319">319</option>');
        $("#fleetModel").append('<option value="320">320</option>');
        $("#fleetModel").append('<option value="321">321</option>');
    }
    else if ($("#fleet").val() == "Boeing") {
        $("#fleetModel").children().remove().end();
        $("#fleetModel").append('<option value="">Select</option>');
        $("#fleetModel").append('<option value="700">700</option>');
        $("#fleetModel").append('<option value="800">800</option>');
        $("#fleetModel").append('<option value="900">900</option>');
        $("#fleetModel").append('<option value="Freighter">Freighter</option>');
    }
});


$("#submitForm").click(function () {

    /*alert( 'Inserting: ' +
        'Fleet: ' + $("#fleet").val() +
        '; FleetModel: ' + $("#fleetModel").val() +
        '; Cause: ' + $("#cause").val() +
        '; ContactDate: ' + $("#contactDate").val() +
        '; FlightRecord: ' + $("#flightRecord").val() +
        '; DurationOfBreak: ' + $("#durationOfBreak").val() +
        '; LastTrainingEvent: ' + $("#lastTrainingEvent").val() +
        '; ContributingFactor: ' + document.querySelector("label.btn.active").id
    );*/
    //alert("saveToList");
    //saveToTestList();
    saveToList();
});

$("#updateForm").click(function () {

    /*alert( 'Updating: ' +
        'Fleet: ' + $("#fleet").val() +
        '; FleetModel: ' + $("#fleetModel").val() +
        '; Cause: ' + $("#cause").val() +
        '; ContactDate: ' + $("#contactDate").val() +
        '; FlightRecord: ' + $("#flightRecord").val() +
        '; DurationOfBreak: ' + $("#durationOfBreak").val() +
        '; LastTrainingEvent: ' + $("#lastTrainingEvent").val() +
        '; ContributingFactor: ' + document.querySelector("label.btn.active").id
    );*/

    updateForm();
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

    //cfLabelRemove = document.querySelector("label.btn.active");
    if (document.querySelector("label.btn.active") != undefined) {
        document.querySelector("label.btn.active").classList.remove('active')
        document.querySelector("#contributingFactor").value = null;
    }

    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/ScorecardSurvey?$filter=Id%20eq%20' + id + '%20';

    getListItems(url, function (data) {
        var numRecords = data.d.results.length;

        if (numRecords > 0) {
            $.each(data, function (i, item) {

                for (var i = 0; i < numRecords; i++) {
                    //var userTitle = getUser(data.d.results[i].ModifiedById);

                    $("#key_id").val(data.d.results[i].Id);
                    $('#fleet').val(data.d.results[i].Fleet);
                    $('#fleetModel').val(data.d.results[i].FleetModel);
                    $('#cause').val(data.d.results[i].Cause);
                    //document.getElementById('cause').options.selectedIndex this gets the position # of the selected option in dropdown
                    $("#contactDate").val(data.d.results[i].ContactDate);
                    $("#flightRecord").val(data.d.results[i].FlightRecord);
                    $("#durationOfBreak").val(data.d.results[i].DurationOfBreak);
                    $("#lastTrainingEvent").val(data.d.results[i].LastTrainingEvent);
                    var cfLabelId = document.getElementById(data.d.results[i].ContributingFactor);
                    cfLabelId.classList.add("active");
                    document.querySelector("#contributingFactor").value = data.d.results[i].ContributingFactor;
                    //document.querySelector("#contributingFactor").textContent e.g. 'Somewhat'

                    //$('#gatekeeperPOC').children();

                }
            })

            $("#submitForm").hide();
            $("#updateForm").show();
            $("#cancelUpdate").show();
        }
    });
}

function populateTbodyTable() {

    //var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/ScorecardSurvey?$orderby=Id%20desc';
    var urlTest = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/ScorecardSurvey?$orderby=Id%20desc';
    //var urlTest = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/CrewContactTrackingList?$filter=substringof(%27'+ year +'%27,ReportingMonth)&$top=10&$orderby=Id%20desc';

    getListItems(urlTest, function (data) {
        var numRecords = data.d.results.length;

        if (numRecords > 0) {
            $.each(data, function (i, item) {

                for (var i = 0; i < 11; i++) {
                    //var userTitle = getUser(data.d.results[i].ModifiedById);

                    var createdDate = new Date(Number(data.d.results[i].Created.slice(6, data.d.results[i].Created.length - 2)));
                    //createdDate.slice(4, 15);

                    $("#previousSubmissionsTable").append("<tr>");
                    $("#previousSubmissionsTable").append("<td>" + data.d.results[i].Id + "</td>");
                    $("#previousSubmissionsTable").append("<td>" + data.d.results[i].GatekeepersName + "</td>");
                    //$("#previousSubmissionsTable").append("<td>" + data.d.results[i].CreatedByDisplayName + "</td>");
                    $("#previousSubmissionsTable").append("<td>" + data.d.results[i].Fleet + "</td>");
                    $("#previousSubmissionsTable").append("<td>" + data.d.results[i].FleetModel + "</td>");
                    $("#previousSubmissionsTable").append("<td>" + createdDate.toDateString() + "</td>");
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
        , "Cause": ($("#cause").val() == "") ? null : $("#cause").val() //$('#cause option:selected').text()
        , "ContactDate": ($("#contactDate").val() == "") ? null : $('#contactDate').val()
        , "FlightRecord": ($("#flightRecord").val() == "") ? null : $('#flightRecord').val()
        , "DurationOfBreak": ($("#durationOfBreak").val() == "") ? 0 : $('#durationOfBreak').val()
        , "LastTrainingEvent": ($("#lastTrainingEvent").val() == "") ? null : $('#lastTrainingEvent').val()
        , "ContributingFactor": (document.querySelector("label.btn.active") == undefined) ? null : document.querySelector("label.btn.active").id
        //, "ContributingFactor": (document.querySelectorAll("input[id=contributingFactor]:checked")[0] == undefined) ? null : document.querySelector("#contributingFactor").value
        , "BrowserVendor": navigator.vendor
        , "BrowserUserAgent": navigator.userAgent
        , "BrowserAppName": navigator.appName
    }//end item

    //alert("In saveToList method");
    var errorMessage = "Error inserting record number: ";
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
        , "Cause": ($("#cause").val() == "") ? null : $("#cause").val() //$('#cause option:selected').text()
        , "ContactDate": ($("#contactDate").val() == "") ? null : $('#contactDate').val()
        , "FlightRecord": ($("#flightRecord").val() == "") ? null : $('#flightRecord').val()
        , "DurationOfBreak": ($("#durationOfBreak").val() == "") ? 0 : $('#durationOfBreak').val()
        , "LastTrainingEvent": ($("#lastTrainingEvent").val() == "") ? null : $('#lastTrainingEvent').val()
        , "ContributingFactor": (document.querySelector("label.btn.active") == undefined) ? null : document.querySelector("label.btn.active").id
        //, "ContributingFactor": (document.querySelectorAll("input[id=contributingFactor]:checked")[0] == undefined) ? null : document.querySelector("#contributingFactor").value
        , "BrowserVendor": navigator.vendor
        , "BrowserUserAgent": navigator.userAgent
        , "BrowserAppName": navigator.appName
    }//end item

    //alert('saveToTestList: ' + JSON.stringify(item));

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
            $("#insertStatus").show();
            $("#insertStatus").html("Request sent!").css({ "color": "green", "font-weight": "bold", "font-size": "18px" });
            //saveToFormErrorLog(item);
        },
        headers: {
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function (data) {
            //alert(JSON.stringify(item));
            //alert('insert success');
            /*if (successMsg != '') {
                $("#insertStatus").show();
                $("#insertStatus").html("Request sent!").css({ "color": "green", "font-weight": "bold", "font-size": "18px" });
                location.href = _spPageContextInfo.webAbsoluteUrl + '/SitePages/FormSuccessRedirect.aspx';
            };*/

        },
        error: saveError
    });
}

function saveError(data, request) {
    //alert('JS: saveToFormErrorLog -> logging(data)');
    alert("saveError");
    //var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/FormErrorLog';
    //var listItemType = GetItemTypeForListName(listName);
    var listItemType = 'Microsoft.SharePoint.DataService.FormErrorLogItem';

    var item = {
        "__metadata": { "type": listItemType }
        , "FK_ID": ($("#key_id").val() == "") ? null : $("#key_id").val()
        , "BrowserVendor": navigator.vendor
        , "BrowserUserAgent": navigator.userAgent
        , "BrowserAppName": navigator.appName
        , "ListsName": "ScorecardSurvey"
        , "UsersName": $("#gatekeepersName").val()
        , "UsersEmail": $("#gatekeepersEmail").val()
        //, "ItemData": JSON.stringify(data)
        , "ItemData": 'Fleet: ' + $("#fleet").val() + ' FleetModel: ' + $("#fleetModel").val() + ' Cause: ' + $("#cause").val() + ' ContactDate: ' + $("#contactDate").val() + ' FlightRecord: ' + $("#flightRecord").val() + ' DurationOfBreak: ' + $("#durationOfBreak").val() + ' LastTrainingEvent: ' + $("#lastTrainingEvent").val() + ' ContributingFactor: ' + document.querySelector("label.btn.active").id
        , "Test": 'Error submitting OR updating record'
    }//end item

    logging(item);
    //window.location.reload();
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
    $("#insertStatus").text("A log of error has been made").css({ "color": "orange", "font-weight": "bold", "font-size": "18px" });
    //alert('loggingSuccess(data, request) -> Form Error Log List');
    location.href = _spPageContextInfo.webAbsoluteUrl + '/SitePages/FormErrorRedirect.aspx';
}

function loggingError(error) {
    $("#insertStatus").text("A log of error has NOT been made").css({ "color": "orange", "font-weight": "bold", "font-size": "18px" });
    //alert('loggingError(data, request) -> Form Error Log List');
    location.href = _spPageContextInfo.webAbsoluteUrl + '/SitePages/FormErrorRedirect.aspx';
}


function updateForm() {

    updateListItem($("#key_id").val());
}

function updateListItem(itemId) {
    var itemType = 'Microsoft.SharePoint.DataService.ScorecardSurveyItem';
    var url = "https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/ScorecardSurvey(" + itemId + ")";

    var item = {
        "__metadata": { "type": itemType }
        , "GatekeepersName": ($("#gatekeepersName").val() == "") ? null : $("#gatekeepersName").val()
        , "Fleet": ($("#fleet").val() == "") ? null : $("#fleet").val()
        , "FleetModel": ($("#fleetModel").val() == "") ? null : $('#fleetModel option:selected').text()
        , "Cause": ($("#cause").val() == "") ? null : $("#cause").val() //$('#cause option:selected').text()
        , "ContactDate": ($("#contactDate").val() == "") ? null : $('#contactDate').val()
        , "FlightRecord": ($("#flightRecord").val() == "") ? null : $('#flightRecord').val()
        , "DurationOfBreak": ($("#durationOfBreak").val() == "") ? 0 : $('#durationOfBreak').val()
        , "LastTrainingEvent": ($("#lastTrainingEvent").val() == "") ? null : $('#lastTrainingEvent').val()
        , "ContributingFactor": (document.querySelector("label.btn.active") == undefined) ? null : document.querySelector("label.btn.active").id
    };

    //update List ScorecardSurveyTest with item
    getListItems(url, function (data) {
        $.ajax({
            url: url,
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(item),
            beforeSend: function () {
                console.log('Success');
                $("#insertStatus").show();
            },
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "X-HTTP-Method": "MERGE",
                "If-Match": "*"
            },
            success: function (data) {
                $("#insertStatus").html("Record has been updated!").css({ "color": "green", "font-weight": "bold", "font-size": "18px" });
                window.location.reload();
                //window.location.href = window.location.href;
            },
            error: saveError
        });
    })
    //window.location.reload();

};