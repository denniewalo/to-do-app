var express = require("express");
var bodyParser = require("body-parser");
const {format} = require('util');
const Multer = require('multer');
const path = require("path");
const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
    keyFilename: path.join(__dirname,"vm-tutorial-310919-961a214ef003.json"),
    projectId: "vm-tutorial-310919"
});

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// Multer is required to process file uploads and make them available via
// req.files.
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    },
  });

const bucket = storage.bucket('denniealex-bucket');

//Login
app.get("/", function(req, res) {
    res.render("login");
});

app.post("/login", function (req, res){
    if(req.body.loginName == "Dennie"){
        res.redirect("/welcome");
    }else{
        res.redirect("/");
    }
});

//Welcome
app.get("/welcome", function (req, res){
   res.render("welcome");
});

//ToDo
app.get("/create", function (req, res){
    res.render("createTodo");
});

//ShowTasks
app.get("/show", function (req, res){
    var tasks = [];
    var images = [];
    var googleURL = "https://storage.googleapis.com/"
    var imagesURL = [];
    bucket.getFiles(function(err, files) {
        if (!err) {
            images = files
            images.forEach(e => {
                fileName = e.name;
                bucketName = e.bucket.id;
                imageURL = googleURL + bucketName + "/" + fileName;
                imagesURL.push(imageURL)
            })
            res.render("show", {imagesURL: imagesURL});
        }else{
            res.render("show")
        }
    });
});

//CreateTask
app.post("/createTask", multer.single('file'), function (req,res, next){
    if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;
    }
    name = req.file.originalname
    nameList = name.split(".")
    newFileName = req.body.newtask + (".") + nameList[1]
    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(newFileName);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', err => {
        next(err);
    });

    blobStream.on('finish', () => {
        // The public URL can be used to directly access the file via HTTP.
        const publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        res.redirect("/welcome")
    });
    blobStream.end(req.file.buffer);
})

//Läuft auf port 8080
app.listen(8080, function () {
  console.log('Hört auf Port 8080!')
});