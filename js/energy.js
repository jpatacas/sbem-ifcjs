import { convertToObj } from "./overlay.js";

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
      title: "energy consumption intensity (kWh/m2/yr)",
    },
    width: width,
    height: height,
    paper_bgcolor:'rgba(0,0,0,0)', 
    plot_bgcolor:'rgba(0,0,0,0)'
  };

  Plotly.newPlot(htmlelem, datas, layoutBox); //return?


}

export function benchmarkGauge(initialavg, average, min, max, htmlelem) {

  var data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: average, //the actual value
      title: { text: "Benchmark comparison<br><span style='font-size:0.8em;color:gray'>kWh/m2/yr</span>" },
      type: "indicator",
      mode: "gauge+number+delta",
    //  number: {suffix: "<br><span style='font-size:3em;color:gray'>kWh/ft2/yr</span>"}, //use html here to format this
      delta: { reference: initialavg  }, //the initial value
      gauge: { axis: { range: [min, max] } }
    }
  ];
  
  var layout = { width: 600, height: 200 , margin: { t: 80, b: 25, l: 25, r: 25 }};
  Plotly.newPlot(htmlelem, data, layout);

}


function createDropdownMulti (htmlElemId, optionValues) {

  const select = document.createElement("select");
  select.id = htmlElemId;
  select.setAttribute("multiple", "multiple");
 // select.multiple = "multiple";
  select.size = "20"; //workaround - this should be changed, or change how to access the selected data in the dropdown

  for (let optionValue of optionValues) {
    const option = document.createElement("option");
    option.value = optionValue;
    option.innerText = optionValue;
    select.appendChild(option);
  }

  return select
}

//createdropdown button
export function createDropdownButton (column, htmlElemId, placeholder, vanillaElement) {

  //let energymenuheader = document.getElementById("energy-menu-header")
  //let toolbarFilter = document.getElementById("simple-card-container-energy-filter");
  //let toolbarFilter = document.getElementById("toolbar-filter-id");
  let toolbarFilter = document.getElementById("toolbar-dropdown-div");

  let selectDropdownMulti =  createDropdownMulti(htmlElemId, column ) ; //these params need to be input from python server
  //energymenuheader.appendChild(selectDropdownMulti);
  toolbarFilter.appendChild(selectDropdownMulti);

  let selectCarsMulti = new vanillaSelectBox(
    vanillaElement,
        {
      "placeHolder": placeholder,
      
    // "maxSelect":3,
    // "translations": { "all": "All", "items": "Cars" } //not sure what this is for 
        });

  return selectCarsMulti
}



export function createEnergyMenuHeader() {

  let energymenu = document.getElementById("energy-menu");

  const energymenuheader = document.createElement("div");
  energymenuheader.id = "energy-menu-header";
  energymenuheader.className = "energy-menu-header";

  energymenu.appendChild(energymenuheader);
}

export function createToolbarFilter() {
  const cardContainer = document.createElement("div");
  cardContainer.className = "simple-card-container";
  cardContainer.id = "simple-card-container-energy-filter";

  let energymenuheader = document.getElementById("energy-menu-header");

  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  toolbar.id = "toolbar-filter-id";

  const toolbarDropdownDiv = document.createElement("div");
  toolbarDropdownDiv.className = "toolbar";
  toolbarDropdownDiv.id = "toolbar-dropdown-div";

  const toolbarButtonsDiv = document.createElement("div");
  toolbarButtonsDiv.className = "toolbar";
  toolbarButtonsDiv.id = "toolbar-buttons-div";

  //add 6 non-breaking spaces between the filter dropdowns and buttons
  let nbspace = document.createTextNode("\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0");

  toolbar.appendChild(toolbarDropdownDiv);
  toolbar.appendChild(nbspace);
  toolbar.appendChild(toolbarButtonsDiv);

  cardContainer.appendChild(toolbar);

  energymenuheader.appendChild(cardContainer);
}

export function createBenchmarkPlot() {

  let energymenuheader = document.getElementById("energy-menu-header");

  const benchmarkplot = document.createElement("div");
  //benchmarkplot.className = "energy-plot";
  benchmarkplot.id = "benchmark-plot";
  benchmarkplot.className = "benchmark-plot";

  energymenuheader.appendChild(benchmarkplot);
}

export function createFilterButton() {

  let toolbarFilter = document.getElementById("toolbar-buttons-div");

    let buttonFilter = document.createElement("button");
    buttonFilter.className = "button";
    buttonFilter.id = "filter-button";
    
    const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgEl.setAttribute("width", "15");
    svgEl.setAttribute("height", "15");
    svgEl.setAttribute("viewBox", "0 0 24 24");

    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute(
      "d",
      "M19.479 2l-7.479 12.543v5.924l-1-.6v-5.324l-7.479-12.543h15.958zm3.521-2h-23l9 15.094v5.906l5 3v-8.906l9-15.094z"
    );

    svgEl.appendChild(path1);
    buttonFilter.appendChild(svgEl);

    toolbarFilter.appendChild(buttonFilter);
}

export function createResetButton() {

  let toolbarFilter = document.getElementById("toolbar-buttons-div");

  let resetButton = document.createElement("button");
  resetButton.className = "button";
  resetButton.id = "reset-button";
  
  const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgEl.setAttribute("width", "15");
  svgEl.setAttribute("height", "15");
  svgEl.setAttribute("viewBox", "0 0 24 24");

  const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");

  path1.setAttribute(
    "d",
    "m3.508 6.726c1.765-2.836 4.911-4.726 8.495-4.726 5.518 0 9.997 4.48 9.997 9.997 0 5.519-4.479 9.999-9.997 9.999-5.245 0-9.553-4.048-9.966-9.188-.024-.302.189-.811.749-.811.391 0 .715.3.747.69.351 4.369 4.012 7.809 8.47 7.809 4.69 0 8.497-3.808 8.497-8.499 0-4.689-3.807-8.497-8.497-8.497-3.037 0-5.704 1.597-7.206 3.995l1.991.005c.414 0 .75.336.75.75s-.336.75-.75.75h-4.033c-.414 0-.75-.336-.75-.75v-4.049c0-.414.336-.75.75-.75s.75.335.75.75z"
  );

  svgEl.appendChild(path1);
  resetButton.appendChild(svgEl);

  toolbarFilter.appendChild(resetButton);

}

export function createEnergyPlots() { //energy sidebar

  let energymenu = document.getElementById("energy-menu");

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

  document.getElementById(htmlElemId).on("plotly_legenddoubleclick", function (data) {return false}) //disable double click on legend

  document.getElementById(htmlElemId).on("plotly_legendclick", function (data) { 

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