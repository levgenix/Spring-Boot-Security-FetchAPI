$(document).ready(function () {
    getAllUsers();
});

function getAllUsers() {
    fetch('/api/users').then(function (response) {
        if (response.ok) {
            response.json().then(function (users) {
                const usersTableRows = $('#users-table-rows');
                usersTableRows.empty();
                var i = 0;
                users.forEach((user) => {
                    usersTableRows
                        .append($('<tr class="border-top bg-light">').attr('id', 'userRow[' + user.id + ']').addClass(i % 2 !== 0 ? 'table-light' : 'table-secondary')
                            .append($('<td>').text(user.id))
                            .append($('<td>').text(user.firstName))
                            .append($('<td>').text(user.lastName))
                            .append($('<td>').text(user.age))
                            .append($('<td>').text(user.email))
                            .append($('<td>').text(user.roles.map(role => role.name)))
                            .append($('<td>').append($('<button class="btn btn-sm btn-info">')
                                .click(() => {
                                    loadUserAndShow(user.id);
                                }).text('Edit')))
                            .append($('<td>').append($('<button class="btn btn-sm btn-danger">')
                                .click(() => {
                                    loadUserAndShow(user.id);
                                }).text('Delete')))
                        );
                    i++;
                });
            });
        } else {
            console.error('Network request for users.json failed with response ' + response.status + ': ' + response.statusText);
        }
    });
}

function loadUserAndShow(id) {
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
                    console.log('User: ' + user);
                    const userForm = $('#user-profile');
                    userForm.find('#id').val(id);
                    userForm.find('#firstName').val(user.firstName);
                    userForm.find('#lastName').val(user.lastName);
                    userForm.find('#age').val(user.age);
                    userForm.find('#email').val(user.email);
                    userForm.find('#password-div').remove();
                    userForm.find('.submit').text('Delete').addClass('btn-danger')
                        .removeAttr('onClick')
                        .attr('onClick', 'deleteUser(' + id + ');');
                    userForm.modal();
                });
            }
        )
        .catch(function (err) {
            console.error('Fetch Error :-S', err);
        });
}

function deleteUser(id) {
    fetch('/api/users/' + id, {method: 'DELETE'})
        .then(function (response) {
            $('#user-profile').modal('hide');
            if (response.status === 404 || response.status === 400) {
                response.text().then((value) => console.warn("Error message: " + value));
                return;
            }
            $("#users-table-rows #userRow\\[" + id + "\\]").remove();
            console.info("User with id = " + id + " was deleted");
        });
}