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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const openEditModal = (button) => {
  const id = button.getAttribute('data-user-id');
  document.getElementById('editUserForm').action = `/users/edit/${id}`;

  document.getElementById('userEmail').value =
    button.getAttribute('data-user-email');
  document.getElementById('userFirstName').value = button.getAttribute(
    'data-user-first-name'
  );
  document.getElementById('userLastName').value = button.getAttribute(
    'data-user-last-name'
  );
  const admin = button.getAttribute('data-user-admin');
  const adminSelect = document.getElementById('userAdmin');
  adminSelect.selectedIndex = admin;
  console.log(admin);
  if (admin == 1) {
    adminSelect.disabled = true;
    document.getElementById('adminRequired').hidden = true;
  }
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
          checkValidJSON();
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
    showAlert('error', 'Fehler beim Speichern der Konfiguration!');
    return;
  }
  showAlert('success', 'Konfiguration erfolgreich gespeichert!');
};

const showAlert = (type, text) => {
  clearAlerts();
  const header = document.getElementsByTagName('header')[0];
  const alert = document.createElement('div');
  alert.classList.add('alert', 'alert-dismissible', 'fade', 'show');
  alert.setAttribute('role', 'alert');
  if (type == 'success') {
    alert.classList.add('alert-success');
  } else {
    alert.classList.add('alert-danger');
  }
  const strong = document.createElement('strong');
  strong.innerHTML = text;
  alert.appendChild(strong);
  const button = document.createElement('button');
  button.classList.add('btn-close');
  button.setAttribute('type', 'button');
  button.setAttribute('data-bs-dismiss', 'alert');
  button.setAttribute('aria-label', 'Close');
  alert.appendChild(button);
  header.appendChild(alert);
};

const clearAlerts = () => {
  const alerts = document.getElementsByClassName('alert');
  for (const alert of alerts) {
    alert.remove();
  }
};

const addListenersConfiguration = () => {
  const configurationTextArea = document.getElementById('configuration');
  if (!configurationTextArea) {
    return;
  }
  configurationTextArea.addEventListener('keyup', () => {
    checkValidJSON();
  });
};

const checkValidJSON = () => {
  const configurationTextArea = document.getElementById('configuration');
  const configuration = configurationTextArea.value;
  const saveBtn = document.getElementById('saveConfigBtn');
  if (!isValidJSON(configuration)) {
    configurationTextArea.classList.add('is-invalid');
    configurationTextArea.classList.remove('blue-border');
    saveBtn.disabled = true;
    document.getElementById('invalidJsonText').hidden = false;
    return;
  }
  configurationTextArea.classList.remove('is-invalid');
  configurationTextArea.classList.add('blue-border');
  saveBtn.disabled = false;
  document.getElementById('invalidJsonText').hidden = true;
};

const isValidJSON = (s) => {
  try {
    JSON.parse(s);
  } catch (e) {
    return false;
  }
  return true;
};

addListenersConfiguration();
addListenersSelectable();
validateRegister();
resetFormOnDismissProfileModal();
