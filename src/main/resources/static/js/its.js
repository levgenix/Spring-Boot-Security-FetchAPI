$(document).ready(function () {
    function loadUserProfileModalFormAndShow(id) {
        console.log(id);
    }

    function loadUserProfileModalFormForDeleteAndShow(id) {
        fetch('/api/users/' + id, {method: 'DELETE'})
            .then(function (response) {
                if (response.status === 404) {
                    response.text().then((value) => console.warn("Error message: " + value));
                } else {
                    $("#users-table-rows #userRow\\[" + id + "\\]").remove();
                    console.info("User with id = " + id + " was deleted");
                }
            });
    }

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
                                    loadUserProfileModalFormAndShow(user.id);
                                }).text('Edit')))
                            .append($('<td>').append($('<button class="btn btn-sm btn-danger">')
                                .click(() => {
                                    loadUserProfileModalFormForDeleteAndShow(user.id);
                                }).text('Delete')))
                        );
                    i++;
                });
            });
        } else {
            console.log('Network request for users.json failed with response ' + response.status + ': ' + response.statusText);
        }
    });


    $('.edit-button-tmp').on('click', function (event) {
        event.preventDefault();
        /*        $.get($(this).attr('href'), function (user, status) {
                    $('#userprofile-form #id').val(user.id);
                    $('#userprofile-form #firstName').val(user.firstName);
                    $('#userprofile-form #lastName').val(user.lastName);
                    $('#userprofile-form #age').val(user.age);
                    $('#userprofile-form #email').val(user.email);
                    $('#userprofile-form #password').val(user.password);
                });*/
        // $('#inputId').prop('readonly', true); когда делитим

        $.get({
            url: $(this).attr('href'),
            dataType: "html"
        }).done(function (html) {
            $('#userprofile-modal').replaceWith(html);
            showUserProfile();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log('textStatus: ' + textStatus);
            console.log('errorThrown: ' + errorThrown);
            console.log('jqXHR: ' + jqXHR);
        });
    });

    $('.edit-button').on('click', function (event) {
        event.preventDefault();
        $('#user-profile').modal("show").find('.modal-dialog').load($(this).attr('href'), function (response, status, xhr) {
            if (xhr.status === 404) {
                $(location).attr('href', '/admin');
            }
            $('#user-profile .modal-header h3').text('Edit User');
            let submit = $('#user-profile .modal-footer .submit');
            submit.text('Save');
            submit.addClass('btn-primary');
            $('#user-profile #method').val("patch");
        });
    });

    $('.delete-button').on('click', function (event) {
        event.preventDefault();
        $('#user-profile').modal("show").find('.modal-dialog').load($(this).attr('href'), function (response, status, xhr) {
            if (xhr.status === 404) {
                $(location).attr('href', '/admin');
            }
            $('#user-profile .modal-header h3').text('Delete User');
            $('#user-profile #password-div').remove();
            $("#user-profile #firstName").prop("readonly", true);
            $("#user-profile #lastName").prop("readonly", true);
            $("#user-profile #age").prop("readonly", true);
            $("#user-profile #email").prop("readonly", true);
            $("#user-profile #roles").prop("disabled", true);
            let submit = $('#user-profile .modal-footer .submit');
            submit.text('Delete');
            submit.addClass('btn-danger');
            $('#user-profile #method').val("delete");
        });
    });
});