const mongoose = require("mongoose");

const StitchCreatureScrema = mongoose.Schema({
  creature_name: {
    type: String,
    required: [true, "Please enter the name of creature"],
  },
  creature_nickname: {
    type: String,
    required: [
      true,
      "Please enter the nick_name of creature or don't have your enter '-' ",
    ],
  },
  species: {
    type: String,
  },
  appearance: {
    type: String,
  },
  createDate: {
    type: Date,
  },
  updateDate: {
    type: Date,
  },
},{
    versionKey : false,
    timestamps : true
});

const StitchCreatureModel = mongoose.model("Creature",StitchCreatureScrema,"creature");

module.exports = StitchCreatureModel;