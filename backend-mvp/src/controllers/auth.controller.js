const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");

module.exports = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          status: "error",
          message: "Invalid Request",
        });
      }

      // Fetch the user from the database
      const { data, error } = await supabase.rpc("check_password", {
        email,
        password,
      });

      if (error) throw error;
      console.log(data);

      if (data.status !== "success") {
        return res.status(401).json(data);
      }
      const { data: user, error: userError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (userError) throw userError;

      console.log(user);

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        status: "success",
        message: "Successfully logged in",
        data: {
          email: user.email,
          token,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: "An error occurred during login",
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
  resetPassword: async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      console.log(currentPassword, newPassword);
      const { data, error } = await supabase.rpc("reset-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      if (error) {
        return res.status(404).json({
          status: "error",
          message: error.message,
        });
      }
      return res.status(200).json({
        status: "success",
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
