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
        <p>Dear user, we are truly sorry to inform that there was an error while retrieving the data</p>
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
    return localStorage.getItem('food_repo_user_id') || 0;
}

/**
 * Logs out
 */
export const logout = () => {
    
    // Current user information is removed from localStorage
    localStorage.removeItem('food_repo_user_id');
    localStorage.removeItem('food_repo_user_token');
    localStorage.removeItem('food_repo_favourites');

    // The user is relocated to the homepage
    window.location.href = 'index.html';
}

/**
 * Creates and returns a recipe card
 */
export const handleRecipeCard = function(data) {
    const recipe = data.meals[0];

    const recipeCard = document.createElement('article');
    recipeCard.innerHTML = `
        <header>
            <h3><a href="recipe.htm?id=${recipe.idMeal}">${recipe.strMeal}</a></h3>
        </header>
        <a href="recipe.htm?id=${recipe.idMeal}">
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
        </a>
        <div>
            <p class="pill foodType">${recipe.strCategory}</p>
            <p class="pill area">${recipe.strArea}</p>
        </div>
    `;

    return recipeCard;
};

/**
 * Returns an HTTP header that includes the authentication token
 */
export const tokenHeader = () => new Headers({
    'X-Session-Token': localStorage.getItem('food_repo_user_token')
});

/**
 * Loads the IDs of favourite recipes in localStorage
 */
export const loadFavourites = async (userID) => {
    
    // A promise is returned, so that it can be treated asynchronously by the caller
    return fetch(`${baseUserUrl}/users/${userID}/favourites`, { 
        headers: tokenHeader() 
    })
    .then(handleAPIError)
    .then(data => {
        localStorage.setItem('food_repo_favourites', JSON.stringify(data.recipes));
    })
    .catch(handleFetchCatchError);
};

/**
 * Returns true if the recipe whose ID it receives is among the user's favourites, false otherwise
 */
export const isFavourite = (recipeID) => {
    const favourites = JSON.parse(localStorage.getItem('food_repo_favourites'));
    return favourites.find((recipe) => recipe.recipe_id === parseInt(recipeID)) !== undefined;
}