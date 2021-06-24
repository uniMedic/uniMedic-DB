const config = require('./config/config');

// mongodb
require('./config/db');

const app = require('express')();

const UserRouter = require('./api/User');
const StadisticRouter = require('./api/Stadistic');

// 
const bodyParser = require('express').json;
app.use(bodyParser());

app.use('/user', UserRouter)
app.use('/stadistic', StadisticRouter)

app.listen(config.portExpress, () => {
    console.log(`Servidor corriendo en el puerto ${config.portExpress}`);
})

// servidor