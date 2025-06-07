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
          keyword: 1,
          day: {
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
          _id: "$day",
          metric: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
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
          metric: 1,
          _id: 0,
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
    // ทำการ group วันที่ โดยภายในมี keyword และจำนวนของ keuword เป็น object
    const data = await DataModel.aggregate([
      [
        { $unwind: "$keyword" },
        {
          $project: {
            keyword: 1,
            day: {
              $dateTrunc: {
                date: { $toDate: "$publisheddate" },
                unit: "day",
                timezone: "Asia/Bangkok",
              },
            },
          },
        },
        {
          $group: {
            _id: { day: "$day", keyword: "$keyword" },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id.day",
            metric: {
              $push: {
                keyword: "$_id.keyword",
                count: "$count",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            dimension: {
              $dateToString: {
                format: "%d/%m/%Y",
                date: "$_id",
                timezone: "Asia/Bangkok",
              },
            },
            metric: 1,
          },
        },
        {
          $sort: {
            dimension: 1,
          },
        },
      ],
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
        $addFields: {
          total_sum: {
            $add: [
              "$total_view",
              "$total_comment",
              "$total_share",
              "$total_like",
              "$total_love",
              "$total_sad",
              "$total_wow",
              "$total_angry",
            ],
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          dimension: {
            $dateToString: {
              format: "%d %m",
              date: "$_id",
              timezone: "Asia/Bangkok",
            },
          },
          _id: 0,
          percent_view: {
            $round: [
              { $multiply: [{ $divide: ["$total_view", "$total_sum"] }, 100] },
            ],
          },
          percent_comment: {
            $round: [
              {
                $multiply: [{ $divide: ["$total_comment", "$total_sum"] }, 100],
              },
            ],
          },
          percent_share: {
            $round: [
              { $multiply: [{ $divide: ["$total_share", "$total_sum"] }, 100] },
            ],
          },
          percent_like: {
            $round: [
              { $multiply: [{ $divide: ["$total_like", "$total_sum"] }, 100] },
            ],
          },
          percent_love: {
            $round: [
              { $multiply: [{ $divide: ["$total_love", "$total_sum"] }, 100] },
            ],
          },
          percent_sad: {
            $round: [
              { $multiply: [{ $divide: ["$total_sad", "$total_sum"] }, 100] },
            ],
          },
          percent_wow: {
            $round: [
              { $multiply: [{ $divide: ["$total_wow", "$total_sum"] }, 100] },
            ],
          },
          percent_angry: {
            $round: [
              { $multiply: [{ $divide: ["$total_angry", "$total_sum"] }, 100] },
            ],
          },
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
