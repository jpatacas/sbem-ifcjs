//UI functions

//needs to be fixed, it is over other html elements - change in css
export function modelName(modelName) {
  const modelNameContainer = document.createElement("div");
  modelNameContainer.className = "simple-card-container top";

  const modelTitle = document.createElement("div");
  modelTitle.className = "simple-card";

  modelTitle.textContent = modelName;

  modelNameContainer.appendChild(modelTitle);
  document.body.appendChild(modelNameContainer);
}

export function uploadCard() {

      //upload - no svg? - how to remove choose file box?
      const uploadCard = document.createElement('input');
      uploadCard.type = 'file';
      uploadCard.id = 'file-input';
      uploadCard.className = 'button';
  
      const card = document.createElement("div");
      card.className = "card";
    
      const svgElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      svgElement.setAttribute("width", "24");
      svgElement.setAttribute("height", "24");
      svgElement.setAttribute("viewBox", "0 0 24 24");
    
      const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path1.setAttribute(
        "d",
        "m11 11h-7.25c-.414 0-.75.336-.75.75s.336.75.75.75h7.25v7.25c0 .414.336.75.75.75s.75-.336.75-.75v-7.25h7.25c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-7.25v-7.25c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
      );
    
      svgElement.appendChild(path1);
      card.appendChild(svgElement);
    
      card.appendChild(uploadCard);
    
      const projectContainer = document.getElementById("projects-container");
      projectContainer.appendChild(card);
}


export function toolbarTop() {
  const cardContainer = document.createElement("div");
  cardContainer.className = "simple-card-container-home top left";
  cardContainer.id = "simple-card-container-home-top";

  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";

  toolbar.appendChild(homeButton());

  cardContainer.appendChild(toolbar);

  document.body.appendChild(cardContainer);
}

export function toolbarBottom() {
  const cardContainer = document.createElement("div");
  cardContainer.className = "simple-card-container bottom";

  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";

  toolbar.appendChild(treeButton());
  toolbar.appendChild(filterButton());
  toolbar.appendChild(clipPlaneButton());
  toolbar.appendChild(annotationsButton());
  toolbar.appendChild(propertiesButton());
  toolbar.appendChild(helpButton());

  cardContainer.appendChild(toolbar);

  document.body.appendChild(cardContainer);
}

// UI categories functions

function checkbox(category, text) {
  const checkbox = document.createElement("div");
  checkbox.className = "checkbox-item";

  const checkboxTextDiv = document.createElement("div");

  const checkboxInput = document.createElement("input");
  checkboxTextDiv.textContent = text;

  const checkboxInputDiv = document.createElement("div");
  checkboxInputDiv.className = "checkbox-value";

  checkboxInput.checked = true;
  checkboxInput.id = category;
  checkboxInput.type = "checkbox";

  checkboxInputDiv.appendChild(checkboxInput);
  checkbox.appendChild(checkboxTextDiv);
  checkbox.appendChild(checkboxInputDiv);

  return checkbox;
}

export function createCheckboxes() {
  // need to improve this and check if categories are ok
  const checkboxes = document.createElement("div");
  checkboxes.className = "checkboxes";
  checkboxes.id = "checkboxes";
  checkboxes.style.display = "none";

  let categoriesName = [
    "Walls",
    "Walls (standard case)",
    "Slabs",
    "Furniture",
    "Doors",
    "Windows",
    "Curtain wall plates",
    "Curtain wall structure",
    "Spaces",
    "Site",
    "Roofs",
    "Other",
  ];

  const categoriesText = [
    "IFCWALL",
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
    "IFCBUILDINGELEMENTPROXY",
  ];

  for (let i = 0; i < categoriesText.length; i++) {
    checkboxes.appendChild(checkbox(categoriesText[i], categoriesName[i]));
  }

  document.body.appendChild(checkboxes);
}

export function createCardDiv(projectName, projectId) {
  const card = document.createElement("div");
  card.className = "card";

  const svgElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  svgElement.setAttribute("width", "24");
  svgElement.setAttribute("height", "24");
  svgElement.setAttribute("viewBox", "0 0 24 24");

  const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path1.setAttribute(
    "d",
    "m3.514 6.636c-.317.179-.514.519-.514.887v8.95c0 .37.197.708.514.887 1.597.901 6.456 3.639 8.005 4.512.152.085.319.128.487.128.164 0 .328-.041.477-.123 1.549-.855 6.39-3.523 7.994-4.408.323-.177.523-.519.523-.891v-9.055c0-.368-.197-.708-.515-.887-1.595-.899-6.444-3.632-7.999-4.508-.151-.085-.319-.128-.486-.128-.168 0-.335.043-.486.128-1.555.876-6.405 3.609-8 4.508zm15.986 2.115v7.525l-6.75 3.722v-7.578zm-14.264-1.344 6.764-3.813 6.801 3.834-6.801 3.716z"
  );

  svgElement.appendChild(path1);
  card.appendChild(svgElement);

  const h2Element = document.createElement("h2");
  h2Element.textContent = projectName;

  card.appendChild(h2Element);

  const button = document.createElement("a");
  button.className = "button";
  button.href = "./bimviewer.html" + `?id=${projectId}`;
  //button.href= projectId; //also needs to be an input
  button.textContent = "Model";

  card.appendChild(button);

  const projectContainer = document.getElementById("projects-container");
  projectContainer.appendChild(card);
}

function homeButton() {
  const homeButton = document.createElement("button");
  homeButton.className = "homebutton";

  homeButton.setAttribute("onclick", "window.location.href='./index.html';");

  const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgEl.setAttribute("width", "50");
  svgEl.setAttribute("height", "50");
  svgEl.setAttribute("viewBox", "0 0 24 24");

  const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path1.setAttribute(
    "d",
    "M22 11.414v12.586h-20v-12.586l-1.293 1.293-.707-.707 12-12 12 12-.707.707-1.293-1.293zm-6 11.586h5v-12.586l-9-9-9 9v12.586h5v-9h8v9zm-1-7.889h-6v7.778h6v-7.778z"
  );

  svgEl.appendChild(path1);
  homeButton.appendChild(svgEl);

  return homeButton;
}

function filterButton() {
  const filterButton = document.createElement("button");
  filterButton.className = "button";

  const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgEl.setAttribute("width", "15");
  svgEl.setAttribute("height", "15");
  svgEl.setAttribute("viewBox", "0 0 24 24");

  const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path1.setAttribute(
    "d",
    "M19.479 2l-7.479 12.543v5.924l-1-.6v-5.324l-7.479-12.543h15.958zm3.521-2h-23l9 15.094v5.906l5 3v-8.906l9-15.094z"
  );

  svgEl.appendChild(path1);
  filterButton.appendChild(svgEl);

  filterButton.addEventListener(
    "click",
    function () {
      if (document.getElementById("checkboxes").style.display === "initial") {
        document.getElementById("checkboxes").style.display = "none";
        filterButton.classList.remove("active");
      } else if (
        document.getElementById("checkboxes").style.display === "none"
      ) {
        document.getElementById("checkboxes").style.display = "initial";
        filterButton.classList.add("active");
      }
    },
    false
  );

  return filterButton;
}

function propertiesButton() {
  const propertiesButton = document.createElement("button");
  propertiesButton.className = "button";
  propertiesButton.id = "propertiesButton";

  const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgEl.setAttribute("width", "15");
  svgEl.setAttribute("height", "15");
  svgEl.setAttribute("viewBox", "0 0 24 24");

  const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path1.setAttribute(
    "d",
    "M4 22h-4v-4h4v4zm0-12h-4v4h4v-4zm0-8h-4v4h4v-4zm3 0v4h17v-4h-17zm0 12h17v-4h-17v4zm0 8h17v-4h-17v4z"
  );

  svgEl.appendChild(path1);
  propertiesButton.appendChild(svgEl);

  propertiesButton.addEventListener(
    "click",
    function () {
      if (
        document.getElementById("ifc-property-menu").style.display === "initial"
      ) {
        document.getElementById("ifc-property-menu").style.display = "none";
        propertiesButton.classList.remove("active");
      } else if (
        document.getElementById("ifc-property-menu").style.display === "none"
      ) {
        document.getElementById("ifc-property-menu").style.display = "initial";
        propertiesButton.classList.add("active");
      }
    },
    false
  );

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
  path1.setAttribute(
    "d",
    "M14.686 13.646l-6.597 3.181c-1.438.692-2.755-1.124-2.755-1.124l6.813-3.287 2.539 1.23zm6.168 5.354c-.533 0-1.083-.119-1.605-.373-1.511-.731-2.296-2.333-1.943-3.774.203-.822-.23-.934-.891-1.253l-11.036-5.341s1.322-1.812 2.759-1.117c.881.427 4.423 2.136 7.477 3.617l.766-.368c.662-.319 1.094-.43.895-1.252-.351-1.442.439-3.043 1.952-3.77.521-.251 1.068-.369 1.596-.369 1.799 0 3.147 1.32 3.147 2.956 0 1.23-.766 2.454-2.032 3.091-1.266.634-2.15.14-3.406.75l-.394.19.431.21c1.254.614 2.142.122 3.404.759 1.262.638 2.026 1.861 2.026 3.088 0 1.64-1.352 2.956-3.146 2.956zm-1.987-9.967c.381.795 1.459 1.072 2.406.617.945-.455 1.405-1.472 1.027-2.267-.381-.796-1.46-1.073-2.406-.618-.946.455-1.408 1.472-1.027 2.268zm-2.834 2.819c0-.322-.261-.583-.583-.583-.321 0-.583.261-.583.583s.262.583.583.583c.322.001.583-.261.583-.583zm5.272 2.499c-.945-.457-2.025-.183-2.408.611-.381.795.078 1.814 1.022 2.271.945.458 2.024.184 2.406-.611.382-.795-.075-1.814-1.02-2.271zm-18.305-3.351h-3v2h3v-2zm4 0h-3v2h3v-2z"
  );

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
  path1.setAttribute(
    "d",
    "M22 18v-7h-9v-5h3v-6h-8v6h3v5h-9v7h-2v6h6v-6h-2v-5h7v5h-2v6h6v-6h-2v-5h7v5h-2v6h6v-6z"
  );

  svgEl.appendChild(path1);
  treeButton.appendChild(svgEl);

  treeButton.addEventListener(
    "click",
    function () {
      if (
        document.getElementById("ifc-tree-menu").style.display === "initial"
      ) {
        document.getElementById("ifc-tree-menu").style.display = "none";
        treeButton.classList.remove("active");
        document.getElementById("simple-card-container-home-top").className =
          "simple-card-container-home top left";
      } else if (
        document.getElementById("ifc-tree-menu").style.display === "none"
      ) {
        document.getElementById("ifc-tree-menu").style.display = "initial";
        treeButton.classList.add("active");
        document.getElementById("simple-card-container-home-top").className =
          "simple-card-container top";
      }
    },
    false
  );

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
  path1.setAttribute(
    "d",
    "M0 18.343l5.656 5.657 18.344-18.343-5.657-5.657-18.343 18.343zm21.171-12.686l-15.514 15.514-2.829-2.829 1.04-1.008 2.122 2.122.707-.707-2.122-2.122 1.414-1.414 1.414 1.414.708-.708-1.414-1.414 1.414-1.414 1.414 1.414.707-.707-1.414-1.414 1.414-1.414 2.122 2.122.707-.708-2.121-2.122 1.414-1.414 1.414 1.414.707-.707-1.414-1.414 1.414-1.414 1.414 1.414.707-.707-1.414-1.414 1.414-1.415 2.121 2.122.707-.707-2.121-2.122 1.039-1.071 2.829 2.83z"
  );

  svgEl.appendChild(path1);
  annotationsButton.appendChild(svgEl);

  return annotationsButton;
}

function helpButton() {
  const helpButton = document.createElement("button");
  helpButton.className = "button";
  helpButton.id = "help-button";

  const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgEl.setAttribute("width", "15");
  svgEl.setAttribute("height", "15");
  svgEl.setAttribute("viewBox", "0 0 24 24");

  const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path1.setAttribute(
    "d",
    "M14.601 21.5c0 1.38-1.116 2.5-2.499 2.5-1.378 0-2.499-1.12-2.499-2.5s1.121-2.5 2.499-2.5c1.383 0 2.499 1.119 2.499 2.5zm-2.42-21.5c-4.029 0-7.06 2.693-7.06 8h3.955c0-2.304.906-4.189 3.024-4.189 1.247 0 2.57.828 2.684 2.411.123 1.666-.767 2.511-1.892 3.582-2.924 2.78-2.816 4.049-2.816 7.196h3.943c0-1.452-.157-2.508 1.838-4.659 1.331-1.436 2.986-3.222 3.021-5.943.047-3.963-2.751-6.398-6.697-6.398z"
  ); //change path

  svgEl.appendChild(path1);
  helpButton.appendChild(svgEl);

  let helpButtonActive = false;

  helpButton.onclick = () => {
    helpButtonActive = !helpButtonActive;
    if (helpButtonActive) {
      helpButton.classList.add("active");
      document.getElementById("helpdoc").style.display = "initial";
    } else {
      helpButton.classList.remove("active");
      document.getElementById("helpdoc").style.display = "none";
    }
  };

  return helpButton;
}

export function createIfcTreeMenu() {
  const ifcTreeMenuDiv = document.createElement("div");
  ifcTreeMenuDiv.className = "ifc-tree-menu";
  ifcTreeMenuDiv.id = "ifc-tree-menu";
  ifcTreeMenuDiv.style.display = "none";

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
  ifcPropertyMenuDiv.style.display = "none";

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

export function createHelpInfo() {
  const helpDocDiv = document.createElement("div");
  helpDocDiv.id = "helpdoc";

  helpDocDiv.style.display = "none";

  const helpDocImg = document.createElement("img");
  helpDocImg.src = "./ifcjsapphelp.png";
  helpDocImg.className = "helpdoc helpdoc-position ifc-property-menu";

  helpDocDiv.appendChild(helpDocImg);
  document.body.appendChild(helpDocDiv);
}

//only used for the bimserver version
// https://www.tutorialspoint.com/building-a-map-from-2-arrays-of-values-and-keys-in-javascript
export function buildMap(keys, values) {
  const map = new Map();
  for (let i = 0; i < keys.length; i++) {
    map.set(keys[i], values[i]);
  }
  return map;
}
