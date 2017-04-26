import {FavoriteAdd, FavoriteRemove, FavoritesClear} from "../../actions/favorites";
import FavoritesReducer from "../reducerFavorites";

describe('favorites reducer', () => {
    it('should return the initial state', () => {
        let initialState = FavoritesReducer(undefined, {});
        expect(initialState.game).toBeDefined();
        expect(initialState.competition).toBeDefined();
        expect(initialState.marketType).toBeDefined();
        expect(initialState.casinoGame).toBeDefined();
    });

    it('should add and remove favorites', () => {
        let state;
        state = FavoritesReducer(state, FavoriteAdd("game", 1234));
        state = FavoritesReducer(state, FavoriteAdd("competition", 12345));
        state = FavoritesReducer(state, FavoriteAdd("marketType", 123456));
        state = FavoritesReducer(state, FavoriteAdd("casinoGame", "casino_game_id", {url: "testUrl"}));

        expect(state.game["1234"]).toBeDefined();
        expect(state.competition["12345"]).toBeDefined();
        expect(state.marketType["123456"]).toBeDefined();
        expect(state.casinoGame["casino_game_id"]).toBeDefined();
        expect(state.casinoGame["casino_game_id"]).toEqual({url: "testUrl"});

        state = FavoritesReducer(state, FavoriteRemove("game", 1234));
        state = FavoritesReducer(state, FavoriteRemove("competition", 12345));
        state = FavoritesReducer(state, FavoriteRemove("marketType", 123456));
        state = FavoritesReducer(state, FavoriteRemove("casinoGame", "casino_game_id"));

        expect(state.game["1234"]).toBeUndefined();
        expect(state.competition["12345"]).toBeUndefined();
        expect(state.marketType["123456"]).toBeUndefined();
        expect(state.casinoGame["casino_game_id"]).toBeUndefined();
    });

    it('should clear favorites', () => {
        let initialState = FavoritesReducer(undefined, {});

        let state = FavoritesReducer(initialState, FavoriteAdd("game", 1234));
        state = FavoritesReducer(state, FavoriteAdd("competition", 1234));
        state = FavoritesReducer(state, FavoriteAdd("marketType", 1234));
        state = FavoritesReducer(state, FavoriteAdd("casinoGame", "casino_game_id", {url: "testUrl"}));

        state = FavoritesReducer(state, FavoritesClear());

        expect(state).toEqual(initialState);

    });

});