import {buildMap, createCardDiv} from './overlay.js';
import { projects } from './projects.js';

//get list of projects from bimserver, create a card for each project

//local
//const socket = io("http://localhost:8088/");
//const socket = io("http://localhost:8088/");

//aws
//const socket = io("http://13.40.172.106:8088/");


// socket.on("hello", (arg) => {
//     console.log(arg);
// })

//socket.emit("getProjects", "getProjects"); //get projects from a bimserver

// console.log("hello model list")

//proj map
// let projnames = ["A-MEP","TESTED_Simple_project_01","TESTED_Simple_project_02","rac_advanced_sample_project","rac_basic_sample_project"];
// let projids = ["3145729","2883585","2949121","3080193","3014657"];



for (let proj of projects)
{
    createCardDiv(proj.name, proj.id);
    console.log(proj.name, proj.id);
}

//need to build the projects map for locally hosted files instead of bimserver...
// socket.on("projectIds",(resname, reslist) => {

//     let projectsMap = buildMap(resname, reslist);

//     projectsMap.forEach(function (value, key) {
//         createCardDiv(key, value);
//     });

//     console.log(resname + reslist) 
//     //console.log("projectIds")

// }
// )