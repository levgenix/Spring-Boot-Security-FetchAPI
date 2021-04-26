package ru.itsinfo.fetchapi.model;

import org.springframework.data.domain.Persistable;
import org.springframework.lang.Nullable;

import javax.persistence.*;

@MappedSuperclass
public abstract class AbstractEntity<PK extends Number> implements Persistable<PK> {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private PK id;

    @Nullable
    @Override
    public PK getId() {
        return id;
    }

    public void setId(@Nullable PK id) {
        this.id = id;
    }

    @Transient
    @Override
    public boolean isNew() {
        return null == getId();
    }

    @Override
    public int hashCode() {
        int hashCode = 17;
        hashCode += null == getId() ? 0 : getId().hashCode() * 31;
        return hashCode;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (this == obj) {
            return true;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        AbstractEntity<?> other = (AbstractEntity<?>) obj;
        if (getId() == null || other.getId() == null) {
            return false;
        }
        return getId().equals(other.getId());
    }
}
