package cat.itacademy.s05.t02.Virtual_Pet.service;

import cat.itacademy.s05.t02.Virtual_Pet.exception.GlobalExceptionHandler;
import cat.itacademy.s05.t02.Virtual_Pet.exception.UserNotFoundException;
import cat.itacademy.s05.t02.Virtual_Pet.model.Person;
import cat.itacademy.s05.t02.Virtual_Pet.model.Pet;
import cat.itacademy.s05.t02.Virtual_Pet.repository.PersonRepository;
import cat.itacademy.s05.t02.Virtual_Pet.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PetService {

    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private PetRepository petRepository;

    public Person createPet(Long userId, String petName, String petColor, String petBreed){
        Person user = findUser(userId);
        Pet pet = new Pet();

        if (user == null) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }
        if (user.getPetList().size() < 3){
            petInfo(pet, petName, petColor, petBreed);
            pet.setOwnerId(userId);
            user.getPetList().add(pet);
            if (user.getPetList().size() == 3) {
                user.setCapacity("NO_PLACES_AVAILABLE");
            }
            return personRepository.save(user);
        } else {
            return null;
        }
    }

    public Person findUser(Long userId){
        return personRepository.findAll()
                .stream()
                .filter(user -> user.getId().equals(userId))
                .findFirst()
                .orElse(null);
    }

    public void petInfo(Pet pet, String petName, String petColor, String petBreed){
        pet.setName(petName);
        pet.setColor(petColor);
        pet.setBreed(petBreed);
        pet.setHappiness(100);
        pet.setHealth(100);
    }

    public void deletePet(Long petId){
        petRepository.deleteById(petId);
    }

    public Pet updatePet(Long petId, String update, String change){
        Pet pet = findPet(petId);
        update(pet, update, change);

        return petRepository.save(pet);
    }

    public Pet findPet(Long petId){
        return petRepository.findAll()
                .stream()
                .filter(pet -> pet.getId().equals(petId))
                .findFirst()
                .orElse(null);
    }

    public void update(Pet pet, String update, String change){
        switch (update) {
            case "change_name":
                pet.setName(change);
                break;
            case "change_color":
                pet.setColor(change);
                break;
            case "change_breed":
                pet.setBreed(change);
                break;
        }
    }

    public Pet petAction(Long petId, String action){
        Pet pet = findPet(petId);
        action(pet, action);

        return petRepository.save(pet);
    }

    public void action(Pet pet, String action){
        switch (action) {
            case "play" -> {
                pet.setHappiness(pet.getHappiness() + 10);
                pet.setHealth(pet.getHealth() - 20);
            }
            case "feed" -> {
                pet.setHappiness(pet.getHappiness() + 10);
                pet.setHealth(pet.getHealth() + 10);
            }
            case "train" -> {
                pet.setHappiness(pet.getHappiness() - 20);
                pet.setHealth(pet.getHealth() + 10);
            }
        }
    }

    public boolean isOwner(Long userId, Long petId) {
        Pet pet = findPet(petId);

        if (userId == pet.getOwnerId()) {
            return true;
        } else {
            return false;
        }
    }
}
