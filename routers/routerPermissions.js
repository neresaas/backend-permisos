const express = require ('express');
const routerPerissions = express.Router();

let authorizers = require('../data/authorizers');
let permissions = require('../data/permissions');
let users = require('../data/users');

routerPerissions.get('/', (req, res) => {
    res.json(permissions)
});

routerPerissions.get('/:id', (req, res) => {
    let id = req.params.id
    if (id == undefined) {
        res.status(400).json({error: 'No id'})
        return
    }
    let permission = permissions.find(p => p.id == id)
    if (permission == undefined) {
        res.status(400).json({error: 'Invalid id'})
        return
    }
    res.json(permission)
});

// PUT sirve para modificar datos que ya están creados.
routerPerissions.put('/:id/approvedBy', (req, res) => {
    let permissionId = req.params.id
    let authorizerEmail = req.body.authorizerEmail
    let authorizerPassword = req.body.authorizerPassword

    // Autenticación
    let authorizer = authorizers.find(a => a.email == authorizerEmail && a.password == authorizerPassword)
    if (authorizer == undefined){
        res.status(401).json({ error: 'No autorizado'})
        return
    }

    // Validación
    let permission = permissions.find( p => p.id == permissionId)
    if (permissionId == undefined) {
        res.status(400).json({ error: 'No permissionId'})
        return
    }

    permission.approvedBy.push(authorizer.id)

    res.json(permission)
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
        approvedBy: [],
        userId: listUsers[0].id
    })
    // Para devolver un JSON tiene que ser un objeto, una clave y un valor ------> 1 { clave: valor }
    res.json({ id: lastId + 1 })
});

module.exports = routerPerissions;