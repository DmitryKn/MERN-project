import React from 'react';
import Users from './Users/Pages/Users';
import NewPlace from './Places/Pages/NewPlace';
import { Route, Redirect, Switch } from 'react-router-dom';

const App = () => {
  return <div>
    <Switch>
      <Route exact path='/' component={Users}/>
      <Route exact path='/places/new' component={NewPlace}/>
      <Redirect to='/'/>
    </Switch>
  </div>;
}

export default App;
