import React from "react";

import MainNavigation from "./Shared/Components/Navigation/MainNavigation";
import Users from "./Users/Pages/Users";
import UserPlaces from "./Places/Pages/UserPlaces";
import NewPlace from "./Places/Pages/NewPlace";
import { Route, Redirect, Switch } from "react-router-dom";

const App = () => {
  return (
    <div>
      <MainNavigation />
      <main>
        <Switch>
          <Route exact path="/" component={Users} />
          <Route exact path="/:userId/places" component={UserPlaces} />
          <Route exact path="/places/new" component={NewPlace} />
          <Redirect to="/" />
        </Switch>
      </main>
    </div>
  );
};

export default App;
