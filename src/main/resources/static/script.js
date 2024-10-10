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

    const deletePetForm = document.getElementById('delete-pet-form');
    const deletePetButton = document.getElementById('delete-pet-button');
    const deletePetOption = document.getElementById('delete-pet-option');
    const cancelDeletePetBtn = document.getElementById('cancel-delete-pet-btn');

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

    deletePetOption.addEventListener('click', () => {
        mainContent.style.display = 'none';
        deletePetForm.style.display = 'block';
    });

    cancelDeletePetBtn.addEventListener('click', () => {
        deletePetForm.style.display = 'none';
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
        } else {
            alert('Failed to create pet, no places available');
        }
    });

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

    // Display user pets
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
    
    // Display all pets
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
    
    // Delete a pet
    deletePetButton.addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        const petId = document.getElementById('delete-pet-id').value;
    
        if (!token) {
            alert('Please log in first');
            return;
        }
    
        if (!petId) {
            alert('Please enter a pet ID');
            return;
        }
    
        const response = await fetch(`/petapp/pet/delete/${petId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    
        if (response.ok) {
            alert('Pet deleted successfully');
            deletePetForm.style.display = 'none';
            mainContent.style.display = 'block';
            petDisplay.innerHTML = ''; // clean pets
            petsContainer.innerHTML = ''; // clean pets    
        } else {
            if (response.status === 403) {
                alert('You do not have permission to delete this pet.');
            } else if (response.status === 404) {
                alert('Pet not found.');
            } else {
                alert('Failed to delete pet.');
            }
        }
    });
    
    // Update pet 
    const updatePetForm = document.getElementById('update-pet-form');
    const updatePetButton = document.getElementById('update-pet-button');
    const updateField = document.getElementById('update-field');
    const updateValue = document.getElementById('update-value');
    const updateBreed = document.getElementById('update-breed');
    const updateColor = document.getElementById('update-color');
    const updatePetOption = document.getElementById('update-pet-option');
    const cancelUpdatePetBtn = document.getElementById('cancel-update-pet-btn');

    updatePetOption.addEventListener('click', () => {
        mainContent.style.display = 'none';
        updatePetForm.style.display = 'block';
    });

    cancelUpdatePetBtn.addEventListener('click', () => {
        updatePetForm.style.display = 'none';
        mainContent.style.display = 'block';
    });

    updateField.addEventListener('change', () => {
        const selectedField = updateField.value;
        updateValue.style.display = 'none';
        updateBreed.style.display = 'none';
        updateColor.style.display = 'none';

        switch (selectedField) {
            case 'change_name':
                updateValue.style.display = 'block';
                break;
            case 'change_breed':
                updateBreed.style.display = 'block';
                break;
            case 'change_color':
                updateColor.style.display = 'block';
                break;
        }
    });

    updatePetButton.addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        const petId = document.getElementById('update-pet-id').value;
        const selectedField = updateField.value;
        let updateValueContent;

        if (!token) {
            alert('Please log in first');
            return;
        }

        if (!petId) {
            alert('Please enter all required fields');
            return;
        }

        switch (selectedField) {
            case 'change_name':
                updateValueContent = updateValue.value;
                break;
            case 'change_breed':
                updateValueContent = updateBreed.value;
                break;
            case 'change_color':
                updateValueContent = updateColor.value;
                break;
        }

        if (!updateValueContent) {
            alert('Please enter a value to update');
            return;
        }

        const response = await fetch(`/petapp/pet/update/${petId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ update: selectedField, change: updateValueContent })
        });

        if (response.ok) {
            alert('Pet updated successfully');
            updatePetForm.style.display = 'none';
            mainContent.style.display = 'block';
            petDisplay.innerHTML = ''; // clean pets
            petsContainer.innerHTML = ''; // clean pets    
        } else {
            if (response.status === 403) {
                alert('You do not have permission to update this pet.');
            } else if (response.status === 404) {
                alert('Pet not found.');
            } else {
                alert('Failed to update pet.');
            }
        }
    });

    // Interact with pet 
    const actionPetForm = document.getElementById('pet-action-form');
    const actionPetButton = document.getElementById('action-pet-button');
    const interactPetOption = document.getElementById('interact-pet-option');
    const cancelActionPetBtn = document.getElementById('cancel-action-pet-btn');

    interactPetOption.addEventListener('click', () => {
        mainContent.style.display = 'none';
        actionPetForm.style.display = 'block';
    });

    cancelActionPetBtn.addEventListener('click', () => {
        actionPetForm.style.display = 'none';
        mainContent.style.display = 'block';
    });

    actionPetButton.addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        const petId = document.getElementById('action-pet-id').value;
        const actionField = document.getElementById('action-field').value;

        if (!token) {
            alert('Please log in first');
            return;
        }

        if (!petId) {
            alert('Please enter a pet ID');
            return;
        }

        const response = await fetch(`/petapp/pet/action/${petId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: actionField })
        });

        if (response.ok) {
            alert('Action performed successfully');
            actionPetForm.style.display = 'none';
            mainContent.style.display = 'block';
            petDisplay.innerHTML = ''; // clean pets
            petsContainer.innerHTML = ''; // clean pets    
        } else {
            if (response.status === 403) {
                alert('You do not have permission to interact with this pet.');
            } else if (response.status === 404) {
                alert('Pet not found.');
            } else {
                alert('Failed to interact with pet.');
            }
        }
    });


    
});
