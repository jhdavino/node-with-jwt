var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

var jwt = require('jsonwebtoken');
var user = require('./models/user');

//código que será responsável para realizar a conversão dos nossos dados para JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//esponsável por gerenciar os logs das nossas requisições e apresentar eles na nossa console
app.use(morgan('dev'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//chamando o Router do pacote Express
var apiRoutes = express.Router();

apiRoutes.post('/', function (req, res) {

    if (req.body.username != "davino" || req.body.password != "123456") {
            res.json({ success: false, message: 'Usuário ou senha invalido(s)!' });
    } else {
    let usuario = new user()
            { 
               name : "davino";
               admin: true
            };
    var token = jwt.sign(usuario, 'casa bola dedo', {
            expiresIn : 60*1 // neste exemplo ele esta durando 1 min //*24 // 60s * 60 = 1h * 24 = 1day
        });
         
        res.json({
            success: true,
            message: 'Token criado!!!',
            toke: token
        });
    }
});


apiRoutes.use(function (req, res, next) {
    
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        var isExpiredToken = false; 
        var dateNow = new Date();
       
        console.log("token ");

        if (token) {
            jwt.verify(token, 'casa bola dedo', function (err, decoded) {
                if (err) {
                    console.log("erro encontrado -> "+ err.name +"\n")    
                    return res.json({ success: false, message: err.message });
                } else {
                
                    console.log("token valido");
                    //se o token estiver válido, salver a requisição para o uso em outras rotas
                    req.decoded = decoded;
                    next();
                
                }
            });
    
        } else {
            // se não tiver o token, retornar o erro 403
            return res.status(403).send({
                success: false,
                message: '403 - Forbidden'
            });
        }
    });


// rota na raiz
apiRoutes.get('/', function (req, res) {
    res.json({ message: 'Node.js com JWT by jhdavino' });
});
app.use('/', apiRoutes);


var port = process.env.PORT || 8000;
app.listen(port);
console.log('Aplicação rodando na porta:' + port);
    