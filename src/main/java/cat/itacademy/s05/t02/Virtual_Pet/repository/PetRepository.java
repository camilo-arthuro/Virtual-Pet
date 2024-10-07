package cat.itacademy.s05.t02.Virtual_Pet.repository;

import cat.itacademy.s05.t02.Virtual_Pet.model.Person;
import cat.itacademy.s05.t02.Virtual_Pet.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
}
