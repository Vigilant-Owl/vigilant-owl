const supabase = require("../config/supabase");

module.exports = {
  installBot: async (req, res) => {
    try {
      const { title, phoneNumber, parentId } = req.body;
      const whatsappId = `${phoneNumber}@c.us`;
      const group = await global.client.createGroup(title, [whatsappId]);
      console.log("Group created successfully:", group);
      // const message = await global.client.sendMessage(
      //   group.gid._serialized,
      //   consentMessage
      // );
      const { error } = await supabase.from("consent_messages").insert({
        group_id: group.gid._serialized,
        title: title,
        phone_number: phoneNumber,
        parent_id: parentId,
      });
      return res.status(200).json({
        status: "success",
        message: "Success to install bot",
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