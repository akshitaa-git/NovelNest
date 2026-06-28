const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`\x1b[32m✔\x1b[0m MongoDB Atlas Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`\x1b[31m✘\x1b[0m Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
