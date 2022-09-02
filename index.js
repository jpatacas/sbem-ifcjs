import { checkinIFC } from './bimserver-client-upload.js';
import {createCardDiv, buildMap, uploadCard, modelName} from './overlay.js';
import { socket } from './projects.js';


// for (let proj of projects)
// {
//     createCardDiv(proj.name, proj.id);
//    // console.log(proj.name, proj.id);
// }

//get list of projects from bimserver, create a card for each project



socket.on("hello", (arg) => {
    console.log(arg);
})

uploadCard();

socket.emit("getProjects", "getProjects"); //get projects from a bimserver

socket.on("projectIds",(resname, reslist) => {

    let projectsMap = buildMap(resname, reslist);

    projectsMap.forEach(function (value, key) {
        createCardDiv(key, value);
    });

    //console.log(resname + reslist) 
    //console.log("projectIds")

}
)

const input = document.getElementById("file-input");
input.addEventListener(
  "change", //create project, upload file to project/bimserver 
  async (changed) => {

//     var fullPath = document.getElementById('upload').value;
// if (fullPath) {
//     var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
//     var filename = fullPath.substring(startIndex);
//     if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
//         filename = filename.substring(1);
//     }
//     alert(filename);
// }


    //create a project and load the file to bimserver
    
    //let ifcFile = await changed.target.files[0];
   // const modelURL = URL.createObjectURL(ifcFile); //pass it into bimserverapi(client)
    console.log("input.value: " + input.value);

    //look for filw with above name, upload that file URL (hack only works for local folder)
   //this (input stream? to DataHandler, pass DataHandler)
   let ifcURLlocal = input.value;
  
   
   let ifcURL2 = ifcURLlocal.substr(12);

   
   
   let path = "http://localhost:5500/models/"

   let ifcURL = path + ifcURL2;

   console.log("ifcl url path: " + ifcURL);
    checkinIFC(ifcURL, ifcURL2);
    

    //socket.emit("getProjects", "getProjects");

    //open the page with the model
    //get model id..
    //socket get projects
    //get where proj name = reslist

    socket.emit("getProjects", "getProjects"); //get projects from a bimserver

    socket.on("projectIds",(resname, reslist) => {

    let projectsMap = buildMap(resname, reslist);

    projectsMap.forEach(function (value, key) {
        console.log(key, value);
    });

    //console.log(resname + reslist) 
    //console.log("projectIds")

}
)

    //window.location.href = "https://www.example.com";

  });