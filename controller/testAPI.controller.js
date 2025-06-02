const CreatureModel = require("../model/testAPI.model");

const getAllCreature = async (req, res) => {
  try {
    const response = await CreatureModel.find();

    if (!response) {
      return res.status(404).json({ message: "data not found" });
    } else {
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createNewCreature = async (req, res) => {
  try {
    const newCreature = new CreatureModel();
    const reqBody = req.body;

    newCreature.creature_name = reqBody.creature_name;
    newCreature.creature_nickname = reqBody.creature_nickname;
    newCreature.species = reqBody.species;
    newCreature.appearance = reqBody.appearance;
    newCreature.createDate = new Date();
    newCreature.updateDate = new Date();

    await newCreature.save();
    res.status(201).json({ newCreature });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllCreature, createNewCreature };
