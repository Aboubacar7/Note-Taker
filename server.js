const express = require("express")
const path = require("path")
const fs = require("fs")
const {v4: uuidv4} = require("uuid")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"))
})

app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if(err) throw err
        res.json(JSON.parse(data))
    })
})

app.post("/api/notes", (req, res) => {

    const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuidv4()
    }

    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if(err) throw err
        let dbData = JSON.parse(data)
        dbData.push(newNote)

        fs.writeFile("./db/db.json", JSON.stringify(dbData), (err) => {
            if (err) throw err;
            console.log("New Note Added!")
        })
    })
    res.sendFile(path.join(__dirname, "/public/notes.html"))
})

app.delete("/api/notes/:id", (req, res) => {

    const clicked = req.params.id

    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if(err) throw err
        let dbData = JSON.parse(data)

        let newDbData = dbData.filter(element => element.id !== clicked)

        fs.writeFile("./db/db.json", JSON.stringify(newDbData), (err) => {
            if (err) throw err;
            console.log("New Note Added!")
        })
    })
    res.sendFile(path.join(__dirname, "/public/notes.html"))
})

app.listen(PORT, () => {
    console.log("APP listen at http://localhost:"+ PORT);
})