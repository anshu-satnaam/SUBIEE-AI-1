document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const loginLink = document.getElementById('loginLink');
    const mobileInput = document.getElementById('mobile');
    const googleRegisterBtn = document.getElementById('google-register');
    const facebookRegisterBtn = document.getElementById('facebook-register');

    // Initialize Facebook SDK
    window.fbAsyncInit = function() {
        FB.init({
            appId: 'YOUR_FACEBOOK_APP_ID', // Replace with your Facebook App ID
            cookie: true,
            xfbml: true,
            version: 'v18.0'
        });
    };

    // Load Facebook SDK
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    // Form submission handler
    registrationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous error messages
        document.getElementById('mobileError').style.display = 'none';
        document.getElementById('passwordError').style.display = 'none';
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const mobile = mobileInput.value.trim();
        const password = document.getElementById('password').value.trim();
        
        // Validation flags
        let isValid = true;
        
        // Name validation
        if (!name) {
            alert('Please enter your name');
            isValid = false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            isValid = false;
        }
        
        // Mobile number validation (exactly 10 digits)
        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(mobile)) {
            const mobileError = document.getElementById('mobileError');
            mobileError.textContent = 'Mobile number must be 10 digits';
            mobileError.style.display = 'block';
            isValid = false;
        }
        
        // Password validation (8-16 characters)
        if (password.length < 8 || password.length > 16) {
            const passwordError = document.getElementById('passwordError');
            passwordError.textContent = 'Password must be 8-16 characters';
            passwordError.style.display = 'block';
            isValid = false;
        }
        
        // If all validations pass
        if (isValid) {
            try {
                // Here you would typically send the data to a server
                console.log('Registration submitted:', { name, email, mobile, password });
                
                // For demonstration, just show an alert
                alert('Account created successfully!');
                
                // Reset form
                this.reset();
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        }
    });

    // Mobile number input restriction (numbers only)
    mobileInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    // Login link click handler
    loginLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'login.html';
    });

    // Google Registration
    googleRegisterBtn.addEventListener('click', function() {
        // Initialize Google client
        google.accounts.id.initialize({
            client_id: '352258216802-r4js04pa2okog5h9nd45h9gql9u9fpbe.apps.googleusercontent.com', // Replace with your Google Client ID
            callback: handleGoogleRegisterResponse
        });
        
        // Show Google One Tap prompt
        google.accounts.id.prompt();
    });

    // Google registration response handler
    function handleGoogleRegisterResponse(response) {
        try {
            const decodedToken = parseJwt(response.credential);
            const { name, email } = decodedToken;

            console.log('Google Registration:', { name, email });

            // Send data to your server for registration
            registerWithSocial('google', { name, email });

        } catch (error) {
            console.error("Error during Google registration:", error);
            alert("Google registration failed. Please try again.");
        }
    }

    // Facebook Registration
    facebookRegisterBtn.addEventListener('click', function() {
        FB.login(function(response) {
            if (response.authResponse) {
                FB.api('/me', { fields: 'name,email' }, function(response) {
                    const { name, email } = response;
                    console.log('Facebook Registration:', { name, email });
                    
                    // Send data to your server for registration
                    registerWithSocial('facebook', { name, email });
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
                alert('Facebook registration was cancelled.');
            }
        }, { scope: 'public_profile,email' });
    });

    // Common social registration function
    function registerWithSocial(provider, userData) {
        fetch(`/register-${provider}`, { // Replace with your server endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} registration successful!`);
            // Redirect to dashboard or home page after successful registration
            window.location.href = '/dashboard'; // Update with your desired redirect path
        })
        .catch(error => {
            console.error(`Error during ${provider} registration:`, error);
            alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} registration failed. Please try again.`);
        });
    }

    // Parse JWT (Google)
    function parseJwt(token) {
        try {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("Error parsing JWT:", error);
            throw new Error("Failed to parse JWT");
        }
    }
});