const express = require("express");
const router = express.Router();
const {
  getAllData,
  getCountDataGroupByHour,
  getCountDataByEngagement,
  getCountDataByKeywordAndHour
} = require("../controller/graph.controller");

router.get("/", getAllData);
router.get("/getCountDataByHour", getCountDataGroupByHour);
router.get("/getCountDataByEngagement", getCountDataByEngagement);
router.get("/getCountDataByKeyword", getCountDataByKeywordAndHour);

module.exports = router;
