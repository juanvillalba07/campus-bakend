require('dotenv').config();
const { User } = require('../../../database/models/index');
const sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Mail = require('../../../config/mailer');
const role = 'admin'

//API

const identifyById = async (req,res) => {

    const id = req.params.id

    console.log('buscando usuario por el id: '+id);

    User.findOne({ 
        attributes: ['id', 'name', 'email', 'role', 'dni'],
        where: { 
            id: id
        } 
    }).then(user =>{
        console.log(user);
        return res.status(200).json({'status':200, user})
    }).catch(err =>{
        return res.status(404).json({'status':404, 'msg':'usuario no encontrado'})
    });        
}


const search = async (req,res) => {

    const pageAsNumber = Number.parseInt(req.query.page);
    const page = 0, size = 10;
    
    if (!Number.isNaN(pageAsNumber)) 
        page = pageAsNumber;
    
    console.log('obteniendo el listado de usuarios......');

    User.findAndCountAll({
        limit: size, 
        offset: page * size,
        attributes: ['id', 'name', 'email', 'role', 'dni', 'createdAt', 'updatedAt']
    }).then(users =>{
        console.log(users);
        return res.status(200).json({
            'status':200, 
            content: users.rows,
            totalPages: Math.ceil(users.count / size),
            page,
        });
    }).catch(err =>{
        return res.status(500).json({'status':500 ,'msg':err.message});
    });
}


const register = async (req,res) => {

    const {name, email, password, dni, role} = req.body;

    if (!name || !email || !password || !dni)
        return res.status(400).json({'status':400, 'msg':'Parametros invalidos'});

    const passwordHash = await bcrypt.hash(req.body.password, 10);

    console.log('creando admin.....');

    User.create({
        name : name,
        email: email,
        password: passwordHash,
        dni: dni,
        role: role
    }).then(user =>{
        Mail.registeUser(user.email);
        return res.status(200).json({'status':200, user, 'msg':'Creado correctamente'})
    }).catch(err =>{
        return res.status(500).json({'status':500 ,'msg':err.message});
    });
};


const login = async (req, res) => {

    const {dni, password} = req.body
    console.log(dni, password);

    User.findOne({
        where:{
            dni:dni,
            role:role
        },
        attributes: ['id', 'name', 'email', 'role', 'dni', 'password'],
    }).then(user =>{
        if (!user) {
            res.status(404).json({msg: 'Usuario y/o contraseña incorrecta'});
        }else if(user.role === role && bcrypt.compareSync(password, user.password)){

            console.log(user);

            const token = jwt.sign({id:user.id, role: user.role, email:user.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "8h"})
            
            delete user.dataValues['password'];
            
            return res.status(200).json({
                user, 
                token
            })
        }else{
            return res.status(401).json({msg: 'Usuario y/o contraseña incorrecta'});
        }
    }).catch(err => {
        return res.status(500).json({'status':500 ,'msg':err.message});
    })
}


const setName = async (req,res) => {

    const id = req.params.id_user
    const name = req.body.name;

    if (!name)
        return res.status(400).json({'status':400, 'msg':'Parametros invalidos'});

    console.log('buscando usuario por el id: '+id);

    User.findOne({ 
        attributes: ['id', 'name'],
        where: { 
            id: id
        } 
    }).then(user =>{
        if (!user)
            return res.status(404).json({'status':404, 'msg':'usuario no encontrado'});
        
        console.log('usuario antes del update');
        console.log(user);
        
        user.name = name;
        
        user.save()
        
        console.log('usuario despues del update');
        console.log(user);

        return res.status(200).json({'status':200, 'msg':'usuario actualizado correctamente'})
    }).catch(err =>{
        return res.status(500).json({'status':500 ,'msg':err.message});
    })
}

const setEmail = async (req,res) => {

    const id = req.params.id_user
    const email = req.body.email;

    if (!email)
        return res.status(400).json({'status':400, 'msg':'Parametros invalidos'});

    console.log('buscando usuario por el id: '+id);

    User.findOne({ 
        attributes: ['id', 'email'],
        where: { 
            id: id
        } 
    }).then(user =>{
        if (!user)
            return res.status(404).json({'status':404, 'msg':'usuario no encontrado'});
        
        console.log('usuario antes del update');
        console.log(user);
        
        user.email = email;
        
        user.save()
        
        console.log('usuario despues del update');
        console.log(user);

        return res.status(200).json({'status':200, 'msg':'usuario actualizado correctamente'})
    }).catch(err =>{
        return res.status(500).json({'status':500 ,'msg':err.message});
    })
};


const setDni = async (req,res) => {

    const id = req.params.id_user
    const dni = req.body.dni;

    if (!dni)
        return res.status(400).json({'status':400, 'msg':'Parametros invalidos'});

    console.log('buscando usuario por el id: '+id);

    User.findOne({ 
        attributes: ['id', 'dni'],
        where: { 
            id: id
        } 
    }).then(user =>{
        if (!user)
            return res.status(404).json({'status':404, 'msg':'usuario no encontrado'});
        
        console.log('usuario antes del update');
        console.log(user);
        
        user.dni = dni;
        
        user.save()
        
        console.log('usuario despues del update');
        console.log(user);

        return res.status(200).json({'status':200, 'msg':'usuario actualizado correctamente'})
    }).catch(err =>{
        return res.status(500).json({'status':500 ,'msg':err.message});
    })
};


const setRole = async (req,res) => {

    const id = req.params.id_user
    const role = req.body.role;

    if (!role || role != 'admin' || role != 'student' || role != 'teacher')
        return res.status(400).json({'status':400, 'msg':'Parametros invalidos'});

    console.log('buscando usuario por el id: '+id);

    User.findOne({ 
        attributes: ['id', 'role'],
        where: { 
            id: id
        } 
    }).then(user =>{
        if (!user)
            return res.status(404).json({'status':404, 'msg':'usuario no encontrado'});
        
        console.log('usuario antes del update');
        console.log(user);
        
        user.role = role;
        
        user.save()
        
        console.log('usuario despues del update');
        console.log(user);

        return res.status(200).json({'status':200, 'msg':'usuario actualizado correctamente'})
    }).catch(err =>{
        return res.status(500).json({'status':500 ,'msg':err.message});
    })
};


const destroy = async (req,res) => {

    const id = req.params.id;

    console.log('buscando administrador por el id: '+id);

    User.findOne({ 
        where: { id: id } 
    }).then(user =>{
        if (!user)
            return res.status(404).json({msg:"Usuario no encontrado"});

        console.log('eliminando usuario.....');

        user.destroy();
        Mail.destoyUser(user.email);

        return res.status(200).json({'status':200, 'msg':'usuario eliminado correctamente'});
    }).catch(err =>{
        return res.status(500).json({'status':500 ,'msg':err.message});
    });
};





const edit = async(req,res) => {
    const id = req.params.id;
    const body = req.body;

    let user = await User.findOne({ 
        where: { id: id } 
    });

    if(!user) {
        console.log('No se edito');
    } else {
        try {
            user.set({...body});
            await user.save();
            return res.status(200).json({msg:"User Editado"});
        } catch (error) {
            console.log(error);
            return res.status(500).json({msg:"Error. User No Editado"});
        }
    }
};

module.exports = {
    identifyById,
    search,
    register,
    login,
    destroy,
    setDni,
    setEmail,
    setName,
    setRole,
    edit
};