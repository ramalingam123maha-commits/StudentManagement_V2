/* =============================================
   LIBRARY MANAGEMENT — CONTACT PAGE SCRIPT
   ============================================= */

// ── DOM REFERENCES ──────────────────────────────
const contactForm   = document.getElementById('contactForm');
const submitBtn     = document.getElementById('submitBtn');
const btnLoader     = document.getElementById('btnLoader');
const formResponse  = document.getElementById('formResponse');
const messageInput  = document.getElementById('message');
const charCount     = document.getElementById('charCount');
const navToggle     = document.getElementById('navToggle');
const navLinks      = document.querySelector('.nav-links');
const faqList       = document.getElementById('faqList');

const MAX_CHARS = 500;

// ── MOBILE NAV TOGGLE ───────────────────────────
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Close nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── CHARACTER COUNTER ───────────────────────────
messageInput.addEventListener('input', () => {
    const len = messageInput.value.length;
    charCount.textContent = `${len} / ${MAX_CHARS}`;
    if (len > MAX_CHARS) {
        charCount.classList.add('over');
    } else {
        charCount.classList.remove('over');
    }
});

// ── FAQ ACCORDION ───────────────────────────────
faqList.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item    = btn.closest('.faq-item');
        const isOpen  = item.classList.contains('open');

        // Close all items first
        faqList.querySelectorAll('.faq-item').forEach(el => {
            el.classList.remove('open');
            el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        // Toggle the clicked item
        if (!isOpen) {
            item.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});

// ── VALIDATION HELPERS ──────────────────────────
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\d\s\+\-\(\)]{7,20}$/;

function setFieldState(input, errorEl, message) {
    if (message) {
        input.classList.add('is-error');
        input.classList.remove('is-valid');
        errorEl.textContent = message;
    } else {
        input.classList.remove('is-error');
        input.classList.add('is-valid');
        errorEl.textContent = '';
    }
}

function clearFieldState(input, errorEl) {
    input.classList.remove('is-error', 'is-valid');
    errorEl.textContent = '';
}

function validateField(input) {
    const id      = input.id;
    const value   = input.value.trim();
    const errorEl = document.getElementById(id + 'Error');

    switch (id) {
        case 'firstName':
        case 'lastName':
            if (!value) {
                setFieldState(input, errorEl, `${id === 'firstName' ? 'First' : 'Last'} name is required.`);
                return false;
            }
            if (value.length < 2) {
                setFieldState(input, errorEl, 'Must be at least 2 characters.');
                return false;
            }
            break;

        case 'email':
            if (!value) {
                setFieldState(input, errorEl, 'Email address is required.');
                return false;
            }
            if (!emailRegex.test(value)) {
                setFieldState(input, errorEl, 'Please enter a valid email address.');
                return false;
            }
            break;

        case 'phone':
            if (value && !phoneRegex.test(value)) {
                setFieldState(input, errorEl, 'Please enter a valid phone number.');
                return false;
            }
            // Phone is optional — no error if empty
            if (value) {
                setFieldState(input, errorEl, null);
            }
            return true;

        case 'subject':
            if (!value) {
                setFieldState(input, errorEl, 'Please select a subject.');
                return false;
            }
            break;

        case 'message':
            if (!value) {
                setFieldState(input, errorEl, 'Message is required.');
                return false;
            }
            if (value.length < 10) {
                setFieldState(input, errorEl, 'Message must be at least 10 characters.');
                return false;
            }
            if (value.length > MAX_CHARS) {
                setFieldState(input, errorEl, `Message must not exceed ${MAX_CHARS} characters.`);
                return false;
            }
            break;

        default:
            return true;
    }

    setFieldState(input, errorEl, null);
    return true;
}

// Live validation on blur
['firstName', 'lastName', 'email', 'phone', 'subject', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('blur', () => validateField(el));

    el.addEventListener('input', () => {
        // Clear error state while the user is typing
        const errorEl = document.getElementById(id + 'Error');
        if (el.classList.contains('is-error')) {
            clearFieldState(el, errorEl);
        }
    });
});

// ── FORM SUBMISSION ─────────────────────────────
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all required fields
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'subject', 'message'];
    let allValid = true;

    fieldsToValidate.forEach(id => {
        const el = document.getElementById(id);
        if (!validateField(el)) allValid = false;
    });

    if (!allValid) {
        // Scroll to the first error
        const firstError = contactForm.querySelector('.is-error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        return;
    }

    // Disable button and show loader
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').hidden = true;
    btnLoader.hidden = false;
    formResponse.hidden = true;
    formResponse.className = 'form-response';

    // Simulate async submission (replace with real fetch in production)
    await simulateSubmit();

    // Re-enable button
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').hidden = false;
    btnLoader.hidden = true;

    // Show success message
    showFormResponse(
        '✅ Your message has been sent! We\'ll get back to you within 24 hours.',
        'success'
    );

    // Reset form
    contactForm.reset();
    charCount.textContent = `0 / ${MAX_CHARS}`;
    contactForm.querySelectorAll('input, select, textarea').forEach(el => {
        el.classList.remove('is-valid', 'is-error');
    });
});

function simulateSubmit() {
    return new Promise(resolve => setTimeout(resolve, 1500));
}

function showFormResponse(message, type) {
    formResponse.textContent = message;
    formResponse.className   = `form-response ${type}`;
    formResponse.hidden      = false;
    formResponse.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
