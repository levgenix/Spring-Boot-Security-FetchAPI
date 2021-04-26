package ru.itsinfo.fetchapi.exception;

import org.springframework.validation.FieldError;
import ru.itsinfo.fetchapi.model.User;

import java.util.Collections;
import java.util.List;

public class UserValidationException extends RuntimeException {

    private static final long serialVersionUID = -6322609567303796544L;

    private final User user;
    private final List<FieldError> fieldErrors;

    public UserValidationException(User user, List<FieldError> fieldErrors, String message) {
        super(message);
        this.user = user;
        this.fieldErrors = fieldErrors;
    }

    public User getUser() {
        return user;
    }

    public List<FieldError> getFieldErrors() {
        return fieldErrors == null ? Collections.emptyList() : fieldErrors;
    }
}
