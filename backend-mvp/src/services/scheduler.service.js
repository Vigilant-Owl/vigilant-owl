const cron = require("node-cron");
const supabase = require("../config/supabase");
cron.schedule("0 */3 * * *", async () => {
// cron.schedule("*/1 * * * *", async () => {
  try {
    console.log("Running a task every 3 hours");
    // Your task logic here
    const { data: groups, error } = await supabase
      .from("consent_messages")
      .select("*")
      .eq("is_active", true);
    if (error) throw error;
    groups.forEach(async (group) => {
      const report = await global.ai.generateReport(
        group.group_id,
        group.phone_number,
        "2024-10-10",
        "2024-10-14"
        // startDate,
        // endDate,
        // tableId || "1"
      );
      if (report === "no data") {
        return;
      }
      const { data: previousReport, reportError } = await supabase
        .from("reports")
        .select("*")
        .eq("parent_id", group.parent_id)
        .eq("group_id", group.group_id);
      console.log(previousReport, group.parent_id, group.group_id);
      if (reportError) throw reportError;
      console.log(previousReport.length);
      if (previousReport.length) {
        const { error } = await supabase
          .from("reports")
          .update({ data: JSON.stringify(report) })
          .eq("parent_id", group.parent_id)
          .eq("group_id", group.group_id);
        console.log(error, "Updated");
        if (error) throw error;
      } else {
        const { error } = await supabase.from("reports").insert({
          group_id: group.group_id,
          parent_id: group.parent_id,
          data: JSON.stringify(report),
        });
        console.log(error, "Inserted");
        if (error) throw error;
      }
    });
  } catch (err) {
    console.error(err);
  }
});
