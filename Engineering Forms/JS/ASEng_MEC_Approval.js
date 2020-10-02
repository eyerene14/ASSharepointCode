$(document).ready(function () {

    $("#fleetError").hide();
    $("#dataPullTypeError").hide();
    $("#tailError").hide();
    //$("#flightNoError").hide();
    $("#outsideVendorError").hide();
    $("#timeframeError").hide();

    $("#fleet").change(function () {
        getFleetType($("#fleet").val());
    });

    

    $("#outsideVendor").change(function () {
        if ($("#outsideVendor").val() == "Other") {
            $("#otherVendorLabel").show();
            $("#otherVendor").show();
        }
        else {
            $("#otherVendorLabel").hide();
            $("#otherVendor").hide();
        }
    });

    $("#dataPullType").on("change", function () {
        $("#dataPullTypeError").hide();
    });
    $("#fleet").on("click", function () {
        $("#fleetError").hide();
    });
    $("#tail").on("change", function () {
        $("#tailError").hide();
    });
    $("#outsideVendor").on("change", function () {
        $("#outsideVendorError").hide();
    });
    $("#dateFrom").on("change", function () {
        $("#timeframeError").hide();
    });


    getRequestHistoryTable();

    $("#submitForm").on("click", function () {

        if ($("#dataPullType").val() == '') {
            $("#dataPullTypeError").show();
        }
        else if ($("#fleet").val() == '') {
            $("#fleetError").show();
        }
        else if ($("#tail").val() == '') {
            $("#tailError").show();
        }
        else if ($("#outsideVendor").val() == '') {
            $("#outsideVendorError").show();
        }
        else if ($("#dateFrom").val() == '') {
            $("#timeframeError").show();
        }
        else {
            saveToList();
        }
    });

});



function getFleetType(fleet) {

    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/FLICS_AS_FleetTailNo?$select=ACT_FULL_TAIL_NBR&$filter=(%20substringof(%27' + fleet + '%27,MANUFACTURER_NM))&groupBy=ACT_FULL_TAIL_NBR&$orderby=ACT_FULL_TAIL_NBR%20asc';

    getListItems(url, function (data) {
        var numRecords = data.d.results.length;

        if (numRecords > 0) {
            $.each(data, function (i, item) {

                $("#tail").children().remove().end();
                $("#tail").append('<option value="">Select</option>');
                for (var i = 0; i < numRecords; i++) {
                    $("#key_id").val(data.d.results[i].Id);
                    $("#tail").append('<option value="' + data.d.results[i].ACT_FULL_TAIL_NBR + '">' + data.d.results[i].ACT_FULL_TAIL_NBR + '</option>');
                } //end for
            }) //end each
        } //end if
    }); //end getListItems
}; //end getFleetType(fleet)

function getRequestHistoryTable() {

    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/ENG_MEC_ApprovalRequests?$orderby=Id%20desc';
    //var urlTest = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/CrewContactTrackingList?$filter=substringof(%27'+ year +'%27,ReportingMonth)&$top=10&$orderby=Id%20desc';

    getListItems(url, function (data) {
        var numRecords = data.d.results.length;


        if (numRecords > 0) {
            $.each(data, function (i, item) {


                for (var i = 0; i < 11; i++) {

                    //var userTitle = getUser(data.d.results[i].ModifiedById);
                    var createdDate = data.d.results[i].Created.slice(6,data.d.results[i].Created.length-2);
                    var complete = '<i class="far fa-square"></i>';
                    var status;

                    if (data.d.results[i].Done == true) {
                        var complete = '<i class="fas fa-check-square"></i>';
                    }

                    switch (data.d.results[i].Approval_Request_Status) {
                        case 'Pending Gatekeeper Response':
                            status = '<div class="progress"><div class="progress-bar progress-bar-striped bg-info" role="progressbar" style="width: 33%" aria-valuenow="33" aria-valuemin="0" aria-valuemax="100">Pending Gatekeeper Response</div></div>';                            
                            break;
                        case 'Pending MEC Response':
                            status = '<div class="progress"><div class="progress-bar progress-bar-striped bg-info" role="progressbar" style="width: 66%" aria-valuenow="66" aria-valuemin="0" aria-valuemax="100">Pending MEC Response</div></div>';
                            break;
                        case 'Approvals Complete':
                            status = '<div class="progress"><div class="progress-bar progress-bar-striped bg-info" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">Approvals Complete</div></div>';
                            break;
                        case 'Request Denied':
                            status = '<div class="progress"><div class="progress-bar progress-bar-striped bg-danger" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">Request Denied</div></div>';
                            break;
                        default:
                            status = '<div class="progress"><div class="progress-bar progress-bar-striped bg-warning" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">Notification Sent</div></div>';
                    }

                    $("#requestHistoryTable").append("<tr>");
                    $("#requestHistoryTable").append("<td>" + data.d.results[i].Id + "</td>");
                    $("#requestHistoryTable").append("<td>" + data.d.results[i].CreatedByDisplayName + "</td>");
                    $("#requestHistoryTable").append("<td>" + data.d.results[i].Fleet + "</td>");
                    $("#requestHistoryTable").append("<td>" + Date(createdDate).slice(4,15) + "</td>");
                    $("#requestHistoryTable").append("<td>" + data.d.results[i].TailNo + "</td>");
                    $("#requestHistoryTable").append("<td>" + data.d.results[i].FlightNo + "</td>");
                    $("#requestHistoryTable").append("<td>" + data.d.results[i].Timeframe + "</td>");
                    $("#requestHistoryTable").append("<td class='ml-1'>" + complete + "</td>");
                    $("#requestHistoryTable").append("<td>" + status + "</td>");
                    //$("#returnedData").append("<td><button class='btn btn-warning btn-sm' type='button' id='getIDButton' onclick='getData(" + data.d.results[i].Id + ")'>Get Details</button></td></tr>");

                }

                //$("#tbody").append("<tr>");
            })
        }
        else {
            $("#requestHistoryTable").append("<tr><td><b>No records for given month</b></td></tr>")
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
            $.each(data, function (i, item) {
                for (var i = 0; i < 1; i++) {
                    console.log(data.d.results[i]);
                } //end for
            }) //end each
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
    //var count = document.getElementById("runningCount").value;
    var count = 1;
    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/ENG_MEC_ApprovalRequests';
    //var listItemType = GetItemTypeForListName(listName);
    var listItemType = 'Microsoft.SharePoint.DataService.ENG_MEC_ApprovalRequestsItem';

    var item = {
        "__metadata": { "type": listItemType }
        , "RequestType": ($("#dataPullType").val() == "") ? null : $('#dataPullType option:selected').text()
        , "Fleet": ($("#fleet").val() == "") ? null : $("#fleet").val()
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
            location.href = _spPageContextInfo.webAbsoluteUrl + '/SitePages/FormSuccessRedirect.aspx';
            //window.location.reload();
        },
        error: function (data) {
            alert("");
            if ($("#browser").val() == 'Safari') {
                location.href = _spPageContextInfo.webAbsoluteUrl + '/SitePages/FormSuccessRedirect.aspx';
            }
            else {
                location.href = _spPageContextInfo.webAbsoluteUrl + '/SitePages/FormErrorRedirect.aspx';
            }
            if (failMsg != '') {
                console.log(failMsg);
                console.log(data);
                //toggleCursor();
            }
        }

    });
}