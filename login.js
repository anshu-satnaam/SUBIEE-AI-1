document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const passwordError = document.getElementById('passwordError');
    const backHomeBtn = document.querySelector('.back-home-btn');

    // 1. Back to Home Button - Immediate Redirect
    backHomeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'https://stubiee-ai-2.vercel.app/';
    });

    // 2. Regular Login Form
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        passwordError.style.display = 'none';

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // Validation
        if (!validateForm(email, password)) return;

        try {
            // Demo mode - remove in production
            simulateLogin(email);
            
            /* Production code:
            const response = await fetch('YOUR_BACKEND_ENDPOINT/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login failed');
            
            handleSuccessfulLogin(data.token, email);
            */
            
        } catch (error) {
            console.error('Login error:', error);
            alert(error.message || 'Login failed. Please try again.');
        }
    });

    // 3. Google Login
    window.onload = function() {
        google.accounts.id.initialize({
            client_id: "352258216802-9tegrsi6r3hgtgdgpbgn7gbuu0qsit9h.apps.googleusercontent.com",
            callback: handleGoogleLogin
        });
        google.accounts.id.renderButton(
            document.getElementById("google-login"),
            { theme: "outline", size: "large" }
        );
    };

    // 4. Facebook Login
    window.fbAsyncInit = function() {
        FB.init({
            appId: '352258216802',
            cookie: true,
            xfbml: true,
            version: 'v12.0'
        });
    };

    document.getElementById("facebook-login").addEventListener("click", function(e) {
        e.preventDefault();
        FB.login(function(response) {
            if (response.authResponse) {
                handleFacebookLogin(response);
            } else {
                alert("Facebook login cancelled");
            }
        }, { scope: 'email,public_profile' });
    });

    // Helper Functions
    function validateForm(email, password) {
        if (!email || !password) {
            alert('Please fill in all fields');
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Please enter a valid email');
            return false;
        }

        if (password.length < 8 || password.length > 16) {
            passwordError.textContent = 'Password must be 8-16 characters';
            passwordError.style.display = 'block';
            return false;
        }

        return true;
    }

    function simulateLogin(email) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        alert('Demo: Login successful! Redirecting...');
        redirectToApp();
    }

    function handleSuccessfulLogin(token, email) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userEmail', email);
        redirectToApp();
    }

    function handleGoogleLogin(response) {
        console.log("Google response:", response);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('authMethod', 'google');
        alert('Google login successful! Redirecting...');
        redirectToApp();
        
        /* Production:
        verifyWithBackend(response.credential, 'google')
            .then(() => redirectToApp())
            .catch(err => alert(err));
        */
    }

    function handleFacebookLogin(response) {
        console.log("Facebook response:", response);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('authMethod', 'facebook');
        alert('Facebook login successful! Redirecting...');
        redirectToApp();
        
        /* Production:
        verifyWithBackend(response.authResponse.accessToken, 'facebook')
            .then(() => redirectToApp())
            .catch(err => alert(err));
        */
    }

    function redirectToApp() {
        window.location.href = 'https://stubiee-ai-2.vercel.app/';
    }

    // Check existing session
    if (localStorage.getItem('isLoggedIn') === 'true') {
        redirectToApp();
    }

    // Load Facebook SDK
    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
});
