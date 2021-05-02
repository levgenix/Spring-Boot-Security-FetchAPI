const usersTableId = $('#users-table-rows');
const userFormId = $('#user-profile');
const userAddFormId = $('#user-addform');

$('#nav-users_table-link').click(() => {
    loadUsersTable();
});
$('#nav-user_form-link').click(() => {
    loadAddForm();
});
userAddFormId.find(':submit').click(() => {
    insertUser();
});

function loadUsersTable() {
    $('#nav-users_table-link').addClass('active');
    $('#nav-users_table').addClass('show').addClass('active');
    $('#nav-user_form-link').removeClass('active');
    $('#nav-user_form').removeClass('show').removeClass('active');
    getAllUsers();
}

function initNavigation() {
    $('#admin-area-tab').click(() => {
        $('#admin-area-tab').addClass('active').removeClass('btn-light').addClass('btn-primary').prop('aria-selected', true);
        $('#admin-area').addClass('active');
        $('#user-area-tab').removeClass('active').removeClass('btn-primary').addClass('btn-light').prop('aria-selected', false);
        $('#user-area').removeClass('active');
    });
    $('#user-area-tab').click(() => {
        $('#user-area-tab').addClass('active').removeClass('btn-light').addClass('btn-primary').prop('aria-selected', true);
        $('#user-area').addClass('active');
        $('#admin-area-tab').removeClass('active').removeClass('btn-primary').addClass('btn-light').prop('aria-selected', false);
        $('#admin-area').removeClass('active');
    });
}

function loadAddForm() {
    $('#nav-user_form-link').addClass('active');
    $('#nav-user_form').addClass('show').addClass('active');
    $('#nav-users_table-link').removeClass('active');
    $('#nav-users_table').removeClass('show').removeClass('active');
    loadUserForInsertForm();
}

function getAllUsers() {
    fetch('/api/users').then(function (response) {
        if (response.ok) {
            response.json().then(users => {
                usersTableId.empty();
                users.forEach(user => {
                    _appendUserRow(user);
                });
            });
        } else {
            console.error('Network request for users.json failed with response ' + response.status + ': ' + response.statusText);
        }
    });
}

function _appendUserRow(user) {
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
                    loadUserAndShowModalForm(user.id);
                }).text('Edit')))
            .append($('<td>').append($('<button class="btn btn-sm btn-danger">')
                .click(() => {
                    loadUserAndShowModalForm(user.id, false);
                }).text('Delete')))
        );
}

function _eraseUserModalForm() {
    userFormId.find('.invalid-feedback').remove();
    userFormId.find('#firstName').removeClass('is-invalid');
    userFormId.find('#email').removeClass('is-invalid');
    userFormId.find('#password').removeClass('is-invalid');
    userFormId.find('#age').removeClass('is-invalid');
}

function _setReadonlyAttr(value = true) {
    userFormId.find('#firstName').prop('readonly', value);
    userFormId.find('#lastName').prop('readonly', value);
    userFormId.find('#age').prop('readonly', value);
    userFormId.find('#email').prop('readonly', value);
    userFormId.find('#password').prop('readonly', value);
    userFormId.find('#roles').prop('disabled', value);
}

function updateUser(id) {
    _eraseUserModalForm();

    let headers = new Headers();
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
    let request = new Request('/api/users/', {
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
                    console.warn('Error: ' + userData.message);
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

function loadUserAndShowModalForm(id, editMode = true) {
    _eraseUserModalForm();

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
                        _setReadonlyAttr(false);
                    } else {
                        userFormId.find('.modal-title').text('Delete user');
                        userFormId.find('#password-div').hide();
                        userFormId.find('.submit').text('Delete').removeClass('btn-primary').addClass('btn-danger')
                            .removeAttr('onClick')
                            .attr('onClick', 'deleteUser(' + id + ');');
                        _setReadonlyAttr();
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

function _eraseUserAddForm() {
    userAddFormId.find('.invalid-feedback').remove();
    userAddFormId.find('#newfirstName').removeClass('is-invalid');
    userAddFormId.find('#newage').removeClass('is-invalid');
    userAddFormId.find('#newemail').removeClass('is-invalid');
    userAddFormId.find('#newpassword').removeClass('is-invalid');
}

function loadUserForInsertForm() {
    _eraseUserAddForm();
    userAddFormId.find('#newfirstName').val('');
    userAddFormId.find('#newlastName').val('');
    userAddFormId.find('#newage').val('0');
    userAddFormId.find('#newemail').val('');
    userAddFormId.find('#newpassword').val('');

    fetch('/api/roles').then(function (response) {
        if (response.ok) {
            userAddFormId.find('#newroles').empty();
            response.json().then(roleList => {
                roleList.forEach(role => {
                    userAddFormId.find('#newroles')
                        .append($('<option>').val(role.id).text(role.name));
                });
            });
        } else {
            console.error('Network request for roles.json failed with response ' + response.status + ': ' + response.statusText);
        }
    });
}

function insertUser() {
    _eraseUserAddForm();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    let user = {
        'firstName': userAddFormId.find('#newfirstName').val(),
        'lastName': userAddFormId.find('#newlastName').val(),
        'age': userAddFormId.find('#newage').val(),
        'email': userAddFormId.find('#newemail').val(),
        'password': userAddFormId.find('#newpassword').val(),
        'roles': userAddFormId.find('#newroles').val().map(roleId => parseInt(roleId))
    };
    let request = new Request('/api/users/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(user)
    });

    fetch(request)
        .then(function (response) {
            response.json().then(function (userData) {
                console.log(userData);

                if (response.status === 409) {
                    userData.fieldErrors.forEach(error => {
                        userAddFormId.find('#new' + error.field)
                            .addClass('is-invalid')
                            .parent().append($('<div class="invalid-feedback">').text(error.defaultMessage));
                    });
                    console.warn('Error: ' + userData.message);
                    return false;
                }
                if (response.status === 400) {
                    userAddFormId.find('#newemail')
                        .addClass('is-invalid')
                        .parent().append($('<div class="invalid-feedback">').text('E-mail must be unique'));
                    console.warn("Error message: " + userData.message);
                    return false;
                }

                loadUsersTable();
                console.info("User with id = " + userData.id + " was inserted");
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

$(document).ready(
    () => {
        getAllUsers();
        initNavigation();
    }
);