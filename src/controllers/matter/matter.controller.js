require('dotenv').config();
const { Matter } = require('../../database/models/index');
const sequelize = require('sequelize');

//API

const identifyById = async (req,res) => {
    const id = req.params.id

    console.log('identificando materia por el id: '+id);

    Matter.findOne({ 
        attributes: ['id', 'name', 'quota', 'registered']
    }).then(matter =>{
        if(!matter)
            return res.status(404).json({'status':404, 'msg':'Materia no encontrada'});

        console.log(matter);
        return res.status(200).json({'status':200, matter});
    }).catch(err =>{
        return res.status(500).json({'status':500 ,'msg':err.message});
    });        
};


const search = async (req,res) => {
    let pageAsNumber = Number.parseInt(req.query.page);
    let page = 0, size = 10;
    
    if (!Number.isNaN(pageAsNumber)) 
        page = pageAsNumber;
    
    console.log('obteniendo el listado de materias.....');

    Matter.findAndCountAll({
        limit: size, 
        offset: page * size,
        attributes: ['id', 'name', 'quota', 'registered', 'updatedAt', 'createdAt'],
    }).then(matters =>{
        console.log(matters);

        return res.status(200).json({
            'status':200, 
            content: matters.rows,
            totalPages: Math.ceil(matters.count / size),
            page,
        });
    }).catch(err =>{
        return res.status(500).json({'status':500 ,'msg':err.message});
    });
};


const register = async (req,res) => {

    const {name, quota, registered} = req.body;

    if (!name || !quota || !registered)
        return res.status(400).json({'status':400, 'msg':'Parametros invalidos'});

    console.log('creando materia.....');

    Matter.create({
        name: name,
        quota: quota,
        registered: registered
    }).then(matter =>{
        if (matter)
            return res.status(200).json({'status':200, matter, 'msg':'Materia creada correctamente'});

        return res.status(404).json({'msg':'No se recibieron los datos'});
    }).catch(err =>{
        return res.status(500).json({'status':500 ,'msg':err.message});
    });
};


const destroy = async (req,res) => {
    const id = req.params.id;

    console.log('identificando materia por el id: '+id);

    Matter.findOne({ 
        where: { id: id } 
    }).then(matter =>{
        if (!matter)
            return res.status(404).json({msg:"Materia no encontrada"});

        console.log(matter);
        console.log('eliminando la amateria de la bd.....');
        matter.destroy();

        return res.status(200).json({'status':200, 'msg':'Materia eliminado correctamente'});
    }).catch(err =>{
        return res.status(500).json({'status':500 ,'msg':err.message});
    });
};

const edit = async(req,res) => {
    const id = req.params.id;
    const body = req.body;

    let matter = await Matter.findOne({ 
        where: { id: id } 
    });

    if(!matter) {
        console.log('No se edito');
    } else {
        try {
            matter.set({...body});
            await matter.save();
            return res.status(200).json({msg:"Subject Editado"});
        } catch (error) {
            console.log(error);
            return res.status(500).json({msg:"Error. Subject No Editado"});
        }
    }
};

module.exports = {
    identifyById,
    search,
    register,
    destroy,
    edit
};