const Router = require('express');
const router = Router();

const matter = require('../../controllers/matter/matter.controller');
const {imAdmin} = require('../../validators/user/validationUser'); 
const {NameIsUnique} = require('../../validators/matter/validationsMatter')

//API

router.get("/", matter.search);

router.get("/:id", matter.identifyById);

router.post("/", imAdmin, NameIsUnique, matter.register);

router.delete("/:id", imAdmin, matter.destroy);

router.put("/:id", imAdmin, matter.edit);

module.exports = router;