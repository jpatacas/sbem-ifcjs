import { createCardDiv, buildMap, uploadCard } from "./uifunctions.js";
import { socket, socketpy } from "./projects.js";

//get list of projects from bimserver, create a card for each project

socketpy.on("connect", () => {
  console.log("connected");
  socketpy.emit("sum", { numbers: [1, 2] });
});

socketpy.on("disconnect", () => {
  console.log("disconnected");
});

uploadCard();

socket.emit("getProjects", "getProjects"); //get projects from a bimserver

socket.on("projectIds", (resname, reslist) => {
  let projectsMap = buildMap(resname, reslist);

  projectsMap.forEach(function (value, key) {
    createCardDiv(key, value);
    console.log("key: " + key + " value: " + value);
  });
});

const input = document.getElementById("file-input");

input.addEventListener(
  "change", //create project, upload file to project/bimserver
  async (changed) => {
    let ifcURLlocal = input.value;

    let modelName = ifcURLlocal.substr(12); //get just the modelname

    let path = "http://localhost:5500/models/"; //e.g. using VS code live server

    let ifcURL = path + modelName;

    let modelNameNoExt = modelName.substr(0, modelName.length - 4);

    socket.emit("uploadModel", modelNameNoExt, ifcURL);

    socket.on("newProjectData", (fileName, poid) => {
      window.location.href = "./bimviewer.html" + `?id=${poid}`;
    });
  }
);
