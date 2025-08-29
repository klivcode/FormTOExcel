// Tournament Registration Form JavaScript
class TournamentForm {
    constructor() {
        this.form = document.getElementById('tournamentForm');
        this.fileInput = document.getElementById('screenshot');
        this.fileUploadArea = document.getElementById('fileUploadArea');
        this.filePreview = document.getElementById('filePreview');
        this.categorySelect = document.getElementById('category');
        this.teammatesSection = document.getElementById('teammatesSection');
        this.teamNameField = document.getElementById('teamName');

        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.allowedTypes = ['image/jpeg', 'image/png', 'image/gif','image/jpg'];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFileUpload();
        this.setupFormValidation();
        this.handleCategoryChange();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });

        this.categorySelect.addEventListener('change', () => this.handleCategoryChange());
    }

    setupFileUpload() {
        this.fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) this.handleFile(file);
        });

        this.fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.fileUploadArea.classList.add('dragover');
        });

        this.fileUploadArea.addEventListener('dragleave', () => {
            this.fileUploadArea.classList.remove('dragover');
        });

        this.fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.fileUploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) this.handleFile(files[0]);
        });

        this.fileUploadArea.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.fileInput.click();
        });

        this.fileInput.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    setupFormValidation() {
        this.validationRules = {
            playerName: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Z0-9\s_-]+$/,
                message: 'Please enter a valid name (2-50 characters)'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            phone: {
                required: true,
                pattern: /^[\+]?[1-9][\d]{0,15}$/,
                message: 'Please enter a valid phone number'
            },
            age: {
                required: true,
                min: 13,
                max: 50,
                message: 'Age must be between 13 and 50'
            },
            country: {
                required: true,
                message: 'Please select your country'
            },
            gameId: {
                required: true,
                pattern: /^\d{7,}$/,  // 7 or more digits
                message: 'Game ID must be at least 7 digits'
            },
            ign: {
                required: true,
                minLength: 2,
                maxLength: 20,
                message: 'In-Game Name must be 2-20 characters'
            },
            rank: {
                required: true,
                message: 'Please select your current rank'
            },
            experience: {
                required: true,
                message: 'Please select your experience level'
            },
            category: {
                required: true,
                message: 'Please select a tournament category'
            },
            screenshot: {
                required: true,
                message: 'Please upload a payment screenshot'
            },
            terms: {
                required: true,
                message: 'You must agree to the terms and conditions'
            }
        };
    }

    handleCategoryChange() {
        const category = this.categorySelect.value;
        const isTeamCategory = category === 'duo' || category === 'squad';

        this.teammatesSection.style.display = isTeamCategory ? 'block' : 'none';

        if (isTeamCategory) {
            this.teamNameField.setAttribute('required', 'required');
            this.validationRules.teamName = {
                required: true,
                minLength: 2,
                maxLength: 30,
                message: 'Team name is required for duo/squad categories'
            };
        } else {
            this.teamNameField.removeAttribute('required');
            delete this.validationRules.teamName;
            this.clearError(this.teamNameField);
        }

        const teammateRows = this.teammatesSection.querySelectorAll('.form-row');
        teammateRows.forEach(row => row.style.display = "none");

        if (category === "duo") {
            teammateRows[0].style.display = "flex";
            this.setTeammateValidation(1);
        } else if (category === "squad") {
            teammateRows[0].style.display = "flex";
            teammateRows[1].style.display = "flex";
            teammateRows[2].style.display = "flex";
            this.setTeammateValidation(3);
        } else {
            this.clearTeammateValidation();
        }
    }

    setTeammateValidation(count) {
        this.clearTeammateValidation();

        for (let i = 1; i <= count; i++) {
            this.validationRules[`teammate${i}UID`] = {
                required: true,
                pattern: /^\d{7,}$/,
                message: `Teammate ${i} Game UID must be at least 7 digits`
            };

            this.validationRules[`teammate${i}Phone`] = {
                required: true,
                pattern: /^[\+]?[1-9][\d]{0,15}$/,
                message: `Teammate ${i} phone must be valid`
            };
        }
    }

    clearTeammateValidation() {
        for (let i = 1; i <= 4; i++) {
            delete this.validationRules[`teammate${i}UID`];
            delete this.validationRules[`teammate${i}Phone`];

            const uidField = document.getElementById(`teammate${i}UID`);
            const phoneField = document.getElementById(`teammate${i}Phone`);

            if (uidField) this.clearError(uidField);
            if (phoneField) this.clearError(phoneField);
        }
    }

    handleFile(file) {
        const validation = this.validateFile(file);
        if (!validation.valid) {
            this.showError('screenshot', validation.message);
            return;
        }

        this.clearError(this.fileInput);
        this.showFilePreview(file);
    }

    validateFile(file) {
        if (!this.allowedTypes.includes(file.type)) {
            return { valid: false, message: 'Please upload a valid image file (JPG, PNG, or GIF)' };
        }

        if (file.size > this.maxFileSize) {
            return { valid: false, message: 'File size must be less than 5MB' };
        }

        return { valid: true };
    }

    showFilePreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.filePreview.innerHTML = `
                <div class="preview-item">
                    <img src="${e.target.result}" alt="Preview" class="preview-image">
                    <div class="preview-info">
                        <div class="preview-name">${file.name}</div>
                        <div class="preview-size">${this.formatFileSize(file.size)}</div>
                    </div>
                    <button type="button" class="remove-file" onclick="tournamentForm.removeFile()">
                        <i class="fas fa-times"></i> Remove
                    </button>
                </div>
            `;
            this.filePreview.classList.add('show');
        };
        reader.readAsDataURL(file);
    }

    removeFile() {
        this.fileInput.value = '';
        this.filePreview.innerHTML = '';
        this.filePreview.classList.remove('show');
        this.showError('screenshot', 'Please upload a payment screenshot');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.type === 'checkbox' ? field.checked : field.value.trim();
        const rules = this.validationRules[fieldName];

        if (!rules) return true;

        if (rules.required && (!value || (field.type === 'checkbox' && !field.checked))) {
            this.showError(fieldName, rules.message || `${fieldName} is required`);
            return false;
        }

        if (!value && !rules.required) {
            this.clearError(field);
            return true;
        }

        if (rules.pattern && !rules.pattern.test(value)) {
            this.showError(fieldName, rules.message);
            return false;
        }

        if (rules.minLength && value.length < rules.minLength) {
            this.showError(fieldName, rules.message);
            return false;
        }

        if (rules.maxLength && value.length > rules.maxLength) {
            this.showError(fieldName, rules.message);
            return false;
        }

        if (rules.min && parseFloat(value) < rules.min) {
            this.showError(fieldName, rules.message);
            return false;
        }

        if (rules.max && parseFloat(value) > rules.max) {
            this.showError(fieldName, rules.message);
            return false;
        }

        if (rules.custom && !rules.custom(value)) {
            this.showError(fieldName, rules.message);
            return false;
        }

        if (fieldName === 'screenshot' && field.files.length > 0) {
            const fileValidation = this.validateFile(field.files[0]);
            if (!fileValidation.valid) {
                this.showError(fieldName, fileValidation.message);
                return false;
            }
        }

        this.clearError(field);
        this.markSuccess(field);
        return true;
    }

    showError(fieldName, message) {
        const field = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`);
        const formGroup = field.closest('.form-group') || field.closest('.checkbox-group');
        const errorElement = document.getElementById(`${fieldName}Error`);

        if (formGroup) {
            formGroup.classList.add('error');
            formGroup.classList.remove('success');
        }

        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    clearError(field) {
        const fieldName = field.name || field.id;
        const formGroup = field.closest('.form-group') || field.closest('.checkbox-group');
        const errorElement = document.getElementById(`${fieldName}Error`);

        if (formGroup) formGroup.classList.remove('error');
        if (errorElement) errorElement.classList.remove('show');
    }

    markSuccess(field) {
        const formGroup = field.closest('.form-group');
        if (formGroup) formGroup.classList.add('success');
    }

    validateForm() {
        let isValid = true;
        const fields = this.form.querySelectorAll('input, select, textarea');

        fields.forEach(field => {
            if (!this.validateField(field)) isValid = false;
        });

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            Toastify({
                text: "Please fix the errors above",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#ff4757",
                stopOnFocus: true
            }).showToast();
            return;
        }

        const submitBtn = this.form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner"></i> Registering...';
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            await this.submitForm();

            Toastify({
                text: "Registration successful! You will receive a confirmation email from sSTREAK shortly.",
                duration: 5000,
                gravity: "top",
                position: "top",
                backgroundColor: "#10b981",
                color: "#000",
                stopOnFocus: true
            }).showToast();

            setTimeout(() => {
                this.form.reset();
                this.filePreview.innerHTML = '';
                this.filePreview.classList.remove('show');
                this.handleCategoryChange();
            }, 2000);

        } catch (error) {
            Toastify({
                text: "Registration failed. Please try again.",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#ff4757",
                stopOnFocus: true
            }).showToast();
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    // ✅ Updated async submitForm
async submitForm() {
    const formData = new FormData(this.form);

    // Build a plain object
    let data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Convert screenshot to Base64 if uploaded
    const file = this.fileInput.files[0];
    if (file) {
        const base64 = await this.fileToBase64(file);
        data.screenshot = {
            name: file.name,
            type: file.type,
            base64: base64.split(",")[1] // remove prefix like data:image/png;base64,
        };
    }

    // Send POST to Apps Script web app URL
    const response = await fetch("https://excelbacknd.onrender.com/api/key", {
        method: "POST",
        // ✅ prevents CORS issues for Apps Script
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });

    // Since `no-cors` blocks JS from reading the response,
    // we just assume success if no network error occurred
    return { status: "success" };
}

// Convert file to Base64
fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
    });
}

}

// Initialize form
document.addEventListener('DOMContentLoaded', () => {
    window.tournamentForm = new TournamentForm();

    const phoneInput = document.getElementById('phone');
    const gameIdInput = document.getElementById('gameId');

    if (phoneInput) {
        phoneInput.addEventListener('input', () => {
            let value = phoneInput.value.replace(/\D/g, '');
            if (value.length >= 10) value = value.substring(0, 15);
            phoneInput.value = value;
        });
    }

    // if (gameIdInput) {
    //     gameIdInput.addEventListener('input', () => {
    //         let value = gameIdInput.value.replace(/\D/g, '');
    //         if (value.length > 7) value = value.substring(0, 7);
    //         gameIdInput.value = value;
    //     });
    // }
});
