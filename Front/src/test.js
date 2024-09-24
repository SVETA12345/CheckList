anychart.onDocumentReady(function () {
  
    // create a column chart
    var chart = anychart.column();
  
    // create a data set
    var dataSet = anychart.data.set([
      ["Virat Kohli", "India", "148", "100", "48"],
      ["Max O'Dowd", "Netherlands", "106", "88", "48"],
      ["Suryakumar Yadav", "India", "81", "104", "54"],
      ["JD Butler", "England", "87", "96", "42"],
      ["Kusal Mendis", "Sri Lanka", "95", "68", "60"],
      ["Sikandar Raza", "Zimbabwe", "89", "64", "66"],
      ["Pathum Nissanka", "Sri Lanka", "114", "52", "48"],
      ["AD Hales", "England", "76", "76", "60"],
      ["Lorkan Tucker", "Ireland", "104", "76", "24"],
      ["Glenn Phillips", "New Zealand", "77", "76", "48"]
    ]);
  
    // map the data
    var firstSeriesData = dataSet.mapAs({x: 0, value: 4});
    var secondSeriesData = dataSet.mapAs({x: 0, value: 3});
    var thirdSeriesData = dataSet.mapAs({x: 0, value: 2});
  
    // create the series
    var series;
    firstSeries = chart.column(firstSeriesData);
    secondSeries = chart.column(secondSeriesData);
    thirdSeries = chart.column(thirdSeriesData);
  
    // stack values on the y scale
    chart.yScale().stackMode("value");
    
    // add axis titles
    chart.xAxis().title("Batsman");
    chart.yAxis().title("Number of runs");
    
    // add a chart title
    chart.title("Top 10 Run Scorers at ICC Men's T20 World Cup 2022");
  
    // set the container element
    chart.container("container");
  
    // display the chart
    chart.draw();
    
  });