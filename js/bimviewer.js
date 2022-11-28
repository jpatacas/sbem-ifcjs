import { Color } from "three";
import { IfcViewerAPI } from "web-ifc-viewer";
import {
  createCheckboxes,
  createIfcTreeMenu,
  createIfcPropertyMenu,
  toolbarBottom,
  toolbarTop,
  createHelpInfo,
  createEnergyMenu,
} from "./uifunctions.js";

import { socket, socketiourl, socketpy } from "./projects.js";

import {
  //ifc entities for the filter
  IFCWALL,
  IFCWALLSTANDARDCASE,
  IFCSLAB,
  IFCDOOR,
  IFCWINDOW,
  IFCFURNISHINGELEMENT,
  IFCMEMBER,
  IFCPLATE,
  IFCSPACE,
  IFCSITE,
  IFCROOF,
  IFCBUILDINGELEMENTPROXY,
} from "web-ifc";
import {
  boxplot_graph,
  createEnergyPlots,
  updateGraph,
  benchmarkGauge,
  createDropdownButton,
  createBenchmarkPlot,
  createFilterButton,
  createEnergyMenuHeader,
  createResetButton,
  createToolbarFilter,
  createSaveButton,
} from "./energy.js";

// List of categories names
const categories = {
  IFCWALL,
  IFCWALLSTANDARDCASE,
  IFCSLAB,
  IFCFURNISHINGELEMENT,
  IFCDOOR,
  IFCWINDOW,
  IFCPLATE,
  IFCMEMBER,
  IFCSPACE,
  IFCSITE,
  IFCROOF,
  IFCBUILDINGELEMENTPROXY,
};

const container = document.getElementById("viewer-container");
const viewer = new IfcViewerAPI({
  container,
  backgroundColor: new Color(255, 255, 255),
});

viewer.axes.setAxes();
viewer.grid.setGrid();

const currentUrl = window.location.href;
const url = new URL(currentUrl);
const currentProjectID = url.searchParams.get("id"); //bimserver project id - use this to get latest revision etc

//console.log(currentProjectID);

//for energy assessment
let initialEnergyAvg;
let ifcAreas;
let occupancyDropdownButton;
let usageDropdownButton;
let vintageDropdownButton;

if (currentProjectID !== null) {
  console.log("getting latest revision", currentProjectID);
  socket.emit("getLatestRevision", currentProjectID);
}

async function loadIfc(url) {
  // Load the model
  const model = await viewer.IFC.loadIfcUrl(url);

  // Add dropped shadow and post-processing efect
  await viewer.shadowDropper.renderShadow(model.modelID);
  viewer.context.renderer.postProduction.active = true;

  model.removeFromParent(); //enable/disable categories filter

  const ifcProject = await viewer.IFC.getSpatialStructure(model.modelID);

  await setupAllCategories(); //for ifc categories filter
  createTreeMenu(ifcProject);
  await getIfcTotalAreas(model); //get floor, window, wall areas etc
}

socketpy.on("connect", () => {
  console.log("connected");
});

socketpy.on("disconnect", () => {
  console.log("disconnected");
});

//create the graphs using energy assessment data from python app
socketpy.on("df_benchmark", (labels, values) => {
  let values_flat = values.flat();
  initialEnergyAvg = avg(values_flat);
  //call the benchmark gauge with initial values here
  benchmarkGauge(
    initialEnergyAvg,
    initialEnergyAvg,
    Math.min.apply(Math, values_flat),
    Math.max.apply(Math, values_flat),
    "benchmark-plot"
  );
});

socketpy.on("df_orientation", (labels, values) => {
  boxplot_graph(labels, values, "Orientation", "orientation-plot", 600, 400);
  updateGraph("orientation-plot", initialEnergyAvg);
});

socketpy.on("df_wwr", (labels, values) => {
  boxplot_graph(labels, values, "WWR", "wwr-plot", 600, 400);
  updateGraph("wwr-plot", initialEnergyAvg);
});

socketpy.on("df_wall", (labels, values) => {
  //console.log(labels, values)
  boxplot_graph(labels, values, "Wall construction", "wall-plot", 600, 400);
  updateGraph("wall-plot", initialEnergyAvg);
});

socketpy.on("df_roof", (labels, values) => {
  //console.log(labels, values)
  boxplot_graph(labels, values, "Roof construction", "roof-plot", 600, 400);
  updateGraph("roof-plot", initialEnergyAvg);
});

socketpy.on("df_window", (labels, values) => {
  //console.log(labels, values)
  boxplot_graph(labels, values, "Window construction", "window-plot", 600, 400);
  updateGraph("window-plot", initialEnergyAvg);
});

socketpy.on("df_inf", (labels, values) => {
  //console.log(labels, values)
  boxplot_graph(labels, values, "Infiltration", "inf-plot", 600, 400);
  updateGraph("inf-plot", initialEnergyAvg);
});

socketpy.on("df_hvac_h", (labels, values) => {
  //console.log(labels, values)
  boxplot_graph(labels, values, "HVAC heating type", "hvac-h-plot", 600, 400);
  updateGraph("hvac-h-plot", initialEnergyAvg);
});

socketpy.on("df_hvac_c", (labels, values) => {
  //console.log(labels, values)
  boxplot_graph(labels, values, "HVAC cooling type", "hvac-c-plot", 600, 400);
  updateGraph("hvac-c-plot", initialEnergyAvg);
});

socketpy.on("df_plug", (labels, values) => {
  //labels not working - % sign?
  //console.log(labels, values)
  boxplot_graph(labels, values, "Plug load", "plug-plot", 600, 400);
  updateGraph("plug-plot", initialEnergyAvg);
});

socketpy.on("df_pv", (labels, values) => {
  //console.log(labels, values)
  boxplot_graph(labels, values, "PV size", "pv-plot", 600, 400);
  updateGraph("pv-plot", initialEnergyAvg);
});

socketpy.on("occupancy_values", (occupancy_values) => {
  //console.log(occupancy_values)

  if (!document.getElementById("occupancy")) {
    occupancyDropdownButton = createDropdownButton(
      occupancy_values,
      "occupancy",
      "Occupancy",
      "#occupancy"
    );
  }
});

socketpy.on("usage_values", (usage_values) => {
  if (!document.getElementById("usage")) {
    usageDropdownButton = createDropdownButton(
      usage_values,
      "usage",
      "Usage",
      "#usage"
    );
  }
});

socketpy.on("vintage_values", (vintage_values) => {
  if (!document.getElementById("vintage")) {
    vintageDropdownButton = createDropdownButton(
      vintage_values,
      "vintage",
      "Vintage",
      "#vintage"
    );
  }
});

//loads the model -
socket.on("fileName", (fileName) => {
  let path = socketiourl + fileName;
  loadIfc(path);
  //console.log(path);
});

const scene = viewer.context.getScene(); //for showing/hiding categories

//UI elements

createIfcPropertyMenu();

const propsGUI = document.getElementById("ifc-property-menu-root");

createIfcTreeMenu();
createCheckboxes();
createHelpInfo();
toolbarTop();
toolbarBottom();

//energy menu
createEnergyMenu();
createEnergyMenuHeader();
createBenchmarkPlot();
createToolbarFilter();
createFilterButton();
createResetButton();
createSaveButton();
createEnergyPlots();

//energy menu filter button
let filterButton = document.getElementById("filter-button");

filterButton.onclick = () => {
  filterButtonAll(initialEnergyAvg);
};

//energy menu reset button
let resetButton = document.getElementById("reset-button");

resetButton.onclick = () => {
  socketpy.emit("ifcAreas", ifcAreas);
  //clear the selections
  occupancyDropdownButton.empty();
  usageDropdownButton.empty();
  vintageDropdownButton.empty();
};

//select IFC elements
window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();

window.ondblclick = async () => {
  //access the three geometry object here and get qts

  const result = await viewer.IFC.selector.pickIfcItem(); //highlightIfcItem hides all other elements
  if (!result) return;

  const { modelID, id } = result;

  const props = await viewer.IFC.getProperties(modelID, id, true, false);

  createPropertiesMenu(props);

  document.getElementById("ifc-property-menu").style.display = "initial";
  propertiesButton.classList.add("active");

  if (clippingPlanesActive) {
    viewer.clipper.createPlane();
  }

  if (measurementsActive) {
    viewer.dimensions.create();
  }
};

//set up clipping planes
const clipButton = document.getElementById("clipPlaneButton");

let clippingPlanesActive = false;
clipButton.onclick = () => {
  clippingPlanesActive = !clippingPlanesActive;
  viewer.clipper.active = clippingPlanesActive;

  if (clippingPlanesActive) {
    //add or remove active class depending on whether button is clicked and clipping planes are active
    clipButton.classList.add("active");
  } else {
    clipButton.classList.remove("active");
  }
};

window.onauxclick = () => {
  if (clippingPlanesActive) {
    viewer.clipper.createPlane();
  }

  if (measurementsActive) {
    viewer.dimensions.create();
  }
};

window.onkeydown = (event) => {
  if (event.code === "Delete" && clippingPlanesActive) {
    viewer.clipper.deleteAllPlanes();
  }

  if (event.code === "Delete" && measurementsActive) {
    viewer.dimensions.delete();
  }
};

//notes / annotations

const annotationsButton = document.getElementById("annotationsButton");
let measurementsActive = false;

annotationsButton.onclick = () => {
  viewer.dimensions.active = true;
  viewer.dimensions.previewActive = true;
  measurementsActive = !measurementsActive;

  if (measurementsActive) {
    annotationsButton.classList.add("active");
  } else {
    annotationsButton.classList.remove("active");
    viewer.dimensions.active = false;
    viewer.dimensions.previewActive = false;
  }
};

//IFC tree view
const toggler = document.getElementsByClassName("caret");
for (let i = 0; i < toggler.length; i++) {
  toggler[i].onclick = () => {
    toggler[i].parentElement
      .querySelector(".nested")
      .classList.toggle("tree-active");
    toggler[i].classList.toggle("caret-down");
  };
}

// hiding/filters

// Gets the name of a category
function getName(category) {
  const names = Object.keys(categories);
  return names.find((name) => categories[name] === category);
}

// Gets all the items of a category
async function getAll(category) {
  return viewer.IFC.loader.ifcManager.getAllItemsOfType(0, category, false);
}

// Creates a new subset containing all elements of a category
async function newSubsetOfType(category) {
  const ids = await getAll(category);
  return viewer.IFC.loader.ifcManager.createSubset({
    modelID: 0,
    scene,
    ids,
    removePrevious: true,
    customID: category.toString(),
  });
}

// Stores the created subsets
const subsets = {};

async function setupAllCategories() {
  const allCategories = Object.values(categories);
  for (let i = 0; i < allCategories.length; i++) {
    const category = allCategories[i];
    await setupCategory(category);
  }
}

// Creates a new subset and configures the checkbox
async function setupCategory(category) {
  subsets[category] = await newSubsetOfType(category);
  setupCheckBox(category);
}

// Sets up the checkbox event to hide / show elements
function setupCheckBox(category) {
  const name = getName(category);
  const checkBox = document.getElementById(name);
  checkBox.addEventListener("change", (event) => {
    const checked = event.target.checked;
    const subset = subsets[category];
    if (checked) scene.add(subset);
    else subset.removeFromParent();
  });
}

// Spatial tree menu

function createTreeMenu(ifcProject) {
  const root = document.getElementById("tree-root");
  removeAllChildren(root);
  const ifcProjectNode = createNestedChild(root, ifcProject);
  ifcProject.children.forEach((child) => {
    constructTreeMenuNode(ifcProjectNode, child);
  });
}

function nodeToString(node) {
  return `${node.type} - ${node.expressID}`;
}

function constructTreeMenuNode(parent, node) {
  const children = node.children;
  if (children.length === 0) {
    createSimpleChild(parent, node);
    return;
  }
  const nodeElement = createNestedChild(parent, node);
  children.forEach((child) => {
    constructTreeMenuNode(nodeElement, child);
  });
}

function createNestedChild(parent, node) {
  const content = nodeToString(node);
  const root = document.createElement("li");
  createTitle(root, content);
  const childrenContainer = document.createElement("ul");
  childrenContainer.classList.add("nested");
  root.appendChild(childrenContainer);
  parent.appendChild(root);
  return childrenContainer;
}

function createTitle(parent, content) {
  const title = document.createElement("span");
  title.classList.add("caret");
  title.onclick = () => {
    title.parentElement
      .querySelector(".nested")
      .classList.toggle("tree-active");
    title.classList.toggle("caret-down");
  };
  title.textContent = content;
  parent.appendChild(title);
}

function createSimpleChild(parent, node) {
  const content = nodeToString(node);
  const childNode = document.createElement("li");
  childNode.classList.add("leaf-node");
  childNode.textContent = content;
  parent.appendChild(childNode);

  childNode.onmouseenter = () => {
    viewer.IFC.selector.prepickIfcItemsByID(0, [node.expressID]);
  };

  childNode.onclick = async () => {
    viewer.IFC.selector.pickIfcItemsByID(0, [node.expressID], true);

    let idsArray = [node.expressID];

    const props = await viewer.IFC.getProperties(0, idsArray[0], true, false);
    //console.log(props); //call the function here
    createPropertiesMenu(props);
    document.getElementById("ifc-property-menu").style.display = "initial";
    propertiesButton.classList.add("active");
  };
}

//IFC properties menu functions
function createPropertiesMenu(properties) {

  removeAllChildren(propsGUI);

  delete properties.psets;
  delete properties.mats;
  delete properties.type;

  for (let key in properties) {
    createPropertyEntry(key, properties[key]);
  }
}

function createPropertyEntry(key, value) {
  const propContainer = document.createElement("div");
  propContainer.classList.add("ifc-property-item");

  if (value === null || value === undefined) value = "undefined";
  else if (value.value) value = value.value;

  const keyElement = document.createElement("div");
  keyElement.textContent = key;
  propContainer.appendChild(keyElement);

  const valueElement = document.createElement("div");
  valueElement.classList.add("ifc-property-value");
  valueElement.textContent = value;
  propContainer.appendChild(valueElement);

  propsGUI.appendChild(propContainer);
}

function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function filterButtonAll() {
  //1. get the selected data
  let occupancy = document.getElementsByClassName("title")[1].outerText;
  let occupancyStrArray = occupancy.split(",");

  let usage = document.getElementsByClassName("title")[2].outerText;
  let usageStrArray = usage.split(",");

  let vintage = document.getElementsByClassName("title")[3].outerText;
  let vintageStrArray = vintage.split(",");

  //2. send selected data back to python server, query and update the dataset - occupancyStrArray, usageStrArray, vintageStrArray
  socketpy.emit("updateFilter", [
    ifcAreas,
    {
      occupancy: occupancyStrArray,
      usage: usageStrArray,
      vintage: vintageStrArray,
    },
  ]);
}

//get gross floor area
async function getIfcTotalAreas(model) {
  const slabs = await viewer.IFC.getAllItemsOfType(
    model.modelID,
    IFCSLAB,
    true
  );

  let totalSlabArea = 0;

  for (let slab of slabs) {
    let slabProps = await viewer.IFC.getProperties(
      model.modelID,
      slab.expressID,
      true,
      false
    );

    if (slabProps.PredefinedType.value === "FLOOR") {
      let Pset_SlabCommonid =
        slabProps.psets[slabProps.psets.length - 2].expressID;
      let Pset_SlabCommonProps = await viewer.IFC.getProperties(
        model.modelID,
        Pset_SlabCommonid,
        true,
        false
      );

      let isExternal = await viewer.IFC.getProperties(
        model.modelID,
        Pset_SlabCommonProps.HasProperties[0].value,
        true,
        false
      );
      let isExternalValue = isExternal.NominalValue.value;
      let isExternalName = isExternal.Name.value;

      if (isExternalValue === "F" && isExternalName === "IsExternal") {
        //if isExternal = FALSE
        let qts = slabProps.psets[slabProps.psets.length - 1].Quantities;

        for (let qty of qts) {
          let value = await viewer.IFC.getProperties(
            model.modelID,
            qty.value,
            true,
            false
          );

          if (value.Name.value === "GrossArea") {
            totalSlabArea += value.AreaValue.value;
          }
        }
      }
    }
  }
  //console.log("Total Gross floor area: " + totalSlabArea);

  //get external walls
  const walls = await viewer.IFC.getAllItemsOfType(
    model.modelID,
    IFCWALLSTANDARDCASE,
    true
  );

  let totalWallArea = 0;

  for (let wall of walls) {
    let wallProps = await viewer.IFC.getProperties(
      model.modelID,
      wall.expressID,
      true,
      false
    );

    let Pset_WallCommonid =
      wallProps.psets[wallProps.psets.length - 1].expressID;
    let Pset_WallCommonProps = await viewer.IFC.getProperties(
      model.modelID,
      Pset_WallCommonid,
      true,
      false
    );
    let isExternal = await viewer.IFC.getProperties(
      model.modelID,
      Pset_WallCommonProps.HasProperties[0].value,
      true,
      false
    );
    let isExternalValue = isExternal.NominalValue.value;
    let isExternalName = isExternal.Name.value;

    if (isExternalValue === "T" && isExternalName === "IsExternal") {
      //if isExternal = true

      if (wallProps.psets[0].Quantities) {
        let wallQts = wallProps.psets[0].Quantities;

        for (let qty of wallQts) {
          let value = await viewer.IFC.getProperties(
            model.modelID,
            qty.value,
            true,
            false
          );

          if (value.Name.value === "NetSideArea") {
            totalWallArea += value.AreaValue.value;
          }
        }
      }
    }
  }

  console.log("Total Wall area: " + totalWallArea);

  //get windows
  const ifcWindows = await viewer.IFC.getAllItemsOfType(
    model.modelID,
    IFCWINDOW,
    true
  );

  let totalWindowArea = 0;

  for (let window of ifcWindows) {
    let windowProps = await viewer.IFC.getProperties(
      model.modelID,
      window.expressID,
      true,
      false
    );

    let windowQts = windowProps.psets[windowProps.psets.length - 1].Quantities;

    for (let qty of windowQts) {
      let value = await viewer.IFC.getProperties(
        model.modelID,
        qty.value,
        true,
        false
      );

      if (value.AreaValue) {
        totalWindowArea += value.AreaValue.value;
      }
    }
  }
  //console.log("Total IFC Window area: " + totalWindowArea);

  //return the areas
  socketpy.emit("ifcAreas", {
    windowArea: totalWindowArea,
    wallArea: totalWallArea,
    slabArea: totalSlabArea,
  });

  ifcAreas = {
    windowArea: totalWindowArea,
    wallArea: totalWallArea,
    slabArea: totalSlabArea,
  };
}

//https://techformist.com/average-median-javascript/
function avg(numbers) {
  const arr = numbers.filter((val) => !!val);
  const sum = arr.reduce((sum, val) => (sum += val));
  const len = numbers.length;

  return sum / len;
}
