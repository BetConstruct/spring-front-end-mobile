import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form';
import UserReducer from './reducerUser';
import SwarmDataReducer from './reducerSwarmData';
import SwarmConfigDataReducer from './reducerSwarmConfigData';
import CmsDataReducer from './reducerCmsData';
import PersistentUIStateReducer from './reducerPersistentUIState';
import UIStateReducer from './reducerUIState';
import AppReadyReducer from './reducerAppReady';
import PreferencesReducer from './reducerPreferences';
import FavoritesReducer from './reducerFavorites';
import BetslipReducer from './reducerBetslip';
import PaymentReducer from './reducerPayment';
import CasinoReducer from './reducerCasino';
import BetHistoryFiltersReducer from './reducerBetHistoryFilters';
import NavigationMenuReducer from './reducerNavigationMenu';
import {routerReducer} from 'react-router-redux';

const allReducers = combineReducers({
    preferences: PreferencesReducer,             // user's preferences
    appReady: AppReadyReducer,                   // application bootstrap state
    user: UserReducer,                           // user data
    swarmData: SwarmDataReducer,                 // main sport/casino data from swarm
    swarmConfigData: SwarmConfigDataReducer,     // config data loaded from swarm (partner , currencies)
    cmsData: CmsDataReducer,                     // data from CMS
    persistentUIState: PersistentUIStateReducer, // persistent ui state (saved in local storage)
    uiState: UIStateReducer,                     // ui state (not saved)
    favorites: FavoritesReducer,                 // favorites data (game/competition/market ids)
    betslip: BetslipReducer,                     // betslip data (event ids, mode, etc..)
    payments: PaymentReducer,                    // payments data
    casino: CasinoReducer,                       // casino data
    betHistoryFilters: BetHistoryFiltersReducer, // bet history filters data
    navigationMenu: NavigationMenuReducer,       // Navigation menu state
    routing: routerReducer, // bet history filters data
    form: formReducer                            // redux-form reducer
});

export default allReducers;