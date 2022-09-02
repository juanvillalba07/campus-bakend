const Router = require('express');
const router = Router();

const student = require('../../../controllers/user/student/student.controller');
const { getMatterInscript } = require('../../../controllers/user_matter/user_matter.controller')
const {imAdmin, EmailIsUnique, DniIsUnique, validateLogin, validateRegister, imStudent} = require('../../../validators/user/validationUser');

//API

router.get("/", student.search);

router.get("/:id", student.identifyById);

router.post("/", validateRegister, EmailIsUnique, DniIsUnique, student.register);

router.post("/login", validateLogin, student.login);

router.put('/set_email', imStudent, EmailIsUnique, student.setEmail);

router.put('/set_dni', imStudent, DniIsUnique, student.setDni);

router.put('/set_name', imStudent, student.setName);

router.put('/set_password', imStudent, student.setPassword);

router.delete("/:id" , imAdmin, student.destroy);

module.exports = router;