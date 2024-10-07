package cat.itacademy.s05.t02.Virtual_Pet.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String color;
    private String breed;
    private int happiness;
    private int health;

    private Long ownerId;
}
