package cat.itacademy.s05.t02.Virtual_Pet.controller;

import cat.itacademy.s05.t02.Virtual_Pet.model.Person;
import cat.itacademy.s05.t02.Virtual_Pet.model.Pet;
import cat.itacademy.s05.t02.Virtual_Pet.service.PersonService;
import cat.itacademy.s05.t02.Virtual_Pet.service.PetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/petapp")
@Tag(name = "Pet Controller", description = "Controller for mapping Virtual Pet App")
public class AppController {

    @Autowired
    private PersonService personService;
    @Autowired
    private PetService petService;

    @PostMapping("/login")
    @Operation(summary = "Login a user", description = "Login a user in the web")
    public String login(@RequestBody Map<String, String> payload) {
        String userName = payload.get("userName");
        String userPassword = payload.get("userPassword");

        return personService.verify(userName, userPassword);
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Register a new user to use the web")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        String userName = payload.get("userName");
        String userPassword = payload.get("userPassword");
        String userRole = payload.get("userRole");
        try {
            Person newUser = personService.createUser(userName, userPassword, userRole);
            return new ResponseEntity<>(newUser, HttpStatus.CREATED);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("The user name is already taken, please choose another one. ");
        }
    }

    @PostMapping("/create")
    @Operation(summary = "Create a virtual pet", description = "Create a pet for a user")
    public ResponseEntity<Person> createPet(@RequestBody Map<String, String> payload, Authentication authentication) {
        String userName = authentication.getName();
        Long userId = personService.getUserId(userName);

        String petName = payload.get("petName");
        String petColor = payload.get("petColor");
        String petBreed = payload.get("petBreed");

        Person newOwner = petService.createPet(userId,petName,petColor,petBreed);
        if (newOwner != null){
            return new ResponseEntity<>(newOwner, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }
    }


    @GetMapping("/user/pets")
    @Operation(summary = "View user's pets", description = "Allows to see the user's pets")
    public ResponseEntity<List<Pet>> getUserPets(Authentication authentication){
        String userName = authentication.getName();
        Long userId = personService.getUserId(userName);

        List<Pet> petList = personService.getUserPets(userId);
        return new ResponseEntity<>(petList, HttpStatus.OK);
    }

    @GetMapping("/admin/pets")
    @Operation(summary = "View all pets in the Database",
            description = "Allows the ADMIN to see all the pets in the Database")
    public ResponseEntity<List<Pet>> getAllPets() {
        List<Pet> allPets = personService.getAllPets();
        return new ResponseEntity<>(allPets, HttpStatus.OK);
    }

    @DeleteMapping("/user/delete/{userId}")
    @Operation(summary = "Delete a user", description = "Delete a user from the Database")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        try {
            personService.deleteUser(userId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/pet/delete/{petId}")
    @Operation(summary = "Delete a user's pet", description = "Delete a pet from the Database")
    public ResponseEntity<Void> deletePet(@PathVariable Long petId, Authentication authentication){
        try {
            String userName = authentication.getName();
            Long userId = personService.getUserId(userName);
            boolean isAdmin = personService.isAdmin(userName);

            if (isAdmin || petService.isOwner(userId, petId)){
                petService.deletePet(petId);
                personService.updateCapacity(userId);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("pet/update/{petId}")
    @Operation(summary = "Update a pet", description = "Update the pet's info")
    public ResponseEntity<Pet> updatePet(@PathVariable Long petId,
                                         @RequestBody Map<String, String> payload,
                                         Authentication authentication) {
        try {
            String userName = authentication.getName();
            Long userId = personService.getUserId(userName);
            boolean isAdmin = personService.isAdmin(userName);
            String update = payload.get("update");
            String change = payload.get("change");

            if (isAdmin || petService.isOwner(userId, petId)){
                Pet pet = petService.updatePet(petId,update,change);
                return new ResponseEntity<>(pet, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("pet/action/{petId}")
    @Operation(summary = "Interact with a pet", description = "Interact with a user's pet")
    public ResponseEntity<Pet> petAction(@PathVariable Long petId,
                                         @RequestBody Map<String, String> payload,
                                         Authentication authentication) {
        try {
            String userName = authentication.getName();
            Long userId = personService.getUserId(userName);
            boolean isAdmin = personService.isAdmin(userName);
            String action = payload.get("action");

            if (isAdmin || petService.isOwner(userId, petId)){
                Pet pet = petService.petAction(petId,action);
                return new ResponseEntity<>(pet, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/role")
    @Operation(summary = "get the user's role", description = "Get the user's role for other request")
    public ResponseEntity<Map<String, String>> getUserRole(Authentication authentication) {
        String userName = authentication.getName();
        String userRole = personService.getRole(userName);

        return new ResponseEntity<>(Map.of("role", userRole), HttpStatus.OK);
    }

}
