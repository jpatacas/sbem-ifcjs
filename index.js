import { checkinIFC } from "./bimserver-client-upload.js";
import { createCardDiv, buildMap, uploadCard, modelName } from "./overlay.js";
import { socket } from "./projects.js";

// for (let proj of projects)
// {
//     createCardDiv(proj.name, proj.id);
//    // console.log(proj.name, proj.id);
// }

//get list of projects from bimserver, create a card for each project

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
    //look for filw with above name, upload that file URL (hack only works for local folder)
    //this (input stream? to DataHandler, pass DataHandler)
    let ifcURLlocal = input.value;

    let modelName = ifcURLlocal.substr(12); //get just the modelname

    let path = "http://localhost:5500/models/";

    let ifcURL = path + modelName;

    let modelNameNoExt = modelName.substr(0, modelName.length - 4);

    console.log("model name: " + modelNameNoExt);
    console.log("ifc url path: " + ifcURL);
    //checkinIFC(ifcURL, modelName); //do this serverside, return the project id and go to that url

    //socket.emit("createProject", "testproject" + Math.random())

    socket.emit("uploadModel", modelNameNoExt, ifcURL);

    //await uploadModel(modelNameNoExt, ifcURL);

    //howto use async await here??
    socket.on("newProjectData", (fileName, poid) => {
      console.log("new filename: " + fileName, "new project id: " + poid);
      window.location.href = "./bimviewer.html" + `?id=${poid}`;

      //issues with existing/repeat project names??
    });
  }
);

// async function uploadModel (modelName, URL) 
// {
//   socket.emit("uploadModel", modelName, URL);
// }
