import { createCardDiv, buildMap, uploadCard} from "./overlay.js";
import { socket, socketpy } from "./projects.js";

// for (let proj of projects)
// {
//     createCardDiv(proj.name, proj.id);
//    // console.log(proj.name, proj.id);
// }

//get list of projects from bimserver, create a card for each project

socketpy.on('connect', () => {
  console.log('connected');
  socketpy.emit('sum', {numbers: [1,2]});
})

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
