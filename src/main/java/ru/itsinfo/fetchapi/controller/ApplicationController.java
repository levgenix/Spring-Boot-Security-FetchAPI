package ru.itsinfo.fetchapi.controller;

import org.springframework.lang.Nullable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import ru.itsinfo.fetchapi.model.User;

import javax.security.auth.login.LoginException;
import java.util.Objects;
import java.util.Set;

@Controller
public class ApplicationController {

    @GetMapping({"", "/"})
    public String main(@CurrentSecurityContext(expression = "authentication.principal") User principal,
                       @CurrentSecurityContext(expression = "authentication") Authentication authentication,
                       @Nullable Authentication auth) {
        System.out.println("principal "+ principal);
        System.out.println("authentication "+ authentication.getPrincipal());
        System.out.println("auth "+ (Objects.nonNull(auth) ? auth.getPrincipal() : "null"));
        if (Objects.isNull(auth)) {
            return "login-page";
        }

        User user = (User) auth.getPrincipal();
        System.out.println("user "+user);
        System.out.println("authorities "+user.getAuthorities());
//        Set<String> roles = AuthorityUtils.authorityListToSet(authentication.getAuthorities());

//        if (!roles.contains("ROLE_ADMIN") || !roles.contains("ROLE_USER")) {
        if (!user.hasRole("ROLE_ADMIN") || !user.hasRole("ROLE_USER")) {
            // todo <header th:replace="fragments/header :: header"/>
            return "access-denied-page";
        }

        return "main-page";
    }
}
