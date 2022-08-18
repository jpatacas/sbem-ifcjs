import { Color } from "three";
import { IfcViewerAPI } from "web-ifc-viewer";
import { modelName, toolbar, checkboxes } from "./overlay.js";

import {
    IFCWALLSTANDARDCASE,
    IFCSLAB,
    IFCDOOR,
    IFCWINDOW,
    IFCFURNISHINGELEMENT,
    IFCMEMBER,
    IFCPLATE
  } from 'web-ifc';

const socketiourl = "http://192.168.236.229:8088/"; //edit socket.io url here

// List of categories names
const categories = {
    IFCWALLSTANDARDCASE,
    IFCSLAB,
    IFCFURNISHINGELEMENT,
    IFCDOOR,
    IFCWINDOW,
    IFCPLATE,
    IFCMEMBER
  };

const container = document.getElementById("viewer-container");
const viewer = new IfcViewerAPI({
  container,
  backgroundColor: new Color(255, 255, 255),
}); //white

viewer.axes.setAxes();
viewer.grid.setGrid();

const currentUrl = window.location.href;
const url = new URL(currentUrl);
const currentProjectID = url.searchParams.get("id"); //bimserver project id - use this to get latest revision etc
//console.log(currentProjectID);

//const currentProject = projects.find(project => project.id === currentProjectID); //get bimserver project id here and get latest revision

//local
//const socket = io("http://localhost:8088/"); //the node.js server
const socket = io(socketiourl);

//aws

//const socket = io(socketiourl);

// socket.on("hello", (arg) => {
//     console.log(arg);
// })

//socket.emit("howdy", "stranger");
//let ifcUrl;

//socket.emit("createProject", "createProject");//create project


//otherwise socket app will crash 
if (currentProjectID !== null)
    {
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
}

socket.on("fileName", (fileName) => {
  let path = socketiourl + fileName; //change here too or make it global variable
  loadIfc(path);
  //console.log(path);
});


const scene = viewer.context.getScene(); //for showing/hiding categories

//  let path = "http://localhost:8088/testmodel.ifc"; // get path into this
//  loadIfc(path);

//window.ondblclick = () => viewer.IFC.selector.pickIfcItem();

//get ifc properties, need to add the html element etc..
const propsGUI = document.getElementById("ifc-property-menu-root");

document.getElementById("ifc-property-menu").style.display = "none";
document.getElementById("ifc-tree-menu").style.display = "none";
document.getElementById("checkboxes").style.display = "none";

//modelName("Test IFC model"); //need to get the model name from bimserver - from project id? - call getProjects socket event, get the name from list of ids where id is in url

//checkboxes(); //this is not working

toolbar();

//select IFC elements
window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();

window.ondblclick = async () => {
  const result = await viewer.IFC.selector.pickIfcItem(); //highlightIfcItem hides all other elements
  if (!result) return;
  const { modelID, id } = result;
  const props = await viewer.IFC.getProperties(modelID, id, true, false); //can also use getTypeProperties(), getMaterialProperties() and getPropertySets()
  console.log(props); //call the function here
  createPropertiesMenu(props);
  document.getElementById("ifc-property-menu").style.display = "initial";
  propertiesButton.classList.add("active");
};

//set up clipping planes - try to put inside function (see three model loader - switch views button)
const clipButton = document.getElementById("clipPlaneButton");

let clippingPlanesActive = false;
clipButton.onclick = () => {
  clippingPlanesActive = !clippingPlanesActive;
  viewer.clipper.active = clippingPlanesActive;

  if (clippingPlanesActive) {
    //add or remove active class depending on wether button is clicked and clipping planes are active
    clipButton.classList.add("active");
  } else {
    clipButton.classList.remove("active");
  }
};

//on right mouse click
window.onauxclick = () => {
    if (clippingPlanesActive) {
      viewer.clipper.createPlane();
    }
  };

window.onkeydown = (event) => {
  if (event.code === "Delete" && clippingPlanesActive) {
    // viewer.clipper.deletePlane();
    viewer.clipper.deleteAllPlanes();
  }
};

//IFC tree view
const toggler = document.getElementsByClassName("caret");
for (let i = 0; i < toggler.length; i++) {
    toggler[i].onclick = () => {
        toggler[i].parentElement.querySelector(".nested").classList.toggle("tree-active");
        toggler[i].classList.toggle("caret-down");
    }
}

// hiding/filters


  
  // Gets the name of a category
  function getName(category) {
    const names = Object.keys(categories);
    return names.find(name => categories[name] === category);
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
      checkBox.addEventListener('change', (event) => {
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
    ifcProject.children.forEach(child => {
        constructTreeMenuNode(ifcProjectNode, child);
    })
}

function nodeToString(node) {
    return `${node.type} - ${node.expressID}`
}

function constructTreeMenuNode(parent, node) {
    const children = node.children;
    if (children.length === 0) {
        createSimpleChild(parent, node);
        return;
    }
    const nodeElement = createNestedChild(parent, node);
    children.forEach(child => {
        constructTreeMenuNode(nodeElement, child);
    })
}

function createNestedChild(parent, node) {
    const content = nodeToString(node);
    const root = document.createElement('li');
    createTitle(root, content);
    const childrenContainer = document.createElement('ul');
    childrenContainer.classList.add("nested");
    root.appendChild(childrenContainer);
    parent.appendChild(root);
    return childrenContainer;
}

function createTitle(parent, content) {
    const title = document.createElement("span");
    title.classList.add("caret");
    title.onclick = () => {
        title.parentElement.querySelector(".nested").classList.toggle("tree-active");
        title.classList.toggle("caret-down");
    }
    title.textContent = content;
    parent.appendChild(title);
}

function createSimpleChild(parent, node) {
    const content = nodeToString(node);
    const childNode = document.createElement('li');
    childNode.classList.add('leaf-node');
    childNode.textContent = content;
    parent.appendChild(childNode);

    childNode.onmouseenter = () => {
        viewer.IFC.selector.prepickIfcItemsByID(0, [node.expressID]);
    }

    childNode.onclick = async () => {
        viewer.IFC.selector.pickIfcItemsByID(0, [node.expressID], true);

        let idsArray = [node.expressID];

        const props = await viewer.IFC.getProperties(0, idsArray[0], true, false); //can also use getTypeProperties(), getMaterialProperties() and getPropertySets()
        console.log(props); //call the function here
        createPropertiesMenu(props);
        document.getElementById("ifc-property-menu").style.display = "initial";
        propertiesButton.classList.add("active");
    }
}


//IFC properties menu functions
function createPropertiesMenu(properties) {
    //console.log(properties);
  
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