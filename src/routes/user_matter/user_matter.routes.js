const Router = require('express');
const router = Router();

const user_matter = require('../../controllers/user_matter/user_matter.controller');
const {imStudent, imTeacher, UserExist} = require('../../validators/user/validationUser'); 
const { MatterExist, AllReadySubscribe, ImSubscribe, VacancyAvailable} = require('../../validators/matter/validationsMatter')

//API

router.get("/inscript/:id_matter", user_matter.getStudentInscript);

router.get("/subscribe", imStudent, user_matter.getMatterInscript);

router.post("/subscribe/:id_matter", imStudent, MatterExist, AllReadySubscribe, VacancyAvailable, user_matter.subscribeMatter);

router.delete("/subscribe/:id_matter" , imStudent, MatterExist, ImSubscribe, user_matter.cancelSubscription);

router.get("/assing", imTeacher, user_matter.getMatterAssing);

router.post("/assing/:id_matter", imTeacher, MatterExist, user_matter.assignMatter);

router.delete("/assing/:id_matter" , imTeacher, MatterExist, user_matter.unassignMatter);

router.put('/set_note1/:id_user/:id_matter', imTeacher, MatterExist, UserExist, user_matter.setNote1);

router.put('/set_note2/:id_user/:id_matter', imTeacher, MatterExist, UserExist, user_matter.setNote2);

router.put('/set_note3/:id_user/:id_matter', imTeacher, MatterExist, UserExist, user_matter.setNote3);

module.exports = router;