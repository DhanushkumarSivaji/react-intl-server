import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import 'primereact/resources/themes/home/theme.css';
import 'primereact/resources/primereact.min.css';
import 'font-awesome/css/font-awesome.css';

import reducers from './reducers.js';
import App from './App.jsx';
import './index.css';

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route exact path="/" render={() => <Redirect to="/Configuration" />} />
                <Route path="/:tab">
                    <App />
                </Route>
            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);