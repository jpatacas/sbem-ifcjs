//create a section element and create the divs inside

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

// export function createSection () {
//     const section = document.createElement('section');
//     section.className = "project-list";
    
//     let card1 = createCardDiv(); //needs to be a array?
//     let card2 = createCardDiv();

//     section.appendChild(card1);
//     section.appendChild(card2);
//     document.body.appendChild(section);
// }

function buildMap (keys, values) {
    const map = new Map();
    for(let i = 0; i < keys.length; i++){
       map.set(keys[i], values[i]);
    }    return map;
 }

//get list of projects from bimserver, create a card for each project

const socket = io("http://localhost:8088/");

socket.on("hello", (arg) => {
    console.log(arg);
});

socket.emit("getProjects", "getProjects");

console.log("hello model list");

socket.on("projectIds",(resname, reslist) => {

    let projectsMap = buildMap(resname, reslist);

    projectsMap.forEach(function (value, key) {
        createCardDiv(key, value);
    });

    console.log(resname + reslist); 
    //console.log("projectIds")

}
);
