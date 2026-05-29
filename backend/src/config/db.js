import 'dotenv/config';
import mysql from 'mysql2/promise';

const poolConfig = {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 20,
};

if (process.env.DB_SSL === 'true') {
	poolConfig.ssl = {
		rejectUnauthorized: false,
	};
}

const pool = mysql.createPool(poolConfig);

export default pool;
