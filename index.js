var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//render css files
app.use(express.static("public"));


//task-logik -> später mit s3 bucket befüllen
var task = [];
var complete = [];

app.get("/", function(req, res) {    
    res.render("index", { task: task, complete: complete });
});

// neuen task beim nach dem post "herausholen" und im array "task" ablegen, danach zu "/" redirecten
app.post('/addtask', function (req, res) {
    var newTask = req.body.newtask;
    task.push(newTask);
    res.redirect("/");
});

app.post("/completetask", function(req, res) {
    var completeTask = req.body.check;
    //check for the "typeof" the different completed task, then add into the complete task
    if (typeof completeTask === "string") {
        complete.push(completeTask);
        //check if the completed task already exits in the task when checked, then remove it
        task.splice(task.indexOf(completeTask), 1);
    } else if (typeof completeTask === "object") {
        for (var i = 0; i < completeTask.length; i++) {
            complete.push(completeTask[i]);
            task.splice(task.indexOf(completeTask[i]), 1);
        }
    }
    res.redirect("/");
});

//Läuft auf port 3000
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});