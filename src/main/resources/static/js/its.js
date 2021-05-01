$(document).ready(
    () => {
        getAllUsers();
    }
);

const usersTableId = $('#users-table-rows');
const userFormId = $('#user-profile');

function getAllUsers() {
    fetch('/api/users').then(function (response) {
        if (response.ok) {
            response.json().then(users => {
                usersTableId.empty();
                users.forEach(user => {
                    appendUserRow(user);
                });
            });
        } else {
            console.error('Network request for users.json failed with response ' + response.status + ': ' + response.statusText);
        }
    });
}

function appendUserRow(user) {
    usersTableId
        .append($('<tr class="border-top bg-light">').attr('id', 'userRow[' + user.id + ']')
            .append($('<td>').attr('id', 'userData[' + user.id + '][id]').text(user.id))
            .append($('<td>').attr('id', 'userData[' + user.id + '][firstName]').text(user.firstName))
            .append($('<td>').attr('id', 'userData[' + user.id + '][lastName]').text(user.lastName))
            .append($('<td>').attr('id', 'userData[' + user.id + '][age]').text(user.age))
            .append($('<td>').attr('id', 'userData[' + user.id + '][email]').text(user.email))
            .append($('<td>').attr('id', 'userData[' + user.id + '][roles]').text(user.roles.map(role => role.name)))
            .append($('<td>').append($('<button class="btn btn-sm btn-info">')
                .click(() => {
                    loadUserAndShow(user.id);
                }).text('Edit')))
            .append($('<td>').append($('<button class="btn btn-sm btn-danger">')
                .click(() => {
                    loadUserAndShow(user.id, false);
                }).text('Delete')))
        );
}

function eraseUserForm() {
    userFormId.find('.invalid-feedback').remove();
    userFormId.find('#firstName').removeClass('is-invalid');
    userFormId.find('#email').removeClass('is-invalid');
    userFormId.find('#password').removeClass('is-invalid');
    userFormId.find('#age').removeClass('is-invalid');
}

function loadUserAndShow(id, editMode = true) {
    eraseUserForm();

    fetch('/api/users/' + id, {method: 'GET'})
        .then(function (response) {
                if (response.status !== 200) {
                    console.error('Looks like there was a problem. Status Code: ' + response.status);
                    if (response.status === 400) {
                        response.text().then((value) => console.warn("Error message: " + value));
                    }
                    return;
                }
                response.json().then(function (user) {
                    // console.log(user);
                    userFormId.find('#id').val(id);
                    userFormId.find('#firstName').val(user.firstName);
                    userFormId.find('#lastName').val(user.lastName);
                    userFormId.find('#age').val(user.age);
                    userFormId.find('#email').val(user.email);
                    userFormId.find('#password').val('');
                    if (editMode) {
                        userFormId.find('.modal-title').text('Edit user');
                        userFormId.find('#password-div').show();
                        userFormId.find('.submit').text('Edit').removeClass('btn-danger').addClass('btn-primary')
                            .removeAttr('onClick')
                            .attr('onClick', 'updateUser(' + id + ');');
                        setReadonlyAttr(false);
                    } else {
                        userFormId.find('.modal-title').text('Delete user');
                        userFormId.find('#password-div').hide();
                        userFormId.find('.submit').text('Delete').removeClass('btn-primary').addClass('btn-danger')
                            .removeAttr('onClick')
                            .attr('onClick', 'deleteUser(' + id + ');');
                        setReadonlyAttr();
                    }

                    fetch('/api/roles').then(function (response) {
                        if (response.ok) {
                            userFormId.find('#roles').empty();
                            response.json().then(roleList => {
                                roleList.forEach(role => {
                                    userFormId.find('#roles')
                                        .append($('<option>')
                                            .prop('selected', user.roles.filter(e => e.id === role.id).length)
                                            .val(role.id).text(role.name));

                                    console.log(user.roles.filter(e => e.id === role.id).length);

                                });
                            });
                        } else {
                            console.error('Network request for roles.json failed with response ' + response.status + ': ' + response.statusText);
                        }
                    });

                    userFormId.modal();
                });
            }
        )
        .catch(function (err) {
            console.error('Fetch Error :-S', err);
        });
}

function setReadonlyAttr(value = true) {
    userFormId.find('#firstName').prop('readonly', value);
    userFormId.find('#lastName').prop('readonly', value);
    userFormId.find('#age').prop('readonly', value);
    userFormId.find('#email').prop('readonly', value);
    userFormId.find('#password').prop('readonly', value);
    userFormId.find('#roles').prop('disabled', value);
}

function updateUser(id) {
    eraseUserForm();

    const headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    let user = {
        'id': parseInt(userFormId.find('#id').val()),
        'firstName': userFormId.find('#firstName').val(),
        'lastName': userFormId.find('#lastName').val(),
        'age': userFormId.find('#age').val(),
        'email': userFormId.find('#email').val(),
        'password': userFormId.find('#password').val(),
        'roles': userFormId.find('#roles').val().map(roleId => parseInt(roleId))
    };
    const request = new Request('/api/users/', {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(user)
    });

    fetch(request)
        .then(function (response) {
            if (response.status === 404) {
                response.text().then((value) => console.warn("Error message: " + value));
                userFormId.modal('hide');
                return false;
            }

            response.json().then(function (userData) {
                console.log(userData);

                if (response.status === 409) {
                    userData.fieldErrors.forEach(error => {
                        userFormId.find('#' + error.field)
                            .addClass('is-invalid')
                            .parent().append($('<div class="invalid-feedback">').text(error.defaultMessage));
                    });
                    return false;
                }
                if (response.status === 400) {
                    userFormId.find('#email')
                        .addClass('is-invalid')
                        .parent().append($('<div class="invalid-feedback">').text('E-mail must be unique'));
                    console.warn("Error message: " + userData.message);
                    return false;
                }

                $('#userData\\[' + userData.id + '\\]\\[firstName\\]').text(userData.firstName)
                $('#userData\\[' + userData.id + '\\]\\[lastName\\]').text(userData.lastName)
                $('#userData\\[' + userData.id + '\\]\\[age\\]').text(userData.age)
                $('#userData\\[' + userData.id + '\\]\\[email\\]').text(userData.email)
                $('#userData\\[' + userData.id + '\\]\\[roles\\]').text(userData.roles.map(role => role.name));
                userFormId.modal('hide');

                console.info("User with id = " + id + " was updated");
            });
        })
        .catch(function (err) {
            console.error('Fetch Error :-S', err);
        });
}

function insertUser(id) {
    fetch('/api/users/' + id, {method: 'POST'})
        .then(function (response) {
            if (response.status === 404 || response.status === 400) {
                response.text().then((value) => console.warn("Error message: " + value));
                userFormId.modal('hide');
                return;
            }

            response.json().then(function (userData) {
                if (response.status === 409) {
                    const user = userData.user;
                    const fieldErrors = userData.fieldErrors;
                    // todo
                }

                userFormId.modal('hide');
                appendUserRow(userData);
                console.info("User with id = " + id + " was inserted");
            });
        });
}

function deleteUser(id) {
    fetch('/api/users/' + id, {method: 'DELETE'})
        .then(function (response) {
            userFormId.modal('hide');
            if (response.status === 404 || response.status === 400) {
                response.text().then((value) => console.warn("Error message: " + value));
                return;
            }
            usersTableId.find('#userRow\\[' + id + '\\]').remove();
            console.info("User with id = " + id + " was deleted");
        });
}