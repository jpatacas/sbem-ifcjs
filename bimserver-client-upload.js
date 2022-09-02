import { BimServerClient } from "bimserverapi/bimserverclient.js";
//import { ServerResponse } from 'http';

export function checkinIFC(ifcFile, fileName) { //return model id
  let address = "http://localhost:8082/";

  let api = new BimServerClient(address);

  let username = "admin@bimserver.org";
  let password = "admin";

  //example download query, ref bimviews
//   let query = {
//     type: {
//       name: "IfcProduct",
//       includeAllSubTypes: true,
//     },
//   };

  api.init((client, version) => {
    console.log(client.version);
  });

  // checkin ifc

  api.login(username, password, function (resp) {
    //const xhr = new XMLHttpRequest();
    let token = api.token; //get the token, to return later to client side?
    console.log(token);
    
    //let fileName = "testproject" + Math.random();
    //works, need to return project id
    api.call(
      "ServiceInterface",
      "addProject",
      {
        projectName: fileName,
        schema: "ifc2x3tc1",
      },
      (resp) => {
        //let poid = resp.oid;
        let poid = resp.oid;
        console.log("Project created" + poid);

        //get deserialiser
        api.call(
          "ServiceInterface",
          "getSuggestedDeserializerForExtension",
          {
            extension: "ifc",
            poid: poid,
          },
          (resp) => {
            //return the deserialiserOid
            let desid = resp.oid; //oid or poid?
            console.log("deserilizer oid" + desid); //ok

            api.call(
              //works?
              "ServiceInterface",
              "checkinFromUrlSync",
              {
                poid: poid,
                comment: "",
                deserializerOid: desid,
                // fileSize:"",
                fileName: fileName + ".ifc",
                // data: ifcFile,
                url: ifcFile,
                merge: "false",
              },
              (resp) => {
                console.log("checked in file" + resp);
              },
              (err) => {
                console.log("error" + err);
              },
              true,
              true,
              true,
              false
            );
          },
          (err) => {
            console.log("error" + err);
          },
          true,
          true,
          true,
          false
        );
      },
      (err) => {
        console.log("error" + err);
      },
      true,
      true,
      true,
      false
    );

  });
}
