import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import recipesData from '../data/Recipes.json';
import RecipeCard from '../components/RecipeCard.jsx';

import timer from '../images/RecipeDetail/Timer.png';
import forkKnife from '../images/RecipeDetail/ForkKnife.png';
import RecipeNotFound from "../images/RecipeDetail/RecipeNotFound.svg";

const RecipeDetailComponent = ({ favourites, addToFavourites, removeFromFavourites }) => {
  const { title: recipeTitle } = useParams();
  const navigate = useNavigate();

  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');


  useEffect(() => {

    const decodedRecipeTitle = decodeURIComponent(recipeTitle).toLowerCase();

    const foundRecipe = recipesData.find(
      (recipe) => recipe.title.toLowerCase() === decodedRecipeTitle
    );
    setCurrentRecipe(foundRecipe);

    if (foundRecipe) {
      const filteredSimilar = recipesData.filter(
        (recipe) => recipe.category === foundRecipe.category && recipe.title !== foundRecipe.title
      ).slice(0, 4);
      setSimilarRecipes(filteredSimilar);
    } else {
      const randomRecipes = recipesData.sort(() => 0.5 - Math.random()).slice(0, 4);
      setSimilarRecipes(randomRecipes);
    }
  }, [recipeTitle, recipesData]);

  const recipeToDisplay = currentRecipe || {
    title: "Recipe Not Found",
    calories: "N/A",
    diet: "N/A",
    image: RecipeNotFound,
    ingredients: [],
    time: "N/A",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    protein: "N/A",
    carb: "N/A",
    fats: "N/A",
    preparations: []
  };

  const nutritionInfo = {
    calories: recipeToDisplay.calories,
    protein: recipeToDisplay.protein,
    carb: recipeToDisplay.carb,
    fats: recipeToDisplay.fats
  };

  const preparations = [
    { title: "Prepare Ingredients", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { title: "Cooking Process", description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
    { title: "Serving Suggestion", description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit." }
  ];

  const handleEmailSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email address is required.');
      setEmailSuccess('');
    } else if (!emailRegex.test(email)) {
      setEmailError('Email address is invalid.');
      setEmailSuccess('');
    } else {
      setEmailError('');
      setEmailSuccess("Thanks! We'll get in touch with you soon.");
      setEmail('');
    }
  };

  return (
    <>
      <header className="container-fluid">
        <div className='container'>
          <div className='d-flex justify-content-between align-items-center'>
            <div className='row w-100'>
              <div className="col-12 d-flex justify-content-between align-items-center py-3">
                <h1>{recipeToDisplay.title}</h1>
                <button onClick={() => navigate(-1)} className="btn btn-secondary rounded-pill">
                  <i className="bi bi-arrow-left me-2"></i> Back
                </button>
              </div>
              <div className='col-12 d-flex align-items-center gap-4 py-3'>
                <div className='border-end border-end-2 d-flex gap-2 align-items-center'>
                  <img src={timer} alt="Preparation time icon" />
                  <div className='px-2'>
                    <p className='mb-0 fw-semibold'>Preparation Time</p>
                    <p className='text-secondary mb-0'>{recipeToDisplay.time}</p>
                  </div>
                </div>
                <div className='border-end border-end-2 px-2 d-flex gap-2 align-items-center'>
                  <img src={timer} alt="Cooking time icon" />
                  <div>
                    <p className='mb-0 fw-semibold'>Cooking Time</p>
                    <p className='text-secondary mb-0'>{recipeToDisplay.time}</p>
                  </div>
                </div>
                <div className='d-flex gap-2 align-items-center'>
                  <img src={forkKnife} alt="Diet icon" />
                  <div>
                    <p className='text-secondary mb-0'>
                      {Array.isArray(recipeToDisplay.diet) ? recipeToDisplay.diet.join(', ') : recipeToDisplay.diet}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="container py-4">
        <div className="d-flex flex-column flex-lg-row gap-4">
          <div className="col-12 col-lg-8 rounded-4 overflow-hidden">
            <img src={recipeToDisplay.image} alt={recipeToDisplay.title} className='w-100 h-100 object-fit-cover' />
          </div>
          <div className="col-12 col-lg-4 d-flex flex-column bg-info-subtle container rounded-4 p-3">
            <h4 className='py-3'>Nutrition Information </h4>
            <div className='d-flex justify-content-between align-items-center border-bottom border-secondary '>
              <p className='fw-semibold text-secondary'>Calories</p>
              <p className='fw-semibold'>{nutritionInfo.calories}kcal</p>
            </div>
            <div className='d-flex justify-content-between align-items-center border-bottom border-secondary my-3'>
              <p className='fw-semibold text-secondary'>Protein</p>
              <p className='fw-semibold'>{nutritionInfo.protein}g</p>
            </div>
            <div className='d-flex justify-content-between align-items-center border-bottom border-secondary '>
              <p className='fw-semibold text-secondary'>Carbs</p>
              <p className='fw-semibold'>{nutritionInfo.carb}g</p>
            </div>
            <div className='d-flex justify-content-between align-items-center border-bottom border-secondary my-3'>
              <p className='fw-semibold text-secondary'>Fats</p>
              <p className='fw-semibold'>{nutritionInfo.fats}g</p>
            </div>
          </div>
        </div>
      </section>
      <div className='container py-5'>
        <div className='d-flex justify-content-center mb-3 '>
          <h1 className='border-bottom border-secondary'>About the Dish</h1>
        </div>
        <div className='border-bottom border-secondary pb-3'>
          <span className='text-secondary'>
            {recipeToDisplay.description}
          </span>
        </div>
      </div>

      <section className="container my-4">
        <div className="row">
          <div className="col-lg-7">
            <h3 className="fw-bold">Ingredients</h3>
            <h5 className="mt-4 fw-semibold">For the Main Course</h5>
            <ul className="list-unstyled border-top">
              {recipeToDisplay.ingredients && recipeToDisplay.ingredients.length > 0 ? (
                recipeToDisplay.ingredients.map((ingredient, index) => (
                  <li key={index} className="border-bottom py-3 d-flex align-items-center">
                    <input type="checkbox" className="form-check-input me-3 mt-0" />
                    {ingredient}
                  </li>
                ))
              ) : (
                <li className="py-3 text-secondary">No ingredients listed.</li>
              )}
            </ul>

            <div className='py-5'>
              <h3 className="fw-bold">Preparation Instructions</h3>
              <ul className="list-unstyled border-top">
                {preparations && preparations.length > 0 ? (
                  preparations.map((step, index) => (
                    <li key={index} className="border-bottom py-3 d-flex align-items-center flex-wrap">
                      <p className='fw-semibold fs-3'>{index + 1}. {step.title}</p>
                      <p className='text-secondary'>
                        {step.description}
                      </p>
                    </li>
                  ))
                ) : (
                  <li className="py-3 text-secondary">No preparation instructions listed.</li>
                )}
              </ul>
            </div>
          </div>

          <div className="col-lg-5 ps-lg-5 mt-5 mt-lg-0" style={{ position: 'sticky', top: '90px', alignSelf: 'flex-start' }}>
            <h5 className="fw-bold">Other Dishes</h5>

            {similarRecipes.length > 0 ? (
              similarRecipes.map((recipe, index) => (
                <div className="d-flex mb-3" key={index}>
                  <Link to={`/recipe/${encodeURIComponent(recipe.title)}`} className="me-3">
                    <img
                      src={recipe.image}
                      className="rounded-3"
                      width="120"
                      height="80"
                      alt={recipe.title}
                      style={{ objectFit: 'cover' }}
                    />
                  </Link>
                  <div>
                    <Link to={`/recipe/${encodeURIComponent(recipe.title)}`} className="mb-1 fw-semibold text-decoration-none text-black">
                      {recipe.title}
                    </Link>
                    <p className="text-muted">{Array.isArray(recipe.diet) ? recipe.diet.join(', ') : recipe.diet}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">No similar recipes found.</p>
            )}

            <div className="text-center bg-success text-white p-4 rounded-4 mt-3">
              <p className="fw-semibold mb-1">Want your own special diet?</p>
              <p className="fw-semibold fs-2">Contact us!</p>

              <div className="d-flex flex-column flex-md-row gap-2 mb-2">
                <input
                  type="email"
                  className="form-control border-0 rounded-3 w-full flex-grow-1"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ height: '45px' }}
                />
                <button
                  className="btn btn-light fw-semibold text-success px-4 rounded-3 w-full md:w-32"
                  onClick={handleEmailSubmit}
                  style={{ height: '45px' }}
                >
                  Submit
                </button>
              </div>

              {emailError && <small className="text-warning d-block">{emailError}</small>}
              {emailSuccess && <small className="text-warning d-block">{emailSuccess}</small>}

              <small className="d-block mt-2">or</small>
              <p className="mb-0">
                <a href="#" className="small text-decoration-none text-white">www.nutriplanner.com</a>
              </p>
            </div>

          </div>
        </div>
      </section>

      <section className='container my-5'>
        <div className='d-flex justify-content-center mb-3'>
          <h3 className="fw-bold">You might also like these dishes</h3>
        </div>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {similarRecipes.length > 0 ? (
            similarRecipes.map((recipe, index) => (
              <div className="col" key={index}>
                <RecipeCard
                  image={recipe.image}
                  title={recipe.title}
                  description={recipe.description}
                  time={recipe.time}
                  diet={recipe.diet}
                  calories={recipe.calories}
                  favourites={favourites}
                  addToFavourites={addToFavourites}
                  removeFromFavourites={removeFromFavourites}
                />
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p className="text-muted">No recipes to display.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default RecipeDetailComponent;
