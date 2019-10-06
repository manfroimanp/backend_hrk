const express = require("express");
//const mongoose = require("mongoose");
const ttn = require("ttn");
const cors = require('cors');
//const fs = require('fs');

const appID = "592658194155319";
const accessKey = "ttn-account-v2.h7KbuWhx-_8t66dHXsztvenM1hoHL_HEGZ8_flNvvEA";

const app = express();  //Criar um servidor

//Divide servidor para suportar tanto http como protocolo websocket que permite fazer a comuncacao em tempo real
const server = require('http').Server(app);
const io = require('socket.io')(server); 

var package_lora_activation;
var package_lora_uplink;
//Comunicacao com o banco de dados
//mongoose.connect(
//    'mongodb+srv://semana:semana@cluster0-ow9yw.mongodb.net/test?retryWrites=true&w=majority',
//    {
//      useNewUrlParser: true
//    }
//);

//Permite envio de mensagem em tempo real para todas as rotas
app.use((req, res, next) => {
    req.io = io;

    next(); //Vai garantir isso seja executado e tambem o que vem depois
})

app.use(cors());  //Permite que todo o tipo de aplicacao acesse o backend

app.use(require('./routes'));

server.listen(process.env.PORT || 3000);

ttn.data(appID, accessKey)
  .then(function (client) {
    client.on("uplink", function (devID, payload) {
        console.log("Received uplink from ", devID)
        //console.log(payload)
        package_lora_uplink = payload;
        console.log("EUI = " + payload.hardware_serial);
        console.log("UpLinks = " + payload.counter);
        //console.log(payload.payload_raw);
        const decoded = new Buffer.from(payload.payload_raw, 'hex').toString(); // decoded === "This is my string to be encoded/decoded"
        console.log("Data = " + decoded);
        console.log("Time = " + payload.metadata.time);

        const time_gps = decoded[0] + decoded[1] + 
                         decoded[2] + 
                         decoded[3] + decoded[4] +
                         decoded[5] + 
                         decoded[6] + decoded[7];

        const time_int = decoded[9] + decoded[10] + 
                         decoded[11] + 
                         decoded[12] + decoded[13] +
                         decoded[14] + 
                         decoded[15] + decoded[16];

        const time_system = payload.metadata.time[11] + payload.metadata.time[12] + 
                            payload.metadata.time[13] + 
                            payload.metadata.time[14] + payload.metadata.time[15] +
                            payload.metadata.time[16] + 
                            payload.metadata.time[17] + payload.metadata.time[18];

        console.log("Time GPS = " + time_gps);              
        console.log("Time INTERNO = " + time_int);                      
        console.log("Time System = " + time_system);


        //if (payload.hardware_serial == "0004A30B0022E3DC")
        //{
          //0123456789ABCDEF
          //2019-07-27T14:06:35.529222296Z
          //14:06:34
            //fs.writeFile("C:\\Users\\manpt\\Desktop\\ttn-web-app\\log_m0053_05082019.txt", "Sistema: " + time_system + " - GPS: " + time_gps+ " - INTERNO: " + time_int + "\n\r", {enconding:'utf-8',flag: 'a'}, function(erro) {

            //if(erro) {
            //  throw erro;
            //}

            //console.log("Arquivo salvo");
         //}); 
        //}

        //var pack = "OK";

        //var payload = Buffer.from("OK", 'hex');

        //const myString = "OK";
        //const encoded = new Buffer(myString).toString('hex'); // encoded === 54686973206973206d7920737472696e6720746f20626520656e636f6465642f6465636f646564
        //const decoded = new Buffer(encoded, 'hex').toString(); // decoded === "This is my string to be encoded/decoded"

        //console.log(encoded);

        //client.send("5c643ad113dfae13c840ba6e", encoded, 1, true);
    })
  });


  ttn.data(appID, accessKey)
  .then(function (client) {
    client.on("activation", function (devID, payload) {
        console.log("Received activation from ", devID)
        console.log(payload)
        package_lora_activation = payload;
    })
  });

  let getData = () => {
    //O seu método de leitura do arquivo vem aqui
    return 'qualquer que seja o seu resultado aqui';
}

app.get('/activation', (req, res) => {
    res.send(package_lora_activation);
});

app.get('/uplink', (req, res) => {
  res.send(package_lora_uplink);
});

app.get('/lora', (req, res) => {
  res.sendFile(__dirname + '/lora.html');
});
