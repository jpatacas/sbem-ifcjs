//UI functions

//needs to be fixed, it is over other html elements!
export function modelName (modelName) {
    const modelNameContainer = document.createElement('div');
    modelNameContainer.className = "simple-card-container top";
  
    const modelTitle = document.createElement('div');
    modelTitle.className = "simple-card";
  
    modelTitle.textContent = modelName;
  
    modelNameContainer.appendChild(modelTitle);
    document.body.appendChild(modelNameContainer);
}

function button (svgpath) {

    const button = document.createElement('a');
    button.className = 'button';
    button.href= './bimviewer.html'; //also needs to be an input
    
  
    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.setAttribute('width', '15');
    svgEl.setAttribute('height','15');
    svgEl.setAttribute('viewBox','0 0 24 24');
    
    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path1.setAttribute('d', svgpath );
  
    svgEl.appendChild(path1);
    button.appendChild(svgEl);
  
    return button;
  
  }


export function toolbarTop() {

    const cardContainer = document.createElement('div');
    cardContainer.className = 'simple-card-container-home top left';
    cardContainer.id = 'simple-card-container-home-top';

    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';

    toolbar.appendChild(homeButton());

    cardContainer.appendChild(toolbar);

    document.body.appendChild(cardContainer);

}

export function toolbarBottom() { //need to get the functions from the three js project... (create buttons separately)

    const cardContainer = document.createElement('div');
    cardContainer.className = 'simple-card-container bottom';

    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';

    // for (let svgpath of svgPaths){
    //     toolbar.appendChild(button(svgpath));
    // }

    //toolbar.appendChild(homeButton());
    toolbar.appendChild(treeButton());
    toolbar.appendChild(filterButton());
    toolbar.appendChild(clipPlaneButton());
    toolbar.appendChild(annotationsButton());
    toolbar.appendChild(propertiesButton());

    cardContainer.appendChild(toolbar);

    document.body.appendChild(cardContainer);

}

// UI categories functions

function checkbox (category, text) {

    const checkbox = document.createElement('div');
    checkbox.className = "checkbox-item";


    const checkboxTextDiv = document.createElement('div');
    

    const checkboxInput = document.createElement('input');
    checkboxTextDiv.textContent = text;

    const checkboxInputDiv = document.createElement('div');
    checkboxInputDiv.className = "checkbox-value";
  
    checkboxInput.checked = true; //not working?
    checkboxInput.id = category;
    checkboxInput.type = 'checkbox';
  
    //create divs inside the checkbox div, like ifc property menu. 

    checkboxInputDiv.appendChild(checkboxInput);

    checkbox.appendChild(checkboxTextDiv);
   
    checkbox.appendChild(checkboxInputDiv);
  
    return checkbox;
  
  }
  
  export function createCheckboxes() { // need to improve this and check if categories are ok
    const checkboxes = document.createElement('div');
    checkboxes.className = 'checkboxes';
    checkboxes.id = "checkboxes";
  
    let categoriesName = [
      "Walls",
      "Slabs",
      "Furniture",
      "Doors",
      "Windows",
      "Curtain wall plates",
      "Curtain wall structure",
      "Spaces",
      "Site",
      "Roofs",
      "Other"
    ]
  
    const categoriesText = [
      "IFCWALLSTANDARDCASE",
      "IFCSLAB",
      "IFCFURNISHINGELEMENT",
      "IFCDOOR",
      "IFCWINDOW",
      "IFCPLATE",
      "IFCMEMBER",
      "IFCSPACE",
      "IFCSITE",
      "IFCROOF",
      "IFCBUILDINGELEMENTPROXY"
    ]
  
    for (let i = 0; i < categoriesText.length; i++){
        checkboxes.appendChild(checkbox(categoriesText[i], categoriesName[i]))
    }
  
    // checkboxes.appendChild(checkbox(categories.IFCWALLSTANDARDCASE, texts[0]));
  
    document.body.appendChild(checkboxes);
  }

export function createCardDiv(projectName, projectId) {
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

export function createEnergyButton(id) {
    const card = document.createElement('div');
    card.className = "card";
    card.id = id;

    const svgElement = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgElement.setAttribute('width', '24');
    svgElement.setAttribute('height','24');
    svgElement.setAttribute('viewBox','0 0 24 24');
    
    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path1.setAttribute('d', 'M18 10.031v-6.423l-6.036-3.608-5.964 3.569v6.499l-6 3.224v7.216l6.136 3.492 5.864-3.393 5.864 3.393 6.136-3.492v-7.177l-6-3.3zm-1.143.036l-4.321 2.384v-4.956l4.321-2.539v5.111zm-4.895-8.71l4.272 2.596-4.268 2.509-4.176-2.554 4.172-2.551zm-10.172 12.274l4.778-2.53 4.237 2.417-4.668 2.667-4.347-2.554zm4.917 3.587l4.722-2.697v5.056l-4.722 2.757v-5.116zm6.512-3.746l4.247-2.39 4.769 2.594-4.367 2.509-4.649-2.713zm9.638 6.323l-4.421 2.539v-5.116l4.421-2.538v5.115z' );

    svgElement.appendChild(path1);
    card.appendChild(svgElement);

    const h2Element = document.createElement('h2');
    //h2Element.textContent = projectName;
    
    card.appendChild(h2Element);

    const button = document.createElement('a');
    button.className = 'button';
    //button.href = './bimviewer.html' + `?id=${projectId}`;
    //button.href= projectId; //also needs to be an input
    button.textContent = "274 kwh/yr";

    card.appendChild(button);

    

    // const projectContainer = document.getElementById("projects-container");
    // projectContainer.appendChild(card);

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
function homeButton() {

    const homeButton= document.createElement("button"); //should these be buttons instead of 'a'?
    homeButton.className = "homebutton";

   // homeButton.href = "./index.html";
    homeButton.setAttribute("onclick","window.location.href='./index.html';");
    //filterButton.

    const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgEl.setAttribute("width", "50");
    svgEl.setAttribute("height", "50");
    svgEl.setAttribute("viewBox", "0 0 24 24");

    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M22 11.414v12.586h-20v-12.586l-1.293 1.293-.707-.707 12-12 12 12-.707.707-1.293-1.293zm-6 11.586h5v-12.586l-9-9-9 9v12.586h5v-9h8v9zm-1-7.889h-6v7.778h6v-7.778z"); //change icon here

    svgEl.appendChild(path1);
    homeButton.appendChild(svgEl);

    return homeButton;

}

function filterButton() { //need individual class names for buttons?

    const filterButton = document.createElement("button"); //should these be buttons instead of 'a'?
    filterButton.className = "button";

    const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgEl.setAttribute("width", "15");
    svgEl.setAttribute("height", "15");
    svgEl.setAttribute("viewBox", "0 0 24 24");

    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M19.479 2l-7.479 12.543v5.924l-1-.6v-5.324l-7.479-12.543h15.958zm3.521-2h-23l9 15.094v5.906l5 3v-8.906l9-15.094z"); //add svg

    svgEl.appendChild(path1);
    filterButton.appendChild(svgEl);

    filterButton.addEventListener("click", function() {
 
         if (document.getElementById("checkboxes").style.display === "initial")
         {
             document.getElementById("checkboxes").style.display = "none";
             filterButton.classList.remove("active");
             //reset filter here?
         }
         else if (document.getElementById("checkboxes").style.display === "none")
         {
             document.getElementById("checkboxes").style.display = "initial";
             filterButton.classList.add("active");
         }
         
         
         }, false);

    return filterButton;

}

function propertiesButton() { //toggle on off properties

    const propertiesButton = document.createElement("button");
    propertiesButton.className = "button";
    propertiesButton.id = "propertiesButton";

    const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgEl.setAttribute("width", "15");
    svgEl.setAttribute("height", "15");
    svgEl.setAttribute("viewBox", "0 0 24 24");

    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M4 22h-4v-4h4v4zm0-12h-4v4h4v-4zm0-8h-4v4h4v-4zm3 0v4h17v-4h-17zm0 12h17v-4h-17v4zm0 8h17v-4h-17v4z");

    svgEl.appendChild(path1);
    propertiesButton.appendChild(svgEl);

    //let propertiesVisible = true;
    let mouseDown = false;
    //events to switch between views
    propertiesButton.addEventListener("click", function() {
       // document.getElementById("ifc-property-menu").style.display = "initial";

        // if (mouseDown === false) {
        //     mouseDown = true;
        //     document.getElementById("ifc-property-menu").style.display = "initial";
        //     propertiesButton.classList.add("active");
        // } else if (mouseDown === true) {
        //     mouseDown = false;
        //     document.getElementById("ifc-property-menu").style.display = "none";
        //     propertiesButton.classList.remove("active");
        // }

        if (document.getElementById("ifc-property-menu").style.display === "initial")
        {
            document.getElementById("ifc-property-menu").style.display = "none";
            propertiesButton.classList.remove("active");
        }
        else if (document.getElementById("ifc-property-menu").style.display === "none")
        {
            document.getElementById("ifc-property-menu").style.display = "initial";
            propertiesButton.classList.add("active");
        }
        
        
        }, false);

    return propertiesButton;

}

function clipPlaneButton() {

    const clipPlaneButton = document.createElement("button");
    clipPlaneButton.className = "button";
    clipPlaneButton.id = "clipPlaneButton";

    const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgEl.setAttribute("width", "15");
    svgEl.setAttribute("height", "15");
    svgEl.setAttribute("viewBox", "0 0 24 24");

    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M14.686 13.646l-6.597 3.181c-1.438.692-2.755-1.124-2.755-1.124l6.813-3.287 2.539 1.23zm6.168 5.354c-.533 0-1.083-.119-1.605-.373-1.511-.731-2.296-2.333-1.943-3.774.203-.822-.23-.934-.891-1.253l-11.036-5.341s1.322-1.812 2.759-1.117c.881.427 4.423 2.136 7.477 3.617l.766-.368c.662-.319 1.094-.43.895-1.252-.351-1.442.439-3.043 1.952-3.77.521-.251 1.068-.369 1.596-.369 1.799 0 3.147 1.32 3.147 2.956 0 1.23-.766 2.454-2.032 3.091-1.266.634-2.15.14-3.406.75l-.394.19.431.21c1.254.614 2.142.122 3.404.759 1.262.638 2.026 1.861 2.026 3.088 0 1.64-1.352 2.956-3.146 2.956zm-1.987-9.967c.381.795 1.459 1.072 2.406.617.945-.455 1.405-1.472 1.027-2.267-.381-.796-1.46-1.073-2.406-.618-.946.455-1.408 1.472-1.027 2.268zm-2.834 2.819c0-.322-.261-.583-.583-.583-.321 0-.583.261-.583.583s.262.583.583.583c.322.001.583-.261.583-.583zm5.272 2.499c-.945-.457-2.025-.183-2.408.611-.381.795.078 1.814 1.022 2.271.945.458 2.024.184 2.406-.611.382-.795-.075-1.814-1.02-2.271zm-18.305-3.351h-3v2h3v-2zm4 0h-3v2h3v-2z");

    svgEl.appendChild(path1);
    clipPlaneButton.appendChild(svgEl);

    return clipPlaneButton;

}

function treeButton() {

    const treeButton = document.createElement("button");
    treeButton.className = "button";

    const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgEl.setAttribute("width", "15");
    svgEl.setAttribute("height", "15");
    svgEl.setAttribute("viewBox", "0 0 24 24");
    svgEl.setAttribute("transform", "rotate(270 0 0)");

    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M22 18v-7h-9v-5h3v-6h-8v6h3v5h-9v7h-2v6h6v-6h-2v-5h7v5h-2v6h6v-6h-2v-5h7v5h-2v6h6v-6z");

    svgEl.appendChild(path1);
    treeButton.appendChild(svgEl);

    let mouseDown = false;
    //events to switch between views
    treeButton.addEventListener("click", function() {
        // if (mouseDown === false) {
        //     mouseDown = true;
        //     document.getElementById("ifc-tree-menu").style.display = "none";
        //     treeButton.classList.remove("active");
        // } else if (mouseDown === true) {
        //     mouseDown = false;
        //     document.getElementById("ifc-tree-menu").style.display = "initial";
        //     treeButton.classList.add("active");
        // }

        if (document.getElementById("ifc-tree-menu").style.display === "initial")
        {
            document.getElementById("ifc-tree-menu").style.display = "none";
            treeButton.classList.remove("active");
            document.getElementById("simple-card-container-home-top").className = 'simple-card-container-home top left';

        }
        else if (document.getElementById("ifc-tree-menu").style.display === "none")
        {
            document.getElementById("ifc-tree-menu").style.display = "initial";
            treeButton.classList.add("active");
            document.getElementById("simple-card-container-home-top").className = 'simple-card-container top';

        }


        }, false);


    return treeButton;

}

function annotationsButton() {

    const annotationsButton = document.createElement("button");
    annotationsButton.className = "button";
    annotationsButton.id = "annotationsButton";

    const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgEl.setAttribute("width", "15");
    svgEl.setAttribute("height", "15");
    svgEl.setAttribute("viewBox", "0 0 24 24");

    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M1.438 16.873l-1.438 7.127 7.127-1.437 16.874-16.872-5.69-5.69-16.873 16.872zm1.12 4.572l.722-3.584 2.86 2.861-3.582.723zm18.613-15.755l-13.617 13.617-2.86-2.861 13.617-13.617 2.86 2.861z");

    svgEl.appendChild(path1);
    annotationsButton.appendChild(svgEl);


    return annotationsButton;

}

function energyuseButton () {
    const energyuseButton = document.createElement("button");
    energyuseButton.className = "button";
    energyuseButton.id = "energyuse-Button";

    const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgEl.setAttribute("width", "15");
    svgEl.setAttribute("height", "15");
    svgEl.setAttribute("viewBox", "0 0 24 24");

    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M1.438 16.873l-1.438 7.127 7.127-1.437 16.874-16.872-5.69-5.69-16.873 16.872zm1.12 4.572l.722-3.584 2.86 2.861-3.582.723zm18.613-15.755l-13.617 13.617-2.86-2.861 13.617-13.617 2.86 2.861z");

    svgEl.appendChild(path1);
    annotationsButton.appendChild(svgEl);

    
    energyuseButton.addEventListener("click", function() { 
        //show/hide energy button

        

        if (document.getElementById("energyuse-button").style.display === "initial")
        {
            document.getElementById("energyuse-button").style.display = "none";
            energyuseButton.classList.remove("active");
        }
        else if (document.getElementById("energyuse-button").style.display === "none")
        {
            document.getElementById("energyuse-button").style.display = "initial";
            energyuseButton.classList.add("active");
        }
    }
    )


    return energyuseButton;
}

export function createIfcTreeMenu() {
    const ifcTreeMenuDiv = document.createElement("div");
    ifcTreeMenuDiv.className = "ifc-tree-menu";
    ifcTreeMenuDiv.id = "ifc-tree-menu";

    const myUL = document.createElement("ul");
    myUL.id = "myUL";

    const treeRoot = document.createElement("li");
    treeRoot.id = "tree-root";

    const caretSpan = document.createElement("span");
    caretSpan.className = "caret";
    const ulNested = document.createElement("ul");
    ulNested.className = "nested";

   

    treeRoot.appendChild(caretSpan);
    treeRoot.appendChild(ulNested);
    myUL.appendChild(treeRoot);
    ifcTreeMenuDiv.appendChild(myUL);

    document.body.appendChild(ifcTreeMenuDiv);

}

export function createIfcPropertyMenu() {
    const ifcPropertyMenuDiv = document.createElement("div");
    ifcPropertyMenuDiv.className = "ifc-property-menu bottom_right";
    ifcPropertyMenuDiv.id = "ifc-property-menu";

    const ifcPropertyItem = document.createElement("div");
    ifcPropertyItem.className = "ifc-property-item";

    const key = document.createElement("div");
    key.innerText = "Property";

    const ifcPropertyValue = document.createElement("div");
    ifcPropertyValue.className = "ifc-property-value";
    ifcPropertyValue.innerText = "Value";

    const ifcPropMenuRoot = document.createElement("div");
    ifcPropMenuRoot.id = "ifc-property-menu-root";


    ifcPropertyItem.appendChild(key);
    ifcPropertyItem.appendChild(ifcPropertyValue);
    ifcPropertyMenuDiv.appendChild(ifcPropertyItem);
    ifcPropertyMenuDiv.appendChild(ifcPropMenuRoot);
    document.body.appendChild(ifcPropertyMenuDiv);

}

// https://www.tutorialspoint.com/building-a-map-from-2-arrays-of-values-and-keys-in-javascript
export function buildMap (keys, values) {
    const map = new Map();
    for(let i = 0; i < keys.length; i++){
       map.set(keys[i], values[i]);
    };
    return map;
 };