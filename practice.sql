SELECT 
i.title as ingredient_title,
i.image as ingredient_image,
r.title as recipe_title,
r.body as recipe_body
from recipe_ingredients ri

inner join ingredients i 
on i.id = ri.ingredient_id

inner join recipes r
on r.recipe_id = ri.recipe_id


SELECT 
m.name, 
ARRAY(SELECT ecn.name from english_category_names ecn 
INNER JOIN 
movie_keywords mk, 
on 
mk.category_id = ecn.category_id 
WHERE
mk.movie_id = m.id
LIMIT 5) as keywords
FROM movies m
where name like '%star wars%'
