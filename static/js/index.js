
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

  //4. Update DOM
  let elements = getDOMElements()
  elements.infected.append('p').text(totalInfected);
  elements.deaths.append('p').text(totalDeaths);
  elements.countries.append('p').text(totalCountries)
  animateValue("total-infected-number", 25000, totalInfected, 0);
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

function infectionRate(obj) {
  /// This function takes in the api/date object
  /// and calculates the infection rate per day.
  /// The data is then used to create a Plotly chart
  /// tracking the infection rate

  // Format the data
  // infectionRate = infections / Day

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
  // get infections
  let infections = obj.map(infections => {
      let totals = infections.total_confirmed + infections.total_recovered + infections.total_deaths;
      return totals;
  })
  // get infection rate
  let infectionRate = [];
  let rate;
  for (var i=0; i < infections.length; i++) {
    if (i === 0) {
      rate = infections[i]
      infectionRate.push(rate);
    } else {
      rate = infections[i] - infections[i - 1]
      infectionRate.push(rate);
    }
  }
  // plot data

  let trace1 = {
    x: dates,
    y: infectionRate,
    line: {
      color: 'limegreen',
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
      gridcolor: '#7A7A7A '},
    yaxis: {
      dtick: 2000,
      showgrid: false},
    title: "Infection Rate",
    autosize: true,
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 50,
      pad: 4
    }
  }
  Plotly.newPlot('upper-left-chart', [trace1], layout )
};

function infectionByRegion(obj) {
  /// This function takes in the api/date object
  /// and calculates the infection rate per day.
  /// The data is then used to create a Plotly chart
  /// tracking the infection rate
  console.log(obj);
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
      showgrid: false},
    yaxis: {
      // dtick: 300,
      showgrid: false},
    title: "Total Infections",
    showlegend:true,
    legend: {
      x: 0.1,
      y: 1,
      traceorder: 'normal',
    }
}
  Plotly.newPlot('upper-right-chart', [trace1, trace2], layout )
};


=======

>>>>>>> ad06360c2dd1d5f56a3327086fc9e8b9bc74fa75

  Plotly.newPlot('upper-left-chart', [trace1], layout , {responsive: true})




};


// Load Data then call functions...

d3.json('http://127.0.0.1:5000/api/date').then(function(result,error) {

  // Update Total Counts
  totalCounts(result);
  // Update the Last Updated Value
  lastUpdated(result);
  // Create infection rate chart
  infectionRate(result);
  // Create infection by region chart
  infectionByRegion(result);
})
