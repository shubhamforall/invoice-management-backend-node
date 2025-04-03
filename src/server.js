const app = require("./app");

const PORT = process.env.PORT || 5000;

const { sequelize } = require('./config/db');

sequelize.sync({ force: false }) 
  .then()
  .catch((err) => console.error('❌ Sync error:', err));


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("❌ SIGTERM received, shutting down server...");
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Promise Rejection:", reason);
});
