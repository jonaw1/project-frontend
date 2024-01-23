// eslint-disable-next-line @typescript-eslint/no-unused-vars
const toggleProfileForm = () => {
  const disabled = document.getElementById('profileFirstNameInput').disabled;
  document.getElementById('profileFirstNameInput').disabled = !disabled;
  document.getElementById('profileLastNameInput').disabled = !disabled;
  document.getElementById('profileEmailInput').disabled = !disabled;
  document.getElementById('editButton').hidden = !!disabled;
  document.getElementById('submitProfileBtn').hidden = !disabled;
  for (const star of document.getElementsByClassName('required-star')) {
    star.hidden = !disabled;
  }
};

const resetFormOnDismissProfileModal = () => {
  const profileModal = document.getElementById('profileModal');
  const profileForm = document.getElementById('editProfileForm');
  profileModal.addEventListener('hidden.bs.modal', () => {
    profileForm.reset();
    toggleProfileForm();
  });
};

const validateRegister = () => {
  const passwordInput1 = document.getElementById('passwordInput1');
  const passwordInput2 = document.getElementById('passwordInput2');
  if (!passwordInput1 || !passwordInput2) {
    return;
  }
  const form =
    document.getElementById('registerForm') ||
    document.getElementById('forgotPwForm');
  const password1InvalidFeedback = document.getElementById(
    'password1InvalidFeedback'
  );
  const password2InvalidFeedback = document.getElementById(
    'password2InvalidFeedback'
  );

  passwordInput1.addEventListener('keyup', () => {
    const password1 = passwordInput1.value;
    const password2 = passwordInput2.value;
    if (
      password1.length < 8 ||
      !/[A-Z]/.test(password1) ||
      !/[a-z]/.test(password1) ||
      !/\d/.test(password1)
    ) {
      password1InvalidFeedback.style.display = 'inline-block';
      passwordInput1.classList.add('is-invalid');
    } else {
      password1InvalidFeedback.style.display = 'none';
      passwordInput1.classList.remove('is-invalid');
      passwordInput1.classList.add('is-valid');
    }

    if (password1 !== password2) {
      password2InvalidFeedback.style.display = 'inline-block';
      passwordInput2.classList.add('is-invalid');
    } else {
      password2InvalidFeedback.style.display = 'none';
      passwordInput2.classList.remove('is-invalid');
      passwordInput2.classList.add('is-valid');
    }
  });

  passwordInput2.addEventListener('keyup', () => {
    const password1 = passwordInput1.value;
    const password2 = passwordInput2.value;
    if (password1 !== password2) {
      password2InvalidFeedback.style.display = 'inline-block';
      passwordInput2.classList.add('is-invalid');
    } else {
      password2InvalidFeedback.style.display = 'none';
      passwordInput2.classList.remove('is-invalid');
      passwordInput2.classList.add('is-valid');
    }
  });

  form.addEventListener('submit', (event) => {
    console.log(form);
    const invalidFeedbacks = document.getElementsByClassName('invalid-feedb');
    const isInvalid = Array.from(invalidFeedbacks).some((element) => {
      return element.style.display === 'inline-block';
    });
    if (isInvalid) {
      event.preventDefault();
    }
  });
};

validateRegister();
resetFormOnDismissProfileModal();
