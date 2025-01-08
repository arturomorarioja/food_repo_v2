import { baseUserUrl } from './env.js';
import { handleAPIError, handleFetchCatchError } from './common.js';
import { handleCloseDialogButton } from './nav.js';

document.querySelector('#frmSignup').addEventListener('submit', (e) => {
    e.preventDefault();

    // Input validation. Both passwords must match
    const password = e.target.txtPassword.value.trim();
    const repeatPassword = e.target.txtRepeatPassword.value.trim();

    if (password !== repeatPassword) {
        document.querySelector('#msgPasswordError').showModal();
        return false;
    }

    // Sign up in the API
    const firstName = e.target.txtFirstname.value.trim();
    const lastName = e.target.txtLastname.value.trim();
    const email = e.target.txtEmail.value.trim();

    const params = new URLSearchParams();
    params.append('email', email);
    params.append('first_name', firstName);
    params.append('last_name', lastName);
    params.append('password', password);

    fetch(`${baseUserUrl}/users`, {
        method: 'POST',
        body: params
    })
    .then(handleAPIError)
    .then(data => {
        // Check for key "user_id" in response
        if (Object.keys(data).includes('user_id')) {
            window.location.href = 'login.htm';
        } else {
            throw new Error(data.error);
        }
    })
    .catch(handleFetchCatchError);
});

document.querySelector('.close').addEventListener('click', handleCloseDialogButton);