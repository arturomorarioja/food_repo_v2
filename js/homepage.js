import { baseUrl } from './env.js';
import { handleAPIError, handleFetchCatchError, handleRecipeCard } from './common.js';

/**
 * Ten random recipes are shown in the homepage
 */
const NUM_RECIPES_TO_SHOW = 10;

const recipeContainer = document.createElement('div');
for (let index = 0; index < NUM_RECIPES_TO_SHOW; index++) {
    // By waiting for fetch() to finish we avoid appending to the page for each recipe
    await fetch(`${baseUrl}/random.php`)
    .then(handleAPIError)
    .then(data => {
        recipeContainer.append(handleRecipeCard(data));
    })
    .catch(handleFetchCatchError);
}
document.querySelector('#recipe-cards').innerHTML = recipeContainer.innerHTML;