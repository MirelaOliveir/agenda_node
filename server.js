require('dotenv').config(); // esconde a url da base de dados pq contem a senha, em .env
const express = require('express');
const app = express();
const mongoose = require('mongoose'); //mongoose trata e valida os dados
mongoose.connect(process.env.CONNECTIONSTRING) // acessa o .env com o caminho da base de dados
    .then(()=> {
        app.emit('pronto');
        console.log('conectei à base de dados');
    })
    .catch( e=> console.log(e));
const session = require('express-session');
const MongoStore = require('connect-mongo'); // salva a a secao na base de dados
const flash = require('connect-flash');
const routes = require('./routes');
const path = require('path');
const {middlewareGlobal, checkCsrfError, csrfMiddleware} = require('./src/middlewares/middlware')
const helmet = require('helmet');  // segurança
const csrf = require('csurf'); //segurança
const exp = require('constants');

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(helmet())

const sessionOptions = session({
    secret: 'olaMi',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // o tempo que o cookie dura, 7 dias
        httpOnly: true,
    }
});

app.use(sessionOptions);
app.use(flash()); // flash messages (msg de alerta, sucesso, erro)

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs'); // tipo a linguagem do django, uma engine q faz 'for' e 'if' pra acrescentar coisas no html

app.use(csrf()); // token de segurança
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);


app.on('pronto', () => {  //só quando recebir o emit(pronto) da conexao com a base de dados, vai abrir uma porta
    app.listen(3000, () => {
        console.log('Servidor rodando');
        console.log('Acessar http://localhost:3000');
    });
})
// porta do servidor
