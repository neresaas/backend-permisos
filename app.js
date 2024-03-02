let express = require ('express');
let jwt = require('jsonwebtoken');

let app = express();
let port = 8081;
// Lee datos del body que estén en formato json
app.use(express.json());
// Middleware
app.use(['/permissions'], (req, res, next) => {
    console.log('Middleware execution')

    let apiKey = req.query.apiKey
    if ( apiKey == undefined) {
        res.status(401).json({error: 'apiKey required'})
        return
    }

    let infoApiKey = null
    try {
        infoApiKey = jwt.verify(apiKey, 'secret')
    } catch (error) {
        res.status(401).json({error: 'invalid token'})
        return
    }
    req.infoApiKey = infoApiKey
    next()
});

let routerPerissions = require('./routers/routerPermissions');
app.use('/permissions', routerPerissions);
let routerUsers = require('./routers/routerUsers');
app.use('/users', routerUsers);
let routerLogin = require('./routers/routerLogin');
app.use('/login', routerLogin);

app.listen(port, () => {
    console.log('Servidor activo en ' + port)
});