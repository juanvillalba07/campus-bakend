require('dotenv').config();
const { Form } = require('../../database/models/index');
const sequelize = require('sequelize');

//API

const identifyById = async (req,res) => {
    const id = req.params.id

    console.log('identificando formulario por el id: '+id);

    Form.findOne({ 
        attributes: ['id', 'email', 'affair', 'message','createdAt']
    }).then(form =>{
        if(!form)
            return res.status(404).json({'status':404, 'msg':'Formulario no encontrado'});

        console.log(form);
        return res.status(200).json({'status':200, form});
    }).catch(err =>{
        return res.status(500).json({'status':500 ,'msg':err.message});
    });        
};


const search = async (req,res) => {
    let pageAsNumber = Number.parseInt(req.query.page);
    let page = 0, size = 10;
    
    if (!Number.isNaN(pageAsNumber)) 
        page = pageAsNumber;
    
    console.log('obteniendo el listado de formularios.....');

    Form.findAndCountAll({
        limit: size, 
        offset: page * size,
        attributes: ['id', 'email', 'affair', 'message','createdAt'],
        order: [
            ['createdAt', 'DESC']
        ],
    }).then(forms =>{
        console.log(forms);

        return res.status(200).json({
            'status':200, 
            content: forms.rows,
            totalPages: Math.ceil(forms.count / size),
            page,
        });
    }).catch(err =>{
        return res.status(500).json({'status':500 ,'msg':err.message});
    });
};


const createForm = async (req,res) => {

    const {email, affair, message} = req.body;

    if (!email || !affair || !message)
        return res.status(400).json({'status':400, 'msg':'Parametros invalidos'});

    console.log('creando formulario.....');

    Form.create({
        email: email,
        affair: affair,
        message: message
    }).then(form =>{
        if (form)
            return res.status(200).json({'status':200, 'msg':'Su formulario fue enviado con exito'});

        return res.status(404).json({'msg':'No se recibieron los datos'});
    }).catch(err =>{
        return res.status(500).json({'status':500 ,'msg':err.message});
    });
};


const destroy = async (req,res) => {
    const id = req.params.id;

    console.log('identificando formulario por el id: '+id);

    Form.findOne({ 
        where: { id: id } 
    }).then(form =>{
        if (!form)
            return res.status(404).json({msg:"Formulario no encontrado"});

        console.log(form);
        console.log('eliminando la amateria de la bd.....');
        form.destroy();

        return res.status(200).json({'status':200, 'msg':'Formulario eliminado correctamente'});
    }).catch(err =>{
        return res.status(500).json({'status':500 ,'msg':err.message});
    });
};

module.exports = {
    identifyById,
    search,
    createForm,
    destroy
};