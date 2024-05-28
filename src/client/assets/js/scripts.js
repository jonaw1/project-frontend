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
  const changePwForm = document.getElementById('changePwForm');
  profileModal.addEventListener('hidden.bs.modal', () => {
    const disabled = document.getElementById('profileFirstNameInput').disabled;
    if (!disabled) {
      toggleProfileForm();
    }
    profileLabel.innerHTML = 'MEIN PROFIL';
    deleteProfileForm.reset();
    changePwForm.reset();
    profileForm.reset();
    profileForm.hidden = false;
    deleteProfileForm.hidden = true;
    changePwForm.hidden = true;
    const deleteProfilePwRepeatFeedback = document.getElementById(
      'deleteProfilePwRepeatFeedback'
    );
    const changePwPwFeedback = document.getElementById('changePwPwFeedback');
    const changePwPwRepeatFeedback = document.getElementById(
      'changePwPwRepeatFeedback'
    );
    deleteProfilePwRepeatFeedback.hidden = true;
    changePwPwFeedback.hidden = true;
    changePwPwRepeatFeedback.hidden = true;
    const inputs = profileModal.getElementsByTagName('input');
    for (const input of inputs) {
      input.classList.remove('invalid-border');
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validateDeleteProfilePasswordRepeat = () => {
  const deleteProfilePw = document.getElementById('deleteProfilePwInput').value;
  const deleteProfilePwRepeatInput = document.getElementById(
    'deleteProfilePwRepeatInput'
  );
  const deleteProfilePwRepeat = deleteProfilePwRepeatInput.value;
  const deleteProfilePwRepeatFeedback = document.getElementById(
    'deleteProfilePwRepeatFeedback'
  );
  if (deleteProfilePwRepeat.length === 0) {
    return false;
  }
  if (deleteProfilePw !== deleteProfilePwRepeat) {
    deleteProfilePwRepeatFeedback.hidden = false;
    deleteProfilePwRepeatInput.classList.add('invalid-border');
    return false;
  } else {
    deleteProfilePwRepeatFeedback.hidden = true;
    deleteProfilePwRepeatInput.classList.remove('invalid-border');
    return true;
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validateChangePw = () => {
  const changePwPwInput = document.getElementById('changePwPwInput');
  const changePwPwFeedback = document.getElementById('changePwPwFeedback');
  const changePwPwRepeatInput = document.getElementById(
    'changePwPwRepeatInput'
  );
  const pw1 = changePwPwInput.value;
  const pw2 = changePwPwRepeatInput.value;
  const changePwPwRepeatFeedback = document.getElementById(
    'changePwPwRepeatFeedback'
  );
  let returnVal = true;
  if (
    pw1.length > 0 &&
    (pw1.length < 8 ||
      !/[A-Z]/.test(pw1) ||
      !/[a-z]/.test(pw1) ||
      !/\d/.test(pw1))
  ) {
    changePwPwFeedback.hidden = false;
    changePwPwInput.classList.add('invalid-border');
    returnVal = false;
  } else {
    changePwPwFeedback.hidden = true;
    changePwPwInput.classList.remove('invalid-border');
  }
  if (pw2.length === 0) {
    return false;
  }
  if (pw1 !== pw2) {
    changePwPwRepeatFeedback.hidden = false;
    changePwPwRepeatInput.classList.add('invalid-border');
    return false;
  } else {
    changePwPwRepeatFeedback.hidden = true;
    changePwPwRepeatInput.classList.remove('invalid-border');
    return returnVal;
  }
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
  if (admin == 1) {
    adminSelect.disabled = true;
    document.getElementById('adminRequired').hidden = true;
  }
};

const createNewCourse = () => {
  const coursesTreeView = document.getElementById('coursesTreeView');

  const outerDiv = document.createElement('div');
  outerDiv.setAttribute('class', 'row p-1 m-0 selectable');
  outerDiv.setAttribute('id', `dummy`);

  const angleDiv = document.createElement('div');
  angleDiv.setAttribute('class', 'col-auto p-0 pe-1 angle-column');

  const angleIcon = document.createElement('i');
  angleIcon.setAttribute('class', 'fa-solid fa-angle-right');
  angleDiv.appendChild(angleIcon);

  outerDiv.appendChild(angleDiv);

  const nameDiv = document.createElement('div');
  nameDiv.setAttribute('class', 'col p-0 overflow-dots');

  const form = document.createElement('form');
  form.addEventListener('submit', (event) => newCourseFormSubmit(event));

  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('class', 'form-control p-0 m-0 rounded-0 h-100');
  input.setAttribute('onfocusout', 'removeDummy();');
  input.setAttribute('required', 'true');
  input.setAttribute('name', 'course_name');
  form.appendChild(input);

  nameDiv.appendChild(form);

  outerDiv.appendChild(nameDiv);

  coursesTreeView.insertBefore(outerDiv, coursesTreeView.firstChild);

  input.focus();
};

const createNewTreeViewCourse = (courseId) => {
  const treeViewCourse = document.createElement('div');
  treeViewCourse.setAttribute('id', `treeViewCourse${courseId}`);
  treeViewCourse.setAttribute('class', 'row px-1 m-0');

  const vlCol = document.createElement('div');
  vlCol.setAttribute(
    'class',
    'col-auto p-0 pe-1 angle-column d-flex justify-content-center'
  );

  const vl = document.createElement('div');
  vl.setAttribute('class', 'vl');
  vlCol.appendChild(vl);

  treeViewCourse.appendChild(vlCol);

  const parentCol = document.createElement('div');
  parentCol.setAttribute('class', 'col p-0');
  treeViewCourse.appendChild(parentCol);
  return treeViewCourse;
};

const createNewTreeViewAssignment = (assignmentId) => {
  const treeViewAssignment = document.createElement('div');
  treeViewAssignment.setAttribute('id', `treeViewAssignment${assignmentId}`);
  treeViewAssignment.setAttribute('class', 'row px-1 m-0');

  const vlCol = document.createElement('div');
  vlCol.setAttribute(
    'class',
    'col-auto p-0 pe-1 angle-column d-flex justify-content-center'
  );

  const vl = document.createElement('div');
  vl.setAttribute('class', 'vl');
  vlCol.appendChild(vl);

  treeViewAssignment.appendChild(vlCol);

  const parentCol = document.createElement('div');
  parentCol.setAttribute('class', 'col p-0');
  treeViewAssignment.appendChild(parentCol);
  return treeViewAssignment;
};

const createNewAssignment = (courseId) => {
  let treeViewCourse = document.getElementById('treeViewCourse' + courseId);
  if (!treeViewCourse) {
    treeViewCourse = createNewTreeViewCourse(courseId);
    const courseElement = document.getElementById(`course-${courseId}`);
    const courseElementParent = courseElement.parentNode;
    courseElementParent.insertBefore(treeViewCourse, courseElement.nextSibling);

    const i = courseElement.getElementsByTagName('i')[0];
    const isAngleRight = i.classList.contains('fa-angle-right');
    if (isAngleRight) {
      i.classList.add('fa-angle-down');
      i.classList.remove('fa-angle-right');
    }
  }
  if (treeViewCourse.hidden) {
    const courseElement = document.getElementById(`course-${courseId}`);
    courseElement.click();
  }

  const parentCol = treeViewCourse.childNodes[1];

  const outerDiv = document.createElement('div');
  outerDiv.setAttribute('class', 'row p-1 m-0 selectable');
  outerDiv.setAttribute('id', `dummy`);
  parentCol.appendChild(outerDiv);

  const angleDiv = document.createElement('div');
  angleDiv.setAttribute('class', 'col-auto p-0 pe-1 angle-column');

  const angleIcon = document.createElement('i');
  angleIcon.setAttribute('class', 'fa-solid fa-angle-right');
  angleDiv.appendChild(angleIcon);

  outerDiv.appendChild(angleDiv);

  const nameDiv = document.createElement('div');
  nameDiv.setAttribute('class', 'col p-0 overflow-dots');

  const form = document.createElement('form');
  form.addEventListener('submit', (event) =>
    newAssignmentFormSubmit(event, courseId)
  );

  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('class', 'form-control p-0 m-0 rounded-0 h-100');
  input.setAttribute('onfocusout', 'removeDummy();');
  input.setAttribute('required', 'true');
  input.setAttribute('name', 'assignment_name');
  form.appendChild(input);

  nameDiv.appendChild(form);

  outerDiv.appendChild(nameDiv);

  parentCol.insertBefore(outerDiv, parentCol.firstChild);

  input.focus();
};

const createNewTask = (assignmentId, courseId) => {
  let treeViewAssignment = document.getElementById(
    'treeViewAssignment' + assignmentId
  );
  if (!treeViewAssignment) {
    treeViewAssignment = createNewTreeViewAssignment(assignmentId);
    const assignmentElement = document.getElementById(
      `assignment-${assignmentId}`
    );
    const assignmentElementParent = assignmentElement.parentNode;
    assignmentElementParent.insertBefore(
      treeViewAssignment,
      assignmentElement.nextSibling
    );

    const i = assignmentElement.getElementsByTagName('i')[0];
    const isAngleRight = i.classList.contains('fa-angle-right');
    if (isAngleRight) {
      i.classList.add('fa-angle-down');
      i.classList.remove('fa-angle-right');
    }
  }
  if (treeViewAssignment.hidden) {
    const assignmentElement = document.getElementById(
      `assignment-${assignmentId}`
    );
    assignmentElement.click();
  }

  const parentCol = treeViewAssignment.childNodes[1];

  const outerDiv = document.createElement('div');
  outerDiv.setAttribute('class', 'row p-1 m-0 selectable');
  outerDiv.setAttribute('id', `dummy`);
  parentCol.appendChild(outerDiv);

  const nameDiv = document.createElement('div');
  nameDiv.setAttribute('class', 'col p-0 overflow-dots');

  const form = document.createElement('form');
  form.addEventListener('submit', (event) =>
    newTaskFormSubmit(event, assignmentId, courseId)
  );

  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('class', 'form-control p-0 m-0 rounded-0 h-100');
  input.setAttribute('onfocusout', 'removeDummy();');
  input.setAttribute('required', 'true');
  input.setAttribute('name', 'task_name');
  form.appendChild(input);

  nameDiv.appendChild(form);

  outerDiv.appendChild(nameDiv);

  parentCol.insertBefore(outerDiv, parentCol.firstChild);

  input.focus();
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createNewElement = () => {
  const selectedArray = document.getElementsByClassName('selected');
  if (selectedArray.length === 0) {
    createNewCourse();
  } else {
    const selected = selectedArray[0];
    if (selected.id.startsWith('course-')) {
      const courseId = selected.id.split('-')[1];
      createNewAssignment(courseId);
    } else if (selected.id.startsWith('assignment-')) {
      const courseId = selected.getAttribute('data-course-id');
      const assignmentId = selected.id.split('-')[1];
      createNewTask(assignmentId, courseId);
    } else if (selected.id.startsWith('task-')) {
      const courseId = selected.getAttribute('data-course-id');
      const assignmentId = selected.getAttribute('data-assignment-id');
      createNewTask(assignmentId, courseId);
    }
  }
};

const resetEdit = (selectedId, elementName) => {
  const form = document.getElementById('editElementForm');
  form.remove();
  const selectElement = document.getElementById(selectedId);
  selectElement.classList.add('selected');
  const nameDiv = selectElement.childNodes[1];
  const span = document.createElement('span');
  span.innerHTML = elementName;
  nameDiv.appendChild(span);
};

const editElementFormSubmit = async (event, selectedId, elementId, type) => {
  try {
    const inputs = document.getElementsByTagName('input');
    for (const input of inputs) {
      input.removeAttribute('onfocusout');
    }
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const user = document.getElementById('user');
    const actor = user.getAttribute('data-user-email');
    const elementName = formData.get('element_name');
    const selectedElement = document.getElementById(selectedId);
    let formDataObject;
    if (type === 'course') {
      const userId = user.getAttribute('data-user-id');
      formDataObject = {
        course_name: elementName,
        user_id: userId,
        actor
      };
    } else if (type === 'assignment') {
      const courseId = selectedElement.getAttribute('data-course-id');
      formDataObject = {
        assignment_name: elementName,
        course_id: courseId,
        actor
      };
    } else {
      const assignmentId = selectedElement.getAttribute('data-assignment-id');
      formDataObject = {
        task_name: elementName,
        assignment_id: assignmentId,
        actor
      };
    }
    const url = `/api/${type}s/${elementId}`;
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify(formDataObject)
    });
    const data = await response.json();
    if (response.status == 200) {
      resetEdit(selectedId, elementName);
      showAlert('success', 'Name erfolgreich geändert!');
    } else {
      resetEdit(selectedId, elementName);
      showAlert('error', 'Fehler beim Ändern des Namens!');
    }
  } catch (error) {
    resetEdit(selectedId, elementName);
    showAlert('error', 'Fehler beim Ändern des Namens!');
  }
};

const editElement = () => {
  const selectedArray = document.getElementsByClassName('selected');
  if (selectedArray.length === 0) {
    return;
  }
  const selected = selectedArray[0];
  selected.classList.remove('selected');
  const selectedId = selected.id;
  const type = selectedId.split('-')[0];
  const elementId = selectedId.split('-')[1];

  const nameDiv = selected.childNodes[1];
  nameDiv.innerHTML = null;

  const elementName = selected.getAttribute(`data-${type}-name`);

  const form = document.createElement('form');
  form.setAttribute('id', 'editElementForm');
  form.addEventListener('submit', (event) =>
    editElementFormSubmit(event, selectedId, elementId, type)
  );

  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('class', 'form-control p-0 m-0 rounded-0 h-100');
  input.setAttribute(
    'onfocusout',
    `resetEdit('${selectedId}', '${elementName}');`
  );
  input.setAttribute('required', 'true');
  input.setAttribute('name', 'element_name');
  form.appendChild(input);

  nameDiv.appendChild(form);

  input.focus();
};

const deleteCourse = async (courseId, actor) => {
  try {
    const response = await fetch(`/api/courses/delete/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        actor: actor
      })
    });

    if (!response.ok) {
      showAlert('error', 'Fehler beim Löschen des Kurses!');
      return;
    }

    const course = document.getElementById(`course-${courseId}`);
    course.remove();
    const treeViewCourse = document.getElementById(`treeViewCourse${courseId}`);
    if (treeViewCourse) {
      treeViewCourse.remove();
    }
    showAlert('success', 'Kurs erfolgreich gelöscht!');
  } catch (error) {
    showAlert('error', 'Fehler beim Löschen des Kurses!');
  }
};

const deleteAssignment = async (assignmentId, actor) => {
  try {
    const response = await fetch(`/api/assignments/delete/${assignmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        actor: actor
      })
    });

    if (!response.ok) {
      showAlert('error', 'Fehler beim Löschen des Übungszettels!');
      return;
    }

    const assignment = document.getElementById(`assignment-${assignmentId}`);
    assignment.remove();
    const treeViewAssignment = document.getElementById(
      `treeViewAssignment${assignmentId}`
    );
    if (treeViewAssignment) {
      treeViewAssignment.remove();
    }
    showAlert('success', 'Übungszettel erfolgreich gelöscht!');
  } catch (error) {
    showAlert('error', 'Fehler beim Löschen des Übungszettels!');
  }
};

const deleteTask = async (taskId, actor) => {
  try {
    const response = await fetch(`/api/tasks/delete/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        actor: actor
      })
    });

    if (!response.ok) {
      showAlert('error', 'Fehler beim Löschen der Aufgabe!');
      return;
    }

    const task = document.getElementById(`task-${taskId}`);
    task.remove();
    showAlert('success', 'Aufgabe erfolgreich gelöscht!');
  } catch (error) {
    showAlert('error', 'Fehler beim Löschen der Aufgabe!');
  }
};

const addListenerDeleteElementModal = () => {
  const deleteElementModal = document.getElementById('deleteElementModal');
  deleteElementModal.addEventListener('show.bs.modal', (event) => {
    const selectedArray = document.getElementsByClassName('selected');
    if (selectedArray.length === 0) {
      event.preventDefault();
      return;
    }
    const selected = selectedArray[0];
    let name;
    const deleteElementBtn = document.getElementById('deleteElementBtn');
    const actor = document
      .getElementById('user')
      .getAttribute('data-user-email');
    if (selected.id.startsWith('course-')) {
      name = selected.getAttribute('data-course-name');
      deleteElementBtn.onclick = async () =>
        await deleteCourse(selected.getAttribute('data-course-id'), actor);
    } else if (selected.id.startsWith('assignment-')) {
      name =
        selected.getAttribute('data-course-name') +
        ' > ' +
        selected.getAttribute('data-assignment-name');
      deleteElementBtn.onclick = async () =>
        await deleteAssignment(
          selected.getAttribute('data-assignment-id'),
          actor
        );
    } else {
      name =
        selected.getAttribute('data-course-name') +
        ' > ' +
        selected.getAttribute('data-assignment-name') +
        ' > ' +
        selected.getAttribute('data-task-name');
      deleteElementBtn.onclick = async () =>
        await deleteTask(selected.getAttribute('data-task-id'), actor);
    }
    const deleteElementText = document.getElementById('deleteElementText');
    deleteElementText.innerHTML =
      'Bitte bestätigen Sie, dass Sie ' +
      `<strong>${name}</strong>` +
      (selected.id.startsWith('task-')
        ? ''
        : ' sowie alle untergeordneten Elemente') +
      ' löschen möchten.';
  });
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
  profileLabel.innerHTML = 'PROFIL LÖSCHEN';
  const editProfileForm = document.getElementById('editProfileForm');
  editProfileForm.hidden = true;
  const changePwForm = document.getElementById('changePwForm');
  changePwForm.hidden = true;
  const deleteProfileForm = document.getElementById('deleteProfileForm');
  deleteProfileForm.hidden = false;
  const deleteProfilePwInput = document.getElementById('deleteProfilePwInput');
  deleteProfilePwInput.focus();
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const showEditProfile = () => {
  const profileLabel = document.getElementById('profileLabel');
  profileLabel.innerHTML = 'MEIN PROFIL';
  const editProfileForm = document.getElementById('deleteProfileForm');
  editProfileForm.hidden = true;
  const changePwForm = document.getElementById('changePwForm');
  changePwForm.hidden = true;
  const deleteProfileForm = document.getElementById('editProfileForm');
  deleteProfileForm.hidden = false;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const showChangePw = () => {
  const profileLabel = document.getElementById('profileLabel');
  profileLabel.innerHTML = 'PASSWORT ÄNDERN';
  const editProfileForm = document.getElementById('editProfileForm');
  const deleteProfileForm = document.getElementById('deleteProfileForm');
  editProfileForm.hidden = true;
  deleteProfileForm.hidden = true;
  const changePwForm = document.getElementById('changePwForm');
  changePwForm.hidden = false;
  const changePwPwInput = document.getElementById('changePwPwInput');
  changePwPwInput.focus();
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onClickSelectable = async (selectable) => {
  // toggle angle icon
  const i = selectable.getElementsByTagName('i')[0];
  const isAngleRight = i.classList.contains('fa-angle-right');
  if (!i.classList.contains('fa-file-lines')) {
    i.setAttribute(
      'class',
      `fa-solid fa-angle-${isAngleRight ? 'down' : 'right'}`
    );
  }
  // expand content
  if (selectable.id.startsWith('course')) {
    const courseId = selectable.getAttribute('data-course-id');
    const treeViewForCourse = document.getElementById(
      `treeViewCourse${courseId}`
    );
    if (treeViewForCourse) {
      treeViewForCourse.hidden = !treeViewForCourse.hidden;
    }
  }

  if (selectable.id.startsWith('assignment')) {
    const assigmentId = selectable.getAttribute('data-assignment-id');
    const treeViewForAssignment = document.getElementById(
      `treeViewAssignment${assigmentId}`
    );
    if (treeViewForAssignment) {
      treeViewForAssignment.hidden = !treeViewForAssignment.hidden;
    }
  }

  if (!selectable.classList.contains('selected')) {
    // add selected overlay
    selectable.classList.add('selected');
    selectable.classList.remove('selectable-hover');
    // unselect previously selected element
    const selectedElements = document.getElementsByClassName('selected');
    for (const selectedElement of selectedElements) {
      if (selectedElement != selectable) {
        selectedElement.classList.remove('selected');
        selectedElement.classList.add('selectable-hover');
      }
    }

    if (selectable.id.startsWith('task')) {
      // fetch configuration
      const taskConfiguration = await fetchTaskConfiguration(
        selectable.getAttribute('data-task-id')
      );
      const config = document.getElementById('configuration');
      config.value = taskConfiguration;
      config.scrollTo(0, 0);
      checkValidJSON();

      document.getElementById('pathCourseName').innerHTML =
        selectable.getAttribute('data-course-name');
      document
        .getElementById('selectedCourseId')
        .setAttribute(
          'data-course-id',
          selectable.getAttribute('data-course-id')
        );
      document.getElementById('pathAssignmentName').innerHTML =
        selectable.getAttribute('data-assignment-name');
      document
        .getElementById('selectedAssignmentId')
        .setAttribute(
          'data-assignment-id',
          selectable.getAttribute('data-assignment-id')
        );
      document.getElementById('pathTaskName').innerHTML =
        selectable.getAttribute('data-task-name');
      document
        .getElementById('selectedTaskId')
        .setAttribute('data-task-id', selectable.getAttribute('data-task-id'));

      document.getElementById('configContent').hidden = false;
    }
  }
};

const fetchTaskConfiguration = async (taskId) => {
  const configuration = document.getElementById('configuration');
  configuration.classList.remove('invalid-border');
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
  if (!isValidJSON(configuration)) {
    showAlert('error', 'Kein gültiges JSON-Format!');
    return;
  }
  const taskId = document
    .getElementById('selectedTaskId')
    .getAttribute('data-task-id');
  if (!taskId) {
    return;
  }
  const headers = {
    actor,
    'Content-Type': 'application/json'
  };
  const options = {
    method: 'PUT',
    headers: headers,
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
  const span = document.createElement('span');
  span.innerHTML = text;
  alert.appendChild(span);
  const button = document.createElement('button');
  button.classList.add('btn-close');
  button.classList.add('btn-close-white');
  button.setAttribute('type', 'button');
  button.setAttribute('data-bs-dismiss', 'alert');
  button.setAttribute('aria-label', 'Close');
  alert.appendChild(button);
  header.appendChild(alert);

  setTimeout(() => {
    alert.classList.remove('show');
    alert.addEventListener('transitionend', () => {
      alert.remove();
    });
  }, 3000);
};

const clearAlerts = () => {
  const alerts = document.getElementsByClassName('alert');
  for (const alert of alerts) {
    alert.remove();
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checkValidJSON = () => {
  const configurationTextArea = document.getElementById('configuration');
  const configuration = configurationTextArea.value;
  if (!isValidJSON(configuration)) {
    configurationTextArea.classList.add('invalid-border');
  } else {
    configurationTextArea.classList.remove('invalid-border');
  }
};

const isValidJSON = (s) => {
  try {
    JSON.parse(s);
  } catch (e) {
    return false;
  }
  return true;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const submitForm = async (mode) => {
  const form = document.getElementById('addNewModalForm');
  switch (mode) {
    case 'add-course':
      form.action = '/add-courses';
      form.method = 'post';
      break;
    default:
      break;
  }
  if (form.checkValidity()) {
    form.submit();
  } else {
    form.reportValidity();
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const removeDummy = () => {
  const dummy = document.getElementById('dummy');
  if (!!dummy) {
    dummy.remove();
  }
};

const completeCourseElement = (courseId, courseName) => {
  const dummy = document.getElementById('dummy');
  dummy.setAttribute('id', `course-${courseId}`);
  dummy.setAttribute('data-course-id', courseId);
  dummy.setAttribute('data-course-name', courseName);
  dummy.setAttribute('onclick', `onClickSelectable(this)`);
  dummy.setAttribute('tabindex', '0');
  const col = dummy.getElementsByClassName('col')[0];
  col.innerHTML = null;
  const span = document.createElement('span');
  span.innerHTML = courseName;
  col.appendChild(span);
  dummy.classList.add('selected');
};

const completeAssignmentElement = (assignmentId, assignmentName, courseId) => {
  const dummy = document.getElementById('dummy');
  dummy.setAttribute('id', `assignment-${assignmentId}`);
  dummy.setAttribute('data-assignment-id', assignmentId);
  dummy.setAttribute('data-assignment-name', assignmentName);

  const courseElement = document.getElementById(`course-${courseId}`);
  const courseName = courseElement.getAttribute('data-course-name');
  dummy.setAttribute('data-course-id', courseId);
  dummy.setAttribute('data-course-name', courseName);
  dummy.setAttribute('onclick', `onClickSelectable(this)`);
  dummy.setAttribute('tabindex', '0');
  const col = dummy.getElementsByClassName('col')[0];
  col.innerHTML = null;
  const span = document.createElement('span');
  span.innerHTML = assignmentName;
  col.appendChild(span);

  const selecteds = document.getElementsByClassName('selected');
  if (selecteds.length > 0) {
    selecteds[0].classList.remove('selected');
  }
  dummy.classList.add('selected');
};

const completeTaskElement = (taskId, taskName, assignmentId, courseId) => {
  const dummy = document.getElementById('dummy');
  dummy.setAttribute('id', `task-${taskId}`);
  dummy.setAttribute('data-task-id', taskId);
  dummy.setAttribute('data-task-name', taskName);

  const assignmentElement = document.getElementById(
    `assignment-${assignmentId}`
  );
  const assignmentName = assignmentElement.getAttribute('data-assignment-name');
  dummy.setAttribute('data-assignment-id', assignmentId);
  dummy.setAttribute('data-assignment-name', assignmentName);

  const courseElement = document.getElementById(`course-${courseId}`);
  const courseName = courseElement.getAttribute('data-course-name');
  dummy.setAttribute('data-course-id', courseId);
  dummy.setAttribute('data-course-name', courseName);
  dummy.setAttribute('onclick', `onClickSelectable(this)`);
  dummy.setAttribute('tabindex', '0');
  const col = dummy.getElementsByClassName('col')[0];
  col.innerHTML = null;
  const span = document.createElement('span');
  span.innerHTML = taskName;
  col.appendChild(span);

  const selecteds = document.getElementsByClassName('selected');
  if (selecteds.length > 0) {
    selecteds[0].classList.remove('selected');
  }
  dummy.classList.add('selected');

  const fileIconDiv = document.createElement('div');
  fileIconDiv.setAttribute('class', 'col-auto p-0 pe-1 angle-column');
  const fileIcon = document.createElement('i');
  fileIcon.setAttribute('class', 'fa-regular fa-file-lines');
  fileIconDiv.appendChild(fileIcon);
  dummy.insertBefore(fileIconDiv, dummy.childNodes[0]);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const newCourseFormSubmit = async (event) => {
  try {
    const inputs = document.getElementsByTagName('input');
    for (const input of inputs) {
      input.removeAttribute('onfocusout');
    }
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const user = document.getElementById('user');
    const userId = user.getAttribute('data-user-id');
    const actor = user.getAttribute('data-user-email');
    const courseName = formData.get('course_name');
    const formDataObject = {
      course_name: courseName,
      user_id: userId,
      actor
    };
    const url = '/api/courses';
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(formDataObject)
    });
    const data = await response.json();
    if (response.status == 201) {
      completeCourseElement(data.course_id, courseName);
      showAlert('success', 'Neuer Kurs erfolgreich erstellt!');
    } else {
      removeDummy();
      showAlert('error', 'Fehler beim Erstellen des Kurses!');
    }
  } catch (error) {
    removeDummy();
    showAlert('error', 'Fehler beim Erstellen des Kurses!');
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const newAssignmentFormSubmit = async (event, courseId) => {
  try {
    const inputs = document.getElementsByTagName('input');
    for (const input of inputs) {
      input.removeAttribute('onfocusout');
    }
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const user = document.getElementById('user');
    const actor = user.getAttribute('data-user-email');
    const assignmentName = formData.get('assignment_name');
    const formDataObject = {
      assignment_name: assignmentName,
      course_id: courseId,
      actor
    };
    const url = '/api/assignments';
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(formDataObject)
    });
    const data = await response.json();
    if (response.status == 201) {
      completeAssignmentElement(data.assignment_id, assignmentName, courseId);
      showAlert('success', 'Neuer Übungszettel erfolgreich erstellt!');
    } else {
      removeDummy();
      showAlert('error', 'Fehler beim Erstellen des Übungszettels!');
    }
  } catch (error) {
    removeDummy();
    showAlert('error', 'Fehler beim Erstellen des Übungszettels!');
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const newTaskFormSubmit = async (event, assignmentId, courseId) => {
  try {
    const inputs = document.getElementsByTagName('input');
    for (const input of inputs) {
      input.removeAttribute('onfocusout');
    }
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const user = document.getElementById('user');
    const actor = user.getAttribute('data-user-email');
    const taskName = formData.get('task_name');
    const formDataObject = {
      task_name: taskName,
      assignment_id: assignmentId,
      actor
    };
    const url = '/api/tasks';
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(formDataObject)
    });
    const data = await response.json();
    if (response.status == 201) {
      completeTaskElement(data.task_id, taskName, assignmentId, courseId);
      showAlert('success', 'Neue Aufgabe erfolgreich erstellt!');
    } else {
      removeDummy();
      showAlert('error', 'Fehler beim Erstellen der Aufgabe!');
    }
  } catch (error) {
    removeDummy();
    showAlert('error', 'Fehler beim Erstellen der Aufgabe!');
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const removeSelected = (event, element) => {
  if (event.target != element) {
    return;
  }
  const selectedElements = document.getElementsByClassName('selected');
  if (selectedElements.length > 0) {
    selectedElements[0].classList.remove('selected');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  validateRegister();
  resetFormOnDismissProfileModal();
  addListenerDeleteElementModal();
});
