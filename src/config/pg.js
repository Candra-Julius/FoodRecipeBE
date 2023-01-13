require("dotenv").config();
const { Pool } = require("pg");
  let connectionFromDB ={}
  if(process.env.PROJECT_ENV === 'PRODUCTION'){
    {
      user: process.env.PGUSER;
      host: process.env.PGHOST;
      database: process.env.PGDATABASE;
      password: process.env.PGPASSWORD;
      port: process.env.PGPORT;
      connectionString: process.env.DATABASE_URL;
      ssl: {rejectUnauthorized: false};
    }
  }else{
    {
      user: process.env.PGUSER;
      host: process.env.PGHOST;
      database: process.env.PGDATABASE;
      password: process.env.PGPASSWORD;
      port: process.env.PGPORT;
      connectionString: process.env.DATABASE_URL;
    }
  }
  
  const pool = new Pool(connectionFromDB);

module.exports = pool;
