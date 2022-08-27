import {createCardDiv, buildMap} from './overlay.js';
import { socket } from './projects.js';

// for (let proj of projects)
// {
//     createCardDiv(proj.name, proj.id);
//    // console.log(proj.name, proj.id);
// }

//get list of projects from bimserver, create a card for each project

//local
//const socket = io("http://localhost:8088/");

socket.on("hello", (arg) => {
    console.log(arg);
})

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