const supabase = require("../config/supabase");

const createGroup = async (payload) => {
  try {
    if (payload.eventType === "INSERT") {
      const { title, phone_number } = payload.new;
      const whatsappId = `${phone_number}@c.us`;
      console.log(title, whatsappId);
      const group = await global.client.createGroup(title, [whatsappId]);
      console.log("Group created successfully:", group);
      await supabase
        .from("groups")
        .update({
          is_created: true,
          group_id: group.gid._serialize,
        })
        .eq("id", payload.new.id);
    }
  } catch (err) {}
};

supabase
  .channel("groups")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "groups" },
    createGroup
  )
  .subscribe();
