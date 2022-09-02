const Router = require('express');
const router = Router();

const teacher = require('../../../controllers/user/teacher/teacher.controller');
const {imAdmin, EmailIsUnique, DniIsUnique, validateLogin, validateRegister, imTeacher} = require('../../../validators/user/validationUser');

//APIs

router.get("/", teacher.search);

router.get("/:id", teacher.identifyById);

router.post("/", validateRegister, EmailIsUnique, DniIsUnique, imAdmin, teacher.register);

router.post("/login", validateLogin, teacher.login);

router.put('/set_email', imTeacher, EmailIsUnique, teacher.setEmail);

router.put('/set_dni', imTeacher, DniIsUnique, teacher.setDni);

router.put('/set_name', imTeacher, teacher.setName);

router.put('/set_password', imTeacher, teacher.setPassword);

router.delete("/:id" , imAdmin, teacher.destroy);

module.exports = router;