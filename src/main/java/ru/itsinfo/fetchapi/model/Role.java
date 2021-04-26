package ru.itsinfo.fetchapi.model;

import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "roles")
public final class Role extends AbstractEntity<Integer> implements GrantedAuthority {
    private static final long serialVersionUID = 7217778059836250424L;

    @Column(unique = true)
    private String name;

    @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
    private List<User> users = new ArrayList<>();

    public Role() {
    }

    public Role(String name) {
        this.name = name;
    }

    public Role(Integer id) {
        this.setId(id);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String getAuthority() {
        return name;
    }

    @Override
    public String toString() {
        return String.format("Role [id = %d; name = %s;]", this.getId(), name);
    }
}
