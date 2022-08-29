const { Matter } = require('../../database/models/index');

const NameIsUnique = async (req, res, next) => {
  let name = req.body.name

  Matter.findOne({
    where:{name:name}
  }).then(matter =>{
    if (matter) {
      //Email invalido
      return res.status(400).json({msg: "La materia ya se encuentra registrada"})
    }else{
      next()
    }
  }).catch(err => {
    //Fallo al buscar el email en la base de datos
    return res.status(500).json(err.message)
  })
};

module.exports = {
    NameIsUnique
} 