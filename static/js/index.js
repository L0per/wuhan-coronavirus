


function getDOMElements() {
  // This function gets DOM elements and returns them
  // to other functions for ease of use.

  const elements = {
    infected : d3.select('#total-infected-number'),
    deaths: d3.select('#total-deaths-number'),
    countries: d3.select('#total-countries-number'),
    lastUpdated: d3.select('#last-updated'),
    upperLeftChart: d3.select('#upper-left-chart')
  }

  return elements
};



function totalCounts(obj) {
  // This function will take in the api/date json object
  // and then display the total counters at the top of the page

  const latestDate = obj[obj.length - 1];

  // 1. Calculate total countries
  const totalInfected = latestDate.total_confirmed + latestDate.total_recovered + latestDate.total_deaths;

  //2. Calculate total deaths
  const totalDeaths = latestDate.total_deaths

  //3. Calculate total countries
  let countries = []
  let country;
  for (const property in latestDate.locations) {
    country = latestDate.locations[property].region;
    if (countries.includes(country)) {

    }else {
      countries.push(country)
    }
  }
  const totalCountries = countries.length

  let counterDif = totalInfected - 700;

  //4. Update DOM
  let elements = getDOMElements()
  elements.infected.append('p').text(totalInfected);
  elements.deaths.append('p').text(totalDeaths);
  elements.countries.append('p').text(totalCountries)
  animateValue("total-infected-number", counterDif, totalInfected, 0);
  animateValue("total-deaths-number", 0, totalDeaths, 3500);
  animateValue("total-countries-number", 0, totalCountries, 3500);

};

function animateValue(id, start, end, duration) {
    // This function animates the counters
    var range = end - start;
    var current = start;
    var increment = end > start? 1 : -1;
    var stepTime = Math.abs(Math.floor(duration / range));
    var obj = document.getElementById(id);
    var timer = setInterval(function() {
        current += increment;
        obj.innerHTML = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
};

function lastUpdated(obj) {
  // This function takes in the api/date Object
  // and calculates the last time the corona virus data was Updated.
  // It then updates the 'last-updated' section of the DOM
  let date;
  const latest = obj[obj.length -1]
  for (let [key, value] of Object.entries(latest.date)) {
    date = value
  };
  const dateObj = new Date(date);
  const elements = getDOMElements();
  elements.lastUpdated.append('p').text(`Last Updated: ${dateObj.toLocaleDateString()}`);
};

function highchartTotal(coronaData, sarsData) {
  
  // get total coronavirus infections
  let coronaInfections = coronaData.map(infections => {
    let totals = infections.total_confirmed + infections.total_recovered + infections.total_deaths;
    return totals;
  })
  
  // get total sars infections
  let sarsInfections = sarsData.map(infections => {
    let totals = infections.infected + infections.deaths;
    return totals;
  })

  // get days
  let days = [];
  for (var i=0; i < sarsInfections.length; i++) {
    days.push(i)
  }

  Highcharts.chart('upper-left-chart', {

    title: {
        text: 'Total Infections'
    },

    subtitle: {
        text: '2019-nCoV vs. SARS'
    },

    yAxis: {
        title: {
            text: 'Infected'
        }
    },

    xAxis: {
      title: {
          text: 'Days Since Outbreak'
      }
    },

    tooltip: {
      shared: true,
      useHTML: true,
      headerFormat: '<small>Day {point.key}</small><table>',
      pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' +
      '<td style="text-align: right"><b>{point.y}</b></td></tr>',
      footerFormat: '</table>',
    },

    legend: {
        enabled: false
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: 1
        }
    },

    series: [{
        name: '2019-nCoV',
        data: coronaInfections
    }, {
        name: 'SARS',
        data: sarsInfections
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    enabled: false
                }
            }
        }]
    }

  });

}

function totalcountsChart(obj) {

  // get latest date
  let latestDate = obj[obj.length - 1];

  // 1. Calculate total countries
  let totalConfirmed = latestDate.total_confirmed/100;
  let totalRecovered = latestDate.total_recovered/100; 
  let totalDeaths = latestDate.total_deaths/100;

  Highcharts.chart('highchartstest', {

    chart: {
        type: 'item',
        height: 200,
        width:1000
    },

    title: {
        text: 'Highcharts item chart'
    },

    legend: {
        labelFormat: '{name} <span style="opacity: 0.4">{y}{totalConfirmed}</span>'
    },

    tooltip: {
      useHTML: true,
      headerFormat: '<small>{point.key}</small><table>',
      pointFormat: '<tr>' +
      '<td style="text-align: right"><b>{point.y} x 100</b></td></tr>',
      footerFormat: '</table>',
    },

    series: [{
        name: 'Representatives',
        layout: 'horizontal',
        data: [{
            name: 'Confirmed',
            y: totalConfirmed,
            marker: {
                symbol: 'url(https://i.ibb.co/Fshdn65/person-red.png)'
            },
            color: '#F23A2F'
        }, {
            name: 'Recovered',
            y: totalRecovered,
            marker: {
                symbol: 'url(https://i.ibb.co/jLTNVN1/person-green.png)'
            },
            color: '#17FF00'
        }, {
          name: 'Dead',
          y: totalDeaths,
          marker: {
              symbol: 'url(https://i.ibb.co/3p8Z91D/person-grey.png)'
          },
          color: '#8C8C8C'
      }]
    }]

});

}

// function infectionRate(obj) {
//   /// This function takes in the api/date object
//   /// and calculates the infection rate per day.
//   /// The data is then used to create a Plotly chart
//   /// tracking the infection rate

//   // Format the data
//   // infectionRate = infections / Day

//   //get days
//   let parseDate = d3.timeFormat("%Y-%m-%d")
//   let date;
//   let dates;
//   dates = obj.map(date => {
//     for (let [key, value] of Object.entries(date.date)) {
//       date = new Date(value)

//       return parseDate(date)
//     };

//   })
//   // get infections
//   let infections = obj.map(infections => {
//       let totals = infections.total_confirmed + infections.total_recovered + infections.total_deaths;
//       return totals;
//   })
//   // get infection rate
//   let infectionRate = [];
//   let rate;
//   for (var i=0; i < infections.length; i++) {
//     if (i === 0) {
//       rate = infections[i]
//       infectionRate.push(rate);
//     } else {
//       rate = infections[i] - infections[i - 1]
//       infectionRate.push(rate);
//     }
//   }
//   // plot data

//   let trace1 = {
//     x: dates,
//     y: infectionRate,
//     line: {
//       color: 'limegreen',
//       width: 2
//     }
//   }
//   let layout = {
//     paper_bgcolor:'rgba(0,0,0,0)',
//     plot_bgcolor:'rgba(0,0,0,0)',
//     font: {
//         family:"Courier New, monospace",
//         size:18,
//         color:"white"
//     },
//     xaxis: {
//       autotick: false,
//       showgrid: true,
//       gridwidth: 1,
//       gridcolor: '#7A7A7A '},
//     yaxis: {
//       dtick: 1000,
//       showgrid: false},
//     title: "Infection Rate",
//     autosize: true,
//     margin: {
//       l: 50,
//       r: 50,
//       b: 50,
//       t: 50,
//       pad: 4
//     }
//   }
//   Plotly.newPlot('upper-left-chart', [trace1], layout, {responsive: true, displayModeBar: false})
// };

function infectionByRegion(obj) {
  /// This function takes in the api/date object
  /// and calculates the infection rate per day.
  /// The data is then used to create a Plotly chart
  /// tracking the infection rate
  
  // Format the data

  //get days
  let parseDate = d3.timeFormat("%Y-%m-%d")
  let date;
  let dates;
  dates = obj.map(date => {
    for (let [key, value] of Object.entries(date.date)) {
      date = new Date(value)

      return parseDate(date)
    };

  })

  // get infections by region
  let china = [];
  let notChina = [];
  let country, cases, sum;
  let countries = obj.map(data => {
    let chinaSum = 0;
    let notChinaSum = 0;
    for (const property in data.locations) {
      country = data.locations[property].region;
      if (country === "Mainland China") {
        sum = data.locations[property].confirmed + data.locations[property].deaths + data.locations[property].recovered;
        chinaSum += sum;
      }else {
        sum = data.locations[property].confirmed + data.locations[property].deaths + data.locations[property].recovered;
        notChinaSum += sum;

      }

    }
    notChina.push(notChinaSum);
    china.push(chinaSum);

  })


  let trace1 = {
    x: dates,
    y: china,
    name: "Mainland China",
    line: {
      color: 'orange',
      width: 2
    }
  }
  let trace2 = {
    x: dates,
    y: notChina,
    name: "World",
    line: {
      color: '#ff00cc',
      width: 2
    }
  }
  let layout = {
    paper_bgcolor:'rgba(0,0,0,0)',
    plot_bgcolor:'rgba(0,0,0,0)',
    font: {
        family:"Courier New, monospace",
        size:18,
        color:"white"
    },
    xaxis: {
      autotick: false,
      showgrid: true,
      gridwidth: 1,
      gridcolor: '#7A7A7A'},
    yaxis: {
      showgrid: false},
    title: "Total Infections",
    showlegend:true,
    legend: {
      x: 0.1,
      y: 1,
      traceorder: 'normal',
    },
    autosize: true,
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 50,
      pad: 4
    }
}
  Plotly.newPlot('upper-right-chart', [trace1, trace2], layout, {responsive: true, displayModeBar: false})
};

function comparisonInfectionChart(coronaData, sarsData) {

  let coronaInfections = coronaData.map(infections => {
      let totals = infections.total_confirmed + infections.total_recovered + infections.total_deaths;
      return totals;
  })
  
  let sarsInfections = sarsData.map(infections => {
      let totals = infections.infected + infections.deaths;
      return totals;
  })
 

  let days = [];
  for (var i=0; i < sarsInfections.length; i++) {
    days.push(i)
  }


  let trace1 = {
    x: days,
    y: coronaInfections,
    name: "Coronavirus",
    line: {
      color: 'orange',
      width: 2
    }
  }
  let trace2 = {
    x: days,
    y: sarsInfections,
    name: "SARS",
    line: {
      color: '#ff00cc',
      width: 2
    }
  }

  let layout = {
    paper_bgcolor:'rgba(0,0,0,0)',
    plot_bgcolor:'rgba(0,0,0,0)',
    font: {
        family:"Courier New, monospace",
        size:18,
        color:"white"
    },
    xaxis: {
      autotick: true,
      showgrid: true,
      tickmode: 'linear',
      tick0: 0,
      dtick: 10,
      gridwidth: 1,
      gridcolor: '#7A7A7A'},
    yaxis: {
      showgrid: false},
    title: "Total Infections",
    showlegend:true,
    legend: {
      x: 0.1,
      y: 1,
      traceorder: 'normal',
    },
    autosize: true,
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 50,
      pad: 4
    }
}



  Plotly.newPlot('lower-left-chart', [trace1, trace2], layout, {responsive: true, displayModeBar: false})
}

function comparisonDeathChart(coronaData, sarsData) {

  let coronaInfections = coronaData.map(infections => infections.total_deaths);

  let sarsInfections = sarsData.map(infections => infections.deaths);

  let days = [];
  for (var i=0; i < sarsInfections.length; i++) {
    days.push(i)

  }


  let trace1 = {
    x: days,
    y: coronaInfections,
    name: "Coronavirus",
    line: {
      color: 'orange',
      width: 2
    }
  }
  let trace2 = {
    x: days,
    y: sarsInfections,
    name: "SARS",
    line: {
      color: '#ff00cc',
      width: 2
    }
  }

  let layout = {
    paper_bgcolor:'rgba(0,0,0,0)',
    plot_bgcolor:'rgba(0,0,0,0)',
    font: {
        family:"Courier New, monospace",
        size:18,
        color:"white"
    },
    xaxis: {
      autotick: true,
      showgrid: true,
      tickmode: 'linear',
      tick0: 0,
      dtick: 10,
      gridwidth: 1,
      gridcolor: '#7A7A7A'},
    yaxis: {
      showgrid: false},
    title: "Total Deaths",
    showlegend:true,
    legend: {
      x: 0.1,
      y: 1,
      traceorder: 'normal',
    },
    autosize: true,
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 50,
      pad: 4
    }
}



  Plotly.newPlot('lower-right-chart', [trace1, trace2], layout, {responsive: true, displayModeBar: false})
}

// Load Data then call functions...

d3.json('http://127.0.0.1:5000/api/date').then(function(result,error) {

  let coronaData = result
  // Update Total Counts
  totalCounts(coronaData);
  totalcountsChart(coronaData)
  // Update the Last Updated Value
  lastUpdated(coronaData);
  // Create infection rate chart
  // infectionRate(coronaData);
  // Create infection by region chart
  infectionByRegion(coronaData);

  d3.json('http://127.0.0.1:5000/api/sars').then(function(result,error) {
    let sarsData = result

    comparisonInfectionChart(coronaData, sarsData);
    comparisonDeathChart(coronaData, sarsData);
    highchartTotal(coronaData, sarsData);
  })
})

// highcharts theme
Highcharts.theme = {
  lang: {
    thousandsSep: ','
  },
  colors: ['red', '#08d9d6', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
      '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
  chart: {
      backgroundColor: 'rgba(26, 26, 26)',
      style: {
          fontFamily: '\'Unica One\', sans-serif'
      },
      plotBorderColor: '#606063'
  },
  title: {
      style: {
          color: '#E0E0E3',
          textTransform: 'uppercase',
          fontSize: '20px'
      }
  },
  subtitle: {
      style: {
          color: '#E0E0E3',
          textTransform: 'uppercase'
      }
  },
  xAxis: {
      gridLineColor: '#707073',
      labels: {
          style: {
              color: '#E0E0E3'
          }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      title: {
          style: {
              color: '#A0A0A3'
          }
      }
  },
  yAxis: {
      gridLineColor: '#707073',
      labels: {
          style: {
              color: '#E0E0E3'
          }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      tickWidth: 1,
      title: {
          style: {
              color: '#A0A0A3'
          }
      }
  },
  tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      style: {
          color: '#F0F0F0'
      }
  },
  plotOptions: {
      series: {
          dataLabels: {
              color: '#F0F0F3',
              style: {
                  fontSize: '13px'
              }
          },
          marker: {
              lineColor: '#333'
          }
      },
      boxplot: {
          fillColor: '#505053'
      },
      candlestick: {
          lineColor: 'white'
      },
      errorbar: {
          color: 'white'
      }
  },
  legend: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      itemStyle: {
          color: '#E0E0E3'
      },
      itemHoverStyle: {
          color: '#FFF'
      },
      itemHiddenStyle: {
          color: '#606063'
      },
      title: {
          style: {
              color: '#C0C0C0'
          }
      }
  },
  credits: {
      style: {
          color: '#666'
      }
  },
  labels: {
      style: {
          color: '#707073'
      }
  },
  drilldown: {
      activeAxisLabelStyle: {
          color: '#F0F0F3'
      },
      activeDataLabelStyle: {
          color: '#F0F0F3'
      }
  },
  navigation: {
      buttonOptions: {
          symbolStroke: '#DDDDDD',
          theme: {
              fill: '#505053'
          }
      }
  },
  // scroll charts
  rangeSelector: {
      buttonTheme: {
          fill: '#505053',
          stroke: '#000000',
          style: {
              color: '#CCC'
          },
          states: {
              hover: {
                  fill: '#707073',
                  stroke: '#000000',
                  style: {
                      color: 'white'
                  }
              },
              select: {
                  fill: '#000003',
                  stroke: '#000000',
                  style: {
                      color: 'white'
                  }
              }
          }
      },
      inputBoxBorderColor: '#505053',
      inputStyle: {
          backgroundColor: '#333',
          color: 'silver'
      },
      labelStyle: {
          color: 'silver'
      }
  },
  navigator: {
      handles: {
          backgroundColor: '#666',
          borderColor: '#AAA'
      },
      outlineColor: '#CCC',
      maskFill: 'rgba(255,255,255,0.1)',
      series: {
          color: '#7798BF',
          lineColor: '#A6C7ED'
      },
      xAxis: {
          gridLineColor: '#505053'
      }
  },
  scrollbar: {
      barBackgroundColor: '#808083',
      barBorderColor: '#808083',
      buttonArrowColor: '#CCC',
      buttonBackgroundColor: '#606063',
      buttonBorderColor: '#606063',
      rifleColor: '#FFF',
      trackBackgroundColor: '#404043',
      trackBorderColor: '#404043'
  }
};

// apply the theme
Highcharts.setOptions(Highcharts.theme);


