require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require("path");
const {json} = require('body-parser');
const app = express();

//Requerir router
const studentRouter = require('./routes/user/student/student.routes');
const admintRouter = require('./routes/user/admin/admin.routes');
const teacherRouter = require('./routes/user/teacher/teacher.routes');
const matterRouter = require('./routes/metter/matter.routes');
const user_matterRouter = require('./routes/user_matter/user_matter.routes');
const formRouter = require('./routes/form/matter.routes');

//Settings
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extend:false}));
app.use(json());

//Rutas
app.use('/api/student', studentRouter);
app.use('/api/admin', admintRouter);
app.use('/api/teacher', teacherRouter);
app.use('/api/matter', matterRouter);
app.use('/api/user_matter', user_matterRouter);
app.use('/api/form', formRouter);

app.use((req, res, next) => {
  res.status(404).json({
    status: '404',
    descripcion: 'Pagina no encontrada'
  })
})
  
module.exports = app;