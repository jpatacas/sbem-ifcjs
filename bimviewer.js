import { Color } from "three";
import { IfcViewerAPI } from "web-ifc-viewer";
import { projects } from "./projects";

const container = document.getElementById('viewer-container');
const viewer = new IfcViewerAPI({container, backgroundColor: new Color(255,255,255)}); //white

viewer.axes.setAxes();
viewer.grid.setGrid();

const currentUrl = window.location.href;
const url = new URL(currentUrl);
const currentProjectID = url.searchParams.get("id"); //bimserver project id - use this to get latest revision etc
console.log(currentProjectID);

//const currentProject = projects.find(project => project.id === currentProjectID); //get bimserver project id here and get latest revision

const socket = io("http://localhost:8088/"); //the node.js server

socket.on("hello", (arg) => {
    console.log(arg);
})

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

socket.on("fileName", (fileName) =>{
    let path = "http://localhost:8088/" + fileName;
    loadIfc(path);
    console.log(path);
})

// let path = "http://localhost:8088/testmodel.ifc"; // get path into this
// loadIfc(path);

//window.ondblclick = () => viewer.IFC.selector.pickIfcItem();
window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();

window.ondblclick = async () => {
const result = await viewer.IFC.selector.pickIfcItem(); //highlightIfcItem hides all other elements
if (!result) return;
const {modelID, id} = result;
const props = await viewer.IFC.getProperties(modelID, id, true, false); //can also use getTypeProperties(), getMaterialProperties() and getPropertySets()
//console.log(props); //call the function here
createPropertiesMenu(props);

}

//get ifc properties, need to add the html element etc..
const propsGUI = document.getElementById("ifc-property-menu-root");



function createPropertiesMenu(properties) {
console.log(properties);

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

if(value === null || value === undefined) value = "undefined";
else if(value.value) value = value.value;

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
