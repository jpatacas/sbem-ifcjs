# SBEM + IFC.js

Simplified building energy modelling tool using IFC.js and the NREL ResStock dataset (https://resstock.nrel.gov/).

It takes IFC quantities as an input for initial filtering and allows you to evaluate different design options and their impact on energy usage.

To consider initial filtering by area and window to wall ratio, models must be exported including Base quantities (e.g. in Revit IFC export, Modify setup, Property sets, Export base quantities). 

Add .ifc models to the /models folder and edit the projects.js file to add model names.

The following tool should be running to use the energy modelling panel: https://github.com/jpatacas/energy-queries-sbem

This version to be used with https://github.com/lukin1967/bimserver-nodejs to view the models hosted on a bimserver (https://bimserver.org/). Tested using BIMserver 1.5.182

