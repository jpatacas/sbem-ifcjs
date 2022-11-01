//UI functions

function uploadCard() {

      //upload - no svg? - how to remove choose file box?
      const uploadCard = document.createElement('input');
      uploadCard.type = 'file';
      uploadCard.id = 'file-input';
      uploadCard.className = 'button';
  
      const card = document.createElement("div");
      card.className = "card";
    
      const svgElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      svgElement.setAttribute("width", "24");
      svgElement.setAttribute("height", "24");
      svgElement.setAttribute("viewBox", "0 0 24 24");
    
      const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path1.setAttribute(
        "d",
        "m11 11h-7.25c-.414 0-.75.336-.75.75s.336.75.75.75h7.25v7.25c0 .414.336.75.75.75s.75-.336.75-.75v-7.25h7.25c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-7.25v-7.25c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
      );
    
      svgElement.appendChild(path1);
      card.appendChild(svgElement);
    
      card.appendChild(uploadCard);
    
      const projectContainer = document.getElementById("projects-container");
      projectContainer.appendChild(card);
}

function createCardDiv(projectName, projectId) {
  const card = document.createElement("div");
  card.className = "card";

  const svgElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  svgElement.setAttribute("width", "24");
  svgElement.setAttribute("height", "24");
  svgElement.setAttribute("viewBox", "0 0 24 24");

  const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path1.setAttribute(
    "d",
    "m3.514 6.636c-.317.179-.514.519-.514.887v8.95c0 .37.197.708.514.887 1.597.901 6.456 3.639 8.005 4.512.152.085.319.128.487.128.164 0 .328-.041.477-.123 1.549-.855 6.39-3.523 7.994-4.408.323-.177.523-.519.523-.891v-9.055c0-.368-.197-.708-.515-.887-1.595-.899-6.444-3.632-7.999-4.508-.151-.085-.319-.128-.486-.128-.168 0-.335.043-.486.128-1.555.876-6.405 3.609-8 4.508zm15.986 2.115v7.525l-6.75 3.722v-7.578zm-14.264-1.344 6.764-3.813 6.801 3.834-6.801 3.716z"
  );

  svgElement.appendChild(path1);
  card.appendChild(svgElement);

  const h2Element = document.createElement("h2");
  h2Element.textContent = projectName;

  card.appendChild(h2Element);

  const button = document.createElement("a");
  button.className = "button";
  button.href = "./bimviewer.html" + `?id=${projectId}`;
  //button.href= projectId; //also needs to be an input
  button.textContent = "Model";

  card.appendChild(button);

  const projectContainer = document.getElementById("projects-container");
  projectContainer.appendChild(card);
}

//only used for the bimserver version
// https://www.tutorialspoint.com/building-a-map-from-2-arrays-of-values-and-keys-in-javascript
function buildMap(keys, values) {
  const map = new Map();
  for (let i = 0; i < keys.length; i++) {
    map.set(keys[i], values[i]);
  }
  return map;
}

const socketiourl = "http://localhost:8088/";

const socketpyurl = "http://localhost:8000/";

const socketpy = io(socketpyurl);

const socket = io(socketiourl);

// export const projects = [
//   {
//     name: "Duplex-A-MEP",
//     id: "3145729",
//   },
//   {
//     name: "TESTED_Simple_project_01",
//     id: "2883585",
//   },
//   {
//     name: "TESTED_Simple_project_02",
//     id: "2949121",
//   },
//   {
//     name: "rac_advanced_sample_project",
//     id: "3080193",
//   },
//   {
//     name: "rac_basic_sample_project",
//     id: "3014657",
//   },
// ];

// for (let proj of projects)
// {
//     createCardDiv(proj.name, proj.id);
//    // console.log(proj.name, proj.id);
// }

//get list of projects from bimserver, create a card for each project

socketpy.on('connect', () => {
  console.log('connected');
  socketpy.emit('sum', {numbers: [1,2]});
});

// socketpy.on('sum_result', (data) => {console.log(data)}
// )
// socketpy.on('test', (test) => { console.log(test)})

socketpy.on('disconnect', () => {
  console.log('disconnected');
});

socket.on("hello", (arg) => {
  console.log(arg);
});

uploadCard();

socket.emit("getProjects", "getProjects"); //get projects from a bimserver

socket.on("projectIds", (resname, reslist) => {
  let projectsMap = buildMap(resname, reslist);

  projectsMap.forEach(function (value, key) {
    createCardDiv(key, value);
  });

  //console.log(resname + reslist)
  //console.log("projectIds")
});

const input = document.getElementById("file-input");

input.addEventListener(
  "change", //create project, upload file to project/bimserver
  async (changed) => {

    let ifcURLlocal = input.value;

    let modelName = ifcURLlocal.substr(12); //get just the modelname

    let path = "http://localhost:5500/models/";

    let ifcURL = path + modelName;

    let modelNameNoExt = modelName.substr(0, modelName.length - 4);

    console.log("model name: " + modelNameNoExt);
    console.log("ifc url path: " + ifcURL);

    socket.emit("uploadModel", modelNameNoExt, ifcURL); 

    socket.on("newProjectData", (fileName, poid) => {
      console.log("new filename: " + fileName, "new project id: " + poid);
      window.location.href = "./bimviewer.html" + `?id=${poid}`;

    });
  }
);
