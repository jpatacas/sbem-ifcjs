//UI functions

function createCardDiv(projectName, projectId) {
    const card = document.createElement('div');
    card.className = "card";

    const svgElement = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgElement.setAttribute('width', '24');
    svgElement.setAttribute('height','24');
    svgElement.setAttribute('viewBox','0 0 24 24');
    
    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path1.setAttribute('d', 'M18 10.031v-6.423l-6.036-3.608-5.964 3.569v6.499l-6 3.224v7.216l6.136 3.492 5.864-3.393 5.864 3.393 6.136-3.492v-7.177l-6-3.3zm-1.143.036l-4.321 2.384v-4.956l4.321-2.539v5.111zm-4.895-8.71l4.272 2.596-4.268 2.509-4.176-2.554 4.172-2.551zm-10.172 12.274l4.778-2.53 4.237 2.417-4.668 2.667-4.347-2.554zm4.917 3.587l4.722-2.697v5.056l-4.722 2.757v-5.116zm6.512-3.746l4.247-2.39 4.769 2.594-4.367 2.509-4.649-2.713zm9.638 6.323l-4.421 2.539v-5.116l4.421-2.538v5.115z' );

    svgElement.appendChild(path1);
    card.appendChild(svgElement);

    const h2Element = document.createElement('h2');
    h2Element.textContent = projectName;
    
    card.appendChild(h2Element);

    const button = document.createElement('a');
    button.className = 'button';
    button.href = './bimviewer.html' + `?id=${projectId}`;
    //button.href= projectId; //also needs to be an input
    button.textContent = "Model";

    card.appendChild(button);

    const projectContainer = document.getElementById("projects-container");
    projectContainer.appendChild(card);

}

//make golabl and import here and bimserver.js
const projects = [ {
    name: "A-MEP",
    id: "3145729"
}, {
    name: "TESTED_Simple_project_01",
    id : "2883585"
}, {
    name: "TESTED_Simple_project_02",
    id: "2949121"
}, {
    name: "rac_advanced_sample_project",
    id: "3080193"
}, {
    name: "rac_basic_sample_project",
    id: "3014657"
}];

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
