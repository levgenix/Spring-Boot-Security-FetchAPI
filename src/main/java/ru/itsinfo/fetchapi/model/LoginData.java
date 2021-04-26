package ru.itsinfo.fetchapi.model;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;

public class LoginData {

    @NotEmpty(message = "Email should not be empty")
    @Email(message = "Email should be valid")
    private String email;

    @NotEmpty(message = "Password should not be empty")
    private String password;

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}
