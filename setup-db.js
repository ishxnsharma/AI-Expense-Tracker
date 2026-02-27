const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Render databases
});

async function setup() {
    console.log('Connecting to remote Render database...');
    try {
        const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

        console.log('Executing schema.sql...');
        await pool.query(schemaSql);

        console.log('✅ Database setup complete! Tables created and demo user inserted.');
    } catch (err) {
        console.error('❌ Error setting up database:', err);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

setup();
