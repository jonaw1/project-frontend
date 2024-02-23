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
  const profileLabel = document.getElementById('profileLabel');
  const deleteProfileForm = document.getElementById('deleteProfileForm');
  profileModal.addEventListener('hidden.bs.modal', () => {
    const disabled = document.getElementById('profileFirstNameInput').disabled;
    profileForm.style.display = 'block';
    deleteProfileForm.hidden = true;
    deleteProfileForm.reset();
    profileLabel.innerHTML = 'Mein Profil';
    profileForm.reset();
    if (!disabled) {
      toggleProfileForm();
    }
  });
};

const resetFormOnDismissDeleteModal = () => {
  const deleteUserModal = document.getElementById('deleteUserModal');
  if (!deleteUserModal) {
    return;
  }
  const deleteUserForm = document.getElementById('deleteUserForm');
  const deleteConfirmInput = document.getElementById('deleteConfirmInput');
  const deleteConfirmInvalidFeedback = document.getElementById(
    'deleteConfirmInvalidFeedback'
  );
  deleteUserModal.addEventListener('hidden.bs.modal', () => {
    deleteConfirmInput.classList.remove('is-valid');
    deleteConfirmInput.classList.remove('is-invalid');
    deleteConfirmInvalidFeedback.style.display = 'none';
    deleteUserForm.reset();
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
    document.getElementById('forgotPwForm') ||
    document.getElementById('changePwForm');
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
    const invalidFeedbacks = document.getElementsByClassName('invalid-feedb');
    const isInvalid = Array.from(invalidFeedbacks).some((element) => {
      return element.style.display === 'inline-block';
    });
    if (isInvalid) {
      event.preventDefault();
    }
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const openDeleteModal = (button) => {
  const userEmail = button.getAttribute('data-user-email');
  const userId = button.getAttribute('data-user-id');
  const deleteUserForm = document.getElementById('deleteUserForm');
  const deleteUserEmail = document.getElementById('deleteUserEmail');
  deleteUserEmail.innerHTML = `${userEmail} `;
  deleteUserForm.action = `/users/${userId}`;
  validateConfirmDelete();
  resetFormOnDismissDeleteModal();
};

const openEditModal = (button) => {
  const userEmail = button.getAttribute('data-user-email');
  const userId = button.getAttribute('data-user-id');
  const userFirstName = button.getAttribute('data-user-firstName');
  const userLastName = button.getAttribute('data-user-lastName');
  const userAdmin = button.getAttribute('data-user-admin');
  formUserFirstName = document.getElementById('userFirstName');
  formUserLastName = document.getElementById('userLastName'); 
  formUserEmail = document.getElementById('userEmail');
  formUserAdmin = document.getElementById('userAdmin');
  if (userFirstName != null) {
    formUserFirstName.value = `${userFirstName} `;
  }  
  if (userLastName != null) {
    formUserLastName.value = `${userLastName} `;
  } 
  formUserEmail.value = `${userEmail} `;
  formUserAdmin.value = userAdmin;
  editUserForm.action = `/users/edit/${userId}`;
};

const validateConfirmDelete = () => {
  const deleteConfirmInput = document.getElementById('deleteConfirmInput');
  const email = document.getElementById('deleteUserEmail').innerHTML.trim();
  const form = document.getElementById('deleteUserForm');
  const deleteConfirmInvalidFeedback = document.getElementById(
    'deleteConfirmInvalidFeedback'
  );

  deleteConfirmInput.addEventListener('keyup', () => {
    if (deleteConfirmInput.value != email) {
      deleteConfirmInvalidFeedback.style.display = 'inline-block';
      deleteConfirmInput.classList.remove('is-valid');
      deleteConfirmInput.classList.add('is-invalid');
    } else {
      deleteConfirmInvalidFeedback.style.display = 'none';
      deleteConfirmInput.classList.remove('is-invalid');
      deleteConfirmInput.classList.add('is-valid');
    }
  });

  form.addEventListener('submit', (event) => {
    const invalidFeedbacks = document.getElementsByClassName('invalid-feedb');
    const isInvalid = Array.from(invalidFeedbacks).some((element) => {
      return element.style.display === 'inline-block';
    });
    if (isInvalid) {
      event.preventDefault();
    }
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const showDeleteProfile = () => {
  const profileLabel = document.getElementById('profileLabel');
  profileLabel.innerHTML = 'Profil löschen';
  const editProfileForm = document.getElementById('editProfileForm');
  editProfileForm.style.display = 'none';
  const deleteProfileForm = document.getElementById('deleteProfileForm');
  deleteProfileForm.hidden = false;
};

const addListenersSelectable = () => {
  const selectables = document.getElementsByClassName('selectable');
  if (selectables.length == 0) {
    return;
  }
  for (const selectable of selectables) {
    selectable.addEventListener('click', async () => {
      if (selectable.classList.contains('selected')) {
        selectable.classList.remove('selected');
        selectable.classList.add('selectable-hover');
        if (selectable.id.startsWith('task-')) {
        } else {
          document.getElementById(selectable.id + '-toggle').hidden = true;
        }
      } else {
        selectable.classList.add('selected');
        selectable.classList.remove('selectable-hover');
        if (selectable.id.startsWith('task-')) {
          const tasks = document.getElementsByClassName('task');
          for (const task of tasks) {
            if (task != selectable) {
              task.classList.remove('selected');
              task.classList.add('selectable-hover');
            }
          }
          const taskConfiguration = await fetchTaskConfiguration(
            selectable.getAttribute('data-task-id')
          );
          const config = document.getElementById('configuration');
          config.value = taskConfiguration;
          config.scrollTo(0, 0);
        } else {
          document.getElementById(selectable.id + '-toggle').hidden = false;
        }
      }
    });
  }
};

const fetchTaskConfiguration = async (taskId) => {
  const actor = document.getElementById('user').getAttribute('data-user-email');
  try {
    const response = await fetch(`/api/configuration/${taskId}`, {
      headers: { actor }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch task configuration');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Error fetching task configuration');
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateConfiguration = async (actor) => {
  const configuration = document.getElementById('configuration').value;
  const task = document.getElementsByClassName('selected task')[0];
  if (!task) {
    return;
  }
  const taskId = task.getAttribute('data-task-id');
  const headers = {
    actor,
    'Content-Type': 'application/json'
  };
  const options = {
    method: 'PUT',
    headers,
    body: JSON.stringify({ configuration })
  };
  const response = await fetch(`/api/configuration/${taskId}`, options);
  if (!response.ok) {
    showAlert('error', 'Fehler beim Speichern der Konfiguration!', 5);
    return;
  }
  showAlert('success', '✅ Konfiguration erfolgreich gespeichert!', 5);
};

let timeOutId;

const showAlert = (type, text) => {
  const alert = document.getElementById('myAlert');
  alert.innerHTML = text;
  if (type == 'success') {
    alert.style.borderColor = 'green';
  } else {
    alert.style.borderColor = 'red';
  }
  if (timeOutId) {
    clearTimeout(timeOutId);
  }
  alert.hidden = false;
  alert.classList.remove('start-animation');
  alert.classList.add('start-animation');
  timeOutId = setTimeout(() => {
    alert.hidden = true;
    alert.classList.remove('start-animation');
  }, 3000);
};

addListenersSelectable();
validateRegister();
resetFormOnDismissProfileModal();
