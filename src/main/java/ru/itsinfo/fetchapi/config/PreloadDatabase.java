package ru.itsinfo.fetchapi.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import ru.itsinfo.fetchapi.model.Role;
import ru.itsinfo.fetchapi.model.User;
import ru.itsinfo.fetchapi.repository.RoleRepository;
import ru.itsinfo.fetchapi.repository.UserRepository;

import java.util.HashSet;

@Configuration
public class PreloadDatabase {

    private static final Logger log = LoggerFactory.getLogger(PreloadDatabase.class);

    @Bean
    CommandLineRunner initDatabase(RoleRepository roleRepository,
                                   UserRepository userRepository,
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            Role admin = new Role("ROLE_ADMIN");
            Role user = new Role("ROLE_USER");

            log.info("Preloading " + roleRepository.save(admin));
            log.info("Preloading " + roleRepository.save(user));
            log.info("Preloading " + roleRepository.save(new Role("ROLE_GUEST")));

            log.info("Preloading " + userRepository.save(new User("Василий", "Уткин", 49, "admin@mail.com",
                    passwordEncoder.encode("admin"),
                    new HashSet<>() {{
                        add(admin);
                        add(user);
                    }})));
            log.info("Preloading " + userRepository.save(new User("Дмитрий", "Губерниев", 46, "user@mail.com",
                    passwordEncoder.encode("user"),
                    new HashSet<>() {{
                        add(user);
                    }})));
        };
    }
}
