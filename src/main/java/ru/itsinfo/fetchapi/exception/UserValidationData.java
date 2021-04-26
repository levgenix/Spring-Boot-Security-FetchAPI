package ru.itsinfo.fetchapi.exception;

import org.springframework.validation.FieldError;
import ru.itsinfo.fetchapi.model.User;

import java.util.Collections;
import java.util.List;

public class UserValidationData {

    private final User user;
    private List<FieldError> fieldErrors;
    private final String message;

    public UserValidationData(User user, List<FieldError> fieldErrors, String message) {
        this(user, message);
        this.fieldErrors = fieldErrors;
    }

    public UserValidationData(User user, String message) {
        this.user = user;
        this.message = message;
    }

    public User getUser() {
        return user;
    }

    public List<FieldError> getFieldErrors() {
        return fieldErrors == null ? Collections.emptyList() : fieldErrors;
    }

    public String getMessage() {
        return message;
    }
}
