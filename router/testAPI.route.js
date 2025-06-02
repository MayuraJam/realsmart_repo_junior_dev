const express = require("express")
const router = express.Router();
const {getAllCreature,
    createNewCreature} 
    = require("../controller/testAPI.controller")

router.get("/",getAllCreature);
router.post("/",createNewCreature);

module.exports = router;