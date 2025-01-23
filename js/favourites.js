import { baseUrl, baseUserUrl } from './env.js';
import { 
    handleAPIError, handleFetchCatchError, 
    handleRecipeCard, 
    loggedUserID, tokenHeader
} from './common.js';

/**
 * Gets the favourite recipe ID for the current user from the user API,
 * then gets information for each favourited recipe from the Meal DB API
 */
fetch(`${baseUserUrl}/users/${loggedUserID()}/favourites`, { 
    headers: tokenHeader() 
})
.then(handleAPIError)
.then(async data => {
    if (data.recipes.length === 0) {
        const message = document.createElement('p');
        message.innerText = 'This user has not marked any recipe as favourite yet.';
        document.querySelector('#recipe-cards').append(message);
    } else {
        // data.recipes.forEach() does not handle asynchronous operations sequentially,
        // but a traditional for() does
        const recipeContainer = document.createDocumentFragment();
        for (let index = 0; index < data.recipes.length; index++) {
            // By waiting for fetch() to finish we avoid appending to the page for each recipe
            await fetch(`${baseUrl}/lookup.php?i=${data.recipes[index].recipe_id}`)
            .then(handleAPIError)
            .then(data => {
                recipeContainer.append(handleRecipeCard(data));
            })
            .catch(handleFetchCatchError);
        }
        document.querySelector('#recipe-cards').append(recipeContainer);
    }
})
.catch(handleFetchCatchError);