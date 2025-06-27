const cron = require("node-cron");
const Baby = require("../db/Models/babyModel");
const Notification = require("../db/Models/notificationModel");
const calculateAgeInMonths = require("../utils/calculateAgeInMonths");

cron.schedule("0 0  * * *", async () => {
    console.log("[CRON STARTED] Running baby age check at :00 AM");
  try {
    const babies = await Baby.findAll();

    for (const baby of babies) {
      const actualAge = calculateAgeInMonths(baby.birth_date);

      if (actualAge > baby.age_in_months) {
        baby.age_in_months = actualAge;
        await baby.save();

        const existing = await Notification.findOne({
          where: {
            user_id: baby.user_id,
            type: "vaccination_reminder",
            age_in_months: actualAge
          }
        });

        if (!existing) {
            await Notification.create({
              user_id: baby.user_id,
              content: `Your baby ${baby.baby_name} is now ${actualAge} months old. Please check the vaccination schedule.`,
              type: "vaccination_reminder",
              is_read: false,
              age_in_months: actualAge
            });
          }
          
      }
    }
  } catch (error) {
    console.error("Cron job error:", error.message);
  }
});
