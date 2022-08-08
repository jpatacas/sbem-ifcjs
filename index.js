import {buildMap, createCardDiv, createSection} from './overlay.js';

//get list of projects from bimserver, create a card for each project

const socket = io("http://localhost:8088/");

socket.on("hello", (arg) => {
    console.log(arg);
})

socket.emit("getProjects", "getProjects");

console.log("hello model list")

socket.on("projectIds",(resname, reslist) => {

    let projectsMap = buildMap(resname, reslist);

    projectsMap.forEach(function (value, key) {
        createCardDiv(key, value);
    });

    console.log(resname + reslist) 
    //console.log("projectIds")

}
)