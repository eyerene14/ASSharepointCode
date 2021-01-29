
google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(drawMultSeries);


//window.onload = function() {
var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//const reducer = (accumulator, currentValue) => MONTHS[accumulator].concat(currentValue);
var m = MONTHS.map(s => s.slice(0,3))
var counts = m.filter(s2 => getItems(s2, function (data) {
    return data.d.results; 
}));

//alert("counts" + counts);

for (var index = 0; index < MONTHS.length; ++index) {
    //newDataset.data.push(randomScalingFactor());  
    //alert("counts" + counts[index].toString()) ;
    getItems(MONTHS[index].slice(0,3), function (data) { 

        alert(data.d.results.length);
    })
}

/*
var m2 = MONTHS.map(s => getItems(s.slice(0,3), function (data) {
    return data.d.results.length; 
}))

var m3 = m.map(s => getItems(s, function (data) {
    return data.d.results.length; 
}))

alert("m2" + m2);
*/

function getItems(month) {
    //var url = '/_vti_bin/ListData.svc/Human_Factor_by_Flight_List';
    //var url = "/_api/Web/Lists/GetByTitle('Human_Factor_by_Flight_List')/Items?$filter=Year%20eq%20%272020%27&groupBy=Month&$orderby=Month%20asc";
    var url = "/_api/Web/Lists/GetByTitle('Human_Factor_by_Flight_List')/Items?$filter=((Year%20eq%20%272020%27)%20and%20(Month%20eq%20%27" + month + "%27))&groupBy=Month&$orderby=Month%20asc";
    return $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + url,
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {
            //alert("success:" + data.d.results.length);
        },
        error: function (data) {
            horizontalBarGraph(data);
            alert("error:" + data.d.results.length);
        }
    });
}

function drawMultSeries() {
      var data = google.visualization.arrayToDataTable([
        ['Month', '2010 Population', '2000 Population'],
        ['January', 8175000, 8008000],
        ['Los Angeles, CA', 3792000, 3694000],
        ['Chicago, IL', 2695000, 2896000],
        ['Houston, TX', 2099000, 1953000],
        ['Philadelphia, PA', 1526000, 1517000]
      ]);

      var options = {
        title: 'Population of Largest U.S. Cities',
        chartArea: {width: '50%'},
        hAxis: {
          title: 'Total Population',
          minValue: 0
        },
        vAxis: {
          title: 'City'
        }
      };

      var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    }

/*
var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var m = MONTHS.map(m => m.slice(0, 3))
var color = Chart.helpers.color;
var horizontalBarChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
        label: 'Dataset 1',
        backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
        borderColor: window.chartColors.red,
        borderWidth: 1,
        data: [
            data()
            //MONTHS.map(m => getItems(m.slice(0,3), function (data) {return data.d.results.length})),
            //randomScalingFactor(),
            //randomScalingFactor(),
            //randomScalingFactor(),
            //randomScalingFactor(),
            //randomScalingFactor(),
            //randomScalingFactor(),
        ]
    }, {
        label: 'Dataset 2',
        backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
        borderColor: window.chartColors.blue,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ]
    }]

};

function data(){
    for (var index = 0; index < MONTHS.length; ++index) {
        //newDataset.data.push(randomScalingFactor());
        return Math.trunc(getItems(MONTHS[index].slice(0, 3), function (data) {
            return num = data.d.results.length; 
        }));
    }

    
}
for (var index = 0; index < MONTHS.length; ++index) {
    //newDataset.data.push(randomScalingFactor());
    horizontalBarChartData.datasets[0].data.push(getItems(MONTHS[index].slice(0, 3), function (data) {
        return num = data.d.results.length; 
    }));
}







window.onload = function () {
    var ctx = document.getElementById('canvas').getContext('2d');
    window.myHorizontalBar = new Chart(ctx, {
        type: 'horizontalBar',
        data: horizontalBarChartData,
        options: {
            // Elements options apply to all of the options unless overridden in a dataset
            // In this case, we are setting the border of each horizontal bar to be 2px wide
            elements: {
                rectangle: {
                    borderWidth: 2,
                }
            },
            responsive: true,
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: 'Chart.js Horizontal Bar Chart'
            }
        }
    });

};


document.getElementById('randomizeData').addEventListener('click', function () {
    var zero = Math.random() < 0.2 ? true : false;
    horizontalBarChartData.datasets.forEach(function (dataset) {
        dataset.data = dataset.data.map(function () {
            return zero ? 0.0 : randomScalingFactor();
        });

    });
    window.myHorizontalBar.update();
});

var colorNames = Object.keys(window.chartColors);

document.getElementById('addDataset').addEventListener('click', function () {
    var colorName = colorNames[horizontalBarChartData.datasets.length % colorNames.length];
    var dsColor = window.chartColors[colorName];
    var newDataset = {
        label: 'Dataset ' + (horizontalBarChartData.datasets.length + 1),
        backgroundColor: color(dsColor).alpha(0.5).rgbString(),
        borderColor: dsColor,
        data: []
    };

    for (var index = 0; index < horizontalBarChartData.labels.length; ++index) {
        //newDataset.data.push(randomScalingFactor());
        newDataset.data.push(getItems(horizontalBarChartData.labels[index].slice(0, 3)));
    }

    horizontalBarChartData.datasets.push(newDataset);
    window.myHorizontalBar.update();
});

document.getElementById('addData').addEventListener('click', function () {
    if (horizontalBarChartData.datasets.length > 0) {
        var month = MONTHS[horizontalBarChartData.labels.length % MONTHS.length];
        horizontalBarChartData.labels.push(month);

        for (var index = 0; index < horizontalBarChartData.datasets.length; ++index) {
            horizontalBarChartData.datasets[index].data.push(getItems());
        }

        window.myHorizontalBar.update();
    }
});

document.getElementById('removeDataset').addEventListener('click', function () {
    horizontalBarChartData.datasets.pop();
    window.myHorizontalBar.update();
});

document.getElementById('removeData').addEventListener('click', function () {
    horizontalBarChartData.labels.splice(-1, 1); // remove the label first

    horizontalBarChartData.datasets.forEach(function (dataset) {
        dataset.data.pop();
    });

    window.myHorizontalBar.update();
});

/*push();

function push() {
    var colorName = colorNames[horizontalBarChartData.datasets.length % colorNames.length];
    var dsColor = window.chartColors[colorName];
    var newDataset = {
        label: 'Dataset ' + (horizontalBarChartData.datasets.length + 1),
        backgroundColor: color(dsColor).alpha(0.5).rgbString(),
        borderColor: dsColor,
        data: []
    };

    for (var index = 0; index < horizontalBarChartData.labels.length; ++index) {
        //newDataset.data.push(randomScalingFactor());
        newDataset.data.push(Math.trunc(getItems(horizontalBarChartData.labels[index].slice(0, 3), function (data) {
            return num = data.d.results.length; 
        })));
    }

    horizontalBarChartData.datasets.push(newDataset);
    window.myHorizontalBar.update();
};*/