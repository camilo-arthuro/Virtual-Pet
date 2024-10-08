document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterForm = document.getElementById('show-register-form');
    const showLoginForm = document.getElementById('show-login-form');
    const mainContent = document.getElementById('main-content');
    const userOptions = document.getElementById('user-options');
    const petDisplay = document.getElementById('pet-display');
    const allPetsButton = document.getElementById('all-pets');

    const createPetForm = document.getElementById('createPetForm');
    const logoutBtn = document.getElementById('logout-btn');
    const createPetBtn = document.getElementById('create-pet-btn');
    const cancelCreatePetBtn = document.getElementById('cancel-create-pet-btn');
    const createPetFormContainer = document.getElementById('create-pet-form');

    let userRole;

    showRegisterForm.addEventListener('click', function() {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    showLoginForm.addEventListener('click', function() {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
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
        const token = sessionStorage.getItem('token');
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
            alert('Failed to create pet');
        }
    });


    // More event listeners and functions to handle pet interactions can be added here

    function displayPets(pets) {
        petDisplay.innerHTML = '';
        pets.forEach((pet, index) => {
            const petImage = document.createElement('img');
            petImage.src = `images/${pet.breed}_${pet.color}.gif`;
            petImage.classList.add('pet-image');
            switch (index) {
                case 0:
                    petImage.style.left = '25%';
                    break;
                case 1:
                    petImage.style.left = '0';
                    break;
                case 2:
                    petImage.style.right = '0';
                    break;
            }
            petDisplay.appendChild(petImage);
        });
    }

    function fetchPets() {
        const token = localStorage.getItem('token');
        fetch('/petapp/user/pets', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(response => response.json())
        .then(data => displayPets(data));
    }

    document.getElementById('view-pets').addEventListener('click', fetchPets);

    // Similar setup for delete, update, and interact with pet, ensuring to include the Authorization header

    
});
