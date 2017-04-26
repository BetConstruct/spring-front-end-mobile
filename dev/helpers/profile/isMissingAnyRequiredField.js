import Config from "../../config/main";
export const isMissingAnyRequiredField = (user, cb) => {
    let fields = Object.keys(Config.main.regConfig.fields);
    for (let length = fields.length, i = 0; i < length; i++) {
        let field = Config.main.regConfig.fields[fields[i]],
            fieldName = field.name;

        if (fields[i] === "password" || fields[i] === "confirmPassword" || fields[i] === "captcha" || fields[i] === "securityQuestion" || fields[i] === "agree") {
            continue;
        }

        if (field.customAttrs && field.customAttrs.required && (!user.hasOwnProperty(fieldName) || !user[fieldName])) {
            return true;
        }
    }
    cb && cb();
    return false;
};