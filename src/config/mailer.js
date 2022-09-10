const mailer = require('nodemailer');
const transporter = mailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS
	}
});

const subscribeBody = '<b>Se ha registrado con exito a la materia<b>';

const cancelBody = '<b> Usted se ha dado de baja de la materia<b>'

const registerBody = '<b>Su cuenta ha sido creada con exito<b>';

const destoyUserBody = '<b>Su cuenta ha sido eliminada<b>';

const assingBody = '<b>Usted ha sido asignado profesor de la mteria<b>';

const unassingBody = '<b>Usted ha sido desasignado como profesor de la mteria<b>';

function logError(error) {
	console.log("Error: " + error);
}


function sendMail(recept, subject, body){
	
	transporter.sendMail({
		from: '"Administracion campus"', // sender address
		to: recept, // list of receivers
		subject: subject, // Subject line
		html: body, // html body
	}).catch(logError)
}

function subscriptionMatter(recept){
	sendMail(recept, 'Subscripcion', subscribeBody);
}

function registeUser(recept){
	sendMail(recept, 'Alta de cuenta',registerBody);
}

function cancelSubscrive(recept){
	sendMail(recept,'Baja de materia',cancelBody);
}

function destoyUser(recept){
	sendMail(recept,'Baja de materia',destoyUserBody);
}


function assingMatter(recept){
	sendMail(recept,'Asignacion de materia',assingBody);
}


function unassingMatter(recept){
	sendMail(recept,'Desasignacion de materia',unassingBody);
}


module.exports = {
	subscriptionMatter, 
	registeUser, 
	cancelSubscrive,
	destoyUser,
	assingMatter,
	unassingMatter
}