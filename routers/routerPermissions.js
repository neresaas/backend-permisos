const express = require ('express');
const routerPerissions = express.Router();

let authorizers = require('../data/authorizers');
let permissions = require('../data/permissions');
let users = require('../data/users');

routerPerissions.get('/', (req, res) => {
    let text = req.query.text
    if (text != undefined) {
        // El método includes te permite ver si el string incluye lo que le digas
        let permissionsWithText = permissions.filter(p => p.text.includes(text))
        res.json(permissionsWithText)
        return
    }
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

// PUT sirve para modificar datos que ya están creados
routerPerissions.put('/:id', (req, res)=> {
    let permissionId = req.params.id
    if (permissionId == undefined){
        res.status(400).json({error: 'no id'})
        return
    }
    let permission = permissions.find(p => p.id == permissionId)
    if (permission == undefined){
        res.status(400).json({error: 'no permission with this id'})
        return
    }

    let text = req.body.text
    if (text != undefined){
        permission.text = text
    }

    res.json({ modifiyed: true })
});

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
    let user = users.find(
        u => u.email == userEmail && u.password == userPassword)

    if ( user == undefined ){
            res.status(401).json({ error: 'No autorizado'})
            return
        }
    
    let errors = []
    if (text == undefined) {
        errors.push('No text in the body')
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
        userId: user.id
    })
    // Para devolver un JSON tiene que ser un objeto, una clave y un valor ------> 1 { clave: valor }
    res.json({ id: lastId + 1 })
});

// DELETE sirve para eliminar datos
routerPerissions.delete('/:id', (req, res) => {
    let permissionId = req.params.id
    if (permissionId == undefined){
        res.status(400).json({error: 'no id'})
        return
    }
    let permission = permissions.find(p => p.id == permissionId)
    if (permission == undefined){
        res.status(400).json({error: 'no permission with this id'})
        return
    }

    permissions = permissions.filter(p => p.id != permissionId)
    
    res.json({ deleted: true })
});

module.exports = routerPerissions;