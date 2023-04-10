import {createCardDiv} from './overlay.js';
import { projects } from './projects.js';

for (let proj of projects)
{
    createCardDiv(proj.name, proj.id);
}
