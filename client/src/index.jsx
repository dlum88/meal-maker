/* eslint-disable class-methods-use-this */
// rendering all components
/* eslint import/extensions: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Login from './components/login/Login.jsx';
import randomRecipe from '../example_random.js';
import Main from './components/main/Main.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      recipeOfTheDay: randomRecipe, // recipe of the day video
      savedRecipes: [],
      savedSearches: [],
      ingredients: [],
      userId: 0,
      selectedRecipe: randomRecipe,
      authorized: false,
      show: 'login',
      userName: '',
    };
    // binding all functions to the index component
    this.getRandomRecipe = this.getRandomRecipe.bind(this);
    this.getRecipes = this.getRecipes.bind(this);
    this.getSavedRecipes = this.getSavedRecipes.bind(this);
    this.getSavedSearches = this.getSavedSearches.bind(this);
    this.saveRecipe = this.saveRecipe.bind(this);
    this.saveDislikeRecipe = this.saveDislikeRecipe.bind(this);
    this.selectRecipe = this.selectRecipe.bind(this);
    this.signUp = this.signUp.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    const { authorized } = this.state;
    this.getRandomRecipe();
    this.grabIngredients();
    if (authorized) {
      this.setState({
        show: 'home',
      });
    }
  }


  // function to retrieve recipes to display
  getRecipes(ingredients) {
    const { userId } = this.state;
    return axios.get('/food', {
      params: {
        userId,
        ingredients,
      },
    }) // sends a GET request to serve at endpoint '/food'
      .then((results) => {
        this.setState({ // change the state
          recipes: results.data, // by making the data received back fron the server available
        });
      }).catch((err) => {
        console.log(err, 'error while retrieving data from server');
      });
  }

  // function to retrieve the recipe of the day
  getRandomRecipe() {
    return axios.get('/recipeoftheday') // sends get request to server for random recipe
      .then((recipe) => {
        this.setState({
          recipeOfTheDay: recipe.data,
        });
      })
      .catch((err) => {
        console.log(`there was an error retriving random recipe : ${err}`);
      });
  }

  // function to retrieve all saved recipes for the current user
  getSavedRecipes() {
    const { userId } = this.state;
    return axios.get('/savedrecipes', {
      params: {
        userId,
      },
    }) // sends get request to server for saved recipes
      .then((results) => {
        this.setState({
          savedRecipes: results.data,
        });
      })
      .catch((err) => {
        console.log(`there was an error retrieving saved recipes : ${err}`);
      });
  }

  getSavedSearches() {
    const { userId } = this.state;
    return axios.get('/savedsearches', {
      params: {
        userId,
      },
    }) // sends get request to server for saved recipes
      .then((results) => {
        this.setState({
          savedSearches: results.data,
        });
      })
      .catch((err) => {
        console.log(`there was an error retrieving saved searches : ${err}`);
      });
  }

  // gets all ingredients saved to db to for autocomplete component
  grabIngredients() {
    axios.get('/ingredients')
      .then((allIngOptions) => {
        this.setState({
          ingredients: allIngOptions.data,
        });
      })
      .catch((error) => {
        console.log(error, 'error in getting all ingredients');
      });
  }

  // sends a POST request to serve at endpoint '/toBeSaved'
  // eslint-disable-next-line class-methods-use-this
  saveDislikeRecipe(recipe) {
    const { userId } = this.state;
    return axios.post('/toBeSavedDislike', {
      userId,
      recipeId: recipe.recipeId,
    })
      .then((result) => {
        console.log(result);
      }).catch((err) => {
        console.log(err, 'error while trying to save recipe into DB');
      });
  }

  // function to update the state with a selected recipe => passed down to list items below
  selectRecipe(recipe) {
    this.setState({
      selectedRecipe: recipe,
    });
  }

  // function to update the nutritional information that will be passed down to all below
  // setNutritionalInfo({ ingredients }) {
  //   return axios.get('/nutrition', {
  //     params: {
  //       ingredients,
  //     },
  //   }).then((nutrition) => {
  //     this.setState({
  //       nutritionInformation: nutrition.data,
  //     }).catch((err) => {
  //       console.log(`No nutrition for you : ${err}`);
  //     });
  //   });
  // }

  // sends a POST request to serve at endpoint '/toBeSaved'
  // eslint-disable-next-line class-methods-use-this
  saveRecipe(recipe) {
    const { userId } = this.state;
    return axios.post('/toBeSaved', {
      userId,
      recipeId: recipe.recipeId,
    })
      .then((result) => {
        console.log(result);
      }).catch((err) => {
        console.log(err, 'error while trying to save recipe into DB');
      });
  }

  signUp(user, pw) {
    console.log(`thank you for signing up, ${user}`);
    console.log(`Hello, ${user}`);
    axios.post('/api/users', {
      user: {
        username: user,
        password: pw,
      },
    })
      .then((res) => {
        console.log('made to signup');
        console.log(res.data.user, res.data.user.id, 'RESPONSE');
        console.log('where is res');
        this.setState({
          authorized: true,
          userId: res.data.user.id,
          userName: res.data.user.username,
        });
        this.componentDidMount();
      })
      .catch((bool) => {
        console.log(bool, 'could not log in after signup');
      });
  }

  login(user, pw) {
    console.log('logged in');
    console.log(`Hello, ${user}`);
    axios.post('/api/users/login', {
      user: {
        username: user,
        password: pw,
      },
    })
      .then((res) => {
        console.log(res, 'LOGGING IN');
        this.setState({
          authorized: true,
          userId: res.data.user.id,
          userName: res.data.user.username,
        });
        this.componentDidMount();
      })
      .catch(() => {
        console.log('could not log in');
      });
  }

  render() {
    const { show } = this.state;
    let mainComponent = 'login';
    const {
      recipeOfTheDay, selectedRecipe, savedRecipes, savedSearches, recipes, ingredients, userName,
    } = this.state;
    if (show === 'login') {
      mainComponent = <Login recipe={recipeOfTheDay} signUp={this.signUp} login={this.login} />;
    } else if (show === 'home') {
      mainComponent = (
        <Main
          recipes={recipes}
          recipeOfTheDay={recipeOfTheDay}
          selectedRecipe={selectedRecipe}
          savedRecipes={savedRecipes}
          savedSearches={savedSearches}
          ingredients={ingredients}
          getRecipes={this.getRecipes}
          saveRecipe={this.saveRecipe}
          saveDislikeRecipe={this.saveDislikeRecipe}
          getSavedRecipes={this.getSavedRecipes}
          getSavedSearches={this.getSavedSearches}
          selectRecipe={this.selectRecipe}
          user={userName}
        />
      );
    }
    return (
      <div>
        {mainComponent}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
