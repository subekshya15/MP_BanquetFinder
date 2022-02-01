import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Homescreen from "./screens/Homescreen";
import Bookingscreen from "./screens/Bookingscreen";
import Registerscreen from "./screens/Registerscreen";
import Loginscreen from "./screens/Loginscreen";
import Profilescreen from "./screens/Profilescreen";
import Adminscreen from "./screens/Adminscreen";
import Landingscreen from "./screens/Landingscreen";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />

        <Switch>
          <Route path="/home">
            <Homescreen />
          </Route>
          <Route path="/book/:venueid/:setdate" component={Bookingscreen} />
          <Route path="/register" component={Registerscreen}></Route>
          <Route path="/login" component={Loginscreen}></Route>
          <Route path="/profile" exact component={Profilescreen}></Route>
          <Route path="/admin" exact component={Adminscreen}></Route>
          <Route path="/" exact component={Landingscreen}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
