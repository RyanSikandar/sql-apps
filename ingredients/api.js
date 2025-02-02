const path = require("path");
const express = require("express");
const router = express.Router();
const pg = require("pg");
// client side static assets
router.get("/", (_, res) => res.sendFile(path.join(__dirname, "./index.html")));
router.get("/client.js", (_, res) =>
  res.sendFile(path.join(__dirname, "./client.js"))
);

/**
 * Student code starts here
 */

// connect to postgres

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  password: "ryan",
  database: "recipeguru",
  port: 5432
})

router.get("/type", async (req, res) => {
  const { type } = req.query;
  console.log("get ingredients", type);

  // return all ingredients of a type
  const query = 'SELECT * FROM ingredients where type=$1';
  const values = [type];
  const result = await pool.query(query, values);
  if ( result ) {
    res.status(200).json({ status: "success", rows: result.rows });
  }
  else {
    res.status(500).json({ status: "error", rows: [] });
  }
});

router.get("/search", async (req, res) => {
  let { term, page } = req.query;
  page = page ? page : 0;
  console.log("search ingredients", term, page);

  // return all columns as well as the count of all rows as total_count
    const query = 'SELECT *, COUNT(*) OVER() AS total_count from ingredients where title ILIKE $1 OFFSET $2 LIMIT 5';

    const values = [`%${term}%`, page * 5];
  // make sure to account for pagination and only return 5 rows at a time
  const result = await pool.query(query, values);

  if ( result ) {
    res.status(200).json({ status: "success", rows: result.rows });
  }
  else {
    res.status(500).json({ status: "error", rows: [] });
  }
});

/**
 * Student code ends here
 */

module.exports = router;
