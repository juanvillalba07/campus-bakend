require('dotenv').config();
const { User_matter } = require('../../database/models/index');
const { Matter } = require('../../database/models/index');
const { User } = require('../../database/models/index');
const sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const Mail = require('../../config/mailer');


const getMatterInscript = async (req, res) => {

    const id_user = jwt.decode(req.headers.authorization).id
    const pageAsNumber = Number.parseInt(req.query.page);
    const page = 0, size = 10;

    if (!Number.isNaN(pageAsNumber))
        page = pageAsNumber;

    console.log('Obteniendo el listado de las materias a las que estan asociada al usuario......');

    const user_matter = await User_matter.findAndCountAll({
        limit: size,
        offset: page * size,
        attributes: ['user_id', 'matter_id','note_1','note_2','note_3'],
        where: { user_id: id_user }
    });

    console.log(user_matter);

    console.log('Obteniendo detalles del listado de las matrias......');

    const matterList = await Promise.all(
        user_matter.rows.map(async (matter) => {
            const id = matter.dataValues.matter_id
            const result = await Matter.findOne({
                attributes: ['id', 'name'],
                where: { id: id }
            });
            result.dataValues.note_1 = matter.dataValues.note_1;
            result.dataValues.note_2 = matter.dataValues.note_2;
            result.dataValues.note_3 = matter.dataValues.note_3;
            return result;
        })
    );

    console.log(matterList);

    return res.status(200).json({
        'status': 200,
        content: matterList,
        totalPages: Math.ceil(user_matter.count / size),
        page,
    });
};


const subscribeMatter = async (req,res) => {
    const id_matter = req.params.id_matter;
    const user = jwt.decode(req.headers.authorization)
    
    console.log('obteniendo detalles de la materia a la cual se quiere inscribir......');

    const matter = await Matter.findOne({
        attributes: ['id', 'name', 'quota', 'registered'],
        where:{id:id_matter}
    });

    if (matter)
        matter.increment('registered')

    console.log(matter);
    console.log('registrando al usuario en la materia......');

    const result = await User_matter.create({
        user_id: user.id, matter_id: Number(id_matter)
    });

    console.log(result);

    if (result) {
        await Mail.subscriptionMatter(user.email)
        return res.status(200).json({'status':200, result, 'msg':'Creado correctamente'})
    } else
        return res.status(404).json({'msg':'No se recibieron los datos'})
};


const cancelSubscription = async (req,res) => {
    const id_matter = req.params.id_matter;
    const user = jwt.decode(req.headers.authorization);

    const matter = await Matter.findOne({
        attributes: ['id', 'name', 'quota', 'registered'],
        where:{id:id_matter}
    });

    if (matter)
        matter.decrement('registered')

    const result = await User_matter.findOne({ 
        where: { user_id: user.id, matter_id:id_matter } 
    });

    if (!result)
        return res.status(404).json({msg:"Materia no encontrada"})
    else {
        result.destroy().then(result => {
            Mail.cancelSubscrive(user.email);
            res.status(200).json({status:200,msg:"operation complete"});
        })
    }
};


const getStudentInscript = async (req, res) => {

    const id_matter = req.params.id_matter;
    const pageAsNumber = Number.parseInt(req.query.page);
    const page = 0, size = 10;

    if (!Number.isNaN(pageAsNumber))
        page = pageAsNumber;

    console.log('Obteniendo el listado de las materias a las que estan asociada al usuario......');

    const user_matter = await User_matter.findAndCountAll({
        limit: size,
        offset: page * size,
        attributes: ['user_id', 'matter_id'],
        where: { matter_id: id_matter }
    });

    console.log(user_matter);

    console.log('Obteniendo detalles del listado de las matrias......');

    const studentList = await Promise.all(
        user_matter.rows.map(async (user) => {
            const id = user.dataValues.user_id
            console.log(id);
            const result = await User.findOne({
                attributes: ['id', 'name', 'dni'],
                where: { 
                    id: id,
                    role:'student'
                }
            });
            console.log(result);
            return result;
        })
    );
    
    var filtered = studentList.filter(function(x) {
        return x !== null;
   });

   console.log(filtered);

    return res.status(200).json({
        'status': 200,
        content: filtered,
        totalPages: Math.ceil(user_matter.count / size),
        page,
    });
};



const assignMatter = async (req,res) => {
    const id_matter = req.params.id_matter;
    const user = jwt.decode(req.headers.authorization);
    
    console.log('registrando al usuario en la materia......');

    const result = await User_matter.create({
        user_id: user.id, matter_id: Number(id_matter)
    });

    console.log(result);

    if (result) {
        Mail.assingMatter(user.email);
        return res.status(200).json({'status':200, result, 'msg':'Creado correctamente'})
    } else
        return res.status(404).json({'msg':'No se recibieron los datos'})
};


const unassignMatter = async (req,res) => {
    const id_matter = req.params.id_matter;
    const user = jwt.decode(req.headers.authorization)

    const result = await User_matter.findOne({ 
        where: { user_id: user.id, matter_id:id_matter } 
    });

    if (!result)
        return res.status(404).json({msg:"Materia no encontrada"})
    else {
        result.destroy().then(result => {
            Mail.unassingMatter(user.email);
            res.status(200).json({status:200,msg:"operation complete"});
        })
    }
};


const getMatterAssing = async (req, res) => {

    const id_user = jwt.decode(req.headers.authorization).id
    const pageAsNumber = Number.parseInt(req.query.page);
    const page = 0, size = 10;

    if (!Number.isNaN(pageAsNumber))
        page = pageAsNumber;

    console.log('Obteniendo el listado de las materias a las que estan asociada al usuario......');

    const user_matter = await User_matter.findAndCountAll({
        limit: size,
        offset: page * size,
        attributes: ['user_id', 'matter_id'],
        where: { user_id: id_user }
    });

    console.log(user_matter);

    console.log('Obteniendo detalles del listado de las matrias......');

    const matterList = await Promise.all(
        user_matter.rows.map(async (matter) => {
            const id = matter.dataValues.matter_id
            const result = await Matter.findOne({
                attributes: ['id', 'name','registered'],
                where: { id: id }
            });
            return result;
        })
    );

    console.log(matterList);

    return res.status(200).json({
        'status': 200,
        content: matterList,
        totalPages: Math.ceil(user_matter.count / size),
        page,
    });
};


const setNote1 = async (req,res) => {

    const id_matter = req.params.id_matter;    
    const id_user = req.params.id_user;
    const note = req.body.note;

    const user = jwt.decode(req.headers.authorization)
    
    console.log('verificando si esta asignado como porfesor en la materia......');

    const result = await User_matter.findOne({ 
        where: { user_id: user.id, matter_id:id_matter } 
    });

    if (!result)
        return res.status(400).json({'msg':'Usted no esta asignado como profesor de la materia'});

    console.log('buscando al estudiante al cual se va a calificar');

    const student = await User_matter.findOne({ 
        where: { user_id: id_user, matter_id:id_matter } 
    });

    console.log(student);

    student.note_1 = note;    

    await student.save();

    if (student) 
        return res.status(200).json({'status':200, 'msg':'Nota cargada con exito'});
    else
        return res.status(404).json({'msg':'No se recibieron los datos'});
};


const setNote2 = async (req,res) => {

    const id_matter = req.params.id_matter;    
    const id_user = req.params.id_user;
    const note = req.body.note;

    const user = jwt.decode(req.headers.authorization)
    
    console.log('verificando si esta asignado como porfesor en la materia......');

    const result = await User_matter.findOne({ 
        where: { user_id: user.id, matter_id:id_matter } 
    });

    if (!result)
        return res.status(400).json({'msg':'Usted no esta asignado como profesor de la materia'});

    console.log('buscando al estudiante al cual se va a calificar');

    const student = await User_matter.findOne({ 
        where: { user_id: id_user, matter_id:id_matter } 
    });

    console.log(student);

    student.note_2 = note;    

    await student.save();

    if (student) 
        return res.status(200).json({'status':200, 'msg':'Nota cargada con exito'});
    else
        return res.status(404).json({'msg':'No se recibieron los datos'});
};


const setNote3 = async (req,res) => {

    const id_matter = req.params.id_matter;    
    const id_user = req.params.id_user;
    const note = req.body.note;

    const user = jwt.decode(req.headers.authorization)
    
    console.log('verificando si esta asignado como porfesor en la materia......');

    const result = await User_matter.findOne({ 
        where: { user_id: user.id, matter_id:id_matter } 
    });

    if (!result)
        return res.status(400).json({'msg':'Usted no esta asignado como profesor de la materia'});

    console.log('buscando al estudiante al cual se va a calificar');

    const student = await User_matter.findOne({ 
        where: { user_id: id_user, matter_id:id_matter } 
    });

    console.log(student);

    student.note_3 = note;    

    await student.save();

    if (student) 
        return res.status(200).json({'status':200, 'msg':'Nota cargada con exito'});
    else
        return res.status(404).json({'msg':'No se recibieron los datos'});
};


module.exports = {
    getMatterInscript,
    subscribeMatter,
    cancelSubscription,
    assignMatter,
    unassignMatter,
    getMatterAssing,
    getStudentInscript,
    setNote1,
    setNote2,
    setNote3
};