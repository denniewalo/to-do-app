var express = require("express");
var bodyParser = require("body-parser");
const {format} = require('util');
const Multer = require('multer');
const {Storage} = require('@google-cloud/storage');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//render css files
app.use(express.static("public"));

//task-logik -> später mit s3 bucket befüllen
//const storage = new Storage();
//const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

//Task-arrays
var task = [];
var complete = [];

app.get("/", function(req, res) {    
    res.render("index", { task: task, complete: complete });
    //console.log(bucket)
});

app.get("/pic", function (req, res) {
    res.render("pic");
})

app.post("/pic", function (req,res) {
    res.render("pic")
})

app.post("/", function (req,res) {
    res.redirect("/");
})

// neuen task beim nach dem post "herausholen" und im array "task" ablegen, danach zu "/" redirecten
app.post('/addtask', function (req, res) {
    var newTask = req.body.newtask;
    task.push(newTask);
    res.redirect("/");
});

app.post("/completetask", function(req, res) {
    var completeTask = req.body.check;
    //nach typeof abfrage, wird der task hinzugefügt, in die Liste "complete"
    if (typeof completeTask === "string") {
        complete.push(completeTask);
        //wenn ein taks doppelt ist, soll er entfernt werden
        task.splice(task.indexOf(completeTask), 1);
        //Fals task vom typ object ist, dann iterieren
    } else if (typeof completeTask === "object") {
        for (var i = 0; i < completeTask.length; i++) {
            complete.push(completeTask[i]);
            task.splice(task.indexOf(completeTask[i]), 1);
        }
    }

    //bucket, nicht verbunden
    var fileRef = storage.bucket(bucket.name).file("task.txt");
    fileRef.exists().then(function(data) {
        console.log("File in database exists ");
    });
    res.redirect("/");
});

//Läuft auf port 8080
app.listen(8080, function () {
  console.log('Hört auf Port 8080!')
});