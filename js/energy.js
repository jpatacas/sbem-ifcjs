//functions and UI elements for the energy assessment menu

//generic function to create boxplot graphs for each category
export function boxplot_graph(
  datalabels,
  dataValues,
  title,
  htmlelem,
  width,
  height
) {
  let data = [];

  for (let i = 0; i < datalabels.length; i++) {
    let trace = {
      y: dataValues[i],
      type: "box",
      name: datalabels[i],
      boxmean: true,
      boxpoints: false,
    };

    data.push(trace);
  }

  let layoutBox = {
    title: title,
    yaxis: {
      title: "energy consumption intensity (kWh/m2/yr)",
    },
    width: width,
    height: height,
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
  };

  Plotly.newPlot(htmlelem, data, layoutBox);
}

export function benchmarkGauge(initialavg, average, min, max, htmlelem) {
  var data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: average, //the actual value
      title: {
        text: "Benchmark comparison<br><span style='font-size:0.8em;color:gray'>kWh/m2/yr</span>",
      },
      type: "indicator",
      mode: "gauge+number+delta",
      delta: { reference: initialavg }, //the initial value
      gauge: { axis: { range: [min, max] } },
    },
  ];

  var layout = {
    width: 600,
    height: 200,
    margin: { t: 80, b: 25, l: 25, r: 25 },
  };
  Plotly.newPlot(htmlelem, data, layout);
}

function createDropdownMulti(htmlElemId, optionValues) {
  const select = document.createElement("select");
  select.id = htmlElemId;
  select.setAttribute("multiple", "multiple");
  // select.multiple = "multiple";
  select.size = "20"; //todo: change how to access the selected data in the dropdown

  for (let optionValue of optionValues) {
    const option = document.createElement("option");
    option.value = optionValue;
    option.innerText = optionValue;
    select.appendChild(option);
  }

  return select;
}

export function createDropdownButton(
  column,
  htmlElemId,
  placeholder,
  vanillaElement
) {
  let toolbarFilter = document.getElementById("toolbar-dropdown-div");

  let selectDropdownMulti = createDropdownMulti(htmlElemId, column); //these params need to be input from python server
  toolbarFilter.appendChild(selectDropdownMulti);

  let selectCarsMulti = new vanillaSelectBox(vanillaElement, {
    placeHolder: placeholder,
  });

  return selectCarsMulti;
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

  //add non-breaking spaces between the filter dropdowns and buttons
  let nbspace = document.createTextNode("\u00A0\u00A0\u00A0\u00A0");

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

export function createSaveButton() {
  let toolbarFilter = document.getElementById("toolbar-buttons-div");

  let saveButton = document.createElement("button");
  saveButton.className = "button";
  saveButton.id = "save-button";

  const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgEl.setAttribute("width", "15");
  svgEl.setAttribute("height", "15");
  svgEl.setAttribute("viewBox", "0 0 24 24");

  const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");

  path1.setAttribute(
    "d",
    "m6.864 3.424c.502-.301 1.136.063 1.136.642 0 .264-.138.509-.365.644-2.476 1.486-4.135 4.197-4.135 7.292 0 4.691 3.808 8.498 8.498 8.498s8.497-3.807 8.497-8.498c0-3.093-1.656-5.803-4.131-7.289-.225-.136-.364-.38-.364-.644 0-.582.635-.943 1.137-.642 2.91 1.748 4.858 4.936 4.858 8.575 0 5.519-4.479 9.998-9.997 9.998s-9.998-4.479-9.998-9.998c0-3.641 1.951-6.83 4.864-8.578zm.831 8.582s2.025 2.021 3.779 3.774c.147.147.339.22.53.22.192 0 .384-.073.531-.22 1.753-1.752 3.779-3.775 3.779-3.775.145-.145.217-.336.217-.526 0-.192-.074-.384-.221-.531-.292-.293-.766-.294-1.056-.004l-2.5 2.499v-10.693c0-.414-.336-.75-.75-.75s-.75.336-.75.75v10.693l-2.498-2.498c-.289-.289-.762-.286-1.054.006-.147.147-.221.339-.222.531 0 .19.071.38.215.524z"
  );
  svgEl.appendChild(path1);
  saveButton.appendChild(svgEl);

  toolbarFilter.appendChild(saveButton);
}

export function createEnergyPlots() {
  //energy sidebar

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

  const hvachplot = document.createElement("div");
  hvachplot.id = "hvac-h-plot";

  energymenu.appendChild(hvachplot);

  const hvaccplot = document.createElement("div");
  hvaccplot.id = "hvac-c-plot";

  energymenu.appendChild(hvaccplot);

  const plugplot = document.createElement("div");
  plugplot.id = "plug-plot";

  energymenu.appendChild(plugplot);

  const pvplot = document.createElement("div");
  pvplot.id = "pv-plot";

  energymenu.appendChild(pvplot);
}

//currently only updates single graph
export function updateGraph(htmlElemId, initialEnergyAvg) {
  //create object to track the status of the legend
  let roofKeys = Object.keys(document.getElementById(htmlElemId).data); //array of keys
  let roofStatusArray = [];

  for (let key in roofKeys) {
    roofStatusArray.push(true);
  }

  let roofLegendObj = convertToObj(roofKeys, roofStatusArray);
  //console.log(roofLegendObj)

  document
    .getElementById(htmlElemId)
    .on("plotly_legenddoubleclick", function (data) {
      return false;
    }); //disable double click on legend

  document.getElementById(htmlElemId).on("plotly_legendclick", function (data) {
    for (let key in Object.keys(roofLegendObj)) {
      if (data.curveNumber.toString() === key) {
        roofLegendObj[key] = !roofLegendObj[key];
        console.log(key, roofLegendObj[key]);
      }
    }

    //console.log(roofLegendObj)

    let updatedPoints = [];

    for (let key in Object.keys(roofLegendObj)) {
      if (roofLegendObj[key] === true) {
        let updatedYPoints = document.getElementById(htmlElemId).data[key].y;

        updatedPoints.push(updatedYPoints);
      }
    }

    let updatedPointsFlat = updatedPoints.flat();

    //update the benchmark gauge
    benchmarkGauge(
      initialEnergyAvg,
      avg(updatedPointsFlat),
      Math.min.apply(Math, updatedPointsFlat),
      Math.max.apply(Math, updatedPointsFlat),
      "benchmark-plot"
    ); //import initialenergyavg from bimviewer

    initialEnergyAvg = avg(updatedPointsFlat);
  });
}

//https://techformist.com/average-median-javascript/
function avg(numbers) {
  const arr = numbers.filter((val) => !!val);
  const sum = arr.reduce((sum, val) => (sum += val));
  const len = numbers.length;

  return sum / len;
}

//https://www.geeksforgeeks.org/how-to-create-an-object-from-two-arrays-in-javascript/
// Checking if the array lengths are same
// and none of the array is empty
function convertToObj(a, b) {
  if (a.length != b.length || a.length == 0 || b.length == 0) {
    return null;
  }
  let obj = {};

  // Using the foreach method
  a.forEach((k, i) => {
    obj[k] = b[i];
  });
  return obj;
}
