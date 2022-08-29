runBackEnd:
	sequelize db:migrate
	sequelize db:seed:all

api:
	npm i
	npm run dev

clean: 
	$(RM) -r node_modules
	$(RM) -r package-lock.json