const Router = require('express');
const router = Router();

const student = require('../../../controllers/user/student/student.controller');
const { getMatterInscript } = require('../../../controllers/user_matter/user_matter.controller')
const {imAdmin, EmailIsUnique, DniIsUnique, validateLogin, validateRegister, imStudent} = require('../../../validators/user/validationUser');

//API

router.get("/", imAdmin, student.search);

router.get("/:id", imAdmin, student.identifyById);

router.get("/matter", imStudent, getMatterInscript);

router.post("/", validateRegister, EmailIsUnique, DniIsUnique, student.register);

router.post("/login", validateLogin, student.login);

// router.get('/logout', logOut)

router.delete("/:id" , imAdmin, student.destroy);

module.exports = router;