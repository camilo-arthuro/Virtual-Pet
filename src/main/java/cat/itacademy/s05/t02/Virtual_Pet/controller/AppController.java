package cat.itacademy.s05.t02.Virtual_Pet.controller;

import cat.itacademy.s05.t02.Virtual_Pet.model.Person;
import cat.itacademy.s05.t02.Virtual_Pet.model.Pet;
import cat.itacademy.s05.t02.Virtual_Pet.service.PersonService;
import cat.itacademy.s05.t02.Virtual_Pet.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/petapp")
public class AppController {

    @Autowired
    private PersonService personService;
    @Autowired
    private PetService petService;

    @PostMapping("/register")
    public ResponseEntity<Person> register(@RequestBody Map<String, String> payload) {
        String userName = payload.get("userName");
        String userPassword = payload.get("userPassword");
        String userRole = payload.get("userRole");
        Person newUser = personService.createUser(userName, userPassword, userRole);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }

    @PostMapping("/create/{userId}")
    public ResponseEntity<Person> createPet(@PathVariable Long userId, @RequestBody Map<String, String> payload) {
        String petName = payload.get("petName");
        String petColor = payload.get("petColor");
        String petBreed = payload.get("petBreed");
        Person newOwner = petService.createPet(userId,petName,petColor,petBreed);
        return new ResponseEntity<>(newOwner, HttpStatus.CREATED);
    }


    @GetMapping("/user/{userId}/pets")
    public ResponseEntity<List<Pet>> getUserPets(@PathVariable Long userId){
        List<Pet> petList = personService.getUserPets(userId);
        return new ResponseEntity<>(petList, HttpStatus.OK);
    }

    @GetMapping("/admin/pets")
    public ResponseEntity<List<Pet>> getAllPets() {
        List<Pet> allPets = personService.getAllPets();
        return new ResponseEntity<>(allPets, HttpStatus.OK);
    }

    @DeleteMapping("/user/delete/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        try {
            personService.deleteUser(userId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/pet/delete/{petId}")
    public ResponseEntity<Void> deletePet(@PathVariable Long petId){
        try {
            petService.deletePet(petId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("pet/update/{petId}")
    public ResponseEntity<Pet> updatePet(@PathVariable Long petId, @RequestBody Map<String, String> payload) {
        String update = payload.get("update");
        String change = payload.get("change");
        Pet pet = petService.updatePet(petId,update,change);
        return new ResponseEntity<>(pet, HttpStatus.OK);
    }

    @PutMapping("pet/action/{petId}")
    public ResponseEntity<Pet> petAction(@PathVariable Long petId, @RequestBody Map<String, String> payload) {
        String action = payload.get("action");
        Pet pet = petService.petAction(petId,action);
        return new ResponseEntity<>(pet, HttpStatus.OK);
    }

}
