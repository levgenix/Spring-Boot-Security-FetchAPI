package ru.itsinfo.fetchapi.exception;

import org.springframework.beans.TypeMismatchException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler({TypeMismatchException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleMethodArgumentNotValid(Exception e) {
        return e.getMessage();
    }

    @ExceptionHandler({UserNotFoundException.class, EmptyResultDataAccessException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleUserNotFound(Exception e) {
        return e.getMessage();
    }

    @ExceptionHandler
    public ResponseEntity<Object> handleUserValidation(UserValidationException e) {
        return new ResponseEntity<>(new UserValidationData(e.getUser(), e.getFieldErrors(), e.getMessage()), HttpStatus.CONFLICT);
    }

    @ExceptionHandler
    public ResponseEntity<Object> handleUserDataIntegrityViolation(UserDataIntegrityViolationException e) {
        return new ResponseEntity<>(new UserValidationData(e.getUser(), e.getMessage()), HttpStatus.BAD_REQUEST);
    }
}
