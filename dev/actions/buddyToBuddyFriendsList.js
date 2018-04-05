import Zergling from '../helpers/zergling';
import {GetBuddyToBuddyFriendList} from "./../actions/payments";

export function GetBuddyToBuddyFriendsList () {
    return function (dispatch) {
        Zergling.get({}, 'get_buddy_list')
            .then(
                (data) => {
                    dispatch(GetBuddyToBuddyFriendList(data && data.details));
                },
                (failResponse) => {
                    console.log('oops !!! BuddyToBuddy friends list not found.');
                }
            )
            .catch(() => {
                console.log('oops !!! BuddyToBuddy friends list not found.');
            });
    };
}

