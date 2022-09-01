const Router = require('express');
const router = Router();

const teacher = require('../../../controllers/user/teacher/teacher.controller');
const {imAdmin, EmailIsUnique, DniIsUnique, validateLogin, validateRegister} = require('../../../validators/user/validationUser');

//APIs

router.get("/", teacher.search);

router.get("/:id", teacher.identifyById);

router.post("/", validateRegister, EmailIsUnique, DniIsUnique, imAdmin, teacher.register);

router.post("/login", validateLogin, teacher.login);

router.delete("/:id" , imAdmin, teacher.destroy);

module.exports = router;