// ===== Form Validation =====
class LoginValidator {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePassword(password) {
        return password.length >= 6;
    }

    static validate(email, password) {
        const errors = {};

        if (!email.trim()) {
            errors.email = 'Email is required';
        } else if (!this.validateEmail(email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!password.trim()) {
            errors.password = 'Password is required';
        } else if (!this.validatePassword(password)) {
            errors.password = 'Password must be at least 6 characters';
        }

        return errors;
    }
}

// ===== Login Handler =====
class LoginHandler {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.togglePasswordBtn = document.getElementById('togglePassword');
        this.rememberMeCheckbox = document.getElementById('rememberMe');
        this.successMessage = document.getElementById('successMessage');
        this.successText = document.getElementById('successText');
        this.emailError = document.getElementById('emailError');
        this.passwordError = document.getElementById('passwordError');

        this.initializeEventListeners();
        this.loadRememberedCredentials();
    }

    initializeEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Toggle password visibility
        this.togglePasswordBtn.addEventListener('click', (e) => this.togglePasswordVisibility(e));

        // Real-time validation
        this.emailInput.addEventListener('blur', () => this.validateEmailField());
        this.passwordInput.addEventListener('blur', () => this.validatePasswordField());

        // Clear errors on input
        this.emailInput.addEventListener('input', () => this.clearEmailError());
        this.passwordInput.addEventListener('input', () => this.clearPasswordError());
    }

    handleSubmit(e) {
        e.preventDefault();

        const email = this.emailInput.value;
        const password = this.passwordInput.value;

        // Validate form
        const errors = LoginValidator.validate(email, password);

        if (Object.keys(errors).length > 0) {
            this.displayErrors(errors);
            return;
        }

        // Clear errors
        this.clearAllErrors();

        // Simulate login (in real app, this would call backend API)
        this.simulateLogin(email);
    }

    validateEmailField() {
        const email = this.emailInput.value;

        if (!email.trim()) {
            this.displayEmailError('Email is required');
            return false;
        }

        if (!LoginValidator.validateEmail(email)) {
            this.displayEmailError('Please enter a valid email address');
            return false;
        }

        this.clearEmailError();
        return true;
    }

    validatePasswordField() {
        const password = this.passwordInput.value;

        if (!password.trim()) {
            this.displayPasswordError('Password is required');
            return false;
        }

        if (!LoginValidator.validatePassword(password)) {
            this.displayPasswordError('Password must be at least 6 characters');
            return false;
        }

        this.clearPasswordError();
        return true;
    }

    displayErrors(errors) {
        if (errors.email) {
            this.displayEmailError(errors.email);
        }

        if (errors.password) {
            this.displayPasswordError(errors.password);
        }
    }

    displayEmailError(message) {
        this.emailError.textContent = message;
        this.emailError.classList.add('show');
        this.emailInput.classList.add('error');
    }

    displayPasswordError(message) {
        this.passwordError.textContent = message;
        this.passwordError.classList.add('show');
        this.passwordInput.classList.add('error');
    }

    clearEmailError() {
        this.emailError.textContent = '';
        this.emailError.classList.remove('show');
        this.emailInput.classList.remove('error');
    }

    clearPasswordError() {
        this.passwordError.textContent = '';
        this.passwordError.classList.remove('show');
        this.passwordInput.classList.remove('error');
    }

    clearAllErrors() {
        this.clearEmailError();
        this.clearPasswordError();
    }

    togglePasswordVisibility(e) {
        e.preventDefault();

        const isPassword = this.passwordInput.type === 'password';
        this.passwordInput.type = isPassword ? 'text' : 'password';
        this.togglePasswordBtn.textContent = isPassword ? '🙈' : '👁️';
    }

    saveCredentials(email) {
        if (this.rememberMeCheckbox.checked) {
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberMe');
        }
    }

    loadRememberedCredentials() {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        const rememberMe = localStorage.getItem('rememberMe');

        if (rememberedEmail && rememberMe === 'true') {
            this.emailInput.value = rememberedEmail;
            this.rememberMeCheckbox.checked = true;
        }
    }

    simulateLogin(email) {
        // Disable button during login
        const submitBtn = this.form.querySelector('.btn-login');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';

        // Simulate API call delay
        setTimeout(() => {
            // Save credentials if remember me is checked
            this.saveCredentials(email);

            // Show success message
            this.showSuccessMessage(email);

            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';

            // Redirect after delay (in real app, redirect to dashboard)
            setTimeout(() => {
                this.redirectToDashboard();
            }, 1500);
        }, 1500);
    }

    showSuccessMessage(email) {
        this.successText.textContent = `Welcome back, ${email}! Redirecting...`;
        this.successMessage.classList.add('show');

        // Auto hide after 5 seconds
        setTimeout(() => {
            this.successMessage.classList.remove('show');
        }, 5000);
    }

    redirectToDashboard() {
        // In a real application, this would redirect to the dashboard
        alert(`Login successful for ${this.emailInput.value}!\n\nIn a real application, you would be redirected to the dashboard.`);
        
        // Clear form
        this.form.reset();
        this.clearAllErrors();
    }
}

// ===== Initialize on DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
    new LoginHandler();
});
