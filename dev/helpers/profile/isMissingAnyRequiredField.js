import Config from "../../config/main";
import Helpers from "../../helpers/helperFunctions";

export const isMissingAnyRequiredField = (user, cb) => {
    if (Helpers.CheckIfPathExists(Config, "main.regConfig.settings.disableRequiredFieldsValidation")) {
        return false;
    }
    let fields = Object.keys(Config.main.regConfig.fields);
    for (let length = fields.length, i = 0; i < length; i++) {
        let field = Config.main.regConfig.fields[fields[i]],
            fieldName = field.name;

        if (field.skippAbleForProfileValidation ||
            fields[i] === "password" ||
            fields[i] === "confirmPassword" ||
            fields[i] === "captcha" ||
            fields[i] === "re_captcha" ||
            fields[i] === "phone_code" ||
            fields[i] === "phone" || //TODO remove this line after fixing external registration fields mismatching
            fields[i] === "promoCode" ||
            fields[i] === "securityQuestion" ||
            fields[i] === "language" ||
            fields[i] === "agree" ||
            fields[i] === "max_bet_amount" || fields[i] === "max_daily_bet_amount" || fields[i] === "casino_maximal_daily_bet" ||
            fieldName === "personal_id" ||
            (fields[i] === "bank" && fieldName === "swift_code" && Config.main.site_id === "592")) { //TODO remove this condition after swarm release it's a temporary solution only for "hn2580.com" skin 30/05/2017
            continue;
        }
        if (field.customAttrs && field.customAttrs.required && (!user.hasOwnProperty(fieldName) || (!user[fieldName] && typeof user[fieldName] !== "boolean"))) {
            return true;
        }
    }
    cb && cb();
    return false;
};