const path = require("path");
const express = require("express");
const router = express.Router();
const pg = require("pg");

// client side static assets
router.get("/", (_, res) => res.sendFile(path.join(__dirname, "./index.html")));
router.get("/client.js", (_, res) =>
  res.sendFile(path.join(__dirname, "./client.js"))
);
router.get("/detail-client.js", (_, res) =>
  res.sendFile(path.join(__dirname, "./detail-client.js"))
);
router.get("/style.css", (_, res) =>
  res.sendFile(path.join(__dirname, "../style.css"))
);
router.get("/detail", (_, res) =>
  res.sendFile(path.join(__dirname, "./detail.html"))
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

router.get("/search", async function (req, res) {
  console.log("search recipes");

  // return recipe_id, title, and the first photo as url
  //
  // for recipes without photos, return url as default.jpg
  const query = "SELECT DISTINCT ON (recipes.recipe_id) recipes.recipe_id, title, coalesce(recipes_photos.url, 'default.jpg') from recipes LEFT JOIN recipes_photos ON recipes.recipe_id = recipes_photos.recipe_id";
  const result = await pool.query(query);

  if (result) {
    res.status(200).json({ status: "success", rows: result.rows });
  }
  else {
    res.status(500).json({ status: "error", rows: [] });
  }
});

router.get("/get", async (req, res) => {
  const recipeId = req.query.id ? +req.query.id : 1;
  console.log("recipe get", recipeId);

  // return all ingredient rows as ingredients
  //    name the ingredient image `ingredient_image`
  //    name the ingredient type `ingredient_type`
  //    name the ingredient title `ingredient_title`
  //
  const ingredientPromise = pool.query(`SELECT i.title AS ingredient_title, i.image as ingredient_image, i.type as ingredient_type FROM recipe_ingredients ri INNER JOIN ingredients i on ri.ingredient_id = i.id WHERE ri.recipe_id = $1`, [recipeId]);
  //
  // return all photo rows as photos
  //    return the title, body, and url (named the same)
  //
  //
  const photoPromise = pool.query(`SELECT title, body, COALESCE(i.url, 'default.jpg') as url from recipes r LEFT JOIN recipes_photos i on r.recipe_id = i.recipe_id WHERE r.recipe_id = $1`, [recipeId]);
  // return the title as title
  // return the body as body
  // if no row[0] has no photo, return it as default.jpg

  const [{ rows: photosRows }, { rows: ingredientsRows }] = await Promise.all([
    photoPromise,
    ingredientPromise,
  ]);
  console.log(photosRows);

  res.json({
    ingredients: ingredientsRows,
    photos: photosRows.map((photo) => photo.url),
    title: photosRows[0].title,
    body: photosRows[0].body,
  });
});
/**
 * Student code ends here
 */

module.exports = router;
