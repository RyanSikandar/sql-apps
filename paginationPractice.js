const pg = require("pg");
const express = require("express");
const router = express.Router();
const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    password: "lol",
    database: "omdb",
    port: 5432
})

router.get("/", async (req, res) => {
    //Implementing seek based pagination
    const limit = 10;
    const cursor = req.query.cursor;
    let query = `SELECT * FROM movies ORDER BY id ASC LIMIT ${limit + 1}`;

    if (cursor) {
        query = `SELECT * FROM movies WHERE id > $1 ORDER BY id ASC LIMIT ${limit + 1}`;
    }

    try {
        const result = cursor ? await pool.query(query, [cursor]) : await pool.query(query);
        const movies = result.rows;
        let nextCursor = null;
        if (movies.length > limit) {
            nextCursor = movies.pop().id;
        }
        res.json({
            movies,
            nextCursor
        })

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
