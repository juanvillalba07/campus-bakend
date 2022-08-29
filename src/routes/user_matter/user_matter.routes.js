const Router = require('express');
const router = Router();

const user_matter = require('../../controllers/user_matter/user_matter.controller');
const {imStudent} = require('../../validators/user/validationUser'); 
const {NameIsUnique, MatterExist, AllReadySubscribe, ImSubscribe, VacancyAvailable} = require('../../validators/matter/validationsMatter')

//API

// router.get("/", matter.search);

router.get("/", user_matter.getMatterInscript);

router.post("/:id_matter", imStudent, MatterExist, AllReadySubscribe, VacancyAvailable, user_matter.subscribeMatter);

router.delete("/:id_matter" , imStudent, ImSubscribe, user_matter.cancelSubscription);

module.exports = router;