package ru.itsinfo.fetchapi.exception;

import org.springframework.beans.TypeMismatchException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler
    //@ExceptionHandler({TypeMismatchException.class})
    public ResponseStatusException handleMethodArgumentNotValid(TypeMismatchException e) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseStatusException handleUserNotFound(UserNotFoundException e) {
        return e;
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

/*Создайте класс ControllerAdvice или RestControllerAdvice в сочетании с аннотациями @ResponseStatus и @ExceptionHandler. Несолько замечаний:
1. Вы можете догадаться о разнице между этими двумя классами, понимая разницу между контроллером и REST контроллером.
2. @ResponseStatus позволяет вам определить код статуса HTTP, который должен быть возвращен клиенту после обработки вашего исключения.
3. @ExceptionHandler указывает исключение, которое должно вызывать ваш метод-обработчик.
4. Кроме этого, это все похоже на написание обычного контроллера или REST контроллера.*/
/*
@ControllerAdvice
public class GlobalControllerExceptionHandler {

    @ResponseStatus(HttpStatus.CONFLICT)  // 409
    @ExceptionHandler(SomeConflictException.class)
    public String handleConflict(SomeConflictException e, Model model) {
        // do something
        model.addAttribute("message", e.getMessage());
        return "new-template";
    }

    @ResponseStatus(HttpStatus.NOT_IMPLEMENTED)  // 409
    @ExceptionHandler(NotYetImplementedExceptoin.class)
    public void handleBandwithLimitExceeded(NotYetImplementedExceptoin e) {
        // do nothing;
    }
}*/
