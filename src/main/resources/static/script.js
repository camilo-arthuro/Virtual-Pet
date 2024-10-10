document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterForm = document.getElementById('show-register-form');
    const showLoginForm = document.getElementById('show-login-form');
    const mainContent = document.getElementById('main-content');
    const userOptions = document.getElementById('user-options');
    const petDisplay = document.getElementById('pet-display');

    const createPetForm = document.getElementById('createPetForm');
    const logoutBtn = document.getElementById('logout-btn');
    const createPetBtn = document.getElementById('create-pet-btn');
    const cancelCreatePetBtn = document.getElementById('cancel-create-pet-btn');
    const createPetFormContainer = document.getElementById('create-pet-form');

    const myPetsButton = document.getElementById('my-pets-btn');
    const allPetsButton = document.getElementById('all-pets-btn');
    const petsContainer = document.getElementById('pets-container');

    let userRole;

    showRegisterForm.addEventListener('click', function() {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    showLoginForm.addEventListener('click', function() {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    logoutBtn.addEventListener('click', () => {
        mainContent.style.display = 'none';
        loginForm.style.display = 'block';
        petDisplay.innerHTML = ''; // clean pets
        petsContainer.innerHTML = ''; // clean pets
        localStorage.removeItem('token');
    });

    createPetBtn.addEventListener('click', () => {
        mainContent.style.display = 'none';
        createPetFormContainer.style.display = 'block';
    });

    cancelCreatePetBtn.addEventListener('click', () => {
        createPetFormContainer.style.display = 'none';
        mainContent.style.display = 'block';
    });

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        fetch('/petapp/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userName: username,
                userPassword: password,
            }),
        })
        .then(response => response.text())
        .then(data => {
            if (data !== 'fail') {
                const token = data;
                localStorage.setItem('token', token);
                fetch('/petapp/role', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                .then(response => response.json())
                .then(roleData => {
                    userRole = roleData.role;
                    loginForm.style.display = 'none';
                    mainContent.style.display = 'block';
                    if (userRole === 'ADMIN') {
                        allPetsButton.style.display = 'block';
                    } else {
                        allPetsButton.style.display = 'none';
                    }
                });
            } else {
                alert('Invalid credentials!');
            }
        });
    });

    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const role = document.getElementById('register-role').value;
        
        fetch('/petapp/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userName: username,
                userPassword: password,
                userRole: role,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
            } else {
                alert('Registration failed!');
            }
        });
    });

    // Create Pet
    createPetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in first');
            return;
        }

        const petName = document.getElementById('pet-name').value;
        const petBreed = document.getElementById('pet-breed').value;
        const petColor = document.getElementById('pet-color').value;

        const response = await fetch('/petapp/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ petName, petBreed, petColor })
        });

        if (response.ok) {
            alert('Pet created successfully');
            createPetFormContainer.style.display = 'none';
            mainContent.style.display = 'block';
            // Aquí puedes agregar la lógica para actualizar la lista de mascotas
        } else {
            alert('Failed to create pet, no places available');
        }
    });

    // More event listeners and functions to handle pet interactions can be added here
    // Get pets (USER)
    myPetsButton.addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in first');
            return;
        }
        
        const response = await fetch(`/petapp/user/pets`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    
        if (response.ok) {
            const pets = await response.json();
            displayPets(pets);
        } else {
            alert('Failed to fetch pets');
        }
    });    

    //All pets (ADMIN)
    allPetsButton.addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in first');
            return;
        }

        const response = await fetch('/petapp/admin/pets', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const pets = await response.json();
            displayAllPets(pets);
        } else {
            alert('Failed to fetch all pets');
        }
    });

    function displayPets(pets) {
        petDisplay.style.display = 'block';
        petDisplay.innerHTML = ''; // clean pets
        petsContainer.style.display = 'none';
        pets.forEach((pet, index) => {
            const petImageContainer = document.createElement('div');
            petImageContainer.classList.add('pet-image-container');
    
            const petImage = document.createElement('img');
            petImage.src = `images/${pet.breed}_${pet.color}.gif`;
            petImage.classList.add('pet-image');
    
            const petInfo = document.createElement('div');
            petInfo.classList.add('pet-info-user');
            petInfo.innerHTML = `
                <h3>${pet.name}</h3>
                <p>Id: ${pet.id}</p>
                <p>Breed: ${pet.breed}</p>
                <p>Color: ${pet.color}</p>
                <p>Happiness: ${pet.happiness}</p>
                <p>Health: ${pet.health}</p>
            `;
    
            petImageContainer.appendChild(petImage);
            petImageContainer.appendChild(petInfo);
            petDisplay.appendChild(petImageContainer);
    
            switch (index) {
                case 0:
                    petImageContainer.style.left = '50%';
                    petImageContainer.style.transform = 'translateX(-50%)'; // Centrar la imagen
                    break;
                case 1:
                    petImageContainer.style.left = '0';
                    break;
                case 2:
                    petImageContainer.style.right = '0';
                    break;
            }
        });
    }
    
    function displayAllPets(pets) {
        petsContainer.style.display = 'block';
        petsContainer.innerHTML = ''; // clean pets
        petDisplay.style.display = 'none';
        pets.forEach(pet => {
            const petElement = document.createElement('div');
            petElement.classList.add('pet-container');
    
            const petImage = document.createElement('img');
            petImage.src = `images/${pet.breed}_${pet.color}.gif`;
            petImage.classList.add('pet');
    
            const petInfo = document.createElement('div');
            petInfo.classList.add('pet-info');
            petInfo.innerHTML = `
                <h3>${pet.name}</h3>
                <p>Id: ${pet.id}</p>
                <p>Breed: ${pet.breed}</p>
                <p>Color: ${pet.color}</p>
                <p>Happiness: ${pet.happiness}</p>
                <p>Health: ${pet.health}</p>
                <p>Owner: ${pet.ownerId}</p>
            `;
    
            petElement.appendChild(petImage);
            petElement.appendChild(petInfo);
            petsContainer.appendChild(petElement);
        });
    }
    
    // function fetchPets() {
    //     const token = localStorage.getItem('token');
    //     fetch('/petapp/user/pets', {
    //         method: 'GET',
    //         headers: {
    //             'Authorization': 'Bearer ' + token
    //         }
    //     })
    //     .then(response => response.json())
    //     .then(data => displayPets(data));
    // }

    // document.getElementById('view-pets').addEventListener('click', fetchPets);

    // Similar setup for delete, update, and interact with pet, ensuring to include the Authorization header

    
});
