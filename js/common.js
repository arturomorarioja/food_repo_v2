import { baseUserUrl } from './env.js';

/**
 * Handles an error in a fetch request's .catch(),
 * displaying an error message on the page
 */
export const handleFetchCatchError = (error) => {
    const errorSection = document.createElement('section');
    errorSection.innerHTML = `
        <header>    
            <h3>Error</h3>
        </header>
        <p>Dear user, we are truly sorry to inform that there was an error while getting the data</p>
        <p class="error">${error}</p>
    `;
    document.querySelector('main').append(errorSection);
}

/**
 * Handles the first .then() in a fetch request,
 * raising an error if the response code is not a 2xx
 */
export const handleAPIError = (response) => {
    if (response.ok) {
        return response.json();
    }
    throw new Error('HTTP response error');
}

/**
 * Returns the logged used ID or 0 if no user is logged in
 */
export const loggedUserID = () => {
    return sessionStorage.getItem('food_repo_user_id') || 0;
}

/**
 * Logs out
 */
export const logout = () => {
    sessionStorage.removeItem('food_repo_user_id');
    sessionStorage.removeItem('food_repo_favourites');
    window.location.href = 'index.html';
}

/**
 * Creates and displays a recipe card
 */
export const handleRecipeCard = function(data) {
    const recipe = data.meals[0];

    const recipeCard = document.createElement('article');
    recipeCard.innerHTML = `
        <header>
            <h3><a href="recipe.htm?id=${recipe.idMeal}">${recipe.strMeal}</a></h3>
        </header>
        <a href="recipe.htm?id=${recipe.idMeal}"><img src="${recipe.strMealThumb}" alt=""></a>
        <div>
            <p class="pill foodType">${recipe.strCategory}</p>
            <p class="pill area">${recipe.strArea}</p>
        </div>
    `;

    // document.querySelector('section#recipe-cards').append(recipeCard);        
    return recipeCard;
}

/**
 * Loads the IDs of favourite recipes in sessionStorage
 */
export const loadFavourites = async (userID) => {
    // A promise is returned, so that it can be treated asynchronously by the caller
    return fetch(`${baseUserUrl}/users/${userID}/favourites`)
        .then(handleAPIError)
        .then(data => {
            sessionStorage.setItem('food_repo_favourites', JSON.stringify(data.recipes));
        })
        .catch(handleFetchCatchError);
}

/**
 * Returns true if the recipe whose ID it receives is among the user's favourites, false otherwise
 */
export const isFavourite = (recipeID) => {
    const favourites = JSON.parse(sessionStorage.getItem('food_repo_favourites'));
    return favourites.find((recipe) => recipe.recipe_id === parseInt(recipeID)) !== undefined;
}