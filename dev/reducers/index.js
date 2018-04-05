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
import MarketGroupReducer from './reducerMarketFilter';
import BetslipReducer from './reducerBetslip';
import PaymentReducer from './reducerPayment';
import CasinoReducer from './reducerCasino';
import BetHistoryFiltersReducer from './reducerBetHistoryFilters';
import NavigationMenuReducer from './reducerNavigationMenu';
import RegistrationReducer from './reducerRegistration';
import PaymentItemsStateReducer from './reducerPaymentItem';
import BetHistoryReducer from "./reducerBetHistory";
import FreeQuizReducer from './reducerFreeQuiz';
import {routerReducer} from 'react-router-redux';

const allReducers = combineReducers({
    preferences: PreferencesReducer,             // user's preferences
    appReady: AppReadyReducer,                   // application bootstrap state
    user: UserReducer,                           // user data
    swarmData: SwarmDataReducer,                 // main sport/casino data from swarm
    gameMarkets: MarketGroupReducer,
    swarmConfigData: SwarmConfigDataReducer,     // config data loaded from swarm (partner , currencies)
    cmsData: CmsDataReducer,                     // data from CMS
    persistentUIState: PersistentUIStateReducer, // persistent ui state (saved in local storage)
    uiState: UIStateReducer,                     // ui state (not saved)
    favorites: FavoritesReducer,                 // favorites data (game/competition/market ids)
    betslip: BetslipReducer,                     // betslip data (event ids, mode, etc..)
    payments: PaymentReducer,                    // payments data
    casino: CasinoReducer,                       // casino data
    freeQuiz: FreeQuizReducer,                       // FreeQuiz data
    betHistoryFilters: BetHistoryFiltersReducer, // bet history filters data
    betHistory: BetHistoryReducer,               // bet history
    navigationMenu: NavigationMenuReducer,       // Navigation menu state
    paymentItemsState: PaymentItemsStateReducer, // Navigation menu state
    registration: RegistrationReducer,           // Registration state
    routing: routerReducer,                      // Sync router with store
    form: formReducer                            // redux-form reducer
});

export default allReducers;