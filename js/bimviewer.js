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
  
} from "./overlay.js";

import { socket, socketiourl, socketpy} from "./projects.js";

import {
  //need to load additional ifc entities or remove filter
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
  IFCBUILDING,
  
} from "web-ifc";
import { boxplot_graph, createEnergyPlots, updateGraph, benchmarkGauge, createDropdownButton, createBenchmarkPlot, createFilterButton, createEnergyMenuHeader, createResetButton, createToolbarFilter } from "./energy.js";

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

  model.removeFromParent(); //for ifc categories filter

  const ifcProject = await viewer.IFC.getSpatialStructure(model.modelID);

  await setupAllCategories(); //for ifc categories filter
  createTreeMenu(ifcProject);
  await getIfcTotalAreas(model); //get GIFA, window, wall areas etc

  //await getIfcReqs(model)

}

socketpy.on('connect', () => {
  console.log('connected');
})

socketpy.on('disconnect', () => {
  console.log('disconnected');
});

//call graphs here (test)

socketpy.on('df_benchmark', (labels, values) => {
  
  let values_flat = values.flat();

  initialEnergyAvg = avg(values_flat);

  //call the benchmark gauge with initial values here
  benchmarkGauge(initialEnergyAvg, initialEnergyAvg, Math.min.apply(Math,values_flat), Math.max.apply(Math, values_flat), 'benchmark-plot');


})

socketpy.on('df_orientation', (labels, values) => {
  
  //console.log(labels, values)
  
  boxplot_graph(labels, values, 'Orientation', 'orientation-plot', 600, 400);

  updateGraph('orientation-plot',initialEnergyAvg)

})

socketpy.on('df_wwr', (labels, values) => {
  
  //console.log(labels, values)
  boxplot_graph(labels, values, 'WWR', 'wwr-plot',600, 400)

  updateGraph('wwr-plot', initialEnergyAvg)

})

socketpy.on('df_wall', (labels, values) => {
  
  //console.log(labels, values)
  boxplot_graph(labels, values, 'Wall construction', 'wall-plot',600, 400)
  updateGraph('wall-plot', initialEnergyAvg)

})

socketpy.on('df_roof', (labels, values) => {
  
  //console.log(labels, values)
  boxplot_graph(labels, values, 'Roof construction', 'roof-plot',600, 400)
  updateGraph('roof-plot', initialEnergyAvg)

})

socketpy.on('df_window', (labels, values) => {
  
 //console.log(labels, values)
  boxplot_graph(labels, values, 'Window construction', 'window-plot',600, 400)

  updateGraph('window-plot', initialEnergyAvg)
})

socketpy.on('df_inf', (labels, values) => {
  
  //console.log(labels, values)
  boxplot_graph(labels, values, 'Infiltration', 'inf-plot',600, 400)

  updateGraph('inf-plot', initialEnergyAvg)
})

socketpy.on('df_hvac_h', (labels, values) => {
  
  //console.log(labels, values)
  boxplot_graph(labels, values, 'HVAC heating type', 'hvac-h-plot',600, 400)

  updateGraph('hvac-h-plot', initialEnergyAvg)

})

socketpy.on('df_hvac_c', (labels, values) => {
  
  //console.log(labels, values)
  boxplot_graph(labels, values, 'HVAC cooling type', 'hvac-c-plot',600, 400)

  updateGraph('hvac-c-plot', initialEnergyAvg)

})

socketpy.on('df_plug', (labels, values) => {
  //labels[0] = labels[0].substr(0,3) //need to check why % not workng
  //console.log(labels, values)
  boxplot_graph(labels, values, 'Plug load', 'plug-plot',600, 400)

  updateGraph('plug-plot', initialEnergyAvg)

})

socketpy.on('df_pv', (labels, values) => {
  
  //console.log(labels, values)
  boxplot_graph(labels, values, 'PV size', 'pv-plot',600, 400)

  updateGraph('pv-plot', initialEnergyAvg)
})

socketpy.on('occupancy_values', (occupancy_values) => { 
  //console.log(occupancy_values)

  if (!document.getElementById("occupancy"))
  {
    occupancyDropdownButton = createDropdownButton(occupancy_values, "occupancy", "Occupancy", "#occupancy")
  //createDropdownButtonOccupancy(occupancy_values)
  }
})

socketpy.on('usage_values', (usage_values) => {
  if (!document.getElementById("usage"))
  {
    usageDropdownButton = createDropdownButton(usage_values, "usage", "Usage", "#usage")
  }
})

socketpy.on('vintage_values', (vintage_values) => {
  if (!document.getElementById("vintage"))
  {
    vintageDropdownButton = createDropdownButton(vintage_values, "vintage", "Vintage", "#vintage")
  }
})

//loads the model -
socket.on("fileName", (fileName) => {
  let path = socketiourl + fileName;
  loadIfc(path);
  //console.log(path);


  //do the calculations and export the data
});

//const resultJson = await viewer.IFC.properties.serializeAllProperties()

const scene = viewer.context.getScene(); //for showing/hiding categories

// let path;

// for (let proj of projects) {
//   //createCardDiv(proj.name, proj.id);
//   //console.log(proj.name, proj.id);
//   if (proj.id === currentProjectID) {
//     let fileName = proj.name;
//     path = "./models/" + fileName + ".ifc"; // get path into this
//     //console.log(path);
//   }
// }

// loadIfc(path);



//UI elements

createIfcPropertyMenu();

const propsGUI = document.getElementById("ifc-property-menu-root");

createIfcTreeMenu();

createCheckboxes();

//help info
createHelpInfo();

toolbarTop();
toolbarBottom();

//energy menu stuff

createEnergyMenu();

createEnergyMenuHeader();
createBenchmarkPlot();

createToolbarFilter();

createFilterButton();
createResetButton();


createEnergyPlots(); 
//createDropdownButtons();

let filterButton = document.getElementById("filter-button");

filterButton.onclick = () => { 
 
    filterButtonAll(initialEnergyAvg)

            //needs to be in separate function and called after updateFilter event resolves;
  //need to get min and max values: ...data[0].gauge.axis.range[0] / ...data[0].gauge.axis.range[1]

  // let updatedEnergyAvg = document.getElementById('benchmark-plot').data[0].value //get the energy average from benchmark plot

  // console.log("initial energy avg: " + initialEnergyAvg + " updated energy avg: " + updatedEnergyAvg)
  
}

let resetButton = document.getElementById("reset-button");

resetButton.onclick = () => {

  socketpy.emit('ifcAreas', ifcAreas);
  //clear the selections
  occupancyDropdownButton.empty()
  usageDropdownButton.empty()
  vintageDropdownButton.empty()

}

function filterButtonAll(initialEnergyAvg) { //input the energy avg?
  //1. get the selected data
  let occupancy = document.getElementsByClassName ('title')[1].outerText
  let occupancyStrArray = occupancy.split(',');

  let usage = document.getElementsByClassName ('title')[2].outerText
  let usageStrArray = usage.split(',');

  let vintage = document.getElementsByClassName ('title')[3].outerText
  let vintageStrArray = vintage.split(',');

  console.log("Occupancy: " + occupancyStrArray[0] + " Usage: " + usageStrArray[0] + " Vintage: " + vintageStrArray[0]);

  console.log(ifcAreas) //pass this to the emit

  //2. send selected data back to python server, query and update the dataset - occupancyStrArray, usageStrArray, vintageStrArray
  socketpy.emit('updateFilter', [ifcAreas, {occupancy :  occupancyStrArray, usage : usageStrArray, vintage: vintageStrArray}])


  //update the gauge here? 
//update the gauge? - instead of initial avg should be previous avg
  //benchmarkGauge(initialEnergyAvg, updatedEnergyAvg ,Math.min.apply(Math,updatedEnergyAvg), Math.max.apply(Math, updatedEnergyAvg), 'benchmark-plot'); //import initialenergyavg from bimviewer


}

//energy menu stuff end

//select IFC elements
window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();

window.ondblclick = async () => {
  //access the three geometry object here and get qts

  const result = await viewer.IFC.selector.pickIfcItem(); //highlightIfcItem hides all other elements
  if (!result) return;

  const { modelID, id } = result;

  const props = await viewer.IFC.getProperties(modelID, id, true, false);
  //console.log(props);

  //GET ELEMENT QUANTITIES -

  //walls
  // const propsw = await viewer.IFC.getProperties(modelID, props.psets[props.psets.length -1].expressID, true, false); //getting the last property set (ifcelementquantities) - slabs
  // console.log(propsw)

  // const props2 = await viewer.IFC.getProperties(
  //   modelID,
  //   //props.psets[props.psets.length - 1].expressID, //getting the last property set (ifcelementquantities) - slabs, windows (ifcwindow) & doors
  //   props.psets[0].expressID, //the first property set for IfcWallStandardCase
  //   true,
  //   false
  // ); 
  // console.log(props2);

  // //let qts = await viewer.IFC.getProperties(modelID, props2.HasProperties[0].value, true, false)

  // let qts = props2.Quantities; // does not work for all objects (works for slabs + windows)
  // console.log(qts)

  // //this needs to be fixed, otherwise breaking the code
  // for (let qty of qts) {
  //   let value = await viewer.IFC.getProperties(modelID, qty.value, true, false);
  //   console.log(value);

  //   if (value.AreaValue) {
  //     //this works (not for all objects)
  //     console.log("Area: " + value.AreaValue.value);
  //   }
  // }

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

//on right mouse click - remove these events?
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
    // viewer.clipper.deletePlane();
    viewer.clipper.deleteAllPlanes();
    //console.log("delete")
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
  //console.log(properties);

  //createTabs()

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

async function getIfcReqs (model) {

  // 0.	Commercial / residential building type (Comstock vs restock datasets) (IfcBuilding – Description)
  // 1.	in.geometry_building_type_recs (from ifc?) (IfcBuilding – Description)
  const ifcbuilding = await viewer.IFC.getAllItemsOfType(
    model.modelID,
    IFCBUILDING,
    true
  )
 console.log(ifcbuilding);

  let buildingDescription = ifcbuilding[0].Description;
  console.log('building description: '+ buildingDescription);

  // 2.	in.vacancy_status (ifcbulding -> Pset_BuildingCommon OccupancyType)
  let psets = await viewer.IFC.getProperties(model.modelID, ifcbuilding[0].expressID, true, false);
  console.log(psets);

  // for each property set
  for (let i = 0; i < psets.psets.length; i++)
  {
    if (psets.psets[i].Name.value === 'Pset_BuildingCommon') {

      //for each property in the property set
      for (let j = 0; j < psets.psets[i].HasProperties.length; j++)
      {

        let prop0 = await viewer.IFC.getProperties(model.modelID, psets.psets[i].HasProperties[j].value, true ,false);
        console.log(prop0);
        if (prop0.Name.value === 'IsLandmarked') //change/add here the property names
        {
          console.log(prop0.Name.value, prop0.NominalValue.value)
        }
         // 3.	in.occupants (Pset_BuildingCommon OccupancyType)
        if (prop0.Name.value === 'OccupancyType') //OccupancyType
        {
          console.log(prop0.Name.value, prop0.NominalValue.value)
        }
        // 6.	in.vintage (Pset_BuildingCommon YearOfConstruction) 
        if (prop0.Name.value === 'YearOfConstruction') //YearOfConstruction
        {
          console.log(prop0.Name.value, prop0.NominalValue.value)
        }
      }
      
    }

      // 7.	in.usage_level (ifcbuilding -> Pset_BuildingUse – NarrativeText)
    if (psets.psets[i].Name.value === 'Pset_BuildingUse') {   
      for (let j = 0; j < psets.psets[i].HasProperties.length; j++)
      {
        let prop0 = await viewer.IFC.getProperties(model.modelID, psets.psets[i].HasProperties[j].value, true ,false);
        if (prop0.Name.value === 'NarrativeText') //change/add here the property names
        {
          console.log(prop0.Name.value, prop0.NominalValue.value)
        }

      }
    }

}

//return the requirements for ifc or a set of default values

}


async function getIfcTotalAreas (model) { //this should return the areas for a given model and they need to be acccesible
  //Calculate GIFA - checking if slabs are Floors, checking isExternal = False (Pset_SlabCommon), calcultae based on gross area
  //
  //
  const slabs = await viewer.IFC.getAllItemsOfType(
    model.modelID,
    IFCSLAB,
    true
  ); //get all the properties here/qto
  //console.log(slabs);

  let totalSlabArea = 0;

  for (let slab of slabs) {
    //getitemproperties of the expressid
    let slabProps = await viewer.IFC.getProperties(
      model.modelID,
      slab.expressID,
      true,
      false
    ); //getting the last property set (ifcelementquantities) - slabs
    //console.log(slabProps);

    if (slabProps.PredefinedType.value === "FLOOR") {

      //check if isExternal false
      let Pset_SlabCommonid = slabProps.psets[slabProps.psets.length -2].expressID;
      let Pset_SlabCommonProps = await viewer.IFC.getProperties(model.modelID, Pset_SlabCommonid, true, false);

      //get the IfcPropertySingleValue - should be a loop instead?
      let isExternal = await viewer.IFC.getProperties(model.modelID, Pset_SlabCommonProps.HasProperties[0].value, true, false); //does not get the isExternal necessarily...
      let isExternalValue = isExternal.NominalValue.value;
      let isExternalName = isExternal.Name.value; //need to check this as well...

      //console.log("isExternal: " +isExternalName + isExternalValue);   

      if (isExternalValue === "F" && isExternalName === "IsExternal") { //if isExternal = FALSE 
        let qts = slabProps.psets[slabProps.psets.length - 1].Quantities; //gets the last property set, which is a quantityset
         //console.log(qts) //base quantities for slabs
  
        for (let qty of qts) {
          let value = await viewer.IFC.getProperties(
            model.modelID,
            qty.value,
            true,
            false
          );
           //console.log(value)
            
          if (value.Name.value === "GrossArea") { //should be net area?
          //if (value.AreaValue) { //this works to see if there is an area value
            //this works (not for all objects)
            //  console.log("Area: " + value.AreaValue.value)
            totalSlabArea += value.AreaValue.value;
            //need to subtract if Pset_SlabCommon isExternal = true and divide /2
          }
        }
      }
      }

  }
  console.log("Total GIFA: " + totalSlabArea);

  //get extenral walls
  const walls = await viewer.IFC.getAllItemsOfType(
    model.modelID,
    IFCWALLSTANDARDCASE,
    true
  ); //get all the properties here/qto
  //console.log(slabs);

  let totalWallArea = 0;

  for (let wall of walls) {

    //getitemproperties of the expressid
    let wallProps = await viewer.IFC.getProperties(
      model.modelID,
      wall.expressID,
      true,
      false
    ); //getting the last property set (ifcelementquantities) - windows

    //check if is exterior wall
    let Pset_WallCommonid = wallProps.psets[wallProps.psets.length -1].expressID;
    let Pset_WallCommonProps = await viewer.IFC.getProperties(model.modelID, Pset_WallCommonid, true, false);

    //console.log(Pset_WallCommonProps)

    //get the IfcPropertySingleValue - should be a loop instead?
    let isExternal = await viewer.IFC.getProperties(model.modelID, Pset_WallCommonProps.HasProperties[0].value, true, false); //does not get the isExternal necessarily...
    let isExternalValue = isExternal.NominalValue.value;
    let isExternalName = isExternal.Name.value; //need to check this as well...

    //console.log("isExternal: " +isExternalName + isExternalValue);   

   if (isExternalValue === "T" && isExternalName === "IsExternal") { //if isExternal = FALSE 


    if (wallProps.psets[0].Quantities) {
      //get the IfcPropertySingleValue
        let wallQts = wallProps.psets[0].Quantities; 
         //console.log(wallQts) //base quantities for windows
  
        for (let qty of wallQts) {
          let value = await viewer.IFC.getProperties(
            model.modelID,
            qty.value,
            true,
            false
          );
           //console.log(value)

           if (value.Name.value === "NetSideArea") {
            //this works (not for all objects)
            //  console.log("Area: " + value.AreaValue.value)
            totalWallArea += value.AreaValue.value;
          }
        }
      }

     }
    }

  console.log("Total Wall area: " + totalWallArea);
  //get windows - IFCWINDOW and Curtain Wall Plates

  const ifcWindows = await viewer.IFC.getAllItemsOfType(
    model.modelID,
    IFCWINDOW,
    true
  ); //get all the properties here/qto
  //console.log(slabs);

  let totalWindowArea = 0;

  for (let window of ifcWindows) {
    //getitemproperties of the expressid
    let windowProps = await viewer.IFC.getProperties(
      model.modelID,
      window.expressID,
      true,
      false
    ); //getting the last property set (ifcelementquantities) - windows

      //get the IfcPropertySingleValue
        let windowQts = windowProps.psets[windowProps.psets.length - 1].Quantities;
         //console.log(windowQts) //base quantities for windows
  
        for (let qty of windowQts) {
          let value = await viewer.IFC.getProperties(
            model.modelID,
            qty.value,
            true,
            false
          );
           //console.log(value)

          if (value.AreaValue) { //this works to see if there is an area value
            //this works (not for all objects)
            //  console.log("Area: " + value.AreaValue.value)
            totalWindowArea += value.AreaValue.value;
          }
        }
      }
  console.log("Total IFC Window area: " + totalWindowArea);

//return the areas
      socketpy.emit('ifcAreas', {windowArea :  totalWindowArea, wallArea : totalWallArea, slabArea: totalSlabArea} )

      ifcAreas = {windowArea :  totalWindowArea, wallArea : totalWallArea, slabArea: totalSlabArea}

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