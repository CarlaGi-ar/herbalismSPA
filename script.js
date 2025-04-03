document.addEventListener('DOMContentLoaded', () => {
    // Declare global variables for the data and the search bar
    let herbsData = [];
    let recipesData = {};
    const searchBar = document.getElementById('search-bar');

    //FETCH HERBS DATA
    fetch('./data/herbs.json')
        .then(response => {
            console.log(`Herbs fetch response: ${response.status} ${response.statusText}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Herbs data loaded successfully:', data);
            herbsData = data; // store globally

            // DOM Elements for herbs
            const herbsList = document.getElementById('herbs-list');
            const herbDetails = document.getElementById('herb-details');
            const herbName = document.getElementById('herb-name');
            const herbImage = document.getElementById('herb-image');
            const herbDescription = document.getElementById('herb-description');
            const herbBenefits = document.getElementById('herb-benefits');

            // Function to display herbs in the list
            const displayHerbs = (filteredHerbs) => {
                herbsList.innerHTML = ''; // Clear existing list
                filteredHerbs.forEach(herb => {
                    const listItem = document.createElement('li');
                    listItem.textContent = herb.name;
                    listItem.classList.add('herb-item');
                    listItem.addEventListener('click', () => {
                        showHerbDetails(herb);
                    });
                    herbsList.appendChild(listItem);
                });
            };

            // Function to show herb details
            const showHerbDetails = (herb) => {
                herbName.textContent = herb.name;
                herbImage.src = herb.image;
                herbImage.alt = `${herb.name} image`;
                herbDescription.textContent = herb.description;
                herbBenefits.innerHTML = ''; // Clear previous benefits
                herb.benefits.forEach(benefit => {
                    const benefitItem = document.createElement('li');
                    benefitItem.textContent = benefit;
                    herbBenefits.appendChild(benefitItem);
                });
                herbDetails.classList.remove('hidden');
            };

            // Display all herbs initially
            displayHerbs(herbsData);

            // Add search bar functionality
            searchBar.addEventListener('input', (event) => {
                const searchTerm = event.target.value.toLowerCase();
                const filteredHerbs = data.filter(herb =>
                    herb.name.toLowerCase().includes(searchTerm)
                );
                displayHerbs(filteredHerbs);
            });
        })
        .catch(error => {
            console.error('Error loading herbs.json:', error);
            document.getElementById('herbs-list').textContent = 'Failed to load herbs. Please try again later.';
        });

    //FETCH TEA RECIPES DATA
    fetch('./data/tearecipes.json')
        .then(response => {
            console.log(`Recipes fetch response: ${response.status} ${response.statusText}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Tea Recipes data loaded successfully:', data);
            recipesData = data; // store globally

            // DOM Elements for recipes
            const tasteList = document.getElementById('recipe-taste'); // Categories header
            const recipeList = document.getElementById('recipes-list'); // List of recipe names
            const recipeDetails = document.getElementById('recipe-details'); // Details container
            const recipeName = document.getElementById('recipe-name'); // Recipe name
            const recipeIngredients = document.getElementById('recipe-ingredients'); // Ingredients list
            const recipeInstructions = document.getElementById('recipe-instructions'); // Instructions list

            // Function to display tea taste categories
            const displayTasteCategories = (categories) => {
                tasteList.innerHTML = ''; // Clear existing categories
                categories.forEach(category => {
                    const listItem = document.createElement('ul');
                    listItem.textContent = category.taste;
                    listItem.classList.add('recipe-taste');
                    listItem.addEventListener('click', () => {
                        displayRecipeNames(category.recipes, category.taste);
                    });
                    tasteList.appendChild(listItem);
                });
            };

            // Function to display recipe names for a selected category
            const displayRecipeNames = (recipes, categoryName) => {
                recipeList.innerHTML = ''; // Clear previous list
                recipeDetails.classList.add('hidden'); // Hide details until a recipe is clicked
                document.getElementById('recipes-list-title').textContent = `${categoryName} recipes`;
                recipes.forEach(recipe => {
                    const listItem = document.createElement('li');
                    listItem.textContent = recipe.name;
                    listItem.classList.add('recipe-name');
                    listItem.addEventListener('click', () => {
                        showRecipeDetails(recipe);
                    });
                    recipeList.appendChild(listItem);
                });
                document.getElementById('recipes-list-container').classList.remove('hidden');
            };

            // Function to display recipe details
            const showRecipeDetails = (recipe) => {
                recipeName.textContent = recipe.name;
                recipeIngredients.innerHTML = ''; // Clear previous ingredients
                recipeInstructions.innerHTML = ''; // Clear previous instructions
                recipe.ingredients.forEach(ingredient => {
                    const ingredientItem = document.createElement('li');
                    ingredientItem.textContent = ingredient;
                    recipeIngredients.appendChild(ingredientItem);
                });
                recipe.instructions.forEach(instruction => {
                    const instructionItem = document.createElement('li');
                    instructionItem.textContent = instruction;
                    recipeInstructions.appendChild(instructionItem);
                });
                recipeDetails.classList.remove('hidden');
            };

            // Display all tea taste categories initially
            displayTasteCategories(recipesData.categories);

            // Add search functionality for recipes (on input)
            searchBar.addEventListener('input', (event) => {
                const searchTerm = event.target.value.toLowerCase();
                let filteredRecipes = [];
                recipesData.categories.forEach(category => {
                    category.recipes.forEach(recipe => {
                        if (recipe.name.toLowerCase().includes(searchTerm)) {
                            filteredRecipes.push(recipe);
                        }
                    });
                });
                displayRecipeNames(filteredRecipes, "Search Results");
            });
        })
        .catch(error => {
            console.error('Error loading tearecipes.json:', error);
            document.getElementById('recipes-list').textContent = 'Failed to load recipes. Please try again later.';
        });

    //FETCH HEALTH CONDITIONS DAT
    fetch('./data/healthconditions.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Health Conditions data loaded successfully:', data);
            window.healthData = data; // Store globally

            //DOM Elements for Health & Herbs
            const conditionsList = document.getElementById('condition-list');
            const healthyTeaListContainer = document.getElementById('healthy-tea-list-container');
            const nameList = document.getElementById('name-list');
            const teaDetails = document.getElementById('tea-details');
            const teaName = document.getElementById('tea-name');
            const teaIngredients = document.getElementById('tea-ingredients');
            const teaInstructions = document.getElementById('tea-instructions');
            const recipesHeader = document.getElementById('health-recipes-list-title');

            //Clear Health section
            conditionsList.innerHTML = "";
            nameList.innerHTML = "";
            recipesHeader.textContent = "";
            healthyTeaListContainer.classList.add('hidden');
            teaDetails.classList.add('hidden');

            //Function to display health conditions list
            const displayConditions = (conditions) => {
                conditionsList.innerHTML = "";
                conditions.forEach(conditionObj => {
                    const li = document.createElement('li');
                    li.textContent = conditionObj.condition;
                    li.classList.add('condition-item');
                    li.addEventListener('click', () => {
                        displayTeaNames(conditionObj.recipes, conditionObj.condition);
                    });
                    conditionsList.appendChild(li);
                });
            };

            //Function to display tea recipe names for a selected condition
            const displayTeaNames = (recipes, conditionName) => {
                nameList.innerHTML = "";
                teaDetails.classList.add('hidden');
                recipesHeader.textContent = conditionName + ' Recipes';
                recipes.forEach(recipe => {
                    const li = document.createElement('li');
                    li.textContent = recipe.name;
                    li.classList.add('tea-name');
                    li.addEventListener('click', () => {
                        showRecipeDetails(recipe);
                    });
                    nameList.appendChild(li);
                });
                healthyTeaListContainer.classList.remove('hidden');
            };

            //Function to display details of a selected recipe
            const showRecipeDetails = (recipe) => {
                teaName.textContent = recipe.name;
                teaIngredients.innerHTML = "";
                teaInstructions.innerHTML = "";
                recipe.ingredients.forEach(ingredient => {
                    const li = document.createElement('li');
                    li.textContent = ingredient;
                    teaIngredients.appendChild(li);
                });
                recipe.instructions.forEach(instruction => {
                    const li = document.createElement('li');
                    li.textContent = instruction;
                    teaInstructions.appendChild(li);
                });
                teaDetails.classList.remove('hidden');
            };

            //Display health conditions initially
            displayConditions(data.health_conditions);
        })
        .catch(error => {
            console.error('Error loading healthconditions.json:', error);
            document.getElementById('condition-list').textContent = 'Failed to load health conditions. Please try again later.';
        });

    // Navigation Bar Functionality
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                document.querySelectorAll('.content-section').forEach(section => {
                    section.classList.remove('active');
                    section.classList.add('hidden');
                });
                targetElement.classList.remove('hidden');
                targetElement.classList.add('active');
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    // Auth System
    // DOM Elements for Auth
    const authOverlay = document.getElementById('auth-overlay');
    const authModal = document.getElementById('auth-modal');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const authButton = document.getElementById('auth-button');
    const closeBtn = document.querySelector('.close');
    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');

    // Show modal when login button is clicked
    authButton.addEventListener('click', () => {
        // Reset to login view by removing inline display styles and using hidden class
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        authOverlay.classList.remove('hidden');
    });

    // Close modal using the hidden class
    closeBtn.addEventListener('click', () => {
        authOverlay.classList.add('hidden');
    });

    // Switch between forms
    showSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    });

    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    // Login functionality
    document.getElementById('login-submit').addEventListener('click', async (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email-input').value;
        const password = document.getElementById('login-password-input').value;

        try {
            const response = await fetch('./data/data.json');
            const data = await response.json();

            const user = data.users.find(u => u.email === email);

            if (user && user.password === hashPassword(password)) {
                currentUser = user;
                // Hide entire overlay
                authOverlay.classList.add('hidden');
                updateAuthUI();
                alert('Login successful!');
            } else {
                alert('Invalid email or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        }
    });

    // Signup functionality
    document.getElementById('signup-submit').addEventListener('click', async (e) => {
        e.preventDefault();

        const username = document.getElementById('signup-username-input').value;
        const email = document.getElementById('signup-email-input').value;
        const password = document.getElementById('signup-password-input').value;
        const confirmPassword = document.getElementById('signup-confirm-password-input').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch('./data/data.json');
            const data = await response.json();

            if (data.users.some(u => u.email === email)) {
                alert('Email already registered!');
                return;
            }

            if (data.users.some(u => u.id === username)) {
                alert('Username already taken!');
                return;
            }

            const newUser = {
                id: username,
                email: email,
                password: hashPassword(password),
                favorites: []
            };

            data.users.push(newUser);
            // (In a real app, send update to server)

            currentUser = newUser;
            authOverlay.classList.add('hidden');
            updateAuthUI();
            alert('Account created successfully!');

            // Clear signup form fields
            document.getElementById('signup-username-input').value = '';
            document.getElementById('signup-email-input').value = '';
            document.getElementById('signup-password-input').value = '';
            document.getElementById('signup-confirm-password-input').value = '';

            // Optionally prefill login form
            document.getElementById('login-email-input').value = email;
        } catch (error) {
            console.error('Signup error:', error);
            alert('Signup failed. Please try again.');
        }
    });

    // Update UI based on auth state
    function updateAuthUI() {
        if (currentUser) {
            authButton.textContent = currentUser.id;
        } else {
            authButton.textContent = 'Login';
        }
    }

    // Simple password hashing (demo only)
    function hashPassword(password) {
        return password.split('').reverse().join('') + 'salt';
    }

    // End of DOMContentLoaded


//User saved favorites
function saveFavorite(item, type)
{
    const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    if (!favorites[type]) favorites[type] = [];
    favorites[type].push(item); localStorage.setItem('favorites', JSON.stringify(favorites));
}
// Simple Chatbot
// Toggle Chatbot Collapsible Functionality
    document.getElementById('toggle-chat').addEventListener('click', () => {
        // Reset the chat messages and clear the user input
        document.getElementById('chat-messages').innerHTML = "";
        document.getElementById('user-input').value = "";

        // Toggle the chat container's visibility
        const chatContainer = document.getElementById('chat-container');
        const toggleButton = document.getElementById('toggle-chat');
        const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
        chatContainer.style.display = isExpanded ? 'none' : 'block';
        toggleButton.setAttribute('aria-expanded', !isExpanded);
    });


// Chatbot Implementation
    const chatbot = {
        responses: {
            "hello": "Hi! How can I help you with herbs or tea recipes today?"
            // You can add more fixed responses if needed
        },
        // Check herbs for a matching name
        getHerbInfo: function (input) {
            input = input.toLowerCase();
            for (let herb of herbsData) {
                if (herb.name.toLowerCase().includes(input)) {
                    return `Info about ${herb.name}: ${herb.description}`;
                }
            }
            return null;
        },
        // Check tea recipes for a matching name
        getTeaRecipeInfo: function (input) {
            input = input.toLowerCase();
            // Assuming recipesData.categories is an array where each category has a 'recipes' array
            for (let category of recipesData.categories) {
                for (let recipe of category.recipes) {
                    if (recipe.name.toLowerCase().includes(input)) {
                        return `Recipe for ${recipe.name}: ${recipe.instructions}`;
                    }
                }
            }
            return null;
        },
        getResponse: function (input) {
            input = input.toLowerCase();

            // First, try to find a matching herb
            let herbInfo = this.getHerbInfo(input);
            if (herbInfo) return herbInfo;

            // If no herb was found, try to find a matching tea recipe
            let teaRecipeInfo = this.getTeaRecipeInfo(input);
            if (teaRecipeInfo) return teaRecipeInfo;

            // Fallback to fixed responses
            for (const [keyword, response] of Object.entries(this.responses)) {
                if (input.includes(keyword)) {
                    return response;
                }
            }

            return "I'm not sure. Try asking about herbs or tea recipes.";
        }
    };

    document.getElementById('send-btn').addEventListener('click', () => {
        const userInputElement = document.getElementById('user-input');
        const input = userInputElement.value;

        if (input.trim() === "") return; // Skip if empty

        const response = chatbot.getResponse(input);

        document.getElementById('chat-messages').innerHTML += `
    <p><strong>You:</strong> ${input}</p>
    <p><strong>Bot:</strong> ${response}</p>
  `;

        // Clear the input after sending
        userInputElement.value = "";
    });


});

