document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        document.getElementById('passwordError').style.display = 'none';

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        if (password.length < 8 || password.length > 16) {
            const passwordError = document.getElementById('passwordError');
            passwordError.textContent = 'Password must be 8-16 characters';
            passwordError.style.display = 'block';
            return;
        }

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message || 'Login successful!');
                window.location.href = 'dashboard.html'; 
            } else {
                alert(result.error || 'Login failed.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });

    // Google Login
    window.onload = function () {
        google.accounts.id.initialize({
            client_id: "352258216802-9tegrsi6r3hgtgdgpbgn7gbuu0qsit9h.apps.googleusercontent.com",
            callback: handleGoogleLogin
        });
        google.accounts.id.renderButton(
            document.getElementById("google-login"),
            { theme: "outline", size: "large" }
        );
    };

    function handleGoogleLogin(response) {
        console.log("Google Auth Response:", response);
        alert("Google login successful!");
        window.location.href = "dashboard.html";
    }

    // Facebook Login
    window.fbAsyncInit = function() {
        FB.init({
            appId: 'YOUR_FACEBOOK_APP_ID',
            cookie: true,
            xfbml: true,
            version: 'v12.0'
        });
    };

    document.getElementById("facebook-login").addEventListener("click", function() {
        FB.login(function(response) {
            if (response.authResponse) {
                console.log("Facebook login success!", response);
                alert("Facebook login successful!");
                window.location.href = "dashboard.html";
            } else {
                alert("Facebook login failed.");
            }
        }, { scope: 'email,public_profile' });
    });
});
