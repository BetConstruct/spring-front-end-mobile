import Config from "../config/main";

/**
 * @name checkPartnerExternalLinks
 * @params {string} actionName
 * @returns {boolean}
 */
function checkPartnerExternalLinks (actionName) {
    return Config.isPartnerIntegration instanceof Object &&
        Config.isPartnerIntegration.externalLinks instanceof Object &&
        Config.isPartnerIntegration.externalLinks.hasOwnProperty(actionName);
}

/**
 * @name getExternalLink
 * @params {string} actionName
 * @returns {*}
 */
function getExternalLink (actionName) {
    return Config.isPartnerIntegration.externalLinks[actionName];
}

/**
 * @name checkAngGetPartnerExternalLinks
 * @params {string} actionName
 * @returns {*}
 */
function checkAngGetPartnerExternalLinks (actionName) {
    return checkPartnerExternalLinks(actionName) ? Config.isPartnerIntegration.externalLinks[actionName] : null;
}

export {checkPartnerExternalLinks, checkAngGetPartnerExternalLinks, getExternalLink};