require('dotenv').config();
const { User } = require('../../../database/models/index');
const sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const role = 'teacher'

//API

const identifyById = async (req,res) => {
    const id = req.params.id
    let user = await User.findOne({ 
        attributes: ['id', 'name', 'email', 'role', 'dni'],
        where: { id: id , role:role} 
    });
    if (user) {
        return res.status(200).json({'status':200, user})
    } else {
        return res.status(404).json({'status':404, 'msg':'usuario no encontrado'})
    }
};


const search = async (req,res) => {
    let pageAsNumber = Number.parseInt(req.query.page);
    let page = 0, size = 10;
    
    if (!Number.isNaN(pageAsNumber)) {
        page = pageAsNumber;
    }
    
    let users = await User.findAndCountAll({
        limit: size, 
        offset: page * size,
        attributes: ['id', 'name', 'email', 'role', 'dni'],
        where:{role:role}
    })

    return res.status(200).json({
        'status':200, 
        content: users.rows,
        totalPages: Math.ceil(users.count / size),
        page,
    })
};


const register = async (req,res) => {
    let params = req.body;
    params.role = role;
    params.password = await bcrypt.hash(req.body.password, 10);
    let user = await User.create(params)
    if (user) {
        return res.status(200).json({'status':200, user, 'msg':'Creado correctamente'})
    } else {
        return res.status(404).json({'msg':'No se recibieron los datos'})
    }
};


const login = async (req, res) => {
    const {dni, password} = req.body

    //Comprobar dni en DB
    User.findOne({
        where:{dni:dni},
        attributes: ['id', 'name', 'email', 'role', 'dni', 'password'],
    })
    .then(user =>{
    if (!user) {
        //dni invalido
        res.status(404).json({msg: 'dni invalido'}) 
    }else if(user.role === role && bcrypt.compareSync(password, user.password)){
        //Seteo un Token
        console.log(user);
        const token = jwt.sign({id:user.id, role: user.role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "8h"})

        return res.status(200).json({
            user, 
            token
        })
    }else{
        //Acceso denegado - Usuario y/o contraseña invalidos
        return res.status(401).json({msg: 'Usuario y/o contraseña incorrecta'})
    }
    
    }).catch(err => {
    //Fallo al buscar el email en la base de datos
    return res.status(500).json(err.message)
    })
}


const destroy = async (req,res) => {
    const id = req.params.id;
    let user = await User.findOne({ 
        where: { id: id , role:role} 
    });
    if (!user) {
        return res.status(404).json({msg:"Usuario no encontrado"})
    } else {
        user.destroy().then(user => {
        res.status(200).json({status:200,msg:"operation complete"})
        })
    }
};

// const logOut = async (req, res, next) => {
// 	//Eliminar cookie jwt
// 	res.clearCookie('jwt')
// 	//Redirigir a la vista de login
// 	return res.redirect('/login')
// };

module.exports = {
    identifyById,
    search,
    register,
    login,
    destroy
    // logOut,
};