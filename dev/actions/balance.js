import Zergling from '../helpers/zergling';
import Helpers from "../helpers/helperFunctions";
import {UserProfileUpdateReceived} from "../actions/user";

export function GetUserBalance (profile) {
    let newProfile = Helpers.cloneDeep(profile);
    return function (dispatch) {
        Zergling.get({}, 'get_balance')
            .then((data) => {
                let userId = Object.keys(data.data.profile)[0];
                newProfile.balance = data.data.profile[userId].balance;
                dispatch(UserProfileUpdateReceived(newProfile));
            })
            .catch();
    };
}

