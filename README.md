---------REQUISITOS-----------
tener instalado mysql, NodeJS y sequelize
para intalar sequelize npm install -g sequelize-cli (ejecutarlo con sudo en linux y en windows abriri una terminal en modo administrador)

----------LEVANTAR EL PROYECTO---------
primero 
	se debe crear la base de datos con el nombre que se eligio en el archivo .env

segundo
	crear el archivo .env a corde a su configuracion de mysql

tercero 
	si esta en linux ejecutar: make runBacken y make api (opcional) make clean
	si esta en windows: sequelize db:migrate sequelize db:seed:all npm i npm run dev


-------CREDENCIALES--------
admin = {
	dni: 11111111
	password: 12345678
}

student = {
	dni: 22222222
	password: 12345678
}

}

teacher = {
	dni: 33333333
	password: 12345678
}