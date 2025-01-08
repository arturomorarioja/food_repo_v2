import { loggedUserID, logout } from './common.js';

/**
 * Menu options are hidden or displayed 
 * depending on whether the user is logged in or not
 */
const userID = loggedUserID();
const favouritesLink = document.querySelector('li:has(a[href="favourites.htm"])');
if (userID == 0) {
    document.querySelector('li:has(a[href="login.htm"])').classList.remove('hidden');
    document.querySelector('li:has(a[href="signup.htm"])').classList.remove('hidden');
    // The login and signup pages do not have the favourites and logout links.
    // If there is no favourites link, there is no logout link either
    if (favouritesLink !== null) {
        favouritesLink.classList.add('hidden');
        document.querySelector('li:has(#logout)').classList.add('hidden');
    }
} else {
    document.querySelector('li:has(a[href="login.htm"])').classList.add('hidden');
    document.querySelector('li:has(a[href="signup.htm"])').classList.add('hidden');
    if (favouritesLink !== null) {
        favouritesLink.classList.remove('hidden');
        document.querySelector('li:has(#logout)').classList.remove('hidden');
    }
}

/**
 * "About" dialog
 */
document.querySelector('nav #about').addEventListener('click', () => {
    
    // By creating the dialog dynamically, 
    // it can be called from every page in the website
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
        <header>
            <h2>About Food Repo</h2>
            <div class="close">&times;</div>
        </header>    
        <p>
            Welcome to Food Repo, your ultimate destination for discovering diverse and delicious food recipes from around the globe. Whether you're craving a quick weeknight meal or an exotic culinary adventure, Food Repo offers a vast collection of recipes that cater to all tastes and skill levels. From hearty stews and refreshing salads to decadent desserts, our recipes feature a wide variety of ingredients—fresh, seasonal, and pantry staples. With contributions from different parts of the world, you'll experience the authentic flavors of Asian, Mediterranean, Latin American, and other international cuisines, all in one place. Each recipe comes with step-by-step instructions, nutritional information, and helpful tips to ensure you create a meal that's not only tasty but also wholesome. Join Food Repo today and explore the joy of cooking, one recipe at a time!
        </p>
        <section id="address">
            <header>
                <h3>Food Repo Inc.</h3>
            </header>
            <address>
                <p>Guldbergsgade 29N</p>
                <p>2200 Copenhagen (Denmark)</p>
            </address>
        </section>
    `;
    dialog.id = 'msgAbout';
    dialog.querySelector('.close').addEventListener('click', handleCloseDialogButton);

    document.body.append(dialog);
    dialog.showModal();
});

if (favouritesLink !== null) {
    document.querySelector('#logout').addEventListener('click', () => logout());
}

export const handleCloseDialogButton = function() { this.parentElement.parentElement.close(); }