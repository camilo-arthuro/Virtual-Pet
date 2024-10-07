package cat.itacademy.s05.t02.Virtual_Pet.exception;

public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException(String message) {
        super(message);
    }
}
