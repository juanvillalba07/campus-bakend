const { Matter, User_matter } = require('../../database/models/index');
const jwt = require('jsonwebtoken');

const NameIsUnique = async (req, res, next) => {
	let name = req.body.name

	Matter.findOne({
		where: { name: name }
	}).then(matter => {
		if (matter) {
			return res.status(400).json({ msg: "La materia ya se encuentra registrada" })
		} else {
			next()
		}
	}).catch(err => {
		return res.status(500).json(err.message)
	})
};

const MatterExist = async (req, res, next) => {
	let id_matter = req.params.id_matter

	Matter.findOne({
		where: { id: id_matter }
	}).then(matter => {
		if (!matter) {
			return res.status(400).json({ msg: "No existe la materia" })
		} else {
			next()
		}
	}).catch(err => {
		return res.status(500).json(err.message)
	})
};


const AllReadySubscribe = async (req, res, next) => {
	const id_matter = req.params.id_matter
	const token = req.headers.authorization
    const id_user = jwt.decode(token).id
	User_matter.findOne({
		where: { 
			user_id: id_user,
			matter_id: id_matter
		}
	}).then(result => {
		if (result) {
			return res.status(400).json({ msg: "Ya estas registrado en esta materia" })
		} else {
			next()
		}
	}).catch(err => {
		return res.status(500).json(err.message)
	})
};


const ImSubscribe = async (req, res, next) => {
	const id_matter = req.params.id_matter
	const token = req.headers.authorization
    const id_user = jwt.decode(token).id
	User_matter.findOne({
		where: { 
			user_id: id_user,
			matter_id: id_matter
		}
	}).then(result => {
		if (result) {
			next()
		} else {
			return res.status(400).json({ msg: "No estas anotado en esta materia" })
		}
	}).catch(err => {
		return res.status(500).json(err.message)
	})
};


const VacancyAvailable = async (req, res, next) => {
	const id_matter = req.params.id_matter
	
	Matter.findOne({
		where: { 
			id: id_matter,
		}
	}).then(result => {
		if (result) {
			if (result.dataValues.registered == result.dataValues.quota) {
				return res.status(400).json({ msg: "No hay cupo disponible para inscripcion" })
			} else {
				next()
			}
		} else {
			return res.status(400).json({ msg: "No se encontro la materia" })
		}
	}).catch(err => {
		return res.status(500).json(err.message)
	})
};

module.exports = {
	NameIsUnique,
	MatterExist,
	AllReadySubscribe,
	ImSubscribe,
	VacancyAvailable
} 