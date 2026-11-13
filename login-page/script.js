(() => {
  'use strict';

  /* =======================================================
     1. DOM elements
     ======================================================= */
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const emailGroup = document.getElementById('emailGroup');
  const passwordGroup = document.getElementById('passwordGroup');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const submitBtn = document.getElementById('submitBtn');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const eyeOpenIcon = document.getElementById('eyeOpenIcon');
  const eyeCloseIcon = document.getElementById('eyeCloseIcon');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  const otpLoginBtn = document.getElementById('otpLoginBtn');
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  const registerLink = document.getElementById('registerLink');
  const privacyLink = document.getElementById('privacyLink');
  const supportLink = document.getElementById('supportLink');
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  let toastTimeout = null;

  /* =======================================================
     2. Toast notification
     ======================================================= */
  function showToast(message, duration = 3200) {
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add('is-visible');

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toastTimeout = window.setTimeout(() => {
      toast.classList.remove('is-visible');
    }, duration);
  }

  /* =======================================================
     3. Theme management
     ======================================================= */
  function initializeTheme() {
    const savedTheme = localStorage.getItem('saas_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', initialTheme);
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('saas_theme', newTheme);
    showToast(newTheme === 'dark' ? 'حالت شب فعال شد' : 'حالت روز فعال شد', 2000);
  });

  initializeTheme();

  /* =======================================================
     4. Password visibility
     ======================================================= */
  togglePasswordBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const shouldShowPassword = passwordInput.type === 'password';
    passwordInput.type = shouldShowPassword ? 'text' : 'password';
    togglePasswordBtn.setAttribute(
      'aria-label',
      shouldShowPassword ? 'مخفی‌سازی رمز عبور' : 'نمایش رمز عبور'
    );
    togglePasswordBtn.setAttribute('aria-pressed', String(shouldShowPassword));
    eyeOpenIcon.style.display = shouldShowPassword ? 'none' : 'block';
    eyeCloseIcon.style.display = shouldShowPassword ? 'block' : 'none';
  });

  /* =======================================================
     5. Validation
     ======================================================= */
  function validateEmail(value) {
    const email = value.trim();

    if (!email) {
      return { valid: false, message: 'لطفاً آدرس ایمیل خود را وارد کنید' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return { valid: false, message: 'فرمت آدرس ایمیل وارد شده معتبر نیست' };
    }

    return { valid: true };
  }

  function validatePassword(value) {
    if (!value) {
      return { valid: false, message: 'لطفاً رمز عبور را وارد کنید' };
    }

    if (value.length < 6) {
      return { valid: false, message: 'رمز عبور باید حداقل ۶ کاراکتر باشد' };
    }

    return { valid: true };
  }

  function setEmailError(message) {
    if (message) {
      emailGroup.classList.add('has-error');
      emailInput.setAttribute('aria-invalid', 'true');
      emailError.querySelector('.error-text').textContent = message;
      return;
    }

    emailGroup.classList.remove('has-error');
    emailInput.setAttribute('aria-invalid', 'false');
  }

  function setPasswordError(message) {
    if (message) {
      passwordGroup.classList.add('has-error');
      passwordInput.setAttribute('aria-invalid', 'true');
      passwordError.querySelector('.error-text').textContent = message;
      return;
    }

    passwordGroup.classList.remove('has-error');
    passwordInput.setAttribute('aria-invalid', 'false');
  }

  // Clear field errors as soon as the entered value becomes valid.
  emailInput.addEventListener('input', () => {
    if (emailGroup.classList.contains('has-error')) {
      const result = validateEmail(emailInput.value);
      if (result.valid) setEmailError(null);
    }
  });

  passwordInput.addEventListener('input', () => {
    if (passwordGroup.classList.contains('has-error')) {
      const result = validatePassword(passwordInput.value);
      if (result.valid) setPasswordError(null);
    }
  });

  /* =======================================================
     6. Login form submission
     ======================================================= */
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const emailValidation = validateEmail(emailInput.value);
    const passwordValidation = validatePassword(passwordInput.value);

    if (!emailValidation.valid) {
      setEmailError(emailValidation.message);
      emailInput.focus();
      return;
    }

    setEmailError(null);

    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.message);
      passwordInput.focus();
      return;
    }

    setPasswordError(null);

    // Loading state. Connect the real authentication API here when available.
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
    emailInput.disabled = true;
    passwordInput.disabled = true;

    /*
      Example backend integration point:
      fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.value,
          password: passwordInput.value
        })
      });
    */

    window.setTimeout(() => {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
      emailInput.disabled = false;
      passwordInput.disabled = false;

      showToast('اطلاعات اعتبارسنجی شد — آماده اتصال به سرویس احراز هویت');
    }, 1200);
  });

  /* =======================================================
     7. Alternative login and navigation handlers
     ======================================================= */
  googleLoginBtn.addEventListener('click', () => {
    showToast('انتقال به درگاه احراز هویت حساب گوگل...');
  });

  otpLoginBtn.addEventListener('click', () => {
    showToast('صفحه ورود با رمز یک‌بارمصرف (OTP) در دسترس است');
  });

  forgotPasswordLink.addEventListener('click', (event) => {
    event.preventDefault();
    showToast('انتقال به بخش بازیابی رمز عبور...');
  });

  registerLink.addEventListener('click', (event) => {
    event.preventDefault();
    showToast('انتقال به فرم ثبت‌نام...');
  });

  privacyLink.addEventListener('click', (event) => {
    event.preventDefault();
    showToast('مشاهده صفحه قوانین و حریم خصوصی');
  });

  supportLink.addEventListener('click', (event) => {
    event.preventDefault();
    showToast('اتصال به سامانه پشتیبانی');
  });
})();
