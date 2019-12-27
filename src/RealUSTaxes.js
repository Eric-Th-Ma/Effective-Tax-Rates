var incomeTaxLineChart;
var linesOnChart = 0;
var graphRender = document.getElementById("incomeTaxGraph");

var taxRates = [];

var yearsDollarValue = [0.2267,0.2413,0.2597,0.2890,0.3280,0.3620,0.3843,0.3965,0.4138,0.4284,0.437,0.452,0.471,0.493,0.520,0.542,0.559,0.575,0.590,0.607,0.625,0.639,0.649,0.663,0.686,0.705,0.716,0.733,0.752,0.778,0.803,0.826,0.857,0.854,0.869,0.896,0.914,0.928,0.943,0.944,0.956,0.976,1];

var possibleNames = ['Deficit to GDP Ratio','Inflation Rate','Median Household Income','% Wealth in top 0.01%','Overall Tax Rate']
// data from: https://www.thebalance.com/us-deficit-by-year-3306306
var deficitToGDPData = [
    2.5, 2.5, 1.5, // 1977 - 1979
    2.6, 2.4, 3.8, 5.6, 4.5, 4.8, 4.8, 3.1, 2.9, 2.7, // 1980s
    3.7, 4.3, 4.4, 3.7, 2.8, 2.1, 1.3, 0.3, 0.8, 1.3, // 1990s
    2.3, 1.2, 1.4, 3.3, 3.4, 2.4, 1.8, 1.1, 3.1, 9.8, // 2000s
    8.6, 8.3, 6.7, 4.0, 2.7, 2.4, 3.1, 3.4, 4.0, 4.8  // 2010s
];
// data from: https://www.thebalance.com/u-s-inflation-rate-history-by-year-and-forecast-3306093
var inflationRate = [
    6.7, 9.0, 13.3, // 1977 - 1979
    12.5, 8.9, 3.8, 3.8, 3.9, 3.8, 1.1, 4.4, 4.4, 4.6, // 1980s
    6.1, 3.1, 2.9, 2.7, 2.7, 2.5, 3.3, 1.7, 1.6, 2.7, // 1990s
    3.4, 1.6, 2.4, 1.9, 3.3, 3.4, 2.5, 4.1, 0.1, 2.7, // 2000s
    1.5, 3.0, 1.7, 1.5, 0.8, 0.7, 2.1, 2.1, 1.9, 1.5  // 2010s
];
// data from: https://www.davemanuel.com/median-household-income.php
var nominalMedHouseIncome = [
    11692, 13098, 14526, // 1977-1979
    15944, 17300, 18347, 18797, 20196, 21317, 22482, 23596, 24772, 26440, // 1980s
    27522, 27842, 28424, 29143, 30247, 32036, 33447, 34952, 36802, 38523, // 1990s
    39772, 39978, 40125, 41039, 41952, 43861, 45618, 47549, 47624, 47126, // 2000s
    46658, 47368, 48291, 50704, 50813, 55435, 57897, 60145, 63179, 63030 // 2010s
];
var realMedHouseIncome = [];
for (i = 0; i < nominalMedHouseIncome.length; ++i) {
    realMedHouseIncome.push((nominalMedHouseIncome[i]/yearsDollarValue[i]).toFixed(0));
}

// data from: Table B1 online appendix Saez & Zucman (2016) Wealth Inequality in the United States since 1913
var percentWealthInTop = [
    2.3, 2.2, 2.6, // 1977-1979
    2.6, 3.0, 3.3, 3.1, 3.4, 3.6, 3.4, 3.7, 4.4, 4.3, // 1980s
    4.5, 4.3, 4.8, 5.0, 4.7, 4.8, 5.4, 5.7, 5.9, 6.2, // 1990s
    6.9, 7.0, 6.3, 6.5, 7.0, 7.4, 7.7, 8.5, 9.2, 9.6, // 2000s
    10.8, 10.1, 11.2
];

// Net national income data from: https://tradingeconomics.com/united-states/adjusted-net-national-income-us-dollar-wb-data.html
// Income tax revenue data from: https://www.cbo.gov/sites/default/files/cbofiles/attachments/45010-breakout-AppendixH.pdf
// overallTaxRate = (Income tax revenue)/(Net national income)
var overallTaxRate = [8.97,9.11,10.13,10.59,10.88,10.68,9.66,8.85,9.26,9.14,9.64,9.01,9.41,9.37,9.09,8.73,8.92,8.90,9.16,9.59,10.05,10.58,10.61,11.38,10.91,9.14,8.10,7.75,8.33,8.77,9.52,9.34,7.58,7.09,8.22,8.09,9.16,9.26,9.80,9.64,9.54,9.66];
// relativeTaxChangeRatio = overallTaxRate-Current-Year / overallTaxRate-Previous Year
var relativeTaxChangeRatio = [1,1.015703401,1.112269614, // 1977-1979
    1.044830259,1.027625046,0.9821001708,0.9041483649,0.9164113226,1.045784991,0.9875307045,1.054636759,0.9342370696,1.044570974, // 1980s
    0.9962144158,0.9700377713,0.9596572166,1.022864856,0.9972510256,1.029094326,1.046530764,1.048485691,1.052739692,1.003150079, // 1990s
    1.071839443,0.9588997741,0.8380505717,0.886006733,0.9568647623,1.074879771,1.053274436,1.085320252,0.9809424988,0.8116269167, // 2000s
    0.9345499803,1.160007548,0.9837554408,1.132306819,1.011027786,1.0589479,0.9837086,0.989624,1.012123151,1];

var congressControl = ['D','D','D','D','M','M','M','M','M','M','D','D','D','D','D','D','D','D','R','R','R','R','R','R','R','R','R','R','R','R','D','D','D','D','M','M','M','M','R','R','R','R','M'];
var presidencyControl = ['D','D','D','D','R','R','R','R','R','R','R','R','R','R','R','R','D','D','D','D','D','D','D','D','R','R','R','R','R','R','R','R','D','D','D','D','D','D','D','D','R','R','R'];

var tableOfTaxes = document.getElementById("table of taxes")

// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function calculateTax(income, taxBracketsData) {
    currentBracket = taxBracketsData[0];
    if (currentBracket[0] > income) {
        return income * currentBracket[1];
    } else {
        taxBracketsData.splice(0,1)
        return (currentBracket[0] * currentBracket[1]) + calculateTax((income-currentBracket[0]), taxBracketsData);
    }
}

function updateIncomeTaxInfo() {
    var income = document.getElementById('income').value * 1000;
    var taxesStartYear = 1977;
    // personal exemptions: https://www.taxpolicycenter.org/sites/default/files/legacy/taxfacts/content/pdf/historical_parameters.pdf
    // tax brackets: https://taxfoundation.org/us-federal-individual-income-tax-rates-history-1913-2013-nominal-and-inflation-adjusted-brackets/
    // standard deduction: https://en.wikipedia.org/wiki/Standard_deduction
    var yearsTaxData = [
        // Within each tax bracket we have the tax bracket size and rate [size,rate]
        // ovarall we have [standard deduction, personal exemption, lowest tax bracket ... highest tax bracket]
        [[2200,0],[750,0],[500,0.14],[1000, 0.16],[2100,0.19],[2000,0.21],[4000,0.25],[4000,0.29],[4000,0.34],[4000,0.38],[10000,0.45],[6000,0.5],[6000,0.55],[6000,0.6],[20000,0.64],[10000,0.66],[20000,0.68],[Number.MAX_SAFE_INTEGER,0.7]], // 1977
        [[2200,0],[750,0],[500,0.14],[1000, 0.16],[2100,0.19],[2000,0.21],[4000,0.25],[4000,0.29],[4000,0.34],[4000,0.38],[10000,0.45],[6000,0.5],[6000,0.55],[6000,0.6],[20000,0.64],[10000,0.66],[20000,0.68],[Number.MAX_SAFE_INTEGER,0.7]], // 1978
        [[2300,0],[1000,0],[1100,0.14],[1000, 0.16],[2100,0.18],[2000,0.19],[2300,0.21],[2100,0.24],[2100,0.26],[3200,0.3],[5300,0.34],[5300,0.39],[5300,0.44],[7400,0.49],[13800,0.55],[26500,0.63],[26500,0.68],[Number.MAX_SAFE_INTEGER,0.7]], // 1979
        [[2300,0],[1000,0],[1100,0.14],[1000, 0.16],[2100,0.18],[2000,0.19],[2300,0.21],[2100,0.24],[2100,0.26],[3200,0.3],[5300,0.34],[5300,0.39],[5300,0.44],[7400,0.49],[13800,0.55],[26500,0.63],[26500,0.68],[Number.MAX_SAFE_INTEGER,0.7]], // 1980
        [[2300,0],[1000,0],[1100,0.14],[1000, 0.16],[2100,0.16],[2000,0.19],[2300,0.21],[2100,0.24],[2100,0.26],[3200,0.3],[5300,0.34],[5300,0.39],[5300,0.44],[7400,0.49],[13800,0.55],[26500,0.63],[26500,0.68],[Number.MAX_SAFE_INTEGER,0.7]], // 1981
        [[2300,0],[1000,0],[1100,0.12],[1000, 0.14],[2100,0.16],[2000,0.17],[2300,0.19],[2100,0.22],[2100,0.23],[3200,0.27],[5300,0.31],[5300,0.35],[5300,0.4],[7400,0.44],[Number.MAX_SAFE_INTEGER,0.5]], // 1982
        [[2300,0],[1000,0],[1100,0.11],[1000, 0.13],[4100,0.15],[2300,0.17],[2100,0.19],[2100,0.21],[3200,0.24],[5300,0.28],[5300,0.32],[5300,0.36],[7400,0.4],[13800,0.45],[Number.MAX_SAFE_INTEGER,0.5]], // 1983
        [[2300,0],[1000,0],[1100,0.11],[1000, 0.12],[2100,0.14],[2000,0.15],[2300,0.16],[2100,0.18],[2100,0.2],[3200,0.23],[5300,0.26],[5300,0.3],[5300,0.34],[7400,0.38],[13800,0.42],[26500,0.48],[Number.MAX_SAFE_INTEGER,0.5]], // 1984
        [[2390,0],[1040,0],[1150,0.11],[1040, 0.12],[2180,0.14],[2090,0.15],[2390,0.16],[2190,0.18],[2180,0.2],[3330,0.23],[5520,0.26],[5510,0.3],[5520,0.34],[7700,0.38],[14360,0.42],[27850,0.48],[Number.MAX_SAFE_INTEGER,0.5]], // 1985
        [[2480,0],[1080,0],[1190,0.11],[1080, 0.12],[2260,0.14],[2160,0.15],[2480,0.16],[2270,0.18],[2270,0.2],[3450,0.23],[5720,0.26],[5720,0.3],[5720,0.34],[7980,0.38],[14890,0.42],[28600,0.48],[Number.MAX_SAFE_INTEGER,0.5]], // 1986
        [[2540,0],[1900,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1987
        [[3000,0],[1950,0],[17850, 0.15],[Number.MAX_SAFE_INTEGER,0.28]], // 1988
        [[3100,0],[2000,0],[18550, 0.15],[Number.MAX_SAFE_INTEGER,0.28]], // 1989
        [[3250,0],[2050,0],[19450, 0.15],[Number.MAX_SAFE_INTEGER,0.28]], // 1990
        [[3400,0],[2150,0],[20350, 0.15],[28950,0.28],[Number.MAX_SAFE_INTEGER,0.31]], // 1991
        [[3600,0],[2300,0],[21450, 0.15],[30450,0.28],[Number.MAX_SAFE_INTEGER,0.31]], // 1992
        [[3700,0],[2350,0],[22100, 0.15],[31400,0.28],[61500,0.31],[135000,0.36],[Number.MAX_SAFE_INTEGER,0.396]], // 1993
        [[3800,0],[2450,0],[22750, 0.15],[32350,0.28],[59900,0.31],[135000,0.36],[Number.MAX_SAFE_INTEGER,0.396]], // 1994
        [[3900,0],[2500,0],[23350, 0.15],[33200,0.28],[61400,0.31],[138550,0.36],[Number.MAX_SAFE_INTEGER,0.396]], // 1995
        [[4000,0],[2550,0],[24000, 0.15],[34150,0.28],[63150,0.31],[142450,0.36],[Number.MAX_SAFE_INTEGER,0.396]], // 1996
        [[4150,0],[2650,0],[24650, 0.15],[35100,0.28],[64900,0.31],[146400,0.36],[Number.MAX_SAFE_INTEGER,0.396]], // 1997
        [[4250,0],[2700,0],[25350, 0.15],[36050,0.28],[66700,0.31],[150350,0.36],[Number.MAX_SAFE_INTEGER,0.396]], // 1998
        [[4300,0],[2750,0],[25750, 0.15],[36700,0.28],[67800,0.31],[152900,0.36],[Number.MAX_SAFE_INTEGER,0.396]], // 1999
        [[4400,0],[2800,0],[26250, 0.15],[37300,0.28],[69050,0.31],[155750,0.36],[Number.MAX_SAFE_INTEGER,0.396]], // 2000
        [[4550,0],[2900,0],[27050, 0.15],[38500,0.275],[71200,0.305],[160600,0.355],[Number.MAX_SAFE_INTEGER,0.391]], // 2001
        [[4700,0],[3000,0],[6000,0.1],[21950, 0.15],[39750,0.27],[73550,0.3],[165800,0.35],[Number.MAX_SAFE_INTEGER,0.386]], // 2002
        [[4750,0],[3050,0],[7000,0.1],[21400, 0.15],[40400,0.25],[74700,0.28],[168450,0.33],[Number.MAX_SAFE_INTEGER,0.35]], // 2003
        [[4850,0],[3100,0],[7150,0.1],[21900, 0.15],[41300,0.25],[76400,0.28],[172350,0.33],[Number.MAX_SAFE_INTEGER,0.35]], // 2004
        [[5000,0],[3200,0],[7300,0.1],[22400, 0.15],[42250,0.25],[78200,0.28],[176300,0.33],[Number.MAX_SAFE_INTEGER,0.35]], // 2005
        [[5150,0],[3300,0],[7550,0.1],[23100, 0.15],[43550,0.25],[80600,0.28],[181750,0.33],[Number.MAX_SAFE_INTEGER,0.35]], // 2006
        [[5350,0],[3400,0],[7825,0.1],[24025, 0.15],[45250,0.25],[83750,0.28],[188850,0.33],[Number.MAX_SAFE_INTEGER,0.35]], // 2007
        [[5450,0],[3500,0],[8025,0.1],[24525, 0.15],[46300,0.25],[85700,0.28],[193150,0.33],[Number.MAX_SAFE_INTEGER,0.35]], // 2008
        [[5700,0],[3650,0],[8350,0.1],[25600, 0.15],[48300,0.25],[89300,0.28],[201400,0.33],[Number.MAX_SAFE_INTEGER,0.35]], // 2009
        [[5700,0],[3650,0],[8375,0.1],[25625, 0.15],[48400,0.25],[89450,0.28],[201800,0.33],[Number.MAX_SAFE_INTEGER,0.35]], // 2010
        [[5800,0],[3700,0],[8500,0.1],[26000, 0.15],[49100,0.25],[90800,0.28],[204750,0.33],[Number.MAX_SAFE_INTEGER,0.35]], // 2011
        [[5950,0],[3800,0],[8700,0.1],[26650, 0.15],[50300,0.25],[93000,0.28],[209700,0.33],[Number.MAX_SAFE_INTEGER,0.35]], // 2012
        [[6100,0],[3900,0],[8925,0.1],[27325, 0.15],[51600,0.25],[95400,0.28],[215100,0.33],[1650,0.35],[Number.MAX_SAFE_INTEGER,0.396]], // 2013
        [[6200,0],[3950,0],[9075,0.1],[27825, 0.15],[52450,0.25],[97000,0.28],[218750,0.33],[1650,0.35],[Number.MAX_SAFE_INTEGER,0.396]], // 2014
        [[6300,0],[4000,0],[9225,0.1],[28225, 0.15],[53300,0.25],[98550,0.28],[222200,0.33],[1700,0.35],[Number.MAX_SAFE_INTEGER,0.396]], // 2015
        [[6300,0],[4050,0],[9275,0.1],[28375, 0.15],[53500,0.25],[99000,0.28],[223200,0.33],[1700,0.35],[Number.MAX_SAFE_INTEGER,0.396]], // 2016
        [[6350,0],[4050,0],[9325,0.1],[28625, 0.15],[53950,0.25],[99750,0.28],[225050,0.33],[1700,0.35],[Number.MAX_SAFE_INTEGER,0.396]], // 2017
        [[12000,0],[0,0],[9525,0.1],[29175, 0.12],[43800,0.22],[75000,0.24],[42500,0.32],[300000,0.35],[Number.MAX_SAFE_INTEGER,0.37]], // 2018
        [[12200,0],[0,0],[9700,0.1],[29775, 0.12],[44725,0.22],[76525,0.24],[43375,0.32],[306200,0.35],[Number.MAX_SAFE_INTEGER,0.37]], // 2019
    ];
    var years = [];
    taxRates = [];
    for (i = 0; i < yearsTaxData.length; ++i) {
        let year = taxesStartYear + i;
        let taxRate = calculateTax((income * yearsDollarValue[i]), yearsTaxData[i]) / (income * yearsDollarValue[i]) * 100;
        years.push(year);
        taxRates.push(taxRate.toFixed(1));
    }
    if (linesOnChart != 0) {
        updatePlot(taxRates, ("Effective Tax Rate For Income Of " + numberWithCommas(income)));
    } else {
        makePlot("incomeTaxGraph",taxRates,years,("Effective Tax Rate For Income Of " + numberWithCommas(income)));
    }
    while (tableOfTaxes.rows.length > 1) {
        tableOfTaxes.deleteRow(1);
    }
    addRows('');

    ++linesOnChart;
}

function makePlot(elementID,data,labels,title) {
    var barChartData = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: title,
                backgroundColor: 'navy',
                data: data,
                hidden: false,
                borderWidth: 2,
                borderColor: 'black',
                pointRadius: 1,
                lineTension: 0,
                yAxisID: "Overall Tax Rate",
                order: data[0]
                }]
            },
        options: {
            legend: {display:true, labels: {fontColor: 'rgb(255, 99, 132)', 
                filter: function(item, incomeTaxLineChart) {
                    // Logic to remove a particular legend item goes here
                    return !item.text.includes('not in legend');
            }}},
            title: {display:true, text:"Effective Income Tax History"},
            responsive:true,
            scales: {yAxes: [{id: "Overall Tax Rate", ticks: {beginAtZero:true,  suggestedMax: 70}, stacked: false}, 
                            {id: "bar-stacked", ticks: {beginAtZero:true,  suggestedMax: 70}, stacked: true, display: false},
                            {id: possibleNames[0], stacked: false, display: false},
                            {id: possibleNames[1], stacked: false, display: false},
                            {id: possibleNames[2], stacked: false, display: false},
                            {id: possibleNames[3], stacked: false, display: false}
                        ],
                     xAxes: [{stacked: true}]}
            }
        }        
    //barChartData.datasets[0].bars[5].backgroundColor = "red".
    Chart.defaults.global.defaultColor = 'rgba(0, 100, 0, 0.9)';
    incomeTaxLineChart = new Chart(document.getElementById(elementID),barChartData);
    graphRender.style.display = "block";
    document.getElementById("chart overlays").style.display = "block";
    tableOfTaxes.style.display = "table";
}

function updatePlot(data, title) {
    var fillColor = 'rgba(' + ((11113*linesOnChart) % 256) + ', ' + ((37441*linesOnChart) % 256) + ', ' + ((46633*linesOnChart) % 256) + ', 1)';
    var newData = {
        label: title,
        backgroundColor: fillColor,
        data: data,
        hidden: false,
        borderWidth: 2,
        borderColor: 'black',
        pointRadius: 1,
        lineTension: 0,
        yAxisID: "Overall Tax Rate",
        order: data[0]
    }
    incomeTaxLineChart.data.datasets.push(newData);
    incomeTaxLineChart.update();
}
  
function clearPlot() {
    if (document.getElementById("incomeTaxGraph").className != "chartjs-render-monitor") {
        alert("Nothing to clear");
    } else {
        incomeTaxLineChart.data.datasets = [];
        incomeTaxLineChart.update();
        linesOnChart = 0;
    }
}

function overlayPlot(controlYears) {
    // This Code allowed the top portion of theoverlay to scale down to fill the portion above the top of the line
    // var dataMax = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    // for (dataYear of incomeTaxLineChart.data.datasets) {
    //     if (Number(dataYear.data[0]) > dataMax[0]) {
    //         for (i = 0; i < dataMax.length; ++i) {
    //             dataMax[i] = Number(dataYear.data[i]);
    //         }
    //     }
    // }
    // var counter = 0;
    backgroundColors = [];
    backgroundColorsTwo = []
    data = [];
    dataTwo = [];
    // This Code allows the top portion to be democrat and GOP logos however it ended up being very glitchy.
    // var imgGOP = new Image();
    // imgGOP.src = 'GOP.png';
    // var ctx = document.getElementById('incomeTaxGraph').getContext('2d');
    // var fillPatternGOP = ctx.createPattern(imgGOP, 'repeat');
    // var imgDEM = new Image();
    // imgDEM.src = 'DEM.png';
    // var fillPatternDEM = ctx.createPattern(imgDEM, 'repeat');
    // var imgSplit = new Image();
    // imgSplit.src = 'Party-Split.png';
    // var fillPatternSplit = ctx.createPattern(imgSplit, 'repeat');
    for (controlChar of controlYears) {
        if (controlChar == 'R') {
            backgroundColors.push('rgba(255, 0, 0, 0.25)');
            // backgroundColorsTwo.push(fillPatternGOP);
            backgroundColorsTwo.push('rgba(255, 0, 0, 0.9)');
        } else if (controlChar == 'D') {
            backgroundColors.push('rgba(0, 0, 255, 0.25)');
            // backgroundColorsTwo.push(fillPatternDEM);
            backgroundColorsTwo.push('rgba(0, 0, 255, 0.9)');
        } else {
            backgroundColors.push('rgba(164, 52, 235, 0.25)');
            // backgroundColorsTwo.push(fillPatternSplit)
            backgroundColorsTwo.push('rgba(164, 52, 235, 0.9)');
        }
        data.push(64);
        dataTwo.push(6);
        // var desiredHeightToNotHide = (Math.min(2 + dataMax[counter], 68)/4).toFixed(0)*4;
        // data.push(desiredHeightToNotHide);
        // dataTwo.push(70 - desiredHeightToNotHide);
        // counter++;
    }
    var newData = {
        label: 'not in legend',
        backgroundColor: backgroundColors,
        data: data,
        hidden: false,
        barPercentage: 1.0,
        categoryPercentage: 1.0,
        order: 0,
        yAxisID: "bar-stacked",
        type: 'bar'
    }
    incomeTaxLineChart.data.datasets.push(newData);
    var newDataTwo = {
        label: 'not in legend',
        backgroundColor: backgroundColorsTwo,
        data: dataTwo,
        hidden: false,
        barPercentage: 1.0,
        categoryPercentage: 1.0,
        order: 0,
        yAxisID: "bar-stacked",
        type: 'bar'
    }
    incomeTaxLineChart.data.datasets.push(newDataTwo);
    incomeTaxLineChart.update();
}

function removeOverlay() {
    incomeTaxLineChart.data.datasets.pop();
    incomeTaxLineChart.data.datasets.pop();
    incomeTaxLineChart.update();
}

function toggleEconomicMeasure(data, measureName) {
    var togglingOn = true;
    for(var j = incomeTaxLineChart.data.datasets.length -1; j >= 0 ; j--){
        if (incomeTaxLineChart.data.datasets[j].label == measureName) {
            togglingOn = false;
            incomeTaxLineChart.data.datasets.splice(j, 1);
        } else {
            for (name of possibleNames) {
                if (incomeTaxLineChart.data.datasets[j].label == name) {
                    incomeTaxLineChart.data.datasets.splice(j, 1);
                    break;
                }
            }
        }
    }
    --linesOnChart;
    if (togglingOn) {
        var newData = {
            label: measureName,
            data: data,
            hidden: false,
            backgroundColor: 'rgba(255,255,255,0)',
            borderWidth: 4,
            borderColor: 'black',
            pointRadius: 2,
            lineTension: 0,
            yAxisID: measureName,
            order: data[0]
        }
        incomeTaxLineChart.data.datasets.push(newData);
        ++linesOnChart;
        ++linesOnChart;
    }
    incomeTaxLineChart.update();
}

class PoliticalFigure {
    constructor(numYears, imgUrl, name, isRepublican) {
        this.numYears = numYears;
        this.imgUrl = imgUrl;
        this.name = name;
        this.isRepublican = isRepublican;
        this.taxChange = 0;
        this.relativeChange = 0;
    }
}

// Presidents
var presidentsInfo = [];
var addedPresidents = [];

// Speakers of The house
var speakersInfo = [];
var addedSpeakers = [];

// Senate Majority Leader
var senateInfo = [];
var addedSenate = [];

function addRows(politicianName) {

    class PoliticalFigure {
        constructor(numYears, imgUrl, name, isRepublican) {
            this.numYears = numYears;
            this.imgUrl = imgUrl;
            this.name = name;
            this.isRepublican = isRepublican;
            this.taxChange = 0;
            this.relativeChange = 0;
        }
    }

    var politicianTaxChange = 0;
    var politicianRelativeChange = 0;

    for (president of addedPresidents) {
        if (president.name == politicianName) {
            politicianTaxChange = Number(president.taxChange.toFixed(1));
            if (Math.abs(politicianTaxChange) > 10) {
                politicianTaxChange = politicianTaxChange.toFixed(0);
            }
            politicianRelativeChange = Number(president.relativeChange.toFixed(1));
            if (Math.abs(politicianRelativeChange) > 10) {
                politicianRelativeChange = politicianRelativeChange.toFixed(0);
            }
        }
    }

    for (speaker of addedSpeakers) {
        if (speaker.name == politicianName) {
            politicianTaxChange = Number(speaker.taxChange.toFixed(1));
            if (Math.abs(politicianTaxChange) > 10) {
                politicianTaxChange = politicianTaxChange.toFixed(0);
            }
            politicianRelativeChange = Number(speaker.relativeChange.toFixed(1));
            if (Math.abs(politicianRelativeChange) > 10) {
                politicianRelativeChange = politicianRelativeChange.toFixed(0);
            }
        }
    }

    for (senateMaj of addedSenate) {
        if (senateMaj.name == politicianName) {
            politicianTaxChange = Number(senateMaj.taxChange.toFixed(1));
            if (Math.abs(politicianTaxChange) > 10) {
                politicianTaxChange = politicianTaxChange.toFixed(0);
            }
            politicianRelativeChange = Number(senateMaj.relativeChange.toFixed(1));
            if (Math.abs(politicianRelativeChange) > 10) {
                politicianRelativeChange = politicianRelativeChange.toFixed(0);
            }
        }
    }

    // Presidents
    var Carter = new PoliticalFigure(4,'https://www.whitehouse.gov/wp-content/uploads/2017/12/39_jimmy_carter.jpg','Jimmy Carter (1977-1980)',false);
    var Reagan = new PoliticalFigure(8,'https://www.whitehouse.gov/wp-content/uploads/2017/12/40_ronald_reagan.jpg','Ronald Reagan (1981-1988)',true);
    var BushSr = new PoliticalFigure(4,'https://www.whitehouse.gov/wp-content/uploads/2017/12/41_george_h_w_bush.jpg','George H. W. Bush (1989-1992)',true);
    var Clinton = new PoliticalFigure(8,'https://www.whitehouse.gov/wp-content/uploads/2017/12/42_bill_clinton.jpg','Bill Clinton (1993-2000)',false);
    var wBush = new PoliticalFigure(8,'https://www.whitehouse.gov/wp-content/uploads/2017/12/43_george_w_bush.jpg','George W. Bush (2001-2008)',true);
    var Obama = new PoliticalFigure(8,'https://www.whitehouse.gov/wp-content/uploads/2017/12/44_barack_obama1.jpg','Barack Obama (2009-2016)',false);
    var Trump = new PoliticalFigure(3,'https://d2v9ipibika81v.cloudfront.net/uploads/sites/25/2017/01/donaldtrump.png','Donald Trump (2017-)',true);
    presidentsInfo = [Carter, Reagan, BushSr, Clinton, wBush, Obama, Trump];
    addedPresidents = [];

    // Speakers of The house
    var ONeill = new PoliticalFigure(10,'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tip_O%27Neill_1978.jpg/440px-Tip_O%27Neill_1978.jpg','Tip ONeill (1977-1986)',false);
    var Wright = new PoliticalFigure(3,'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Speaker_Jim_Wright_of_Texas.jpg/1280px-Speaker_Jim_Wright_of_Texas.jpg','Jim Wright (1987-1989)',false);
    var Foley = new PoliticalFigure(5,'https://upload.wikimedia.org/wikipedia/commons/2/2a/SpeakerFoley.jpg','Tom Foley (1990-1994)',false);
    var Gingrich = new PoliticalFigure(4,'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Newt_Gingrich_2019.jpg/440px-Newt_Gingrich_2019.jpg','Newt Gingrich (1995-1998)',true);
    var Hastert = new PoliticalFigure(8,'https://upload.wikimedia.org/wikipedia/commons/9/9d/SpeakerHastert.jpg','Dennis Hastert (1999-2006)',true);
    var Pelosi1 = new PoliticalFigure(4,'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Official_photo_of_Speaker_Nancy_Pelosi_in_2019.jpg/440px-Official_photo_of_Speaker_Nancy_Pelosi_in_2019.jpg','Nancy Pelosi (2007-2010)',false);
    var Boehner = new PoliticalFigure(5,'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/John_Boehner_official_portrait.jpg/440px-John_Boehner_official_portrait.jpg','John Boehner (2011-2015)',true);
    var Ryan = new PoliticalFigure(3,'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Paul_Ryan_official_photo.jpg/440px-Paul_Ryan_official_photo.jpg','Paul Ryan (2016-2018)',true);
    var Pelosi2019 = new PoliticalFigure(1,'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Official_photo_of_Speaker_Nancy_Pelosi_in_2019.jpg/440px-Official_photo_of_Speaker_Nancy_Pelosi_in_2019.jpg','Nancy Pelosi (2019)',false);
    speakersInfo = [ONeill, Wright, Foley, Gingrich, Hastert, Pelosi1, Boehner, Ryan, Pelosi2019];
    addedSpeakers = [];

    // Senate Majority Leader
    var Byrd1 = new PoliticalFigure(4,'https://www.senate.gov/artandhistory/art/resources/graphic/xlarge/32_00052.jpg','Robert Byrd (1977-1980)',false);
    var Baker = new PoliticalFigure(4,'https://www.senate.gov/artandhistory/art/resources/graphic/xlarge/32_00038.jpg','Howard Baker (1981-1984)',true);
    var Dole1 = new PoliticalFigure(2,'https://www.senate.gov/artandhistory/art/resources/graphic/xlarge/32_00045.jpg','Bob Dole (1985-1986)',true);
    var Byrd2 = new PoliticalFigure(2,'https://www.senate.gov/artandhistory/art/resources/graphic/xlarge/32_00052.jpg','Robert Byrd (1987-1988)',false);
    var Mitchell = new PoliticalFigure(6,'https://www.senate.gov/artandhistory/history/resources/graphic/large/MitchellGeorge.jpg','George Mitchell (1989-1994)',false);
    var Dole2 = new PoliticalFigure(2,'https://www.senate.gov/artandhistory/art/resources/graphic/xlarge/32_00045.jpg','Bob Dole (1995-1996)',true);
    var Lott = new PoliticalFigure(4,'https://www.senate.gov/artandhistory/art/resources/graphic/xlarge/32_00062.jpg','Trent Lott (1997-2000)',true);
    var Daschle = new PoliticalFigure(2,'http://bioguide.congress.gov/bioguide/photo/D/D000064.jpg','Andrew Daschle (2001-2002)',false);
    var First = new PoliticalFigure(4,'http://bioguide.congress.gov/bioguide/photo/F/F000439.jpg','William First (2003-2006)',true);
    var Reid = new PoliticalFigure(8,'http://bioguide.congress.gov/bioguide/photo/R/R000146.jpg','Harry Reid (2007-2014)',false);
    var McConnell = new PoliticalFigure(5,'http://bioguide.congress.gov/bioguide/photo/M/M000355.jpg','Mitch McConnell (2015-2019)',true);
    senateInfo = [Byrd1, Baker, Dole1, Byrd2, Mitchell, Dole2, Lott, Daschle, First, Reid, McConnell];
    addedSenate = [];

    var presidentsCountDown = 0;
    var speakersCountDown = 0;
    var senateCountDown = 0;

    class TaxLaw {
        constructor(isLaw,articleLink,lawDescription) {
            this.isLaw = isLaw;
            this.articleLink = articleLink;
            this.descript = lawDescription;
        }
    }
    // Relevant Legislation
    var relevantLegislation = [new TaxLaw(false,'',''), new TaxLaw(true,'https://www.nytimes.com/1978/11/09/archives/highlights-of-the-tax-law-signed-by-president-carter-individual.html','Revenue Act of 1978'), new TaxLaw(false,'',''), //1977-1979
                new TaxLaw(false,'',''), new TaxLaw(true,'https://www.history.com/this-day-in-history/reagan-signs-economic-recovery-tax-act-erta','Economic Recovery Tax Act of 1981'), new TaxLaw(false,'',''), new TaxLaw(false,'',''), new TaxLaw(false,'',''), new TaxLaw(false,'',''), new TaxLaw(true,'https://www.nytimes.com/1986/10/23/business/tax-reform-act-1986-measure-came-together-tax-bill-for-textbooks.html','Tax Reform Act of 1986'), new TaxLaw(false,'',''), new TaxLaw(false,'',''), new TaxLaw(false,'',''), // 1980s
                new TaxLaw(true,'https://www.taxpolicycenter.org/laws-proposals/major-enacted-tax-legislation-1990-1999#omnibus-budget-reconciliation-act-of-1990','Omnibus Budget Reconciliation Act of 1990'), new TaxLaw(false,'',''), new TaxLaw(false,'',''), new TaxLaw(true,'https://www.chicagotribune.com/news/ct-xpm-1993-09-26-9309260314-story.html','Omnibus Budget Reconciliation Act of 1993'), new TaxLaw(false,'',''), new TaxLaw(false,'',''), new TaxLaw(false,'',''), new TaxLaw(false,'',''), new TaxLaw(false,'',''), new TaxLaw(false,'',''), // 1990s
                new TaxLaw(false,'',''), new TaxLaw(true,'https://www.cbpp.org/research/federal-tax/the-legacy-of-the-2001-and-2003-bush-tax-cuts','Economic Growth and Tax Relief Reconciliation Act of 2001'), new TaxLaw(false,'',''), new TaxLaw(true,'https://www.cbpp.org/research/federal-tax/the-legacy-of-the-2001-and-2003-bush-tax-cuts','Jobs and Growth Tax Relief Reconciliation Act of 2003'), new TaxLaw(false,'',''), new TaxLaw(false,'',''), new TaxLaw(false,'',''), new TaxLaw(false,'',''), new TaxLaw(false,'',''), new TaxLaw(true,'https://www.thebalance.com/arra-details-3306299','American Recovery and Reinvestment Act of 2009'), // 2000s
                new TaxLaw(true,'https://obamawhitehouse.archives.gov/the-press-office/2010/12/10/tax-relief-unemployment-insurance-reauthorization-and-job-creation-act-2','Tax Relief, Unemployment Insurance Reauthorization, and Job Creation Act of 2010'), new TaxLaw(false,'',''), new TaxLaw(true,'https://www.taxpolicycenter.org/briefing-book/what-did-american-taxpayer-relief-act-2012-do','American Taxpayer Relief Act of 2012'), new TaxLaw(false,'',''), new TaxLaw(false,'',''), new TaxLaw(false,'',''), new TaxLaw(false,'',''), new TaxLaw(true,'https://www.nytimes.com/2018/12/27/us/politics/trump-tax-cuts-jobs-act.html','Tax Cuts and Jobs Act of 2017'), new TaxLaw(false,'',''), new TaxLaw(false,'','')  // 2010s
            ]

    for (var i = 1; i <= taxRates.length; i++) {
        var rowToAdd = document.createElement('tr');   
        
        // Add presidents entries
        if (presidentsCountDown == 0) {
            var presidentEntry = document.createElement('td');
            presidentEntry.colSpan = '18';
            presidentEntry.rowSpan = presidentsInfo[presidentsInfo.length - 1].numYears;
            presidentsCountDown = presidentsInfo[presidentsInfo.length - 1].numYears;
            var presImage = document.createElement('img');
            presImage.src = presidentsInfo[presidentsInfo.length-1].imgUrl;
            presImage.style = 'margin-left: 5%; margin-right: 5%; margin-top: 4px; margin-bottom: 0; width: 90%;';
            if (politicianName == presidentsInfo[presidentsInfo.length-1].name) {
                presImage.setAttribute('onclick',  "changeTable('')");
            } else {
                presImage.setAttribute('onclick',  "changeTable('" + presidentsInfo[presidentsInfo.length-1].name + "')");
            }
            presidentEntry.appendChild(presImage);
            var lineBreak = document.createElement('br');
            presidentEntry.appendChild(lineBreak);
            var text1 = document.createTextNode(presidentsInfo[presidentsInfo.length-1].name);
            presidentEntry.appendChild(text1);
            presidentEntry.style = 'background-color: rgb(10,10,200,0.8);';
            if (presidentsInfo[presidentsInfo.length-1].isRepublican) {
                presidentEntry.style = 'background-color: rgb(200,10,10,0.8);';
            }
            rowToAdd.appendChild(presidentEntry);
            addedPresidents.push(presidentsInfo.pop());
        }
        --presidentsCountDown;

        // Add entries for speaker of the House of Representatives
        if (speakersCountDown == 0) {
            var speakerEntry = document.createElement('td');
            speakerEntry.colSpan = '12';
            speakerEntry.rowSpan = speakersInfo[speakersInfo.length - 1].numYears;
            speakersCountDown = speakersInfo[speakersInfo.length - 1].numYears;
            var speakImage = document.createElement('img');
            speakImage.src = speakersInfo[speakersInfo.length-1].imgUrl;
            speakImage.style = 'margin-left: 1%; margin-right: 1%; margin-top: 0; margin-bottom: 0; width: 44%; display: inline;';
            if (politicianName == speakersInfo[speakersInfo.length-1].name) {
                speakImage.setAttribute('onclick',  "changeTable('')");
            } else {
                speakImage.setAttribute('onclick',  "changeTable('" + speakersInfo[speakersInfo.length-1].name + "')");
            }
            speakerEntry.appendChild(speakImage);
            var nameBox = document.createElement('div');
            nameBox.style = 'width: 54%; display: inline-block;';
            var speakerName = document.createTextNode(speakersInfo[speakersInfo.length-1].name);
            nameBox.appendChild(speakerName);
            speakerEntry.appendChild(nameBox);
            speakerEntry.style = 'background-color: rgb(10,10,200,0.8);';
            if (speakersInfo[speakersInfo.length-1].isRepublican) {
                speakerEntry.style = 'background-color: rgb(200,10,10,0.8);';
            }
            rowToAdd.appendChild(speakerEntry);
            addedSpeakers.push(speakersInfo.pop());
        }
        --speakersCountDown;

        // Add entries for the Senate Majority Leader
        if (senateCountDown == 0) {
            var senateEntry = document.createElement('td');
            senateEntry.colSpan = '12';
            senateEntry.rowSpan = senateInfo[senateInfo.length - 1].numYears;
            senateCountDown = senateInfo[senateInfo.length - 1].numYears;
            var senImage = document.createElement('img');
            senImage.src = senateInfo[senateInfo.length-1].imgUrl;
            senImage.style = 'margin-left: 1%; margin-right: 1%; margin-top: 0; margin-bottom: 0; width: 44%; display: inline;';
            if (politicianName == senateInfo[senateInfo.length-1].name) {
                senImage.setAttribute('onclick',  "changeTable('')");
            } else {
                senImage.setAttribute('onclick',  "changeTable('" + senateInfo[senateInfo.length-1].name + "')");
            }
            senateEntry.appendChild(senImage);
            var nameBox = document.createElement('div');
            nameBox.style = 'width: 54%; display: inline-block;';
            var senateName = document.createTextNode(senateInfo[senateInfo.length-1].name);
            nameBox.appendChild(senateName);
            senateEntry.appendChild(nameBox);
            senateEntry.style = 'background-color: rgb(10,10,200,0.8);';
            if (senateInfo[senateInfo.length-1].isRepublican) {
                senateEntry.style = 'background-color: rgb(200,10,10,0.8);';
            }
            rowToAdd.appendChild(senateEntry);
            addedSenate.push(senateInfo.pop());
        }
        --senateCountDown;

        // Add tax rate
        var taxRateCell = document.createElement('td');
        taxRateCell.colSpan = '7';
        var text = document.createTextNode(taxRates[taxRates.length-i] + '%');
        taxRateCell.style = 'font-size: 22px;'
        taxRateCell.appendChild(text);
        rowToAdd.appendChild(taxRateCell);

        // Add tax rate change
        var taxChangeCell = document.createElement('td');
        taxChangeCell.colSpan = '7';
        var text1;
        var needToAdd = true;
        if (addedPresidents[addedPresidents.length-1].name == politicianName) {
            if (presidentsCountDown == (addedPresidents[addedPresidents.length - 1].numYears-1)) {
                taxChangeCell.rowSpan = addedPresidents[addedPresidents.length-1].numYears;
                if (politicianTaxChange > 0) {
                    text1 = document.createTextNode('+' + politicianTaxChange);
                } else {
                    text1 = document.createTextNode(politicianTaxChange);
                }
                taxChangeCell.style = 'font-size: 40px;'
            } else {
                needToAdd = false;
            }
        } else if (addedSpeakers[addedSpeakers.length-1].name == politicianName) {
            if (speakersCountDown == (addedSpeakers[addedSpeakers.length - 1].numYears-1)) {
                taxChangeCell.rowSpan = addedSpeakers[addedSpeakers.length-1].numYears;
                if (politicianTaxChange > 0) {
                    text1 = document.createTextNode('+' + politicianTaxChange);
                } else {
                    text1 = document.createTextNode(politicianTaxChange);
                }
                taxChangeCell.style = 'font-size: 40px;'
            } else {
                needToAdd = false;
            }
        } else if (addedSenate[addedSenate.length-1].name == politicianName) {
            if (senateCountDown == (addedSenate[addedSenate.length - 1].numYears-1)) {
                taxChangeCell.rowSpan = addedSenate[addedSenate.length-1].numYears;
                if (politicianTaxChange > 0) {
                    text1 = document.createTextNode('+' + politicianTaxChange);
                } else {
                    text1 = document.createTextNode(politicianTaxChange);
                }
                taxChangeCell.style = 'font-size: 40px;'
            } else {
                needToAdd = false;
            }
        } else if (i != taxRates.length) {
            var taxChange = (taxRates[taxRates.length-i] - taxRates[taxRates.length-i-1]).toFixed(1);
            addedPresidents[addedPresidents.length-1].taxChange += Number(taxChange);
            addedSpeakers[addedSpeakers.length-1].taxChange += Number(taxChange);
            addedSenate[addedSenate.length-1].taxChange += Number(taxChange);
            var backgroundStyle;
            var taxChangeIntensity = Math.pow(Math.pow(Math.pow((taxRates[taxRates.length-i] - taxRates[taxRates.length-i-1]),4),0.4)/(Number(taxRates[taxRates.length-i]) + Number(taxRates[taxRates.length-i-1])),0.25);
            if (Math.sign(Number(taxChange)) == 1) {
                backgroundStyle = 'background-color: rgba(255,0,0,' + taxChangeIntensity*taxChangeIntensity + ');';
                if ((40*taxChangeIntensity > 29) && (Number(taxChange) >= 10)) {
                    text1 = document.createTextNode('+' + Number(taxChange).toFixed(0));
                } else {
                    text1 = document.createTextNode('+' + taxChange);
                }
            } else {
                backgroundStyle = 'background-color: rgba(0,255,0,' + taxChangeIntensity*taxChangeIntensity + ');';
                if ((40*taxChangeIntensity > 29) && (Math.abs(Number(taxChange)) >= 10)) {
                    text1 = document.createTextNode(Number(taxChange).toFixed(0));
                } else {
                    text1 = document.createTextNode(taxChange);
                }
            }
            taxChangeCell.style = backgroundStyle + 'font-size: ' + (40*taxChangeIntensity).toFixed(0) + 'px;';
        } else {
            text1 = document.createTextNode('No Data');
        }
        if (needToAdd) {
            taxChangeCell.appendChild(text1);
            rowToAdd.appendChild(taxChangeCell);
        }

        // Add relative tax rate change
        var relativeTaxChangeCell = document.createElement('td');
        relativeTaxChangeCell.colSpan = '7';
        var text2;
        var needToAdd2 = true;
        if (addedPresidents[addedPresidents.length-1].name == politicianName) {
            if (presidentsCountDown == (addedPresidents[addedPresidents.length - 1].numYears-1)) {
                relativeTaxChangeCell.rowSpan = addedPresidents[addedPresidents.length-1].numYears;
                if (politicianRelativeChange > 0) {
                    text2 = document.createTextNode('+' + politicianRelativeChange);
                } else {
                    text2 = document.createTextNode(politicianRelativeChange);
                }
                relativeTaxChangeCell.style = 'font-size: 40px;'
            } else {
                needToAdd2 = false;
            }
        } else if (addedSpeakers[addedSpeakers.length-1].name == politicianName) {
            if (speakersCountDown == (addedSpeakers[addedSpeakers.length - 1].numYears-1)) {
                relativeTaxChangeCell.rowSpan = addedSpeakers[addedSpeakers.length-1].numYears;
                if (politicianRelativeChange > 0) {
                    text2 = document.createTextNode('+' + politicianRelativeChange);
                } else {
                    text2 = document.createTextNode(politicianRelativeChange);
                }
                relativeTaxChangeCell.style = 'font-size: 40px;'
            } else {
                needToAdd2 = false;
            }
        } else if (addedSenate[addedSenate.length-1].name == politicianName) {
            if (senateCountDown == (addedSenate[addedSenate.length - 1].numYears-1)) {
                relativeTaxChangeCell.rowSpan = addedSenate[addedSenate.length-1].numYears;
                if (politicianRelativeChange > 0) {
                    text2 = document.createTextNode('+' + politicianRelativeChange);
                } else {
                    text2 = document.createTextNode(politicianRelativeChange);
                }
                relativeTaxChangeCell.style = 'font-size: 40px;'
            } else {
                needToAdd2 = false;
            }
        } else if (i != taxRates.length && i != 1) {
            var taxChange = (taxRates[taxRates.length-i] - taxRates[taxRates.length-i-1]*relativeTaxChangeRatio[relativeTaxChangeRatio.length - i]).toFixed(1);
            addedPresidents[addedPresidents.length-1].relativeChange += Number(taxChange);
            addedSpeakers[addedSpeakers.length-1].relativeChange += Number(taxChange);
            addedSenate[addedSenate.length-1].relativeChange += Number(taxChange);
            var backgroundStyle;
            var taxChangeIntensity = Math.pow(Math.pow(Math.pow((taxChange),4),0.4)/(Number(taxRates[taxRates.length-i]) + Number(taxRates[taxRates.length-i-1]*relativeTaxChangeRatio[relativeTaxChangeRatio.length - i])),0.25);
            if (Math.sign(Number(taxChange)) == 1) {
                backgroundStyle = 'background-color: rgba(255,0,0,' + taxChangeIntensity*taxChangeIntensity + ');';
                if ((40*taxChangeIntensity > 29) && (Number(taxChange) >= 10)) {
                    text2 = document.createTextNode('+' + Number(taxChange).toFixed(0));
                } else {
                    text2 = document.createTextNode('+' + taxChange);
                }
            } else {
                backgroundStyle = 'background-color: rgba(0,255,0,' + taxChangeIntensity*taxChangeIntensity + ');';
                if ((40*taxChangeIntensity > 29) && (Math.abs(Number(taxChange)) >= 10)) {
                    text2 = document.createTextNode(Number(taxChange).toFixed(0));
                } else {
                    text2 = document.createTextNode(taxChange);
                }
            }
            relativeTaxChangeCell.style = backgroundStyle + 'font-size: ' + (40*taxChangeIntensity).toFixed(0) + 'px;';
        } else {
            text2 = document.createTextNode('No Data');
        }
        if (needToAdd2) {
            relativeTaxChangeCell.appendChild(text2);
            rowToAdd.appendChild(relativeTaxChangeCell);
        }

        // Add relevant legislation
        var lawCell = document.createElement('td');
        lawCell.colSpan = '12';
        if (relevantLegislation[taxRates.length-i].isLaw) {
            var lawLink = document.createElement('a');
            lawLink.href = relevantLegislation[taxRates.length-i].articleLink;
            linkText = document.createTextNode(relevantLegislation[taxRates.length-i].descript);
            lawLink.appendChild(linkText);
            lawCell.appendChild(lawLink);
        }
        rowToAdd.appendChild(lawCell);

        tableOfTaxes.appendChild(rowToAdd);
    }
}

function changeTable(politicianName) {
    addRows('');
    while (tableOfTaxes.rows.length > 1) {
        tableOfTaxes.deleteRow(1);
    }
    addRows(politicianName);
    return false;
};

