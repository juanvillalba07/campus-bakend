require('dotenv').config();
const { User_matter } = require('../../database/models/index');
const { Matter } = require('../../database/models/index');
const sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//API

const identifyById = async (req, res) => {
    const id_user = req.params.id_user;
    const id_matter = req.params.id_matter;

    let user_matter = await User_matter.findOne({
        attributes: ['id', 'name', 'quota', 'registered']
    });
    if (user_matter) {
        return res.status(200).json({ 'status': 200, user_matter })
    } else {
        return res.status(404).json({ 'status': 404, 'msg': 'Materia no encontrada' })
    }
};


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


// const register = async (req,res) => {
//     let params = req.body;
//     let matter = await Matter.create(params)
//     if (matter) {
//         return res.status(200).json({'status':200, matter, 'msg':'Creado correctamente'})
//     } else {
//         return res.status(404).json({'msg':'No se recibieron los datos'})
//     }
// };


// const destroy = async (req,res) => {
//     const id = req.params.id;
//     let matter = await Matter.findOne({ 
//         where: { id: id } 
//     });
//     if (!matter) {
//         return res.status(404).json({msg:"Materia no encontrada"})
//     } else {
//         matter.destroy().then(matter => {
//         res.status(200).json({status:200,msg:"operation complete"})
//         })
//     }
// };


module.exports = {
    // identifyById,
    getMatterInscript
    // register,
    // destroy
};