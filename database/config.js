require("dotenv").config({ path: ".env.local" });
//root:@:/railway
mysql: module.exports = {
  development: {
    username: "root",
    password: "xrMryrLAAuPZvsfgfsDmmkpqnFREHMVz",
    database: "railway",
    host: "mainline.proxy.rlwy.net",
    port: 11792,
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: "gGNmzuRtVXphGrwxpwOVcnIskTldaRsK",
    database: "railway_test",
    host: "metro.proxy.rlwy.net",
    port: 42874,
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: "gGNmzuRtVXphGrwxpwOVcnIskTldaRsK",
    database: "railway",
    host: "metro.proxy.rlwy.net",
    port: 42874,
    dialect: "mysql",
  },
};
