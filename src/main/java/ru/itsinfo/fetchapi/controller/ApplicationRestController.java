package ru.itsinfo.fetchapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.itsinfo.fetchapi.model.Role;
import ru.itsinfo.fetchapi.model.User;
import ru.itsinfo.fetchapi.service.AppService;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ApplicationRestController {
    private final AppService appService;

    @Autowired
    public ApplicationRestController(AppService appService) {
        this.appService = appService;
    }

    @GetMapping(value = "/users", produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<List<User>> findAll() {
        return new ResponseEntity<>(appService.findAllUsers(), HttpStatus.OK);
    }

    @GetMapping("/users/{id}")
    public User getOne(@PathVariable Long id) {
        return appService.getOneUser(id);
    }

    @PostMapping("/users")
    public ResponseEntity<User> insert(@Valid @RequestBody User user, BindingResult bindingResult) {
        return new ResponseEntity<>(appService.insertUser(user, bindingResult), HttpStatus.OK);
    }

    @PutMapping("/users")
    public ResponseEntity<User> update(@Valid @RequestBody User user, BindingResult bindingResult) {
        return new ResponseEntity<>(appService.updateUser(user, bindingResult), HttpStatus.OK);
    }

    @DeleteMapping("/users/{id}")
    public void delete(@PathVariable Long id) {
        appService.deleteUser(id);
    }

    @GetMapping(value = "/roles", produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Iterable<Role>> findAllRoles() {
        return new ResponseEntity<>(appService.findAllRoles(), HttpStatus.OK);
    }
}
