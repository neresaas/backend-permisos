let express = require ('express');

let app = express();
let port = 8081;
// Lee datos del body que estén en formato json
app.use(express.json());

let routerPerissions = require('./routers/routerPermissions');
app.use('/permissions', routerPerissions);
let routerUsers = require('./routers/routerUsers');
app.use('/users', routerUsers);
let routerLogin = require('./routers/routerLogin');
app.use('/login', routerLogin);

app.listen(port, () => {
    console.log('Servidor activo en ' + port)
});