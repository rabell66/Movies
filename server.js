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

app.use(express.static("views"));

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

app.get("/movies/:id", (req,res)=>{
     Movie.findOne({_id: req.params.id}).then(foundmovies=>{
         console.log("Year Made:", foundMovies.yearMade)//looking at the virtual field from Movies.js
        foundMovie.shoot()//calls the method created in Arrowhead.js
        res.send(foundmovies);
    })
    .catch(err=>{
        res.status(500).send(err);
    });
});

app.post("/movies", (req, res) => {
  let movieData = req.body;
  let newMovie = new Movie(movieData);
  console.log("newMovie: ", newMovie);
  newMovie
    .save()
    .then(savedMovie => {
      console.log("savedMovie: ", savedMovie);
      //only one param dont need ()
      res.send(savedMovie);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.get("/addmovie", (req, res)=>{
    res.render("addmovie")
})
app.post("/addmovie", (req,res)=>{
    
})

app.get("/updatemovie", (req,res)=>{
    res.render("addmovie", {update:true})
})

app.put("/movies/:id", (req,res)=>{
    Movie.updateOne({_id:req.params.id},req.body)//takes two objects..the query where to update and what to update
.then(updatedMovie=>{
    res.send(updatedMovie);
}).catch(err=>{ res.status(500).send(err);})
})
app.delete("/movies/:id", (req,res)=>{
    Movie.deleteOne({_id: req.params.id})
    .then(()=> {
        res.send("deleted record");
    })
    .catch(err =>{
        res.status(500).send(err);
    });
    });

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
