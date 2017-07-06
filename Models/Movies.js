var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var moviesSchema = new Schema({
    title: {
        type:String,
        require:true,
    },
    director: {
        type:String,
        required:true,
    },
    genre: {
        type:String,
        required:true,
       
    },
    releaseYr: {
        type:Number,
        required:true,
    },
    filmLocation:{
        country:{
            type:String},
        state_province:{
            type:String},

        },
        actor:[String]
})
module.exports = mongoose.model("Movie", moviesSchema);

