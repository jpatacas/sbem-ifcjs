import {buildMap, createCardDiv} from './overlay.js';

//get list of projects from bimserver, create a card for each project

//local
//const socket = io("http://localhost:8088/");
const socket = io("http://192.168.236.229:8088/");

//aws
//const socket = io("http://13.40.172.106:8088/");


// socket.on("hello", (arg) => {
//     console.log(arg);
// })

socket.emit("getProjects", "getProjects"); //get projects from a bimserver

// console.log("hello model list")

socket.on("projectIds",(resname, reslist) => {

    let projectsMap = buildMap(resname, reslist);

    projectsMap.forEach(function (value, key) {
        createCardDiv(key, value);
    });

    console.log(resname + reslist) 
    //console.log("projectIds")

}
)