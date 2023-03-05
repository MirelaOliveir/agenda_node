exports.middlewareGlobal = (req, res, next) => {
    if(req.body.nome) {
        req.body.nome = req.body.nome.toUpperCase();
        console.log('Nome do cliente : ' + req.body.nome); 
    }
    res.locals.LocalVar = 'Este é o valor da localVar';
    next();
}

exports.checkCsrfError = (err, req, res, next) => {
    if(err && err.code == 'EBADCSRFTOKEN') {
        return res.send('Erro bad csrf');
    };
}

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
}