package ru.itsinfo.fetchapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.itsinfo.fetchapi.model.User;
import ru.itsinfo.fetchapi.service.AppService;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/users")
//@EnableGlobalMethodSecurity(prePostEnabled = true)
public class ApplicationRestController {
    private final AppService appService;

    @Autowired
    public ApplicationRestController(AppService appService) {
        this.appService = appService;
    }

    @GetMapping(produces = {MediaType.APPLICATION_JSON_VALUE})
    //@GetMapping
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
    /*public ResponseEntity<List<User>> all() {
        return new ResponseEntity<>(appService.findAllUsers(, HttpStatus.OK);
    }*/

    @GetMapping("/{id}")
//    @PreAuthorize("hasAuthority('user:get')")
    public User getOne(@PathVariable Long id) {
        return appService.getOneUser(id);
    }

    @PostMapping
    public User insert(@Valid @RequestBody User user, BindingResult bindingResult) {
        return appService.insertUser(user, bindingResult);
    }

    @PutMapping
    public User update(@Valid @RequestBody User user, BindingResult bindingResult) {
        return appService.updateUser(user, bindingResult);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        appService.deleteUser(id);
    }
}
