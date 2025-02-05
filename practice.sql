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

