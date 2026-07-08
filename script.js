// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Form elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const rememberMeCheckbox = document.getElementById('rememberMe');
const formMessage = document.getElementById('formMessage');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

// Toggle password visibility
togglePasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePasswordBtn.querySelector('span').textContent = type === 'password' ? 'Show' : 'Hide';
});

// Clear error message on input
emailInput.addEventListener('input', () => {
    clearError('email');
});

passwordInput.addEventListener('input', () => {
    clearError('password');
});

// Clear error function
function clearError(field) {
    if (field === 'email') {
        emailInput.classList.remove('error');
        emailError.classList.remove('show');
        emailError.textContent = '';
    } else if (field === 'password') {
        passwordInput.classList.remove('error');
        passwordError.classList.remove('show');
        passwordError.textContent = '';
    }
}

// Validate email
function validateEmail(email) {
    return emailRegex.test(email);
}

// Validate password
function validatePassword(password) {
    return password.length >= 6;
}

// Show error message
function showError(field, message) {
    if (field === 'email') {
        emailInput.classList.add('error');
        emailError.textContent = message;
        emailError.classList.add('show');
    } else if (field === 'password') {
        passwordInput.classList.add('error');
        passwordError.textContent = message;
        passwordError.classList.add('show');
    }
}

// Show form message
function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
}

// Handle form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    clearError('email');
    clearError('password');
    formMessage.className = 'form-message';

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Validation
    let isValid = true;

    if (!email) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    if (!password) {
        showError('password', 'Password is required');
        isValid = false;
    } else if (!validatePassword(password)) {
        showError('password', 'Password must be at least 6 characters');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Disable submit button
    const submitBtn = loginForm.querySelector('.login-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';

    // Simulate API call
    setTimeout(() => {
        // Mock authentication - in real app, this would be an API call
        if (email === 'student@example.com' && password === 'password123') {
            showFormMessage('Login successful! Redirecting...', 'success');
            
            // Save remember me preference
            if (rememberMeCheckbox.checked) {
                localStorage.setItem('rememberEmail', email);
            } else {
                localStorage.removeItem('rememberEmail');
            }

            // Simulate redirect after 2 seconds
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
        } else {
            showFormMessage('Invalid email or password', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }, 1000);
});

// Load saved email if 'remember me' was previously checked
window.addEventListener('load', () => {
    const savedEmail = localStorage.getItem('rememberEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMeCheckbox.checked = true;
        passwordInput.focus();
    }
});

// Add demo credentials hint (can be removed in production)
window.addEventListener('load', () => {
    console.log('Demo credentials:');
    console.log('Email: student@example.com');
    console.log('Password: password123');
});
