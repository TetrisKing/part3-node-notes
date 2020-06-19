const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
//Require to allow websites outsite this localhost:3001 to access this server
app.use(cors())
//Required to allow 'request.body' to be populated
app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :response-time ms - :body'));


let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2019-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true
    }
]

const generateId = () => {
    return notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
}

//HTML
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

//API
app.get('/api/notes', (req, res) => {
    res.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    note ? response.json(note) : response.status(404).end()
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId(),
    }

    notes = notes.concat(note)

    response.json(note)
})


app.put('/api/notes/:id', (request, response) => {
    const body = request.body

    if (!body.id) {
        return response.status(400).json({
            error: 'id missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: body.date,
        id: body.id,
    }    

    notes[notes.findIndex(n=>n.id==note.id)] = note

    response.json(note)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})