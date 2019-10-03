//Rotas da aplicação
const express = require('express');

const routes = new express.Router();
//const upload = multer(uploadConfig);

//routes.get('/posts', PostController.index);


//routes.post('/posts/:id/like', LikeController.store);   //: quer dizer que vai receber uma parametro id do posto

//routes.get('/',(req, res)=>{   //intercepcao na rota raiz se fosse=> '/contato' exemplo http://localhost:3333/contato
//    return res.send(`olá ${req.query.name}`);
//});

routes.get('/', (req, res) => {
    return res.send("MANP Tecnologia");
});

routes.get('/maionese', (req, res) => {

    //var fs = require('fs');

    //fs.writeFile("C:\\Users\\manpt\\Desktop\\ttn-web-app\\meuarquivo.txt", "Hello, txt!", function(erro) {

    //    if(erro) {
    //    throw erro;
    //    }

    //    console.log("Arquivo salvo");
    //}); 

    return res.send("maionse");  
    
});

routes.get('/api/:version', function(req, res) {
    res.send(req.params.version);
});

// parameter middleware that will run before the next routes
routes.param('name', function(req, res, next, name) {

    // check if the user with that name exists
    // do some validations
    // add -dude to the name
    var modified = name + '-dude';

    // save name to the request
    req.name = modified;

    next();
});

// http://localhost:3333/api/users/chris
//routes.get('/api/users/:name', function(req, res) {
    // the user was found and is available in req.user
//    res.send('What is up ' + req.name + '!');
//});

var bodyParser = require('body-parser');
routes.use(bodyParser.json()); // support json encoded bodies
routes.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// POST http://localhost:3333/api/users
// parameters sent with 
routes.post('/api/users', function(req, res) {
    var user_id = req.body.id;
    var token = req.body.token;
    var geo = req.body.geo;

    console.log(user_id + ' ' + token + ' ' + geo);

    res.send(user_id + ' ' + token + ' ' + geo);
});


module.exports = routes;