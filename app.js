// require modules
const http = require("http");
const express = require("express");
const db = require('./model/db')

// setup server
const app = express();
const server = http.createServer(app)
let id = 6;

// include middleware (static files, json, urluncoded)
app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// get all Todos
app.get('/api/v1/todos', (req,res) => {
    res.json(db.todos)
})

// create new Todo
app.post('/api/v1/todos', (req, res) => {
    if (!req.body || !req.body.text) {
        // respond with an error
        res.status(422).json({
            error: "must include todo text"
        })
        // using return to stop the function if there is an error
        return
    }
    const newTodo = {
        id: id++,
        text: req.body.text,
        completed: false
    }
    // to add new todo to the db list
    db.todos.push(newTodo)
    res.status(201).json(newTodo)
})
// update existing Todo by id

app.patch('/api/v1/todos/:id', (req, res) => {
    // get the id from the route
    const id = parseInt(req.params.id)
    // find the existing todo
    const todoIndex = db.todos.findIndex((todo) => {
        return todo.id === id
    })
    // if we could not find todo with that id
    if (todoIndex === -1) {
        res.status(404).json({error: 'Could not find todo with that id'})
        return
    }
    // update the todo text if one was provided
    if (req.body && req.body.text) {
    db.todos[todoIndex].text = req.body.text
}
// update the todo completed status if it was provided
if (req.body && req.body.completed !== undefined)
    db.todos[todoIndex].completed = req.body.completed

    // respond with updated item
    res.json(db.todos[todoIndex])
})

// delete existing todo by id
app.delete('/api/v1/todos/:id' , (req,res) =>{

// get the id
const id = parseInt(req.params.id)
// find the existing todo
const todoIndex = db.todos.findIndex((todo) => {
    return todo.id === id
})
// delete the todo
db.todos.splice(todoIndex, 1)

// alternatively, filter out any todos the have an id that match
// db.todos.filter((todo) =>{
//  return todo.id !== id
// })
// respond with 204 and empty response
res.status(204).json()


})

// listen for requests
server.listen(3000, '127.0.0.1', () => {
    console.log('Server Listening on http://127.0.0.1:3000')
})