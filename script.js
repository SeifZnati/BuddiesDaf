const bowl = [];
const menu = [];
const discoveredSecretDishes = new Set();

// Get all menu items and their dish names
const menuItems = document.querySelectorAll('.menu-item');
const menuDishNames = Array.from(menuItems).map(item => item.getAttribute('data-dish'));

// Filter validCombinations to only include dishes that are in the menu
const validCombinations = {
    'Spritz': {
        required: ['Alcohol'],
        forbidden: ['Tomato', 'Potato', 'Chicken']
    },
    'Bruschetta': {
        required: ['Bread', 'Tomato', 'Basil'],
        forbidden: ['Parmesan', 'Chicken', 'Potato']
    },
    'Brik': {
        required: ['Dough', 'Egg', 'Tuna'],
        forbidden: ['Bread', 'Pasta']
    },
    'Italian Pasta': {
        required: ['Tomato Sauce', 'Basil', 'Parmesan'],
        optional: ['Chicken'],
        forbidden: ['Potato', 'Rice', 'Bread']
    },
    'Ravioli': {
        required: ['Pasta Dough', 'Cheese', 'Tomato Sauce'],
        optional: ['Basil'],
        forbidden: ['Potato', 'Bread']
    },
    'Mloukhia': {
        required: ['Mloukhia Leaves', 'Meat', 'Onion', 'Garlic'],
        forbidden: ['Pasta', 'Rice', 'Cheese']
    },
    'Wine Combo': {
        required: ['Italian Wine', 'Tunisian Wine'],
        forbidden: ['Tomato', 'Bread', 'Pasta']
    },
    'Salad Mechweya': {
        required: ['Pepper', 'Tomato', 'Onion', 'Garlic'],
        forbidden: ['Cheese', 'Meat', 'Potato']
    },
    'Arancini': {
        required: ['Rice', 'Tomato Sauce', 'Oil'],
        optional: ['Cheese'],
        forbidden: ['Pasta', 'Bread']
    },
    'Zgougou': {
        required: ['Pine Nuts', 'Sugar', 'Cream'],
        forbidden: ['Coffee', 'Egg', 'Cheese']
    },
    'Tiramisu': {
        required: ['Coffee', 'Egg', 'Mascarpone Cream', 'Biscuits'],
        forbidden: ['Tomato', 'Potato']
    },
    'Paella': {
        required: ['Rice', 'Saffron', 'Chicken', 'Seafood', 'Tomato'],
        forbidden: ['Bread', 'Cheese', 'Pasta']
    },
    'Koshari': {
        required: ['Rice', 'Lentils', 'Pasta', 'Tomato Sauce', 'Onion'],
        forbidden: ['Cheese', 'Meat']
    },
    'Turkish Kebab': {
        required: ['Meat', 'Pepper', 'Onion'],
        forbidden: ['Cheese', 'Potato']
    },
    'Tacos': {
        required: ['Tortilla', 'Meat', 'Onion', 'Tomato', 'Chili'],
        forbidden: ['Cheese', 'Potato']
    },
    'Guacamole with Chips': {
        required: ['Avocado', 'Onion', 'Tomato', 'Lime'],
        forbidden: ['Meat', 'Cheese', 'Bread']
    }
};

// Filter out dishes that aren't in the menu
Object.keys(validCombinations).forEach(dish => {
    if (!menuDishNames.includes(dish)) {
        delete validCombinations[dish];
    }
});

// Dish definitions with their ingredient requirements
const dishDefinitions = {
    // Aperitifs
    'Spritz': {
        required: ['Alcohol'],
        forbidden: ['Tomato', 'Potato', 'Chicken']
    },
    'Bruschetta': {
        required: ['Bread', 'Tomato', 'Basil'],
        forbidden: ['Parmesan', 'Chicken', 'Potato']
    },
    'Brik': {
        required: ['Dough', 'Egg', 'Tuna'],
        forbidden: ['Bread', 'Pasta']
    },

    // Pasta
    'Italian Pasta': {
        required: ['Tomato Sauce', 'Basil', 'Parmesan'],
        optional: ['Chicken'],
        forbidden: ['Potato', 'Rice', 'Bread']
    },
    'Ravioli': {
        required: ['Pasta Dough', 'Cheese', 'Tomato Sauce'],
        optional: ['Basil'],
        forbidden: ['Potato', 'Bread']
    },
    'Mloukhia': {
        required: ['Mloukhia Leaves', 'Meat', 'Onion', 'Garlic'],
        forbidden: ['Pasta', 'Rice', 'Cheese']
    },
    'Wine Combo': {
        required: ['Italian Wine', 'Tunisian Wine'],
        forbidden: ['Tomato', 'Bread', 'Pasta']
    },

    // Salad and rice balls
    'Salad Mechweya': {
        required: ['Pepper', 'Tomato', 'Onion', 'Garlic'],
        forbidden: ['Cheese', 'Meat', 'Potato']
    },
    'Arancini': {
        required: ['Rice', 'Tomato Sauce', 'Oil'],
        optional: ['Cheese'],
        forbidden: ['Pasta', 'Bread']
    },

    // Dessert
    'Zgougou': {
        required: ['Pine Nuts', 'Sugar', 'Cream'],
        forbidden: ['Coffee', 'Egg', 'Cheese']
    },
    'Tiramisu': {
        required: ['Coffee', 'Egg', 'Mascarpone Cream', 'Biscuits'],
        forbidden: ['Tomato', 'Potato']
    },

    // Hidden dishes
    'Paella': {
        required: ['Rice', 'Saffron', 'Chicken', 'Seafood', 'Tomato'],
        forbidden: ['Bread', 'Cheese', 'Pasta']
    },
    'Koshari': {
        required: ['Rice', 'Lentils', 'Pasta', 'Tomato Sauce', 'Onion'],
        forbidden: ['Cheese', 'Meat']
    },
    'Turkish Kebab': {
        required: ['Meat', 'Pepper', 'Onion'],
        forbidden: ['Cheese', 'Potato']
    },
    'Tacos': {
        required: ['Tortilla', 'Meat', 'Onion', 'Tomato', 'Chili'],
        forbidden: ['Cheese', 'Potato']
    },
    'Guacamole with Chips': {
        required: ['Avocado', 'Onion', 'Tomato', 'Lime'],
        forbidden: ['Meat', 'Cheese', 'Bread']
    }
};

function addToBowl(ingredient) {
    bowl.push(ingredient);
    displayBowl();
    checkSecretCode();
    // Only show progress if secret code wasn't activated
    if (bowl.length > 0) {
        showPossibleCombinations();
    }
}

function displayBowl() {
    const bowlDiv = document.getElementById('bowlContents');
    const clearBtn = document.getElementById('clearBtn');
    bowlDiv.innerHTML = "";

    if (bowl.length === 0) {
        bowlDiv.innerHTML = "Nothing added yet.";
        clearBtn.style.display = 'none';
        return;
    }

    clearBtn.style.display = 'inline-block';
    bowl.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "bowl-item";
        itemDiv.innerHTML = `${item} <span class="remove-x">❌</span>`;
        itemDiv.onclick = () => removeFromBowl(index);
        bowlDiv.appendChild(itemDiv);
    });
}

function removeFromBowl(index) {
    bowl.splice(index, 1);
    displayBowl();
    // Update progress bars after removing an ingredient
    if (bowl.length > 0) {
        showPossibleCombinations();
    } else {
        document.getElementById('result').innerHTML = '';
    }
}

function checkCombination(ingredients) {
    for (const [dish, recipe] of Object.entries(validCombinations)) {
        const { required, optional = [], forbidden } = recipe;

        // Check if all required ingredients are present
        if (!hasAllRequired(ingredients, required)) {
            continue;
        }

        // Check if any forbidden ingredients are present
        if (hasForbidden(ingredients, forbidden)) {
            continue;
        }

        // Check if there are any extra ingredients not in required or optional
        if (hasExtraIngredients(ingredients, required, optional)) {
            continue;
        }

        // If we get here, we have a match!
        return { success: true, dish: dish };
    }
    return { success: false };
}

function addToMenu(dish) {
    if (!menu.includes(dish)) {
        menu.push(dish);
        const menuItem = document.querySelector(`.menu-item[data-dish="${dish}"]`);
        if (menuItem) {
            menuItem.classList.add('discovered');
            updateMenuProgress();
        }
    }
}

function displayMenu() {
    const menuDiv = document.getElementById('menuItems');
    
    // Only initialize the menu structure if it's empty
    if (menuDiv.children.length === 0) {
        menuDiv.innerHTML = `
            <div class="menu-section">
                <h3>Aperitif</h3>
                <div class="menu-item" data-dish="Spritz">Spritz</div>
                <div class="menu-item" data-dish="Bruschetta">Bruschetta</div>
                <div class="menu-item" data-dish="Brik">Brik</div>
            </div>

            <div class="menu-section">
                <h3>Pasta</h3>
                <div class="menu-item" data-dish="Italian Pasta">Italian Pasta</div>
                <div class="menu-item" data-dish="Ravioli">Ravioli</div>
                <div class="menu-item" data-dish="Mloukhia">Mloukhia</div>
                <div class="menu-item" data-dish="Wine Combo">Wine Combo</div>
            </div>

            <div class="menu-section">
                <h3>Salad and Rice Balls</h3>
                <div class="menu-item" data-dish="Salad Mechweya">Salad Mechweya</div>
                <div class="menu-item" data-dish="Arancini">Arancini</div>
            </div>

            <div class="menu-section">
                <h3>Dessert</h3>
                <div class="menu-item" data-dish="Zgougou">Zgougou</div>
                <div class="menu-item" data-dish="Tiramisu">Tiramisu</div>
            </div>

            <div class="menu-section secret-menu" style="display: none;">
                <h3>Secret Menu <span class="secret-counter">(0/5 discovered)</span></h3>
                <div class="menu-item secret-item" data-dish="Paella">Paella (Spanish)</div>
                <div class="menu-item secret-item" data-dish="Koshari">Koshari (Egyptian)</div>
                <div class="menu-item secret-item" data-dish="Turkish Kebab">Turkish Kebab (Turkish)</div>
                <div class="menu-item secret-item" data-dish="Tacos">Tacos (Mexican)</div>
                <div class="menu-item secret-item" data-dish="Guacamole with Chips">Guacamole with Chips (Mexican)</div>
            </div>
        `;

        // Initialize all menu items as blurred
        const menuItems = menuDiv.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.classList.remove('discovered');
        });
    }

    // Update discovered items
    menu.forEach(dish => {
        const menuItem = document.querySelector(`.menu-item[data-dish="${dish}"]`);
        if (menuItem) {
            menuItem.classList.add('discovered');
        }
    });
}

function removeFromMenu(index) {
    menu.splice(index, 1);
    displayMenu();
}

function updateSecretMenuCounter() {
    const counter = document.querySelector('.secret-counter');
    counter.textContent = `(${discoveredSecretDishes.size}/5 discovered)`;
}

function revealSecretDish(dish) {
    if (discoveredSecretDishes.has(dish)) return;
    
    discoveredSecretDishes.add(dish);
    const secretMenu = document.querySelector('.secret-menu');
    const secretItem = document.querySelector(`.secret-item[data-dish="${dish}"]`);
    
    if (secretItem) {
        secretItem.classList.add('discovered');
    }
    
    if (discoveredSecretDishes.size === 1) {
        secretMenu.style.display = 'block';
    }
    
    updateSecretMenuCounter();
    updateMenuProgress();
}

function mixIngredients() {
    const resultDiv = document.getElementById('result');
    const result = checkCombination(bowl);
    
    if (result.success) {
        const dish = result.dish;
        addToMenu(dish);
        
        // Check if it's a secret dish
        const secretItem = document.querySelector(`.secret-item[data-dish="${dish}"]`);
        if (secretItem) {
            revealSecretDish(dish);
        }
        
        resultDiv.innerHTML = `Success! You created ${dish}! 🎉`;
        resultDiv.style.color = '#06A49C';
    } else {
        const trashItem = getRandomTrashItem();
        resultDiv.innerHTML = `Oops! You created ${trashItem} 🗑️`;
        resultDiv.style.color = '#e74c3c';
    }
    
    clearBowl();
}

// Helper function to check if all required ingredients are present
function hasAllRequired(ingredients, required) {
    return required.every(ing => ingredients.includes(ing));
}

// Helper function to check if any forbidden ingredients are present
function hasForbidden(ingredients, forbidden) {
    return forbidden.some(ing => ingredients.includes(ing));
}

// Helper function to check if there are any extra ingredients not in required or optional
function hasExtraIngredients(ingredients, required, optional = []) {
    const allowedIngredients = [...required, ...optional];
    return ingredients.some(ing => !allowedIngredients.includes(ing));
}

// Helper function to get a random trash item
function getRandomTrashItem() {
    const trashItems = ['Plastic Bag', 'Trash Can', 'Broken Plate', 'Dirty Spoon'];
    return trashItems[Math.floor(Math.random() * trashItems.length)];
}

function getDishResult(ingredients) {
    let bestMatch = null;
    let bestMatchScore = -1;
    let bestMatchMissing = [];
    let bestMatchExtra = [];

    // Check each dish definition
    for (const [dishName, definition] of Object.entries(dishDefinitions)) {
        const { required, optional = [], forbidden } = definition;

        // Check if any forbidden ingredients are present
        if (hasForbidden(ingredients, forbidden)) {
            continue;
        }

        // Calculate how many required ingredients are missing
        const missingIngredients = required.filter(ing => !ingredients.includes(ing));
        
        // Calculate how many extra ingredients are present
        const allowedIngredients = [...required, ...optional];
        const extraIngredients = ingredients.filter(ing => !allowedIngredients.includes(ing));

        // Calculate a score for this match (higher is better)
        const score = required.length - missingIngredients.length - extraIngredients.length;

        // If this is the best match so far, save it
        if (score > bestMatchScore) {
            bestMatchScore = score;
            bestMatch = dishName;
            bestMatchMissing = missingIngredients;
            bestMatchExtra = extraIngredients;
        }
    }

    // If we found a match
    if (bestMatch) {
        // Perfect match
        if (bestMatchMissing.length === 0 && bestMatchExtra.length === 0) {
            return { type: 'success', dish: bestMatch };
        }
        
        // Close match
        if (bestMatchMissing.length <= 2 && bestMatchExtra.length <= 2) {
            return { 
                type: 'close', 
                dish: bestMatch,
                missing: bestMatchMissing,
                extra: bestMatchExtra
            };
        }
    }

    // Check if the combination is extremely bad
    const extremelyBadCombinations = [
        // Mixing sweet and savory
        ['Coffee', 'Tomato', 'Chicken'],
        ['Sugar', 'Meat', 'Cream'],
        // Mixing drinks with food
        ['Alcohol', 'Pasta', 'Cheese'],
        ['Italian Wine', 'Rice', 'Chicken'],
        // Mixing desserts with main dishes
        ['Biscuits', 'Meat', 'Tomato'],
        ['Cream', 'Garlic', 'Chicken'],
        // Mixing incompatible ingredients
        ['Coffee', 'Garlic', 'Cream'],
        ['Alcohol', 'Egg', 'Cream'],
        ['Wine', 'Milk', 'Meat']
    ];

    const isExtremelyBad = extremelyBadCombinations.some(badCombo => 
        badCombo.every(ing => ingredients.includes(ing))
    );

    if (isExtremelyBad) {
        return { type: 'trash', item: getRandomTrashItem() };
    }

    // If we get here, it's not a good match but not extremely bad either
    return { 
        type: 'bad',
        message: bestMatch ? 
            `Almost ${bestMatch}! Try ${bestMatchMissing.length > 0 ? 'adding ' + bestMatchMissing.join(', ') : ''}${bestMatchMissing.length > 0 && bestMatchExtra.length > 0 ? ' and ' : ''}${bestMatchExtra.length > 0 ? 'removing ' + bestMatchExtra.join(', ') : ''}` :
            "This combination doesn't make sense. Try different ingredients!"
    };
}

function clearBowl() {
    bowl.length = 0; // Clear the bowl array
    displayBowl(); // Update the display
    document.getElementById('result').innerHTML = ''; // Clear the progress bars
}

function showPossibleCombinations(ingredient) {
    const resultDiv = document.getElementById('result');
    
    // Clear progress bars if bowl is empty
    if (bowl.length === 0) {
        resultDiv.innerHTML = '';
        return;
    }

    let possibleDishes = [];
    let dishProgress = new Map();

    // Check each dish definition
    for (const [dishName, definition] of Object.entries(validCombinations)) {
        const { required, optional = [], forbidden } = definition;
        
        // Skip if any forbidden ingredients are in the bowl
        if (bowl.some(ing => forbidden.includes(ing))) {
            continue;
        }

        // Calculate progress for this dish
        const totalRequired = required.length;
        const currentProgress = required.filter(ing => bowl.includes(ing)).length;
        
        // Only show if we have at least one required ingredient and no extra ingredients
        const allowedIngredients = [...required, ...optional];
        const hasExtraIngredients = bowl.some(ing => !allowedIngredients.includes(ing));
        
        if (currentProgress > 0 && !hasExtraIngredients) {
            possibleDishes.push(dishName);
            dishProgress.set(dishName, {
                current: currentProgress,
                total: totalRequired
            });
        }
    }

    // Display the results
    if (possibleDishes.length > 0) {
        let message = `<div class="progress-container">`;
        possibleDishes.forEach(dish => {
            const progress = dishProgress.get(dish);
            const percentage = (progress.current / progress.total) * 100;
            message += `
                <div class="dish-progress">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${percentage}%"></div>
                    </div>
                    <div class="progress-text">${progress.current}/${progress.total}</div>
                </div>`;
        });
        message += `</div>`;
        resultDiv.innerHTML = message;
        resultDiv.style.color = '#06A49C';
    } else {
        resultDiv.innerHTML = '';
    }
}

// Update all dish definitions to include salt and pepper as optional
Object.keys(validCombinations).forEach(dish => {
    if (!validCombinations[dish].optional) {
        validCombinations[dish].optional = [];
    }
    validCombinations[dish].optional.push('Salt', 'Pepper');
});

// Update dishDefinitions to match
Object.keys(dishDefinitions).forEach(dish => {
    if (!dishDefinitions[dish].optional) {
        dishDefinitions[dish].optional = [];
    }
    dishDefinitions[dish].optional.push('Salt', 'Pepper');
});

// Example usage:
const result = getDishResult(['Bread', 'Tomato', 'Basil']); // Returns "Bruschetta"
const trash = getDishResult(['Bread', 'Tomato', 'Basil', 'Chicken']); // Returns a random trash item

function checkSecretCode() {
    const secretIngredients = ['Sugar', 'Egg', 'Dough', 'Avocado'];
    const hasAllSecretIngredients = secretIngredients.every(ing => bowl.includes(ing));
    
    if (hasAllSecretIngredients) {
        // Reveal all menu items
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.classList.add('discovered');
        });
        
        // Show secret menu
        const secretMenu = document.querySelector('.secret-menu');
        if (secretMenu) {
            secretMenu.style.display = 'block';
        }
        
        // Add all dishes to menu array
        menuItems.forEach(item => {
            const dishName = item.getAttribute('data-dish');
            if (!menu.includes(dishName)) {
                menu.push(dishName);
            }
        });
        
        // Update secret counter
        const secretItems = document.querySelectorAll('.secret-item');
        secretItems.forEach(item => {
            const dishName = item.getAttribute('data-dish');
            discoveredSecretDishes.add(dishName);
        });
        updateSecretMenuCounter();
        
        // Update progress bar to show 100% + secret items
        const menuProgressDiv = document.getElementById('menuProgress');
        if (menuProgressDiv) {
            const progressHTML = `
                <div class="menu-progress-container">
                    <div class="menu-progress-bar">
                        <div class="menu-progress-fill" style="width: 100%"></div>
                        <div class="menu-progress-secret" style="width: 100%"></div>
                    </div>
                    <div class="menu-progress-text">
                        100% Complete
                        <span class="secret-progress">+5 Secret</span>
                    </div>
                </div>
            `;
            menuProgressDiv.innerHTML = progressHTML;
        }
        
        // Show special message
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = '<div class="secret-reveal">✨ Secret Menu Unlocked! ✨</div>';
        resultDiv.style.color = '#ffb74d';
        
        // Clear the bowl
        clearBowl();
    }
}

// Add CSS for secret reveal
const style = document.createElement('style');
style.textContent = `
    .secret-reveal {
        animation: secretReveal 1.5s ease-out;
        font-size: 24px;
        text-align: center;
        padding: 20px;
    }
    
    @keyframes secretReveal {
        0% { transform: scale(0.5); opacity: 0; }
        50% { transform: scale(1.2); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(style);

function updateMenuProgress() {
    const regularMenuItems = document.querySelectorAll('.menu-item:not(.secret-item)');
    const totalRegularDishes = regularMenuItems.length;
    const discoveredRegularDishes = Array.from(regularMenuItems).filter(item => item.classList.contains('discovered')).length;
    const secretItems = document.querySelectorAll('.secret-item');
    const discoveredSecretDishes = Array.from(secretItems).filter(item => item.classList.contains('discovered')).length;
    
    // Calculate progress
    const regularProgress = Math.min(100, (discoveredRegularDishes / totalRegularDishes) * 100);
    const totalProgress = Math.min(200, ((discoveredRegularDishes + discoveredSecretDishes) / totalRegularDishes) * 100);
    const isOver100 = totalProgress > 100;
    
    const menuProgressDiv = document.getElementById('menuProgress');
    if (!menuProgressDiv) {
        const progressDiv = document.createElement('div');
        progressDiv.id = 'menuProgress';
        progressDiv.className = 'menu-progress';
        document.querySelector('.menu').insertBefore(progressDiv, document.querySelector('.menu-items'));
    }
    
    const progressHTML = `
        <div class="menu-progress-container">
            <div class="menu-progress-bar">
                <div class="menu-progress-fill" style="width: ${isOver100 ? '100%' : regularProgress + '%'}"></div>
                ${isOver100 ? `<div class="menu-progress-secret" style="width: ${totalProgress - 100}%"></div>` : ''}
            </div>
            <div class="menu-progress-text">
                ${Math.round(totalProgress)}% Complete
                ${discoveredSecretDishes > 0 ? `<span class="secret-progress">+${discoveredSecretDishes} Secret</span>` : ''}
            </div>
        </div>
    `;
    
    document.getElementById('menuProgress').innerHTML = progressHTML;
}

// Add initial progress update when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateMenuProgress();
});
