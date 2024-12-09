const cron = require('node-cron');
const { updatePenalties } = require('../controllers/financialController');  // Path to your controller

// Cron job to update penalties once every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    await updatePenalties();
    console.log("Penalties updated successfully");
  } catch (error) {
    console.error("Error updating penalties: ", error);
  }
});
