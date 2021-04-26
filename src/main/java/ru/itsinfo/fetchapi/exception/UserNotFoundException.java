package ru.itsinfo.fetchapi.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class UserNotFoundException extends ResponseStatusException {

	private static final long serialVersionUID = 3784243994085653144L;

	public UserNotFoundException(Long id) {
		super(HttpStatus.NOT_FOUND, "Could not find user with ID = " + id);
	}
}
