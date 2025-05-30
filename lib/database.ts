import { Sequelize } from "sequelize";

// Use Railway's DATABASE_URL (recommended)
const databaseUrl =
  "mysql://root:gGNmzuRtVXphGrwxpwOVcnIskTldaRsK@metro.proxy.rlwy.net:42874/railway";

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

let sequelize: Sequelize;

if (databaseUrl) {
  // Using DATABASE_URL from Railway
  sequelize = new Sequelize(databaseUrl, {
    dialect: "mysql" as const,
    dialectModule: require("mysql2"),
    dialectOptions: {
      connectTimeout: 60000,
      acquireTimeout: 60000,
      timeout: 60000,
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  });
} else {
  // Fallback to individual environment variables
  sequelize = new Sequelize({
    dialect: "mysql" as const,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || "3306", 10),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    dialectModule: require("mysql2"),
    dialectOptions: {
      connectTimeout: 60000,
      acquireTimeout: 60000,
      timeout: 60000,
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  });
}

export default sequelize;

// Test connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// Sync models
export const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
};
