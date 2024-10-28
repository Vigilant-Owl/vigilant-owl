module.exports = {
  getMessages: (req, res) => {
    console.log("message");
    return res.status(200).json({
      message: "ok",
    });
  },
};
