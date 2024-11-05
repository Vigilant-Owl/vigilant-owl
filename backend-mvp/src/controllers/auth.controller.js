module.exports = {
  login: (req, res, next) => {
    try {
      const { email, password } = req.body;
      return res.status(200).json({
        status: "success",
        message: "Success to login",
        data: {
          email,
          password,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }
  },
  register: (req, res, next) => {
    try {
      const { email, firstName, lastName, password } = req.body;
      console.log(email, firstName, lastName, password);
      return res.status(200).json({
        status: "success",
        message: "Success to login",
        data: {
          email,
          password,
        },
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
