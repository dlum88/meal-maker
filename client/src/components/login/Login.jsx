// login view which contains
// 1) a credential component (with username and password input forms, a login button and a signup button)
// 2) a recipe of the day video player component
// 3) a recipe instructions component (with a scrolling list of instructions)
import React from 'react';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // display: 'off', // initial state of display is off 
      // what: 'Reveal Translation' // which means the 'Reveal Translation' text is displayed
    };
  }

  render() {

    return (
      <div>
        <div className="credentials">
          <Credentials ></Credentials>
        </div>
        <div className="appName">
          <h1>Meal Maker</h1>
        </div>
        <div className="title">
          <h2>Recipe of the day</h2>
        </div>
        <table>
          <tbody>
            <tr>
              <td className="vidPlayer"><VideoPlayer video=""></VideoPlayer> </td>
              <td className="instructions"><RecipeInstructions instructions=""></RecipeInstructions></td>
            </tr>   
          </tbody>
        </table>
      </div>
    );
  }
}
export default Login;