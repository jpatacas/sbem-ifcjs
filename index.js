import {createSection} from './overlay.js';

//get list of projects from bimserver, create a card for each project

const socket = io("http://localhost:8088/");

socket.on("hello", (arg) => {
    console.log(arg);
})

socket.emit("getProjects", "getProjects");

createSection();

console.log("hello model list")


socket.on("projectIds",(arg) => {

    //create section here with id = args
    

    console.log(arg) 
    console.log("projectIds")

}
)