//import { initialEnergyAvg } from "./bimviewer.js";
import { convertToObj } from "./overlay.js";


export function energygraph(dataLabels, dataValues) {
  // var x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  // var y = [28.8, 28.5, 37, 56.8, 69.7, 79.7, 78.5, 77.8, 74.1, 62.6, 45.3, 39.9];
  let data = [
    {
      x: dataLabels,
      y: dataValues,
      type: "scatter",
    },
  ];

  var layout = {
    //   xaxis: {
    //     tickmode: "array", // If "array", the placement of the ticks is set via `tickvals` and the tick text is `ticktext`.
    //     tickvals: dataValues,
    //     ticktext: dataLabels
    //   }
  };

  //document.appendChild(energyplot)

  return Plotly.newPlot("energy-plot", data, layout); // DOM node or string id of a DOM node
}

export function boxplot_graph(
  datalabels,
  dataValues,
  title,
  htmlelem,
  width,
  height
) {
  //need to be already in the correct order // add 'title', 'yaxis' and htmlelem id as param inputs, only need this function
  //var y0 = []; //JSON.parse(dataValues); //not the right datatype - string??? convert how?

  let datas = [];

  for (let i = 0; i < datalabels.length; i++) {
    let trace = {
      y: dataValues[i],
      type: "box",
      name: datalabels[i],
      boxmean: true,
      boxpoints: false,
    };

    datas.push(trace);
  }

  let layoutBox = {
    title: title,
    yaxis: {
      title: "energy consumption intensity (kWh/ft2/yr)",
    },
    width: width,
    height: height,
    paper_bgcolor:'rgba(0,0,0,0)', 
    plot_bgcolor:'rgba(0,0,0,0)'
  };

  // var myPlot = htmlelem,
  //   data = datas,
  //   layout = layoutBox;

  Plotly.newPlot(htmlelem, datas, layoutBox); //return?

  //how to get div element?
  // let plotlyhtml = Plotly.offline.plot(data, include_plotlyjs=False, output_type='div')

  // myPlot.on("plotly_legendclick", function (data) {
  //   console.log("plotyl event");
  // });
}

export function benchmarkGauge(initialavg, average, min, max, htmlelem) {

  var data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: average, //the actual value
      title: { text: "Benchmark comparison" },
      type: "indicator",
      mode: "gauge+number+delta",
      number: {suffix: " kWh/ft2/yr"}, //use html here to format this
      delta: { reference: initialavg  }, //the initial value
      gauge: { axis: { range: [min, max] } }
    }
  ];
  
  var layout = { width: 600, height: 400 };
  Plotly.newPlot(htmlelem, data, layout);

}

//replace  / delete this function
function createDropdownButton(labelInput, labelText, optionValues) { //onclick button, need to send event back to server to query again, and get the data back... (where to do this?)

  const label = document.createElement("label");
  label.for = labelInput;
  label.innerText = labelText;

  const select = document.createElement("select");
  select.name = labelInput;
  select.id = labelInput;

  for (let optionValue of optionValues) {
    const option = document.createElement("option");
    option.value = optionValue;
    option.innerText = optionValue;
    select.appendChild(option);
  }

  let dropdownDiv = document.createElement("div");

  dropdownDiv.appendChild(label);
  dropdownDiv.appendChild(select);

  return dropdownDiv

}

function createDropdownMulti (htmlElemId, optionValues) {

  const select = document.createElement("select");
  select.id = htmlElemId;
  select.multiple = "multiple";

  for (let optionValue of optionValues) {
    const option = document.createElement("option");
    option.value = optionValue;
    option.innerText = optionValue;
    select.appendChild(option);
  }

  return select
}

export function createEnergyPlots() { //energy sidebar
  //function in overlay.js
  //document.getElementById("energy-menu").appendChild(energygraph())
  let energymenu = document.getElementById("energy-menu");

  // const myDiv = document.createElement("div");
  // myDiv.id = "myDiv";
  // energymenu.appendChild(myDiv);

  const benchmarkplot = document.createElement("div");
  //benchmarkplot.className = "energy-plot";
  benchmarkplot.id = "benchmark-plot";
  benchmarkplot.className = "benchmark-plot";

  energymenu.appendChild(benchmarkplot); //needs to be in separate div and not scroll?

//call create the dropdown buttons here

  // let dropdownDiv1 = createDropdownButton("labelInput", "labelText", ["option 1", "option2"])
  // energymenu.appendChild(dropdownDiv1);

  // let dropdownDiv2 = createDropdownButton("labelInput", "labelText", ["option 1", "option2"])
  // energymenu.appendChild(dropdownDiv2);

  // let dropdownDiv3 = createDropdownButton("labelInput", "labelText", ["option 1", "option2"])
  // energymenu.appendChild(dropdownDiv3);

  // let selectTest = createDropdownMulti("example-getting-started", ["option1", "option2"]);
  // energymenu.appendChild(selectTest);



  const orientationplot = document.createElement("div");
  orientationplot.className = "energy-plot";
  orientationplot.id = "orientation-plot";

  energymenu.appendChild(orientationplot);

  const wwrplot = document.createElement("div");
  wwrplot.className = "energy-plot";
  wwrplot.id = "wwr-plot";

  energymenu.appendChild(wwrplot);

  const wallplot = document.createElement("div");
  wallplot.className = "energy-plot";
  wallplot.id = "wall-plot";

  energymenu.appendChild(wallplot);

  const roofplot = document.createElement("div");
  //roofplot.className = ""
  roofplot.id = "roof-plot";

  energymenu.appendChild(roofplot);

  const windowplot = document.createElement("div");
  windowplot.id = "window-plot";

  energymenu.appendChild(windowplot);

  const infplot = document.createElement("div");
  infplot.id = "inf-plot";

  energymenu.appendChild(infplot);

  const plugplot = document.createElement("div");
  plugplot.id = "plug-plot";

  energymenu.appendChild(plugplot);

  const hvachplot = document.createElement("div");
  hvachplot.id = "hvac-h-plot";

  energymenu.appendChild(hvachplot);

  const hvaccplot = document.createElement("div");
  hvaccplot.id = "hvac-c-plot";

  energymenu.appendChild(hvaccplot);

  const pvplot = document.createElement("div");
  pvplot.id = "pv-plot";

  energymenu.appendChild(pvplot);
}

export function updateGraph(htmlElemId, initialEnergyAvg) {
    //function that takes in element id, and returns median, avg etc..
  //create object to track the status of the legend
  let roofKeys = Object.keys(document.getElementById(htmlElemId).data) //array of keys
  let roofStatusArray = [];
  

  for (let key in roofKeys) //foreach./
  {
    roofStatusArray.push(true);
  }

  let roofLegendObj = convertToObj(roofKeys, roofStatusArray);
  //console.log(roofLegendObj)

  document.getElementById(htmlElemId).on("plotly_legendclick", function (data) { //how to deal with double click? - can disable while not working

    //also need to remove BIM category (the last one)

    //use map/object {index: active(on/off)}
    //1.get the indexes of the data from .data
    //on click, get the index = index from object - on/off invert //data.curveNumber = index (from obj), active = !active

    for (let key in Object.keys(roofLegendObj)) {
      if (data.curveNumber.toString() === key)
      { 
        roofLegendObj[key] = !roofLegendObj[key]
        console.log(key, roofLegendObj[key]);
      }
    }

    console.log(roofLegendObj)

    let updatedPoints = [];

    //update the data here incl median etc? - get the data from object where true, update median, min max etc
    for (let key in Object.keys(roofLegendObj)){
      if (roofLegendObj[key] === true)
      {
        //need a new array with all the points from these categories, and calculate the metrics for it

        let updatedYPoints = document.getElementById(htmlElemId).data[key].y //array

        updatedPoints.push(updatedYPoints) //replot everything with this dataset - how is everything plotted?

      }
    }

    let updatedPointsFlat = updatedPoints.flat();

    //sort merge, min max etc


    console.log("initial avg:" + initialEnergyAvg);
    console.log("median: " + median(updatedPointsFlat));
    console.log("average: " + avg(updatedPointsFlat));
    console.log("min: " + Math.min.apply(Math, updatedPointsFlat))
    console.log("max: " + Math.max.apply(Math, updatedPointsFlat))
    console.log(document.getElementById(htmlElemId).id) //returns which graph has been changed


    //update the gauge? - instead of initial avg should be previous avg
    benchmarkGauge(initialEnergyAvg, avg(updatedPointsFlat) ,Math.min.apply(Math,updatedPointsFlat), Math.max.apply(Math, updatedPointsFlat), 'benchmark-plot'); //import initialenergyavg from bimviewer

    
    initialEnergyAvg = avg(updatedPointsFlat) //return this and call it in the function? recursive?
    console.log("updated previous avg: " + initialEnergyAvg)

   // return initialEnergyAvg //this needs to go across graphs - how?
})
}

//https://stackoverflow.com/questions/45309447/calculating-median-javascript

function median(numbers) {
  const sorted = Array.from(numbers).sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

//https://techformist.com/average-median-javascript/
function avg (numbers) {

  const arr = numbers.filter(val => !!val);
  const sum = arr.reduce((sum, val) => (sum += val));
  const len = numbers.length;

  return sum/len;

}