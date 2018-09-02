import React from 'react'
import { Router, Route } from 'react-router-dom';
import {Provider} from 'react-redux';
import Home from '../../components/home/Home';
import List from '../../components/list/List.js';

const Main = (store) => (
    <Provider store={store}>
        <Router>
            <Route exact path='/' component={Home}/>
            <Route path="/list" exact component={List}/>
        </Router>
    </Provider>
);

export default Main;