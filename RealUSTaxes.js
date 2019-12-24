var incomeTaxLineChart;
var linesOnChart = 0;
var clearButton = document.getElementById("clear");
clearButton.style.display = "none";
var graphRender = document.getElementById("incomeTaxGraph");
graphRender.style.display = "none";
var presidency = document.getElementById("presidency overlay");
presidency.style.display = "none";
var congress = document.getElementById("congress overlay");
congress.style.display = "none";
var congressControl = ['D','D','D','D','M','M','M','M','M','M','D','D','D','D','D','D','D','D','R','R','R','R','R','R','R','R','R','R','R','R','D','D','D','D','M','M','M','M','R','R','R','R','M'];
var presidencyControl = ['D','D','D','D','R','R','R','R','R','R','R','R','R','R','R','R','D','D','D','D','D','D','D','D','R','R','R','R','R','R','R','R','D','D','D','D','D','D','D','D','R','R','R'];

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
    var income = document.incomeReader.income.value * 1000;
    var taxesStartYear = 1977;
    var yearsDollarValue = [0.2267,0.2413,0.2597,0.2890,0.3280,0.3620,0.3843,0.3965,0.4138,0.4284,0.437,0.452,0.471,0.493,0.520,0.542,0.559,0.575,0.590,0.607,0.625,0.639,0.649,0.663,0.686,0.705,0.716,0.733,0.752,0.778,0.803,0.826,0.857,0.854,0.869,0.896,0.914,0.928,0.943,0.944,0.956,0.976,1]; // 2002 - 2019
    // personal exemptions: https://www.taxpolicycenter.org/sites/default/files/legacy/taxfacts/content/pdf/historical_parameters.pdf
    // tax brackets: https://taxfoundation.org/us-federal-individual-income-tax-rates-history-1913-2013-nominal-and-inflation-adjusted-brackets/
    // standard deduction: https://en.wikipedia.org/wiki/Standard_deduction
    var yearsTaxData = [
        // Within each tax bracket we have the tax bracket size and rate [size,rate]
        // ovarall we have [standard deduction, personal exemption, lowest tax bracket ... highest tax bracket]
        // [[2540,0],[600,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1953
        // [[2540,0],[600,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1954
        // [[2540,0],[600,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1955
        // [[2540,0],[600,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1956
        // [[2540,0],[600,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1957
        // [[2540,0],[600,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1958
        // [[2540,0],[600,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1959
        // [[2540,0],[600,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1960
        // [[2540,0],[600,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1961
        // [[2540,0],[600,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1962
        // [[2540,0],[600,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1963
        // [[2540,0],[600,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1964
        // [[2540,0],[600,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1965
        // [[2540,0],[600,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1966
        // [[2540,0],[600,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1967
        // [[2540,0],[600,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1968
        // [[2540,0],[600,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1969
        // [[2540,0],[625,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1970
        // [[2540,0],[675,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1971
        // [[2540,0],[750,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1972
        // [[2540,0],[750,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1973
        // [[2540,0],[750,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1974
        // [[2540,0],[750,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1975
        // [[2540,0],[750,0],[1800,0.11],[15000, 0.15],[10200,0.28],[27000,0.35],[Number.MAX_SAFE_INTEGER,0.36]], // 1976
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
    var taxRates = [];
    for (i = 0; i < yearsTaxData.length; ++i) {
        let year = taxesStartYear + i;
        let taxRate = calculateTax((income * yearsDollarValue[i]), yearsTaxData[i]) / (income * yearsDollarValue[i]) * 100;
        years.push(year);
        taxRates.push(taxRate.toFixed(1));
    }
    if (linesOnChart != 0) {
        updatePlot(taxRates, ("Effective Tax Rate On " + income));
    } else {
        makePlot("incomeTaxGraph",taxRates,years,("Effective Tax Rate For Income Of " + income));
    }
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
                yAxisID: "line-notStacked",
                order: data[0]
                }]
            },
        options: {
            legend: {display:false},
            title: {display:true, text:"Effective Income Tax History"},
            responsive:true,
            scales: {yAxes: [{id: "line-notStacked", ticks: {beginAtZero:true,  suggestedMax: 70}, stacked: false}, 
                            {id: "bar-stacked", ticks: {beginAtZero:true,  suggestedMax: 70}, stacked: true, display: false}],
                     xAxes: [{stacked: true}]}
            }
        }        
    //barChartData.datasets[0].bars[5].backgroundColor = "red".
    Chart.defaults.global.defaultColor = 'rgba(0, 100, 0, 0.9)';
    incomeTaxLineChart = new Chart(document.getElementById(elementID),barChartData);
    clearButton.style.display = "block";
    graphRender.style.display = "block";
    congress.style.display = "inline-block";
    presidency.style.display = "inline-block";

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
        yAxisID: "line-notStacked",
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
    // var dataMax = [0]*(2019-1977);
    // for (dataYear of incomeTaxLineChart.data.datasets) {
    //     if (dataYear.data[0] > dataMax[0]) {
    //         dataMax = dataYear.data[0];
    //     }
    // }
    backgroundColors = [];
    backgroundColorsTwo = []
    data = [];
    dataTwo = [];
    var imgGOP = new Image();
    imgGOP.src = 'GOP.png';
    var ctx = document.getElementById('incomeTaxGraph').getContext('2d');
    var fillPatternGOP = ctx.createPattern(imgGOP, 'repeat');
    var imgDEM = new Image();
    imgDEM.src = 'DEM.png';
    var fillPatternDEM = ctx.createPattern(imgDEM, 'repeat');
    var imgSplit = new Image();
    imgSplit.src = 'Party-Split.png';
    var fillPatternSplit = ctx.createPattern(imgSplit, 'repeat');
    for (controlChar of controlYears) {
        if (controlChar == 'R') {
            backgroundColors.push('rgba(255, 0, 0, 0.25)');
            backgroundColorsTwo.push(fillPatternGOP);
        } else if (controlChar == 'D') {
            backgroundColors.push('rgba(0, 0, 255, 0.25)');
            backgroundColorsTwo.push(fillPatternDEM);
        } else {
            backgroundColors.push('rgba(164, 52, 235, 0.25)')
            backgroundColorsTwo.push(fillPatternSplit)
        }
        data.push(64);
        dataTwo.push(6);
    }
    var newData = {
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
};

