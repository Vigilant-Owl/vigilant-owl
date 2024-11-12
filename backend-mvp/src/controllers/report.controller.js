module.exports = {
  getReport: async (req, res) => {
    const { groupId, phoneNumber, startDate, endDate } = req.body;
    const report = await global.ai.generateReport(
      groupId,
      phoneNumber,
      startDate,
      endDate
    );

    console.log(report);

    return res.status(200).json({
      status: "success",
      data: report,
    });
  },
};
