const Router = require('express');
const router = Router();

const user_matter = require('../../controllers/user_matter/user_matter.controller');
const {imAdmin} = require('../../validators/user/validationUser'); 
const {NameIsUnique} = require('../../validators/matter/validationsMatter')

//API

// router.get("/", matter.search);

router.get("/", user_matter.getMatterInscript);

// router.post("/", imAdmin, NameIsUnique, matter.register);

// router.delete("/:id" , imAdmin, matter.destroy);

module.exports = router;