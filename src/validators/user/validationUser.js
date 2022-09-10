const { User } = require('../../database/models/index');
const { check } = require('express-validator');
const { validateResult } = require('../../helpers/validateHelper');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const validateLogin = [

    check('dni')
        .exists()
        .isLength({ min: 7 })
        .withMessage('DNI invalido'),
    check('password')
        .exists()
        .isLength({ min: 6 })
        .withMessage('La contraseña debe contener mas de 6 caracteres'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

const validateRegister = [

    check('email')
        .exists()
        .isLength({ min: 5 })
        .withMessage('El correo debe contener mas de 5 caracteres')
        .isEmail()
        .withMessage('No contiene un formato de email valido'),
    check('dni')
        .exists()
        .isLength({ min: 7, max: 9 })
        .withMessage('DNI invalido'),
    check('password')
        .exists()
        .isLength({ min: 6 })
        .withMessage('La contraseña debe contener mas de 6 caracteres'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]


const DniIsUnique = async (req, res, next) => {
    let dni = req.body.dni

    User.findOne({
        where: { dni: dni }
    }).then(user => {
        if (user) {
            return res.status(400).json({ msg: "El dni ingresado ya se encuentra en uso" })
        } else {
            next()
        }
    }).catch(err => {
        return res.status(500).json(err.message + 'CarlosCarlitos')
    })
};


const EmailIsUnique = async (req, res, next) => {
    let email = req.body.email

    User.findOne({
        where: { email: email }
    }).then(user => {
        if (user) {
            return res.status(400).json({ msg: "El email ingresado ya se encuentra en uso" })
        } else {
            next()
        }
    }).catch(err => {
        return res.status(500).json(err.message)
    })
};


const UserExist = async (req, res, next) => {
    let id = req.params.id_user

    User.findOne({
        where: { id: id }
    }).then(user => {
        if (!user) {
            return res.status(400).json({ msg: "No existe el usuario" })
        } else {
            next()
        }
    }).catch(err => {
        return res.status(500).json(err.message)
    })
};


const imAdmin = async (req, res, next) => {
    if (req.headers.authorization === undefined || req.headers.authorization === "") {
        res.status(401).json({ msg: "No autorizado" })
    } else {
        const token = req.headers.authorization;
        const role = jwt.decode(token).role;
        if (role == 'admin') {
            req.isAdmin = true;
            next()
        } else {
            res.status(401).json({ msg: "No autorizado" })
        }
    }
};

const imStudent = async (req, res, next) => {
    if (req.headers.authorization === undefined || req.headers.authorization === "") {
        res.status(401).json({ msg: "No autorizado" })
    } else {
        const token = req.headers.authorization;
        const role = jwt.decode(token).role;
        if (role == 'student') {
            req.isAdmin = true;
            next()
        } else {
            res.status(401).json({ msg: "No autorizado" })
        }
    }
};

const imTeacher = async (req, res, next) => {
    if (req.headers.authorization === undefined || req.headers.authorization === "") {
        res.status(401).json({ msg: "No autorizado" })
    } else {
        const token = req.headers.authorization;
        const role = jwt.decode(token).role;
        if (role == 'teacher') {
            req.isAdmin = true;
            next()
        } else {
            res.status(401).json({ msg: "No autorizado" })
        }
    }
};

module.exports = { 
    validateLogin,
    validateRegister, 
    DniIsUnique, 
    EmailIsUnique, 
    UserExist,
    imAdmin, 
    imStudent, 
    imTeacher 
}