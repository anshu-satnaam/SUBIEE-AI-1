document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const passwordError = document.getElementById('passwordError');

    // Regular login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Reset error messages
        passwordError.style.display = 'none';

        // Get form values
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // Validation
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
            passwordError.textContent = 'Password must be 8-16 characters';
            passwordError.style.display = 'block';
            return;
        }

        try {
            // Simulate successful login for demo purposes
            // In production, replace with actual API call to your backend
            console.log('Login attempt with:', { email, password });
            
            // Store login status
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            
            // Show success and redirect
            alert('Login successful! Redirecting...');
            window.location.href = 'https://stubiee-ai-2.vercel.app/';
            
            /* 
            // Production code would look like this:
            const response = await fetch('https://yourbackend.com/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();
            if (response.ok) {
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('userEmail', email);
                alert(result.message || 'Login successful!');
                window.location.href = 'https://stubiee-ai-2.vercel.app/';
            } else {
                alert(result.error || 'Login failed.');
            }
            */
            
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });

    // Google Login Integration
    window.onload = function() {
        // Initialize Google Auth
        google.accounts.id.initialize({
            client_id: "352258216802-9tegrsi6r3hgtgdgpbgn7gbuu0qsit9h.apps.googleusercontent.com",
            callback: handleGoogleLogin,
            ux_mode: "redirect" // Optional: change to "popup" if you prefer
        });

        // Render Google button
        google.accounts.id.renderButton(
            document.getElementById("google-login"),
            { 
                theme: "outline", 
                size: "large",
                text: "continue_with",
                shape: "pill"
            }
        );
    };

    function handleGoogleLogin(response) {
        console.log("Google Auth Response:", response);
        
        // For demo, we'll just store the token and redirect
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('authMethod', 'google');
        localStorage.setItem('googleToken', response.credential);
        
        alert("Google login successful! Redirecting...");
        window.location.href = "https://stubiee-ai-2.vercel.app/";
        
        /* 
        // Production code would verify the token with your backend:
        fetch("https://yourbackend.com/google-login", { 
            method: "POST", 
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({ token: response.credential })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('authToken', data.token);
                alert("Google login successful!");
                window.location.href = "https://stubiee-ai-2.vercel.app/";
            } else {
                alert("Google login failed: " + (data.error || ""));
            }
        })
        .catch(error => {
            console.error("Google login error:", error);
            alert("An error occurred during Google login.");
        });
        */
    }

    // Facebook Login Integration
    window.fbAsyncInit = function() {
        FB.init({
            appId: '352258216802', // Replace with your actual Facebook App ID
            cookie: true,
            xfbml: true,
            version: 'v12.0',
            status: true
        });
        
        // Check login status on load
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                // Already logged in
                handleFacebookLogin(response);
            }
        });
    };

    // Load Facebook SDK asynchronously
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    document.getElementById("facebook-login").addEventListener("click", function(e) {
        e.preventDefault();
        FB.login(function(response) {
            if (response.authResponse) {
                handleFacebookLogin(response);
            } else {
                alert("Facebook login cancelled or failed.");
            }
        }, { scope: 'email,public_profile' });
    });

    function handleFacebookLogin(response) {
        console.log("Facebook login success!", response);
        
        // For demo, store basic info and redirect
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('authMethod', 'facebook');
        localStorage.setItem('fbAccessToken', response.authResponse.accessToken);
        
        alert("Facebook login successful! Redirecting...");
        window.location.href = "https://stubiee-ai-2.vercel.app/";
        
        /*
        // Production code would verify with your backend:
        fetch("https://yourbackend.com/facebook-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                accessToken: response.authResponse.accessToken,
                userID: response.authResponse.userID 
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('authToken', data.token);
                alert("Facebook login successful!");
                window.location.href = "https://stubiee-ai-2.vercel.app/";
            } else {
                alert("Facebook login failed: " + (data.error || ""));
            }
        })
        .catch(error => {
            console.error("Facebook login error:", error);
            alert("An error occurred during Facebook login.");
        });
        */
    }

    // Check if already logged in (for demo purposes)
    if (localStorage.getItem('isLoggedIn') === 'true') {
        console.log('User already logged in, redirecting...');
        window.location.href = 'https://stubiee-ai-2.vercel.app/';
    }
});
