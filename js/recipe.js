import { baseUrl, baseUserUrl } from './env.js';
import { 
    handleAPIError, handleFetchCatchError, 
    loadFavourites, isFavourite, 
    loggedUserID, tokenHeader
} from './common.js';

const NON_FAVOURITED = '&#9734;';   // White (unselected) star
const FAVOURITED = '&#9733';        // Black (selected) star

let recipeID = new URLSearchParams(window.location.search);
recipeID = recipeID.get('id');

/**
 * Display recipe information on the page
 */
const handleRecipe = (data) => {
    const recipe = data.meals[0];

    const MAX_INGREDIENTS = 20;
    const recipeInfo = document.querySelector('#recipe-info');

    // Header and favourite button
    recipeInfo.querySelector('&> header > h2').innerText = recipe.strMeal;
    if (loggedUserID()) {
        const favourite = isFavourite(recipe.idMeal) ? FAVOURITED : NON_FAVOURITED;
        const favouriteButton = document.createElement('button');
        favouriteButton.classList.add('favourite');
        favouriteButton.innerHTML = favourite;
        recipeInfo.querySelector('&> header').append(favouriteButton);
    }
    
    // Recipe picture
    const recipePicture = recipeInfo.querySelector('img');
    recipePicture.setAttribute('src', recipe.strMealThumb);
    recipePicture.setAttribute('alt', recipe.strMeal);

    // Recipe description.
    // Line breaks are substituted by HTML line breaks
    recipeInfo.querySelector('&> div > p').innerHTML = recipe.strInstructions.replaceAll('\r\n', '<br>');

    // Ingredients
    const ingredientsContainer = document.createDocumentFragment();
    for (let index = 0; index < MAX_INGREDIENTS; index++) {
        const ingredient = recipe[`strIngredient${index + 1}`];
        if (ingredient !== null && ingredient !== '') {
            const measure = recipe[`strMeasure${index + 1}`];
            const li = document.createElement('li');
            li.innerText = `${ingredient}, ${measure}`;            
            ingredientsContainer.append(li);
        }
    }
    recipeInfo.querySelector('section > ul').append(ingredientsContainer);

    let youtubeID = recipe.strYoutube;
    youtubeID = youtubeID.substring(youtubeID.length - 11);

    const thumbnail = new Image();
    thumbnail.src = `http://img.youtube.com/vi/${youtubeID}/mqdefault.jpg`;

    thumbnail.addEventListener('load', function() {
        if (this.width !== 120) {
            const videoIframe = document.createElement('iframe');
            videoIframe.setAttribute('src', `https://www.youtube.com/embed/${youtubeID}?si=MO0O8ATQ_yYp_1wR`);
            videoIframe.setAttribute('title', 'YouTube video player');
            videoIframe.setAttribute('frameborder', '0');
            videoIframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
            videoIframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
            videoIframe.setAttribute('allowfullscreen', true);
            recipeInfo.querySelector('.recipeContainer').append(videoIframe);
        }

        if (loggedUserID()) {
            handleFavouriting();
        }
    });
};

/**
 * Favourite/unfavourite recipe
 */
const handleFavouriting = () => {
    document.querySelector('.favourite').addEventListener('click', function(e) {
        e.preventDefault();
        
        const userID = localStorage.getItem('food_repo_user_id');
        const method = this.innerHTML === '☆' ? 'POST' : 'DELETE';
        const params = new URLSearchParams({
            'recipe_id': recipeID
        });

        fetch(
            `${baseUserUrl}/users/${userID}/favourites`, 
            {
                method: method,
                headers: tokenHeader(),
                body: params
            }
        )
        .then(handleAPIError)
        .then(data => {
            console.log(data);
            if (data.status === 'ok') {
                this.innerHTML = method === 'POST' ? FAVOURITED : NON_FAVOURITED;
                loadFavourites(userID);
            } else {
                throw new Error(data.error);
            }
        })
        .catch(handleFetchCatchError);
    });
}

fetch(`${baseUrl}/lookup.php?i=${recipeID}`)
.then(handleAPIError)
.then(handleRecipe)
.catch(handleFetchCatchError);