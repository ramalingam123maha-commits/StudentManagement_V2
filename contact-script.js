// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    // Form validation
    const validators = {
        firstName: {
            validate: (value) => {
                if (value.trim().length < 2) {
                    return 'First name must be at least 2 characters long';
                }
                if (!/^[a-zA-Z\s]+$/.test(value)) {
                    return 'First name should only contain letters';
                }
                return '';
            }
        },
        lastName: {
            validate: (value) => {
                if (value.trim().length < 2) {
                    return 'Last name must be at least 2 characters long';
                }
                if (!/^[a-zA-Z\s]+$/.test(value)) {
                    return 'Last name should only contain letters';
                }
                return '';
            }
        },
        email: {
            validate: (value) => {
                if (!value.trim()) {
                    return 'Email is required';
                }
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(value)) {
                    return 'Please enter a valid email address';
                }
                return '';
            }
        },
        phone: {
            validate: (value) => {
                if (value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
                    return 'Please enter a valid phone number';
                }
                return '';
            }
        },
        subject: {
            validate: (value) => {
                if (!value) {
                    return 'Please select a subject';
                }
                return '';
            }
        },
        message: {
            validate: (value) => {
                if (value.trim().length < 10) {
                    return 'Message must be at least 10 characters long';
                }
                if (value.trim().length > 1000) {
                    return 'Message must not exceed 1000 characters';
                }
                return '';
            }
        }
    };

    // Real-time validation
    Object.keys(validators).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');

        if (field && errorElement) {
            field.addEventListener('blur', function() {
                const error = validators[fieldName].validate(this.value);
                errorElement.textContent = error;
                
                if (error) {
                    field.style.borderColor = '#e74c3c';
                } else {
                    field.style.borderColor = '#4caf50';
                }
            });

            field.addEventListener('input', function() {
                if (errorElement.textContent) {
                    const error = validators[fieldName].validate(this.value);
                    errorElement.textContent = error;
                    
                    if (!error) {
                        field.style.borderColor = '#4caf50';
                    }
                }
            });
        }
    });

    // Form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Clear previous messages
        formMessage.style.display = 'none';
        formMessage.className = 'form-message';

        // Validate all fields
        let isValid = true;
        const formData = {};

        Object.keys(validators).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const errorElement = document.getElementById(fieldName + 'Error');

            if (field) {
                const value = field.value;
                const error = validators[fieldName].validate(value);

                if (error && (field.hasAttribute('required') || value.trim())) {
                    isValid = false;
                    errorElement.textContent = error;
                    field.style.borderColor = '#e74c3c';
                } else {
                    errorElement.textContent = '';
                    field.style.borderColor = '#4caf50';
                    formData[fieldName] = value;
                }
            }
        });

        if (!isValid) {
            showMessage('Please correct the errors in the form', 'error');
            contactForm.classList.add('shake');
            setTimeout(() => contactForm.classList.remove('shake'), 500);
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';

        // Simulate API call
        try {
            await simulateSubmission(formData);

            // Success
            showMessage('Thank you for contacting us! We will get back to you soon.', 'success');
            contactForm.reset();

            // Reset field borders
            Object.keys(validators).forEach(fieldName => {
                const field = document.getElementById(fieldName);
                if (field) {
                    field.style.borderColor = '#e8eef7';
                }
            });

            // Log submission data (for demonstration)
            console.log('Form submitted successfully:', formData);

        } catch (error) {
            // Error
            showMessage('Something went wrong. Please try again later.', 'error');
            console.error('Form submission error:', error);
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    });

    // Helper function to show messages
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }

    // Simulate API call
    function simulateSubmission(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success 90% of the time
                if (Math.random() > 0.1) {
                    resolve(data);
                } else {
                    reject(new Error('Simulated error'));
                }
            }, 1500);
        });
    }

    // Character counter for message field
    const messageField = document.getElementById('message');
    const messageLabel = messageField.previousElementSibling;

    messageField.addEventListener('input', function() {
        const currentLength = this.value.length;
        const maxLength = 1000;
        const remaining = maxLength - currentLength;

        if (!document.getElementById('charCounter')) {
            const counter = document.createElement('span');
            counter.id = 'charCounter';
            counter.style.float = 'right';
            counter.style.fontSize = '12px';
            counter.style.color = '#8896b7';
            messageLabel.appendChild(counter);
        }

        const counter = document.getElementById('charCounter');
        counter.textContent = `${currentLength}/${maxLength}`;

        if (remaining < 50) {
            counter.style.color = '#e74c3c';
        } else {
            counter.style.color = '#8896b7';
        }
    });

    // Smooth scroll behavior for error fields
    function scrollToFirstError() {
        const firstError = document.querySelector('.error-message:not(:empty)');
        if (firstError) {
            const field = firstError.previousElementSibling;
            if (field) {
                field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                field.focus();
            }
        }
    }

    // Add link to login page navigation
    const backLink = document.querySelector('.back-link a');
    if (backLink) {
        backLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }
});
