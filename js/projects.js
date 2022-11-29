//for connection with bimserver
export const socketiourl = "http://localhost:8088/";

export const socket = io(socketiourl);

//for connection with python app (energy assessment)
export const socketpyurl = "http://localhost:8000/";

export const socketpy = io(socketpyurl);