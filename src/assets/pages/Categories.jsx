import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard.jsx';
import recipesData from '../data/Recipes.json';
import '../css/Categories.css';

export default function Categories({ favourites, addToFavourites, removeFromFavourites }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [ingredientSearch, setIngredientSearch] = useState('');
    const [selectedDiet, setSelectedDiet] = useState('all');
    const [minCalories, setMinCalories] = useState('');
    const [maxCalories, setMaxCalories] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedAllergy, setSelectedAllergy] = useState('all');

    const [filteredRecipes, setFilteredRecipes] = useState(recipesData);

    const [calcIngredients, setCalcIngredients] = useState('');
    const [calculatedNutrition, setCalculatedNutrition] = useState(null);

    const [showMoreFilters, setShowMoreFilters] = useState(false);

    const allCategories = ['breakfast', 'lunch', 'dinner', 'snacks', 'smoothies'];

    const categoryDisplayNames = {
        'breakfast': 'Breakfast Delights',
        'lunch': 'Lunch Specials',
        'dinner': 'Dinner Inspirations',
        'snacks': 'Healthy Snacks',
        'smoothies': 'Refreshing Smoothies',
    };

    const allAllergies = ['Gluten-Free', 'Dairy-Free', 'Nut-Free'];

    const location = useLocation();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [location.hash]);

    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const lowercasedIngredientSearch = ingredientSearch.toLowerCase();

        const newFilteredRecipes = recipesData.filter(recipe => {
            const matchesSearchTerm = lowercasedSearchTerm === '' ||
                recipe.title.toLowerCase().includes(lowercasedSearchTerm);

            const matchesIngredient = lowercasedIngredientSearch === '' ||
                (recipe.ingredients && recipe.ingredients.some(ingredient =>
                    ingredient.toLowerCase().includes(lowercasedIngredientSearch)
                ));

            const matchesDiet = selectedDiet === 'all' ||
                (Array.isArray(recipe.diet) && recipe.diet.some(d => d.toLowerCase() === selectedDiet.toLowerCase()));

            const matchesCalories = (minCalories === '' || recipe.calories >= parseInt(minCalories)) &&
                (maxCalories === '' || recipe.calories <= parseInt(maxCalories));

            const matchesCategory = selectedCategory === 'all' ||
                recipe.category.toLowerCase() === selectedCategory.toLowerCase();

            const matchesAllergy = selectedAllergy === 'all' ||
                (Array.isArray(recipe.diet) && recipe.diet.some(d => d.toLowerCase().includes(selectedAllergy.toLowerCase())));

            return matchesSearchTerm && matchesIngredient && matchesDiet && matchesCalories && matchesCategory && matchesAllergy;
        });
        setFilteredRecipes(newFilteredRecipes);

    }, [searchTerm, ingredientSearch, selectedDiet, minCalories, maxCalories, selectedCategory, selectedAllergy]);

    const handleSearchTermChange = (e) => setSearchTerm(e.target.value);
    const handleIngredientSearchChange = (e) => setIngredientSearch(e.target.value);
    const handleDietChange = (e) => setSelectedDiet(e.target.value);
    const handleMinCaloriesChange = (e) => setMinCalories(e.target.value);
    const handleMaxCaloriesChange = (e) => setMaxCalories(e.target.value);
    const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
    const handleAllergyChange = (e) => setSelectedAllergy(e.target.value);

    const getRecipesByCategory = (category) => {
        return filteredRecipes.filter(recipe => recipe.category === category);
    };

    const uniqueDiets = [...new Set(recipesData.flatMap(recipe => recipe.diet || []).filter(Boolean))];

    const handleCalcIngredientsChange = (e) => {
        setCalcIngredients(e.target.value);
    };

    const calculateNutrition = () => {
        const inputIngredients = calcIngredients.toLowerCase().split(',').map(item => item.trim());
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarb = 0;
        let totalFats = 0;

        recipesData.forEach(recipe => {
            const recipeIngredients = recipe.ingredients.map(ing => ing.toLowerCase());
            const hasCommonIngredient = inputIngredients.some(inputIng =>
                recipeIngredients.some(recIng => recIng.includes(inputIng))
            );

            if (hasCommonIngredient) {
                totalCalories += recipe.calories || 0;
                totalProtein += 10;
                totalCarb += 15;
                totalFats += 5;
            }
        });

        setCalculatedNutrition({
            calories: totalCalories,
            protein: totalProtein,
            carb: totalCarb,
            fats: totalFats,
        });
    };

    const toggleShowMoreFilters = () => {
        setShowMoreFilters(prev => !prev);
    };

    return (
        <div className="categories-page">
            <section className="container mb-5 mt-5 p-4 bg-light rounded-3 shadow-sm filter-section">
                <h3 className="mb-4">Search and Filter Recipes</h3>

                <div className="row g-4 align-items-end mb-4">
                    <div className="col-md-4">
                        <label htmlFor="keywordSearch" className="form-label">By Keyword</label>
                        <input
                            type="text"
                            className="form-control rounded-5 px-4 py-2"
                            id="keywordSearch"
                            placeholder="e.g. chicken, salad"
                            value={searchTerm}
                            onChange={handleSearchTermChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="ingredientSearch" className="form-label">By Ingredient</label>
                        <input
                            type="text"
                            className="form-control rounded-5 px-4 py-2"
                            id="ingredientSearch"
                            placeholder="e.g. rice, avocado, tomato"
                            value={ingredientSearch}
                            onChange={handleIngredientSearchChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="dietType" className="form-label">By Diet Type</label>
                        <select
                            className="form-select rounded-5 px-4 py-2"
                            id="dietType"
                            value={selectedDiet}
                            onChange={handleDietChange}
                        >
                            <option value="all">All</option>
                            {uniqueDiets.map((dietItem, index) => (
                                <option key={index} value={dietItem.toLowerCase()}>{dietItem}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={`filter-collapse-content ${showMoreFilters ? 'expanded' : 'collapsed'}`}>
                    <div className="row g-4 align-items-end">
                        <div className="col-md-6">
                            <label htmlFor="minCalories" className="form-label">Calories (Min)</label>
                            <input
                                type="number"
                                className="form-control rounded-5 px-4 py-2"
                                id="minCalories"
                                placeholder="From"
                                value={minCalories}
                                onChange={handleMinCaloriesChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="maxCalories" className="form-label">Calories (Max)</label>
                            <input
                                type="number"
                                className="form-control rounded-5 px-4 py-2"
                                id="maxCalories"
                                placeholder="To"
                                value={maxCalories}
                                onChange={handleMaxCaloriesChange}
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="mealType" className="form-label">By Meal Type</label>
                            <select
                                className="form-select rounded-5 px-4 py-2"
                                id="mealType"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                            >
                                <option value="all">All</option>
                                {allCategories.map((category, index) => (
                                    <option key={index} value={category.toLowerCase()}>{categoryDisplayNames[category]}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="allergyType" className="form-label">By Allergy</label>
                            <select
                                className="form-select rounded-5 px-4 py-2"
                                id="allergyType"
                                value={selectedAllergy}
                                onChange={handleAllergyChange}
                            >
                                <option value="all">None</option>
                                {allAllergies.map((allergy, index) => (
                                    <option key={index} value={allergy.toLowerCase()}>{allergy}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <button
                        className="btn btn-link text-decoration-none p-0 filter-toggle-button"
                        onClick={toggleShowMoreFilters}
                        aria-expanded={showMoreFilters}
                        aria-controls="filterCollapseContent"
                    >
                        <i className={`bi bi-chevron-down me-2 ${showMoreFilters ? 'rotate-up' : ''}`}></i>
                        {showMoreFilters ? 'Hide Filters' : 'Show More Filters'}
                    </button>
                </div>
            </section>

            <div className="container">
                {filteredRecipes.length > 0 ? (
                    <>
                        {allCategories.map(category => {
                            const recipesForCategory = getRecipesByCategory(category);
                            if (recipesForCategory.length > 0) {
                                const displayCategory = categoryDisplayNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
                                return (
                                    <section className="container mb-5" key={category}>
                                        <h3 className="mb-4" id={`${category}-title`}>{displayCategory}</h3>
                                        <div className="row g-4">
                                            {recipesForCategory.map((recipe, index) => (
                                                <div className="col-md-3" key={index}>
                                                    <RecipeCard
                                                        {...recipe}
                                                        favourites={favourites}
                                                        addToFavourites={addToFavourites}
                                                        removeFromFavourites={removeFromFavourites}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                );
                            }
                            return null;
                        })}
                    </>
                ) : (
                    <section className="container mb-5 text-center">
                        <p className="lead">No recipes found matching your search criteria.</p>
                    </section>
                )}
            </div>

            <section className="container mb-5 p-4 bg-light rounded-3 shadow-sm">
                <h3 className="mb-4">Nutrition Calculator</h3>
                <div className="row g-4">
                    <div className="col-md-8">
                        <label htmlFor="calcIngredients" className="form-label">Enter Ingredients (comma-separated)</label>
                        <textarea
                            className="form-control rounded-3 px-4 py-2"
                            id="calcIngredients"
                            rows="3"
                            placeholder="e.g. chicken breast 200g, rice 100g, broccoli 150g"
                            value={calcIngredients}
                            onChange={handleCalcIngredientsChange}
                        ></textarea>
                        <button className="btn btn-primary mt-3 rounded-pill px-4 py-2" onClick={calculateNutrition}>
                            Calculate Nutrition
                        </button>
                    </div>
                    <div className="col-md-4">
                        {calculatedNutrition && (
                            <div className="bg-white rounded-3 p-4 shadow-sm">
                                <h5 className="mb-3">Estimated Nutrition Values:</h5>
                                <p className="mb-1"><strong>Calories:</strong> {calculatedNutrition.calories} kcal</p>
                                <p className="mb-1"><strong>Protein:</strong> {calculatedNutrition.protein} g</p>
                                <p className="mb-1"><strong>Carbs:</strong> {calculatedNutrition.carb} g</p>
                                <p className="mb-1"><strong>Fats:</strong> {calculatedNutrition.fats} g</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
