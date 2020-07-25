// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

app.use(express.static('public'))

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
res.sendFile(path.join(__dirname, "/public/notes.html"));
});


// Displays all characters
app.get("/api/notes", function(req, res) {
    var data = require(path.join(__dirname, "/db/db.json"));
    return res.json(data);
});

// Create New Characters - takes in JSON input
app.post("/api/notes", function(req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    var newData = req.body;
        
    fs.readFile(path.join(__dirname, "/db/db.json"), function(err, data) {
        if (err) throw err;

        var arrayOfObjects = JSON.parse(data);
        arrayOfObjects.push(newData);

        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(arrayOfObjects), function(err) {
            if (err) throw err
        });    
        res.json(newData);
    });

});


app.delete("/api/notes/:id", function(req, res) {
    fs.readFile(path.join(__dirname, "/db/db.json"), function (err, data) {
        var notes = JSON.parse(data);
        var noteID = req.params.id;
        if (err) throw err;
    
        notes = notes.filter(function(note) {
            return note.id != noteID;
        });
    
        var value = 0;
        notes.forEach(note => {
            note.id = value;
            value++;
        });

        console.log(notes);

        fs.writeFileSync(path.join(__dirname, "/db/db.json"), JSON.stringify(notes));
        res.json(notes);
    });
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
console.log("App listening on PORT " + PORT);
});