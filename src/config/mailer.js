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

const subscribeBody = '<b>se ha registrado con exito a la materia<b>';

const cancelBody = '<b> usted se ha dado de baja de la materia<b>'

const registerBody = '<b>su cuenta ha sido creada con exito<b>';

function sendMail(recept, subject, body){
	transporter.sendMail({
		from: '"Administracion campus"', // sender address
		to: recept, // list of receivers
		subject: subject, // Subject line
		html: body, // html body
	})
}

function subscriptionMatter(recept){
	sendMail(recept, 'subscripcion', subscribeBody);
}

function registeUser(recept){
	sendMail(recept, 'Alta de cuenta',registerBody);
}

function cancelSubscrive(recept){
	sendMail(recept,'Baja de materia',cancelBody);
}

module.exports = {
	sendMail, 
	subscriptionMatter, 
	registeUser, 
	cancelSubscrive
}
