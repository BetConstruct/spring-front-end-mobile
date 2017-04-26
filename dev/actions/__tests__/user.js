import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
jest.mock('../../helpers/zergling');
jest.mock('../../config/main');
import Zergling from "../../helpers/zergling";
import {ResetPassword, ChangePassword} from "../user";

const mockStore = configureMockStore([thunk]);
const store = mockStore({});

describe('async user actions', () => {
    beforeEach(store.clearActions);

    //------------------------------------------ reset password --------------------------------------------------------
    it('should send reset password command', () => {
        return store.dispatch(ResetPassword("test@test.com")).then(() => {
            expect(Zergling.getLastRequest()).toEqual({"command": "forgot_password", "params": {"email": "test@test.com"}});
        });

    });

    it('should handle successful password reset', () => {

        Zergling.setNextResponseType(true);
        return store.dispatch(ResetPassword("test@test.com")).then(() => {
            expect(store.getActions()).toEqual([
                {"key": "resetPassword", "type": "UI_LOADING"},
                {"key": "resetPassword", "type": "UI_LOADING_DONE"}
            ]);
        });
    });
    it('should handle password reset failure', () => {
        Zergling.setNextResponseType(false);
        return store.dispatch(ResetPassword("test@test.com")).then(() => {
            expect(store.getActions()).toEqual([
                {"key": "resetPassword", "type": "UI_LOADING"},
                {"key": "resetPassword", "reason": {"result": -1}, "type": "UI_LOADING_FAILED"}
            ]);
        });

    });

    //------------------------------------------ change password -------------------------------------------------------
    it('should send reset password command', () => {
        return store.dispatch(ChangePassword("currentpass", "newpass", "formName")).then(() => {
            expect(Zergling.getLastRequest()).toEqual({"command": "update_user_password", "params": {"new_password": "newpass", "password": "currentpass"}});
        });

    });
    it('should handle successful password change', () => {
        Zergling.setNextResponseType(true);
        return store.dispatch(ChangePassword("currentpass", "newpass", "formName")).then(() => {
            expect(store.getActions()).toContainEqual({"key": "formName", "type": "UI_LOADING"});
            expect(store.getActions()).toContainEqual({"key": "formName", "type": "UI_LOADING_DONE"});
        });
    });
    it('should handle password change failure', () => {
        Zergling.setNextResponseType(false);
        return store.dispatch(ChangePassword("currentpass", "newpass", "formName")).then(() => {
            expect(store.getActions()).toContainEqual({"key": "formName", "type": "UI_LOADING"});
            expect(store.getActions()).toContainEqual({"key": "formName", "reason": {"result": -1}, "type": "UI_LOADING_FAILED"});
        });
    });
});