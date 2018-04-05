import {t} from "./translator";

/**
 * Validates provided value according to rule
 *
 * @param {String} value value to validate
 * @param {String} key key to store error message under in errorObj
 * @param {String|Array} rule name or array with rule name and rule options
 * @param {Object} errorObj object to store error in
 * @param {String} errorMessage Error message. Optional. If not provided default error message will be set.
 * @returns {Object}
 */

const Validate = (value, key, rule, errorObj = {}, errorMessage = null) => {
    var options = null;
    if (Array.isArray(rule)) {
        [rule, options] = rule;
    }
    switch (rule) {
        case "required":
            if (typeof options === "boolean") {
                if (options && !value) {
                    errorObj[key] = errorMessage || t("Required");
                }
            } else if (!value) {
                errorObj[key] = errorMessage || t("Required");
            }
            return errorObj;
        case "minlength":
            if (!value || value.length < options) {
                errorObj[key] = errorMessage || t("Should be at least {1} characters long.", options);
            }
            return errorObj;
        case "maxlength":
            if (value && value.length > options) {
                errorObj[key] = errorMessage || t("Should be less than {1} characters long.", options);
            }
            return errorObj;
        case "minWithdraw":
            if (+value < options) {
                errorObj[key] = errorMessage || t("Min withdraw is {1}", options);
            }
            return errorObj;
        case "maxWithdraw":
            if (+value > options) {
                errorObj[key] = errorMessage || t("Max withdraw is {1}", options);
            }
            return errorObj;
        case "minDeposit":
            if (+value < options) {
                errorObj[key] = errorMessage || t("Min deposit is {1}", options);
            }
            return errorObj;
        case "maxDeposit":
            if (+value > options) {
                errorObj[key] = errorMessage || t("Max deposit is {1}", options);
            }
            return errorObj;
        case "minAmount":
            if (+value < options) {
                errorObj[key] = errorMessage || t("Min amount is {1}", options);
            }
            return errorObj;
        case "maxAmount":
            if (+value > options) {
                errorObj[key] = errorMessage || t("Max amount is {1}", options);
            }
            return errorObj;
        case "email":
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
                errorObj[key] = errorMessage || t("Invalid email address");
            }
            return errorObj;
        case "regex": {
            let reg = options instanceof Array ? new RegExp(...options) : new RegExp(new RegExp(options));
            if (!(reg.test(value))) {
                errorObj[key] = errorMessage || t("Value {1} is not valid.", value);
            }
            return errorObj;
        }
        case "regexArray": {
            let anyMatched = false;
            for (let i = 0; i < options.length; i++) {
                let reg = options[i] instanceof Array ? new RegExp(...options[i]) : new RegExp(options[i]);
                if (!reg.test(value)) {
                    anyMatched = false;
                } else {
                    anyMatched = true;
                    break;
                }
            }
            !anyMatched && (errorObj[key] = errorMessage || t("Value {1} is not valid.", value));
            return errorObj;
        }
        case "match":
            if (value !== options) {
                errorObj[key] = errorMessage || t("fields don't match.");
            }
            return errorObj;
        case "contain":
            if (options.indexOf(value) === -1) {
                errorObj[key] = errorMessage || t("fields don't match.");
            }
            return errorObj;
        case "identification":
            if (value && options) {
                let idNumber = value.split("").map((item) => +item),
                    ilk = idNumber.length > 10 ? ((((idNumber[0] + idNumber[2] + idNumber[4] + idNumber[6] + idNumber[8]) * 7) - (idNumber[1] + idNumber[3] + idNumber[5] + idNumber[7])) % 10) : null,
                    son = idNumber.length > 10 ? ((idNumber[0] + idNumber[1] + idNumber[2] + idNumber[3] + idNumber[4] + idNumber[5] + idNumber[6] + idNumber[7] + idNumber[8] + idNumber[9]) % 10) : null;
                if (idNumber.length > 10) {
                    if (ilk !== idNumber[9] || son !== idNumber[10]) {
                        errorObj[key] = t("TC Identity Number is incorrect");
                    }
                }
            }
            return errorObj;
        case "notZero":
            if (value && value.split("")[0] === "0") {
                errorObj[key] = errorMessage || t("The first digit of your TC Number can not be 0!");
            }
            return errorObj;

        default: return errorObj;
    }
};

export default Validate;