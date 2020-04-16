$(document).ready(function () {
    $("#event").on("change", function () {

    });
    $('#fleet').addEventListener('change', getEvent($("#fleet").val()));
});

function getEvent(fleet) {

    var url = 'https://alaskaair.sharepoint.com/sites/FOQA/_vti_bin/ListData.svc/AirbusBoeingEMSEventsArchive?$select=EventKey&$filter=(%20substringof(%27' + fleet + '%27,Fleet))&groupBy=Event&orderBy=Event';

    getListItems(url, function (data) {
        var numRecords = data.d.results.length;

        if (numRecords > 0) {
            $.each(data, function (i, item) {
                $("#dagChangeEvent").children().remove().end();
                $("#dagChangeEvent").append('<option id="eventDefault" value="">Select</option>');
                $("#pcalChangeEvent").children().remove().end();
                $("#pcalChangeEvent").append('<option id="eventDefault" value="">Select</option>');
                $("#newEvent").children().remove().end();
                $("#newEvent").append('<option id="eventDefault" value="">Select</option>');

                for (var i = 0; i < numRecords; i++) {

                    if (data.d.results[i].Event != "") {
                        $("#hiddenEvent").val(data.d.results[i].EventKey);
                        $("#dagChangeEvent").append('<option id= "' + data.d.results[i].EventKey + '" value="' + data.d.results[i].EventKey + '">' + data.d.results[i].EventKey + '</option>');
                        $("#pcalChangeEvent").append('<option id= "' + data.d.results[i].EventKey + '" value="' + data.d.results[i].EventKey + '">' + data.d.results[i].EventKey + '</option>');
                        $("#newEvent").append('<option id= "' + data.d.results[i].EventKey + '" value="' + data.d.results[i].EventKey + '">' + data.d.results[i].EventKey + '</option>');
                    }
                }

            })

        }
        else {
            alert("Select a fleet");
        }

    })

};