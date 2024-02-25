const express = require ('express');
const routerPerissions = express.Router();

let permissions = require('../data/permissions');
let users = require('../data/users');
routerPerissions.get('/', (req, res) => {
    res.json(permissions)
});

routerPerissions.post('/', (req, res) => {
    let text = req.body.text
    let userEmail = req.body.userEmail
    let userPassword = req.body.userPassword

    // Validación
    let listUsers = users.filter(
        u => u.email == userEmail && u.password == userPassword)

    if ( listUsers.length == 0 ){
            res.status(401).json({ error: 'No autorizado'})
            return
        }
    
    let errors = []
    if (text == undefined) {
        errors.push('No text in the body')
    }
    if (userId == undefined){
        errors.push('No userId in the body')
    }
    if (errors.length > 0) {
        res.status(400).json({ errors: errors})
        return
    }

    let lastId = permissions[permissions.length - 1].id

    permissions.push({
        id: lastId + 1,
        text: text,
        approbedBy: [],
        userId: listUsers[0].id
    })
    // Para devolver un JSON tiene que ser un objeto, una clave y un valor ------> 1 { clave: valor }
    res.json({ id: lastId + 1 })
});

module.exports = routerPerissions;