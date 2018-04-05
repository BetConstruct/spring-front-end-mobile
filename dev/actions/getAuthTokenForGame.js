import {loadingDone, loadingFailed, loadingStart} from "./loadingStateForCasinoGames";
import Zergling from '../helpers/zergling';
/**
 * @description try to get AuthToken for casino Games
 * @returns {Function} async action dispatcher
 */
export const getAuthTokenForGame = (key, gameId) => {
    return (dispatch) => {
        dispatch(loadingStart(key));
        Zergling.get({'game_id': gameId}, 'casino_auth').then(
            (data) => {
                if (data.result.has_error !== "True") {
                    dispatch(loadingDone(data.result.token, key));
                } else {
                    dispatch(loadingFailed(data, key));
                }
            },
            (data) => dispatch(loadingFailed(data, key))
        ).catch((ex) => {
            console.debug(ex);
        });
    };
};