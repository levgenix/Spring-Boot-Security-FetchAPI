package ru.itsinfo.fetchapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import ru.itsinfo.fetchapi.model.User;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<UserDetails> findByEmail(String email);
}
