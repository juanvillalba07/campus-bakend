----------LEVANTAR EL PROYECTO---------
primero 
	se debe crear la base de datos campus

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