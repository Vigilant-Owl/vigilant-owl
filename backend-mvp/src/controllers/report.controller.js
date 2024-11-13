module.exports = {
  getReport: async (req, res) => {
    try {
      const { groupId, phoneNumber, startDate, endDate, tableId } = req.body;
      const report = await global.ai.generateReport(
        groupId,
        phoneNumber || "18406880000",
        startDate,
        endDate,
        tableId || "1"
      );

      console.log(report);

      if (report === "no data") {
        return res.status(400).json({
          status: "error",
          message: "There is no data.",
        });
      }
      return res.status(200).json({
        status: "success",
        data: report,
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }
  },
};
