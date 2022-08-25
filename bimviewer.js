import { Color , MeshBasicMaterial, Triangle} from "three";
import { IfcViewerAPI } from "web-ifc-viewer";
import { modelName, createCheckboxes,  createIfcTreeMenu, createIfcPropertyMenu, toolbarBottom, toolbarTop } from "./overlay.js";

import { projects } from "./projects.js";

import { //need to load additional ifc entities or remove filter
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
    IFCBUILDINGELEMENTPROXY
  } from 'web-ifc';

const socketiourl = "http://localhost:8088/"; //edit socket.io url here

// List of categories names 
const categories = {
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
    IFCBUILDINGELEMENTPROXY
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

//const socket = io(socketiourl);

//otherwise socket app will crash 
// if (currentProjectID !== null)
//     {
//         console.log("getting latest revision", currentProjectID);
//         socket.emit("getLatestRevision", currentProjectID);
//     }

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

  //floorplans try
  // await viewer.plans.computeAllPlanViews(model.modelID);

  // const allPlans = viewer.plans.getAll(model.modelID);

  // const storeys = ifcProject.children[0].children[0].children;

  // for (const plan of allPlans)
  // {
  //   const currentPlan = viewer.plans.planLists[model.modelID][plan];
  //   const planView = viewer.edges.toggle('example', true);

  //   const storey = storeys.find(storey => storey.expressID === currentPlan.expressID);

  //   drawProjectedItems(storey,plan, model.modelID);
    
  //  // console.log(currentPlan)
  //   //console.log(planView)
  // }

}
//loads the model -
// socket.on("fileName", (fileName) => {
//   let path = socketiourl + fileName; //change here too or make it global variable
//   loadIfc(path);
//   //console.log(path);
// });

//const resultJson = await viewer.IFC.properties.serializeAllProperties()


const scene = viewer.context.getScene(); //for showing/hiding categories

let path;


for (let proj of projects)
{
    //createCardDiv(proj.name, proj.id);
    console.log(proj.name, proj.id);
      if (proj.id === currentProjectID) {
    let fileName = proj.name;
    path = "./models/" + fileName + ".ifc"; // get path into this
    console.log(path);
    }
}
// for (let proj of projects)
// {
//   console.log(proj.name, proj.id);
//   if (proj.id === currentProjectID) {
//     let fileName = elem.name;
//     path = "./models/" + fileName; // get path into this
//     console.log(path);
//   }
// }

loadIfc(path);
//window.ondblclick = () => viewer.IFC.selector.pickIfcItem();

//get ifc properties, need to add the html element etc..

createIfcPropertyMenu();

const propsGUI = document.getElementById("ifc-property-menu-root");

createIfcTreeMenu();
document.getElementById("ifc-property-menu").style.display = "none";
document.getElementById("ifc-tree-menu").style.display = "none";


//createTabs(); //nned to move this to dblclick events..

//modelName("Test IFC model"); //need to get the model name from bimserver - from project id? - call getProjects socket event, get the name from list of ids where id is in url

createCheckboxes(); //this is not working
//createEnergyButton("energyuse-button");

document.getElementById("checkboxes").style.display = "none";

toolbarTop();
toolbarBottom();


//select IFC elements
window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();

window.ondblclick = async () => {
  const result = await viewer.IFC.selector.pickIfcItem(); //highlightIfcItem hides all other elements
  if (!result) return;
  const { modelID, id } = result;
  const props = await viewer.IFC.getProperties(modelID, id, true, false);
  console.log(props); 
  console.log(props.psets);

 

  // for (elem in props.psets)
  // {
  //   if (elem.value === "IfcElementQuantity")
  //   {
  //     console.log("expressID: " + elem.value.expressID);
  //   }
  //   console.log(elem.key, elem.value);
  // }
 // console.log(props);
  createPropertiesMenu(props);
  //createTabs(props, typeProps);
  document.getElementById("ifc-property-menu").style.display = "initial";
  propertiesButton.classList.add("active");

  //works, needs more testing?
  if (clippingPlanesActive) {
    viewer.clipper.createPlane();
  }

  if (measurementsActive)
  {
      viewer.dimensions.create();
  }

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

//on right mouse click - remove these events?
window.onauxclick = () => {
    if (clippingPlanesActive) {
      viewer.clipper.createPlane();
    }

    if (measurementsActive)
    {
        viewer.dimensions.create();
    }
  };

window.onkeydown = (event) => {
  if (event.code === "Delete" && clippingPlanesActive) {
    // viewer.clipper.deletePlane();
    viewer.clipper.deleteAllPlanes();
    //console.log("delete")
  }

      if(event.code === 'Delete' && measurementsActive) {
        viewer.dimensions.delete();
    }
};

//notes measurements

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

}


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

        const props = await viewer.IFC.getProperties(0, idsArray[0], true, false); 
        console.log(props); //call the function here
        createPropertiesMenu(props);
        document.getElementById("ifc-property-menu").style.display = "initial";
        propertiesButton.classList.add("active");
    }
}


//IFC properties menu functions - crete tabs here https://www.w3schools.com/howto/howto_js_tabs.asp
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

//remove this..
  async function drawProjectedItems(storey, plan, modelID) {

    const dummySubsetMat = new MeshBasicMaterial({visible: false});

    // Create a new drawing (if it doesn't exist)
    //if (!viewer.dxf.drawings[plan.name]) viewer.dxf.newDrawing(plan.name);
  
    // Get the IDs of all the items to draw
    const ids = storey.children.map(item => item.expressID);
  
    // If no items to draw in this layer in this floor plan, let's continue
    if (!ids.length) return;
  
    // If there are items, extract its geometry
    const subset = viewer.IFC.loader.ifcManager.createSubset({
      modelID,
      ids,
      removePrevious: true,
      customID: 'floor_plan_generation',
      material: dummySubsetMat,
    });
  
    // Get the projection of the items in this floor plan
    const filteredPoints = [];
    const edges = await viewer.edgesProjector.projectEdges(subset);
    const positions = edges.geometry.attributes.position.array;
    
    // Lines shorter than this won't be rendered
    const tolerance = 0.01;
    for (let i = 0; i < positions.length - 5; i += 6) {
  
      const a = positions[i] - positions[i + 3];
      // Z coords are multiplied by -1 to match DXF Y coordinate
      const b = -positions[i + 2] + positions[i + 5];
  
      const distance = Math.sqrt(a * a + b * b);
  
      if (distance > tolerance) {
        filteredPoints.push([positions[i], -positions[i + 2], positions[i + 3], -positions[i + 5]]);
      }
  
    }
    
    //console.log(positions)
    let positionsArray = Array.from(positions);

    //console.log(positionsArray)

   
    //console.log(filteredPoints);
   // console.log("edges: " + edges);
   
    // Draw the projection of the items

    for (let i = 0; i < positionsArray.length; i++)
    {
      if (positionsArray[i] === 0)
      {
        positionsArray.splice(i,1);
      }
  
    }

    let newArray = sliceIntoChunks(positionsArray, 2);

    let positionsArraySorted = newArray.sort(function(a, b) {
      if (a[0] == b[0]) {
        return a[1] - b[1];
      }
      return b[0] - a[0];
    })

    console.log(positionsArraySorted);
    
    //console.log(sliceIntoChunks(positionsArraySorted, 2));

    //console.log(calculateArea([[16.9,-5.55],[16.9, 1.85], [0, 1.85],[0, -5.55]]))

    console.log(calculateArea(sliceIntoChunks(positionsArraySorted, 2)));

  }

function calculateArea(coords) { //y, x coords are swapped, changed the function...
  let area = 0;

  for (let i = 0; i < coords.length; i++) {
    const [y1, x1] = coords[i];
    const [y2, x2] = coords[(i + 1) % coords.length];

    area += x1 * y2 - x2 * y1
  }

  return area / 2;
  // replace with
  // return Math.abs(area) / 2;
}

function sliceIntoChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      res.push(chunk);
  }
  return res;
}