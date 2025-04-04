const app = require("./app");

const PORT = process.env.PORT || 5000;

const { sequelize } = require('./config/db');

sequelize.sync({ force: false }) 
  .then()
  .catch((err) => console.error('❌ Sync error:', err));


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log("📧 Email User:", process.env.EMAIL);
console.log("🔑 Email Password Present:", process.env.EMAIL_PASSWORD ? "Yes" : "No");

const net = require('net');

const testSMTP = () => {
    const client = net.createConnection(587, "smtp.gmail.com", () => {
        console.log("✅ SMTP Connection Successful");
        client.end();
    });

    client.on("error", (err) => {
        console.error("❌ SMTP Connection Failed:", err.message);
    });
};

testSMTP();



