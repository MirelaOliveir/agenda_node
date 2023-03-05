const Login = require('../models/loginModel');
exports.index = (req, res) => {
    res.render('login');
};

exports.register =  async (req, res) => {
    try {
        const login1 = new Login(req.body);
        await login1.register();
    
        if(login1.errors.length > 0){
            req.flash('errors', login1.errors);
            req.session.save( function(){
                return res.redirect('/login/index'); // leva de volta pra á pagina de cadastro com o erro
            })
            return;
        }

        req.flash('success', 'Usuário cadastrado com sucesso. Faça Login.');
        req.session.save( function(){
            return res.redirect('/login/index'); // leva de volta pra á pagina de cadastro com o sucesso
        })
    } catch (e) {
        console.log(e);
        return res.render('404.ejs');
    }
   
};