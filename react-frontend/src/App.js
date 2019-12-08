import React from "react";

import MainNavigation from "./Shared/Components/Navigation/MainNavigation";
import Users from "./Users/Pages/Users";
import UserPlaces from "./Places/Pages/UserPlaces";
import NewPlace from "./Places/Pages/NewPlace";
import UpdatePlace from "./Places/Pages/UpdatePlace";
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
          <Route exact path="/places/:placeId" component={UpdatePlace} />
          <Redirect to="/" />
        </Switch>
      </main>
    </div>
  );
};

export default App;
