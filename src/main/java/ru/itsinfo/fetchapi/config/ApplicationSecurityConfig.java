package ru.itsinfo.fetchapi.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.PasswordEncoder;
import ru.itsinfo.fetchapi.service.AppService;

@Configuration
@EnableWebSecurity
public class ApplicationSecurityConfig extends WebSecurityConfigurerAdapter {

    // сервис, с помощью которого тащим пользователя
    private final AppService appService;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public ApplicationSecurityConfig(AppService appService,
                                     PasswordEncoder passwordEncoder) {
        this.appService = appService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(appService).passwordEncoder(passwordEncoder);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable() // todo
                .authorizeRequests()
                .antMatchers("/**").permitAll(); // todo
    }
}