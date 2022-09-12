require('dotenv').config();
const { User } = require('../../../database/models/index');
const sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Mail = require('../../../config/mailer')
const role = 'student'

//API

const identifyById = async (req,res) => {

    const id = req.params.id

    console.log('buscando estudiante por el id: '+id);

    User.findOne({ 
        attributes: ['id', 'name', 'email', 'role', 'dni'],
        where: { 
            id: id,
            role:role
        } 
    }).then(user =>{
        console.log(user);

        if (user) 
            return res.status(200).json({'status':200, user});
        else
            return res.status(404).json({'status':404, 'msg':'usuario no encontrado'});
    }).catch(err =>{
        return res.status(500).json({'status':500 ,'msg':err.message});
    });  
};


const register = async (req,res) => {

    const {name, email, password, dni} = req.body;

    if (!name || !email || !password || !dni)
        return res.status(400).json({'status':400, 'msg':'Parametros invalidos'});

    const passwordHash = await bcrypt.hash(req.body.password, 10);

    console.log('creadno el estidenate.....');

    User.create({
        name: name,
        email: email,
        password: passwordHash,
        dni: dni
    }).then(user =>{
        console.log(user);

        if (user){
            Mail.registeUser(user.email);
            return res.status(200).json({'status':200, user, 'msg':'Creado correctamente'});
        } else
            return res.status(404).json({'msg':'No se recibieron los datos'});
    }).catch(err =>{
        return res.status(500).json({'status':500 ,'msg':err.message});
    });
}
    


const login = async (req, res) => {
    const {dni, password} = req.body

    console.log('Buscando el usuario y validando los datos ingresados......');
    console.log(dni, password, "\n");

    User.findOne({
        where:{
            dni:dni,
            role:role
        },
        attributes: ['id', 'name', 'email', 'role', 'dni', 'password'],
    })
    .then(user =>{
        if (!user) {
            res.status(404).json({msg: 'dni invalido'}) 
        }else if(user.role === 'student' && bcrypt.compareSync(password, user.password)){

            console.log('Creando token');
            console.log(user);

            const token = jwt.sign({id:user.id, role: user.role, email: user.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "8h"})
            
            delete user.dataValues['password'];
            
            return res.status(200).json({
                user, 
                token
            });
        }else{
            return res.status(401).json({msg: 'Usuario y/o contraseña incorrecta'})
        }
    }).catch(err => {
        return res.status(500).json({'status':500 ,'msg':err.message});
    });
}


const destroy = async (req,res) => {

    const id = req.params.id;

    console.log('Buacando el usuario');

    User.findOne({ 
        where: { 
            id: id, 
            role:role
        } 
    }).then(user =>{
        if (!user) 
            return res.status(404).json({msg:"Usuario no encontrado"})
        
        console.log('Eliminando usuario....');
        user.destroy();
        Mail.destoyUser(user.email);
        return res.status(200).json({status:200,msg:"operation complete"});
    }).catch(err =>{
        return res.status(500).json({'status':500 ,'msg':err.message});
    });
};


const setName = async (req,res) => {

    const id = jwt.decode(req.headers.authorization).id
    const name = req.body.name;

    if (!name)
        return res.status(400).json({'status':400, 'msg':'Parametros invalidos'}); 

    console.log('buscando usuario por el id: '+id);

    User.findOne({ 
        attributes: ['id', 'name'],
        where: { 
            id: id,
            role:role
        } 
    }).then(user =>{
        if (!user) 
            return res.status(404).json({'status':404, 'msg':'usuario no encontrado'});

        console.log('usuario antes del update');
        console.log(user);

        user.name = name;

        user.save();
        
        console.log('usuario despues del update');
        console.log(user);  

        return res.status(200).json({'status':200, 'msg':'usuario actualizado correctamente'});
    }).catch(err =>{
        return res.status(500).json({'status':500 ,'msg':err.message});
    });
};


const setEmail = async (req,res) => {

    const id = jwt.decode(req.headers.authorization).id
    const email = req.body.email;

    if (!email)
        return res.status(400).json({'status':400, 'msg':'Parametros invalidos'}); 

    console.log('buscando usuario por el id: '+id);

    User.findOne({ 
        attributes: ['id', 'email'],
        where: { 
            id: id,
            role:role
        } 
    }).then(user =>{
        if (!user) 
            return res.status(404).json({'status':404, 'msg':'usuario no encontrado'});

        console.log('usuario antes del update');
        console.log(user);

        user.email = email;

        user.save();
        
        console.log('usuario despues del update');
        console.log(user);  

        return res.status(200).json({'status':200, 'msg':'usuario actualizado correctamente'});
    }).catch(err =>{
        return res.status(500).json({'status':500 ,'msg':err.message});
    });
};


const setDni = async (req,res) => {

    const id = jwt.decode(req.headers.authorization).id
    const dni = req.body.dni;

    if (!dni)
        return res.status(400).json({'status':400, 'msg':'Parametros invalidos'}); 

    console.log('buscando usuario por el id: '+id);

    User.findOne({ 
        attributes: ['id', 'dni'],
        where: { 
            id: id,
            role:role
        } 
    }).then(user =>{
        if (!user) 
            return res.status(404).json({'status':404, 'msg':'usuario no encontrado'});

        console.log('usuario antes del update');
        console.log(user);

        user.dni = dni;

        user.save();
        
        console.log('usuario despues del update');
        console.log(user);  

        return res.status(200).json({'status':200, 'msg':'usuario actualizado correctamente'});
    }).catch(err =>{
        return res.status(500).json({'status':500 ,'msg':err.message});
    });
};


const setPassword = async (req,res) => {

    const id = jwt.decode(req.headers.authorization).id
    const password = await bcrypt.hash(req.body.password, 10);

    console.log('buscando usuario por el id: '+id);

    User.findOne({ 
        attributes: ['id', 'password'],
        where: { 
            id: id,
            role:role
        } 
    }).then(user =>{
        if (!user) 
            return res.status(404).json({'status':404, 'msg':'usuario no encontrado'});

        console.log('usuario antes del update');
        console.log(user);

        user.password = password;

        user.save();
        
        console.log('usuario despues del update');
        console.log(user);  

        return res.status(200).json({'status':200, 'msg':'usuario actualizado correctamente'});
    }).catch(err =>{
        return res.status(500).json({'status':500 ,'msg':err.message});
    });
};

module.exports = {
    identifyById,
    register,
    login,
    destroy,
    setDni,
    setEmail,
    setName,
    setPassword
};