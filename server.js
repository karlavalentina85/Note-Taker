// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3001;

app.use(express.static('public'));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db=path.join(__dirname, "/db/db.json");
var noteList = JSON.parse(fs.readFileSync(db, 'utf8'));

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.route("/api/notes")
    .get(function(req, res) {
//        var data = require(path.join(__dirname, "/db/db.json"));
        res.json(noteList);    
    })
    .post(function(req, res) {
            
        var response = {
            title:req.body.title,
            text:req.body.text
        };

        response.id = (noteList.length) +1;
    
        noteList.push(response);
            
        fs.writeFileSync(db, JSON.stringify(noteList));
        res.json(noteList)
    })
    
    


app.delete("/api/notes/:id", function(req, res) {
    var noteId = req.params.id;
    var newId = 1;
    noteList = noteList.filter(currentNote => {
        return currentNote.id != noteId;
    });
    for (currentNote of noteList) {
        currentNote.id = newId;
        newId++;
    }
    fs.writeFileSync(db, JSON.stringify(noteList));
    res.json(noteList);

});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
console.log("App listening on PORT " + PORT);
});