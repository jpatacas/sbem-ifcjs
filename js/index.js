import { createCardDiv, uploadCard } from "./uifunctions.js";

import { projects } from "./projects.js";

uploadCard();

for (let proj of projects)
{
    createCardDiv(proj.name, proj.id);
}