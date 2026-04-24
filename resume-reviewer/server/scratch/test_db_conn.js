import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function testConn() {
    try {
        console.log('Testing connection with existing password...');
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('SUCCESS: Connection works with existing password.');
        await mongoose.disconnect();
    } catch (error) {
        console.log('FAILED: Connection failed. Password might be wrong or network is blocked.');
        console.error(error.message);
    }
}

testConn();
