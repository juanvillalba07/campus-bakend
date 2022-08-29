const Router = require('express');
const router = Router();

const teacher = require('../../../controllers/user/teacher/teacher.controller');
const {imAdmin, EmailIsUnique, DniIsUnique, validateLogin, validateRegister} = require('../../../validators/user/validationUser');

//APIs

router.get("/", imAdmin, teacher.search);

router.get("/:id", imAdmin, teacher.identifyById);

router.post("/", validateRegister, EmailIsUnique, DniIsUnique, teacher.register);

router.post("/login", validateLogin, teacher.login);

// router.get('/logout', logOut)

router.delete("/:id" , imAdmin, teacher.destroy);

module.exports = router;