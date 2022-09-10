const Router = require('express');
const router = Router();

const form = require('../../controllers/form/form.controller');
const {imAdmin} = require('../../validators/user/validationUser'); 

//API

router.get("/", imAdmin, form.search);

router.get("/:id", imAdmin, form.identifyById);

router.post("/", form.createForm);

router.delete("/:id", imAdmin, form.destroy);

module.exports = router;