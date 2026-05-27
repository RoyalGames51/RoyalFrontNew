import { createStore, applyMiddleware, compose } from 'redux';
import reducer from "../reducer/index";
import { thunk } from 'redux-thunk';

// Nota: usar el compose del devtools si está disponible
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducer,
    composeEnhancer(applyMiddleware(thunk))
);

export default store;
