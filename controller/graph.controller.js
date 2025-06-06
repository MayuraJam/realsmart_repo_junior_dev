const DataModel = require("../model/graph.model");

const getAllData = async (req, res) => {
  try {
    const response = await DataModel.find();

    if (!response) {
      return res.status(404).json({ message: "data not found" });
    } else {
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//แสดงจํานวนข้อมูลทั้งหมด โดยจําแนกตามช่วงวันเวลา (รายชั่วโมง)
const getCountDataGroupByHour = async (req, res) => {
  try {
    const data = await DataModel.aggregate([
      {
        $project: {
          hourOnly: {
            $dateToString: {
              format: "%H:00",
              date: { $toDate: "$publisheddate" },
              timezone: "Asia/Bangkok",
            },
          },
        },
      },
      {
        $group: {
          _id: "$hourOnly",
          metric: { $sum: 1 },
        },
      },
      {
        $project: {
          dimension: "$_id",
          metric: 1,
          _id: 0,
        },
      },
      {
        $sort: {
          dimension: 1,
        },
      },
    ]);

    res.status(200).json({ data: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// แสดงจํานวนข้อมูล Keyword โดยจําแนก Keyword ตามช่วงเวลา

const getCountDataByKeywordAndHour = async (req, res) => {
  try {
    const data = await DataModel.aggregate([
      { $unwind: "$keyword" },
      {
        $set: {
          keyword: { $split: ["$keyword", ", "] },
        },
      },
      { $unwind: "$keyword" },
      {
        $project: {
          keyword: 1,
          hour: {
            $dateTrunc: {
              date: { $toDate: "$publisheddate" },
              unit: "hour",
              timezone: "Asia/Bangkok",
            },
          },
        },
      },
      {
        $group: {
          _id: { hour: "$hour", keyword: "$keyword" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.hour": 1,
          count: -1,
        },
      },
    ]);
    res.status(200).json({ data: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// แสดงจํานวนข้อมูล Engagement โดยจําแนกตามประเภท

const getCountDataByEngagement = async (req, res) => {
  try {
    const data = await DataModel.aggregate([
      {
        $project: {
          day: {
            $dateTrunc: {
              date: { $toDate: "$publisheddate" },
              unit: "day",
              timezone: "Asia/Bangkok",
            },
          },
          engagement: {
            view: "$engagement_view",
            comment: "$engagement_comment",
            share: "$engagement_share",
            like: "$engagement_like",
            love: "$engagement_love",
            sad: "$engagement_sad",
            wow: "$engagement_wow",
            angry: "$engagement_angry",
          },
        },
      },
      {
        $group: {
          _id: "$day",
          total_view: { $sum: "$engagement.view" },
          total_comment: { $sum: "$engagement.comment" },
          total_share: { $sum: "$engagement.share" },
          total_like: { $sum: "$engagement.like" },
          total_love: { $sum: "$engagement.love" },
          total_sad: { $sum: "$engagement.sad" },
          total_wow: { $sum: "$engagement.wow" },
          total_angry: { $sum: "$engagement.angry" },
        },
      },
      {
        $project: {
          dimension: {
            $dateToString: {
              format: "%d/%m/%Y",
              date: "$_id",
              timezone: "Asia/Bangkok",
            },
          },
          total_view: 1,
          total_comment: 1,
          total_share:1,
          total_like: 1,
          total_love: 1,
          total_sad: 1,
          total_wow: 1,
          total_angry: 1,
          _id :0
        },
      },
      {
        $sort: {
          dimension: -1,
        },
      },
    ]);
    res.status(200).json({ data: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getAllData,
  getCountDataGroupByHour,
  getCountDataByEngagement,
  getCountDataByKeywordAndHour,
};
