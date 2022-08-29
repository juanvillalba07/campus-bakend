const Router = require('express');
const router = Router();

const admin = require('../../../controllers/user/admin/admin.controller');
const {imAdmin, EmailIsUnique, DniIsUnique, validateLogin, validateRegister} = require('../../../validators/user/validationUser');

//API

router.get("/", imAdmin, admin.search);

router.get("/:id", imAdmin, admin.identifyById);

router.post("/", validateRegister, EmailIsUnique, DniIsUnique, admin.register);

router.post("/login", validateLogin, admin.login);

// router.get('/logout', logOut)

router.delete("/:id" , admin.destroy);

module.exports = router;