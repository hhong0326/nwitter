import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Profile from 'routes/Profile';
import Navigation from 'components/Navigation';

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
    
    return (
        <Router>
            {isLoggedIn && <Navigation userObj={userObj} />}
            <Switch>
                <Route exact path="/">
                    {isLoggedIn ? <Home userObj={userObj}/> : <Auth />}
                </Route>
                <Route exact path="/profile">
                    <Profile refreshUser={refreshUser} userObj={userObj}/>
                </Route>
            </Switch>
        </Router>
    )
}

export default AppRouter;

