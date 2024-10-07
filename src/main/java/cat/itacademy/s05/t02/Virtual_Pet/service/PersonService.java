package cat.itacademy.s05.t02.Virtual_Pet.service;

import cat.itacademy.s05.t02.Virtual_Pet.model.Person;
import cat.itacademy.s05.t02.Virtual_Pet.model.Pet;
import cat.itacademy.s05.t02.Virtual_Pet.repository.PersonRepository;
import cat.itacademy.s05.t02.Virtual_Pet.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class PersonService {

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private PetRepository petRepository;

    //private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public Person createUser(String name, String password, String role){
        Person user = new Person();
        userInfo(user, name, password, role);

        return personRepository.save(user);
    }

    public void userInfo(Person user, String name, String password, String role) {
        user.setUserName(name);
        //user.setUserPassword(encoder.encode(password));
        user.setUserPassword(password);
        user.setUserRole(role);
        user.setPetList(new ArrayList<>());
        user.setCapacity("AVAILABLE_PLACES");
    }

    public List<Pet> getUserPets(Long userId){
        Person user = findUser(userId);
        List<Pet> petList = user.getPetList();
        return petList;
    }

    public List<Pet> getAllPets(){
        return petRepository.findAll();
    }

    public void deleteUser(Long userId){
        personRepository.deleteById(userId);
    }

    public Person findUser(Long userId){
        return personRepository.findAll()
                .stream()
                .filter(user -> user.getId().equals(userId))
                .findFirst()
                .orElse(null);
    }


}
