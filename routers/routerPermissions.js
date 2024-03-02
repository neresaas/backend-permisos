const express = require ('express');
const routerPerissions = express.Router();
let jwt = require('jsonwebtoken');

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

routerPerissions.post('/', (req, res) => {
    let text = req.body.text

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
        userId: req.infoApiKey.id
    })
    // Para devolver un JSON tiene que ser un objeto, una clave y un valor ------> 1 { clave: valor }
    res.json({ id: lastId + 1 })
});

// PUT sirve para modificar datos que ya están creados
routerPerissions.put('/:id', (req, res)=> {
    let permissionId = req.params.id

    if (permissionId == undefined){
        res.status(400).json({error: 'no id'})
        return
    }
    let permission = permissions.find(
        p => p.id == permissionId && p.userId == req.infoApiKey.id)

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

    let user = users.find(u => u.id == req.infoApiKey.id)

    if (user.role != 'admin'){
        res.status(401).json({error: 'user is not an admin'})
        return
    }

    let permissionId = req.params.id

    // Validación
    if (permissionId == undefined) {
        res.status(400).json({ error: 'No permissionId'})
        return
    }

    let permission = permissions.find(p => p.id == permissionId)
    permission.approvedBy.push(req.infoApiKey.id)

    res.json(permission)
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

    let user = users.find(u => u.id == req.infoApiKey.id)

    if (user.role == 'user' && permission.userId != req.infoApiKey.id) {
        res.status(401).json({error: 'is not your permission'})
        return
    }

    permissions = permissions.filter(p => p.id != permissionId)
    
    res.json({ deleted: true }) 
});

module.exports = routerPerissions;