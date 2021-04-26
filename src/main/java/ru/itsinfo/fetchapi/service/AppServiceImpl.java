package ru.itsinfo.fetchapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import ru.itsinfo.fetchapi.exception.UserDataIntegrityViolationException;
import ru.itsinfo.fetchapi.exception.UserNotFoundException;
import ru.itsinfo.fetchapi.exception.UserValidationException;
import ru.itsinfo.fetchapi.model.User;
import ru.itsinfo.fetchapi.repository.UserRepository;

import java.util.List;

@Service
public class AppServiceImpl implements AppService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AppServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(String.format("Username %s not found", email))
        );
    }

    @Override
    public List<User> findAllUsers() {
        return userRepository.findAll(Sort.by(Sort.Direction.ASC, "firstName", "lastName"));
    }

    @Override
    public User getOneUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    @Override
    public User insertUser(User user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new UserValidationException(user, bindingResult.getFieldErrors(), "User's fields has errors");
        }

        String oldPassword = user.getPassword();
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        try {
            user = userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            user.setPassword(oldPassword);
            throw new UserDataIntegrityViolationException(user, e.getMessage());
        }

        return user;
    }

    @Override
    public User updateUser(User user, BindingResult bindingResult) {
        bindingResult = checkBindingResultForPasswordField(bindingResult);

        if (bindingResult.hasErrors()) {
            throw new UserValidationException(user, bindingResult.getFieldErrors(), "User's fields has errors");
        }

        String oldPassword = user.getPassword();
        user.setPassword(user.getPassword().isEmpty() ?
                getOneUser(user.getId()).getPassword() :
                passwordEncoder.encode(user.getPassword()));
        try {
            user = userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            user.setPassword(oldPassword);
            throw new UserDataIntegrityViolationException(user, e.getMessage());
        }

        return user;
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    /**
     * Удаляет ошибку, если у существующего User пустое поле password
     * @param bindingResult BeanPropertyBindingResult
     * @return BeanPropertyBindingResult
     */
    private BindingResult checkBindingResultForPasswordField(BindingResult bindingResult) {
        if (!bindingResult.hasFieldErrors()) {
            return bindingResult;
        }

        User user = (User) bindingResult.getTarget();
        BindingResult newBindingResult = new BeanPropertyBindingResult(user, bindingResult.getObjectName());
        for (FieldError error : bindingResult.getFieldErrors()) {
            if (!user.isNew() && !error.getField().equals("password")) {
                newBindingResult.addError(error);
            }
        }

        return newBindingResult;
    }
}
