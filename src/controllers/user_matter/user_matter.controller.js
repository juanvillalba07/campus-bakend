require('dotenv').config();
const { User_matter } = require('../../database/models/index');
const { Matter } = require('../../database/models/index');
const sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");

const Mail = require('../../config/mailer');

//API

const getMatterInscript = async (req, res) => {
    const token = req.headers.authorization
    const id_user = jwt.decode(token).id
    let pageAsNumber = Number.parseInt(req.query.page);
    let page = 0, size = 10;

    if (!Number.isNaN(pageAsNumber)) {
        page = pageAsNumber;
    }
    console.log('Obteniendo el listado de las materias a las que estan asociada al usuario');
    let user_matter = await User_matter.findAndCountAll({
        limit: size,
        offset: page * size,
        attributes: ['user_id', 'matter_id'],
        where: { user_id: id_user }
    })

    console.log('Obteniendo detalles del listado de las matrias');
    const matterList = await Promise.all(
        user_matter.rows.map(async (matter) => {
            const id = matter.dataValues.matter_id
            const result = await Matter.findOne({
                attributes: ['id', 'name', 'quota', 'registered'],
                where: { id: id }
            });
            return result;
        })
    );

    return res.status(200).json({
        'status': 200,
        content: matterList,
        totalPages: Math.ceil(user_matter.count / size),
        page,
    })
};


const subscribeMatter = async (req,res) => {
    const id_matter = req.params.id_matter;
    const token = req.headers.authorization
    const user = jwt.decode(token)
    
    const matter = await Matter.findOne({
        attributes: ['id', 'name', 'quota', 'registered'],
        where:{id:id_matter}
    });
    if (matter){
        matter.increment('registered')
    }

    let result = await User_matter.create({user_id: user.id, matter_id: Number(id_matter)})
    if (result) {
        await Mail.subscriptionMatter(user.mail)
        return res.status(200).json({'status':200, result, 'msg':'Creado correctamente'})
    } else {
        return res.status(404).json({'msg':'No se recibieron los datos'})
    }
};


const cancelSubscription = async (req,res) => {
    const id_matter = req.params.id_matter;
    const user = jwt.decode(req.headers.authorization)

    const matter = await Matter.findOne({
        attributes: ['id', 'name', 'quota', 'registered'],
        where:{id:id_matter}
    });
    if (matter){
        matter.decrement('registered')
    }

    let result = await User_matter.findOne({ 
        where: { user_id: user.id, matter_id:id_matter } 
    });
    if (!result) {
        return res.status(404).json({msg:"Materia no encontrada"})
    } else {
        result.destroy().then(result => {
            Mail.cancelSubscrive(user.mail)
            res.status(200).json({status:200,msg:"operation complete"})
        })
    }
};


module.exports = {
    getMatterInscript,
    subscribeMatter,
    cancelSubscription
};