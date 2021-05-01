package ru.itsinfo.fetchapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.itsinfo.fetchapi.model.Role;
import ru.itsinfo.fetchapi.model.User;
import ru.itsinfo.fetchapi.service.AppService;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
//@EnableGlobalMethodSecurity(prePostEnabled = true)
public class ApplicationRestController {
    private final AppService appService;

    @Autowired
    public ApplicationRestController(AppService appService) {
        this.appService = appService;
    }

    @GetMapping(value = "/users", produces = {MediaType.APPLICATION_JSON_VALUE})
    @ResponseBody
    // todo CollectionModel List
    // TODO: В фоме заголовок https://habr.com/ru/post/500572/
    //GET http://localhost:8080/transactions/{userid}
    //Accept: application/json
    // или
    //POST ...
    //Content-Type: application/json; charset=UTF-8
    public List<User> findAll() {
        return appService.findAllUsers();
    }

    @GetMapping("/users/{id}")
//    @PreAuthorize("hasAuthority('user:get')")
    public User getOne(@PathVariable Long id) {
        return appService.getOneUser(id);
    }

    @PostMapping("/users")
    public User insert(@Valid @RequestBody User user, BindingResult bindingResult) {
        return appService.insertUser(user, bindingResult);
        //return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping(
            value = "/users",
            produces = {MediaType.APPLICATION_JSON_VALUE},
            consumes = {MediaType.APPLICATION_FORM_URLENCODED_VALUE, MediaType.APPLICATION_JSON_VALUE},
            method = RequestMethod.PUT)
    public User update(@Valid @RequestBody User user, BindingResult bindingResult) {
        System.out.println("USER: "+user);
        return appService.updateUser(user, bindingResult);
    }

    @DeleteMapping("/users/{id}")
    public void delete(@PathVariable Long id) {
        appService.deleteUser(id);
    }

    @GetMapping(value = "/roles", produces = {MediaType.APPLICATION_JSON_VALUE})
    @ResponseBody
    public Iterable<Role> findAllRoles() {
        return appService.findAllRoles();
    }
}
