package ru.itsinfo.fetchapi.repository;

import org.springframework.data.repository.CrudRepository;
import ru.itsinfo.fetchapi.model.Role;

public interface RoleRepository extends CrudRepository<Role, Integer> {
}
