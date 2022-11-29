//for socket.io connection with python app (energy assessment)
export const socketpyurl = "http://localhost:8000/";

export const socketpy = io(socketpyurl);

//e.g. model names for models placed in /models folder
export let projects = [
  {
    name: "Duplex-A-MEP",
    id: "3145729",
  },
  {
    name: "TESTED_Simple_project_01",
    id: "2883585",
  },
  {
    name: "TESTED_Simple_project_02",
    id: "2949121",
  },
  {
    name: "rac_advanced_sample_project",
    id: "3080193",
  },
  {
    name: "rac_basic_sample_project",
    id: "3014657",
  },
];