# SBEM + IFC.js

<<<<<<< HEAD
Simplified building energy modelling tool using IFC.js and the [NREL ResStock dataset](https://resstock.nrel.gov/).
=======
Simplified building energy modelling tool for residential buildings using IFC.js and the NREL ResStock dataset (https://resstock.nrel.gov/).
>>>>>>> main

It takes IFC quantities as an input for initial filtering and allows you to evaluate different design options and their impact on energy usage.

To consider initial filtering by area and window to wall ratio, models must be exported including Base quantities (e.g. in Revit IFC export, Modify setup, Property sets, Export base quantities). 

Add .ifc models to the /models folder and edit the projects.js file to add model names.

The [energy.py](https://github.com/jpatacas/energy-queries-sbem) tool should be running to use the energy modelling panel. 

To use this tool with Bimserver check the `enable-bimserver` branch.
