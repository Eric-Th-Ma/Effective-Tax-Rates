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
    var taxesStartYear = 1987;
    var yearsDollarValue = [0.437,0.452,0.471,0.493,0.520,0.542,0.559,0.575,0.590,0.607,0.625,0.639,0.649,0.663,0.686,0.705,0.716,0.733,0.752,0.778,0.803,0.826,0.857,0.854,0.869,0.896,0.914,0.928,0.943,0.944,0.956,0.976,1]; // 2002 - 2019
    var yearsTaxData = [
        // Within each tax bracket we have the tax bracket size and rate [size,rate]
        // ovarall we have [standard deduction, personal exemption, lowest tax bracket ... highest tax bracket]
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
    makePlot("incomeTaxGraph",taxRates,years,("Income tax by year for people making: " + income));
}

function makePlot(elementID,data,labels,title) {
    var barChartData = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Effective Tax Rate",
                backgroundColor: "navy",
                data: data,
                hidden: false,
                borderWidth: 4,
                borderColor: 'black',
                pointRadius: 1,
                lineTension: 0
                }]
            },
        options: {
            legend: {display:false},
            title: {display:true, text:title},
            responsive:true,
            scales: {yAxes: [{ ticks: {beginAtZero:true,  suggestedMax: 50 }}]}
            }
        }        
    //barChartData.datasets[0].bars[5].backgroundColor = "red".
    Chart.defaults.global.defaultColor = 'rgba(0, 100, 0, 0.9)';
    myBarChart = new Chart(document.getElementById(elementID),barChartData);
};