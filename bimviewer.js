import { Color } from "three";
import { IfcViewerAPI } from "web-ifc-viewer";
import { modelName, toolbar, checkboxes } from "./overlay.js";

const socketiourl = "http://192.168.236.229:8088/"; //edit socket.io url here

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

socket.emit("getLatestRevision", currentProjectID);

async function loadIfc(url) {
  // Load the model
  const model = await viewer.IFC.loadIfcUrl(url);

  // Add dropped shadow and post-processing efect
  await viewer.shadowDropper.renderShadow(model.modelID);
  viewer.context.renderer.postProduction.active = true;
}

socket.on("fileName", (fileName) => {
  let path = socketiourl + fileName; //change here too or make it global variable
  loadIfc(path);
  //console.log(path);


});

// let path = "http://localhost:8088/testmodel.ifc"; // get path into this
// loadIfc(path);

//window.ondblclick = () => viewer.IFC.selector.pickIfcItem();

//get ifc properties, need to add the html element etc..
const propsGUI = document.getElementById("ifc-property-menu-root");



modelName("Test IFC model"); //need to get the model name from bimserver - from project id? - call getProjects socket event, get the name from list of ids where id is in url

//checkboxes();

svgPaths = [
  "M21.172 24l-7.387-7.387c-1.388.874-3.024 1.387-4.785 1.387-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9c0 1.761-.514 3.398-1.387 4.785l7.387 7.387-2.828 2.828zm-12.172-8c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7zm-3-8c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1zm3 0c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1zm3 0c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1z",
  "M18 10.031v-6.423l-6.036-3.608-5.964 3.569v6.499l-6 3.224v7.216l6.136 3.492 5.864-3.393 5.864 3.393 6.136-3.492v-7.177l-6-3.3zm-1.143.036l-4.321 2.384v-4.956l4.321-2.539v5.111zm-4.895-8.71l4.272 2.596-4.268 2.509-4.176-2.554 4.172-2.551zm-10.172 12.274l4.778-2.53 4.237 2.417-4.668 2.667-4.347-2.554zm4.917 3.587l4.722-2.697v5.056l-4.722 2.757v-5.116zm6.512-3.746l4.247-2.39 4.769 2.594-4.367 2.509-4.649-2.713zm9.638 6.323l-4.421 2.539v-5.116l4.421-2.538v5.115z",
  "M14.686 13.646l-6.597 3.181c-1.438.692-2.755-1.124-2.755-1.124l6.813-3.287 2.539 1.23zm6.168 5.354c-.533 0-1.083-.119-1.605-.373-1.511-.731-2.296-2.333-1.943-3.774.203-.822-.23-.934-.891-1.253l-11.036-5.341s1.322-1.812 2.759-1.117c.881.427 4.423 2.136 7.477 3.617l.766-.368c.662-.319 1.094-.43.895-1.252-.351-1.442.439-3.043 1.952-3.77.521-.251 1.068-.369 1.596-.369 1.799 0 3.147 1.32 3.147 2.956 0 1.23-.766 2.454-2.032 3.091-1.266.634-2.15.14-3.406.75l-.394.19.431.21c1.254.614 2.142.122 3.404.759 1.262.638 2.026 1.861 2.026 3.088 0 1.64-1.352 2.956-3.146 2.956zm-1.987-9.967c.381.795 1.459 1.072 2.406.617.945-.455 1.405-1.472 1.027-2.267-.381-.796-1.46-1.073-2.406-.618-.946.455-1.408 1.472-1.027 2.268zm-2.834 2.819c0-.322-.261-.583-.583-.583-.321 0-.583.261-.583.583s.262.583.583.583c.322.001.583-.261.583-.583zm5.272 2.499c-.945-.457-2.025-.183-2.408.611-.381.795.078 1.814 1.022 2.271.945.458 2.024.184 2.406-.611.382-.795-.075-1.814-1.02-2.271zm-18.305-3.351h-3v2h3v-2zm4 0h-3v2h3v-2z",
  "M4 22h-4v-4h4v4zm0-12h-4v4h4v-4zm0-8h-4v4h4v-4zm3 0v4h17v-4h-17zm0 12h17v-4h-17v4zm0 8h17v-4h-17v4z",
  "M1.438 16.873l-1.438 7.127 7.127-1.437 16.874-16.872-5.69-5.69-16.873 16.872zm1.12 4.572l.722-3.584 2.86 2.861-3.582.723zm18.613-15.755l-13.617 13.617-2.86-2.861 13.617-13.617 2.86 2.861z",
];

toolbar();


window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();

window.ondblclick = async () => {
  const result = await viewer.IFC.selector.pickIfcItem(); //highlightIfcItem hides all other elements
  if (!result) return;
  const { modelID, id } = result;
  const props = await viewer.IFC.getProperties(modelID, id, true, false); //can also use getTypeProperties(), getMaterialProperties() and getPropertySets()
  console.log(props); //call the function here
  createPropertiesMenu(props);
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



//document.getElementById("ifc-property-menu").style.display = "flex"

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


//fix this (see three model loader) and put it inside function 
// const propertiesButton = document.getElementById("propertiesButton");
// let propertiesVisible = true;
// propertiesButton.onclick= () => {
//     if (propertiesVisible) {
//         propertiesVisible != propertiesVisible;
//         document.getElementById("ifc-property-menu").style.display = "none";
//     }
//     else if (propertiesVisible === false) {
//         document.getElementById("ifc-property-menu").style.display = "initial";
//     }

// }

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