import _ from "lodash";
import {FAVORITE_ADD, FAVORITE_REMOVE, FAVORITES_CLEAR, SPORTS_FAVORITES_CLEAR, CASINO_FAVORITES_CLEAR, MARKET_FAVORITES_CLEAR} from "../actions/actionTypes/";

const FavoritesReducer = (state = {game: {}, competition: {}, marketType: {}, casinoGame: {}}, action) => {
    var ret = _.cloneDeep(state);
    switch (action.type) {
        case FAVORITE_ADD:
            ret[action.favType][action.id] = (action.payload || true);
            return ret;
        case FAVORITE_REMOVE:
            delete ret[action.favType][action.id];
            return ret;
        case FAVORITES_CLEAR:
            return {game: {}, competition: {}, marketType: {}, casinoGame: {}};
        case SPORTS_FAVORITES_CLEAR:
            ret.game = {};
            ret.competition = {};
            return ret;
        case CASINO_FAVORITES_CLEAR:
            ret.casinoGame = {};
            return ret;
        case MARKET_FAVORITES_CLEAR:
            ret.marketType = {};
            return ret;
        default :
            return state;
    }
};

export default FavoritesReducer;