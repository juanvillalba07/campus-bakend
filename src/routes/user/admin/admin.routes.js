const Router = require('express');
const router = Router();

const admin = require('../../../controllers/user/admin/admin.controller');
const {imAdmin, EmailIsUnique, DniIsUnique, validateLogin, validateRegister} = require('../../../validators/user/validationUser');

//API

router.get("/", imAdmin, admin.search);

router.get("/:id", imAdmin, admin.identifyById);

router.post("/", validateRegister, EmailIsUnique, DniIsUnique, imAdmin, admin.register);

router.post("/login", validateLogin, admin.login);

router.put('/set_name/:id_user', imAdmin, admin.setName);

router.put('/set_email/:id_user', imAdmin, EmailIsUnique, admin.setEmail);

router.put('/set_dni/:id_user', imAdmin, DniIsUnique, admin.setName);

router.put('/set_role/:id_user', imAdmin, admin.setName);

router.delete("/:id", imAdmin, admin.destroy);



router.put("/edit/:id", admin.edit);

module.exports = router;