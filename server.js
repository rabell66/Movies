const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const mustacheExpress = require("mustache-express");
mongoose.Promise = require("bluebird");
var Movie = require("./models/Movies");
const app = express();
const port = process.env.Port || 8000;
const dbURL = "mongodb://localhost:27017/Movies"; //if db doesnt exist it will create it for you

mongoose.connect(dbURL).then(function(err, db) {
  if (err) {
    console.log("error", err);
  }
  console.log("connected to mongoose db");
});


//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}))
app.use("/", express.static("./public"));
app.engine("mustache", mustacheExpress());
app.set("views", "./public");
app.set("view engine", "mustache");

app.use(express.static("./public"));

app.get("/", (req,res)=>{
    res.redirect("/movies")
})

app.get("/movies", (req, res)=>{
    Movie.find().then(foundMovie=>{
        res.render("movies", {data:foundMovie});
    })
    .catch(err=>{
        res.status(500).send(err);
    });
});

app.get("/addmovie",(req,res)=>{
    res.render("addmovie")
})
//adding a new movie\\
app.post("/addmovie", (req,res)=>{
    var obj = {
        title: req.body.title,   
    director: req.body.director,
    genre: req.body.genre,
    releaseYr: req.body.releaseYr,   
    filmLocation:{
        country:req.body.country,
        state_province:req.body.state_province
        },
        actor:req.body.actor
}  
    let newMovie = new Movie(obj)
     newMovie
    .save()
    .then(savedMovie => {
      res.redirect("/");
    })
    .catch(err => {
      res.status(500).send(err);
    });
    
})

app.get("/addmovie/:id", (req,res)=>{
     Movie.findOne({_id: req.params.id}).then(foundmovie=>{
        
        res.render("addmovie", {info:foundmovie});
    })
    .catch(err=>{
        res.status(500).send(err);
    });
});


app.post("/editmovies/:id", (req,res)=>{
   
     var obj = {
        title: req.body.title,   
    director: req.body.director,
    genre: req.body.genre,
    releaseYr: req.body.releaseYr,   
    filmLocation:{
        country:req.body.country,
        state_province:req.body.state_province
        },
        actor:req.body.actor
}  
console.log(req.params.id)
Movie.updateOne({_id:req.params.id},obj)//takes two objects..the query where to update and what to update
.then(()=>{
    res.redirect("/movies");
}).catch(err=>{ res.status(500).send(err);})
})

app.get("/delete/:id", (req,res)=>{
    Movie.deleteOne({_id: req.params.id})
    .then(()=> {
        res.redirect("/movies");
    })
    .catch(err =>{
        res.status(500).send(err);
    });
    });

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
