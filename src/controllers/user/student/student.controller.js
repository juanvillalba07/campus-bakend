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

    const user = await User.findOne({ 
        attributes: ['id', 'name', 'email', 'role', 'dni'],
        where: { 
            id: id,
            role:role
        } 
    });

    console.log(user);
    
    if (user) 
        return res.status(200).json({'status':200, user});
    else
        return res.status(404).json({'status':404, 'msg':'usuario no encontrado'});
};


const search = async (req,res) => {

    const pageAsNumber = Number.parseInt(req.query.page);
    const page = 0, size = 10;

    if (!Number.isNaN(pageAsNumber)) 
        page = pageAsNumber;
    
    console.log('obteniendo el listado de estudiantes.....');

    const users = await User.findAndCountAll({
        limit: size, 
        offset: page * size,
        attributes: ['id', 'name', 'email', 'role', 'dni'],
        where:{role:role}
    });

    console.log(users);

    return res.status(200).json({
        'status':200, 
        content: users.rows,
        totalPages: Math.ceil(users.count / size),
        page,
    });
};


const register = async (req,res) => {

    const studentParam = req.body;
    studentParam.password = await bcrypt.hash(req.body.password, 10);

    console.log('creadno el estidenate.....');

    const user = await User.create(studentParam);

    console.log(user);

    if (user){
        Mail.registeUser(user.email);
        return res.status(200).json({'status':200, user, 'msg':'Creado correctamente'});
    } else
        return res.status(404).json({'msg':'No se recibieron los datos'})
};


const login = async (req, res) => {
    const {dni, password} = req.body

    console.log('Buscando el usuario y validando los datos ingresados......');

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
        return res.status(500).json(err.message)
    });
}


const destroy = async (req,res) => {

    const id = req.params.id;

    console.log('Buacando el usuario');

    const user = await User.findOne({ 
        where: { 
            id: id, 
            role:role
        } 
    });

    if (!user) 
        return res.status(404).json({msg:"Usuario no encontrado"})
    else {
        console.log('Eliminando usuario....');
        user.destroy().then(user => {
            Mail.destoyUser(user.email);
            res.status(200).json({status:200,msg:"operation complete"})
        })
    }
};

module.exports = {
    identifyById,
    search,
    register,
    login,
    destroy
};