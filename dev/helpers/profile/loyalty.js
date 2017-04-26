import Config from "../../config/main";

/**
 * Calculates  Loyalty status data
 *
 * @param {Object} profile user profile object
 * @param {Array} levelsData array containing level data objects
 * @returns {Object} object containing loyalty status data (progress, remaining days, etc..)
 */
export function getUserLoyaltyStatus (profile, levelsData) {
    let loyaltyStatus = {};
    if (profile && profile.loyalty_level_id && levelsData && levelsData.length) {
        for (let i = 0, len = levelsData.length; i < len; ++i) {
            if (parseInt(profile.loyalty_level_id) === parseInt(levelsData[i].Id)) {
                loyaltyStatus.userCurrentStatus = levelsData[i];

                loyaltyStatus.progressValue = (100 * profile.loyalty_last_earned_points) / (levelsData[levelsData.length - 1].MaxPoint - levelsData[0].MinPoint);

                let nextIndex = i;

                if (Config.main.loyaltyPointsShowAlwaysNextLevel) {
                    nextIndex = i === len - 1 ? i : i + 1;
                    loyaltyStatus.nextLevelDifference = levelsData[nextIndex].MinPoint - profile.loyalty_last_earned_points;
                } else {
                    if (profile.loyalty_last_earned_points < levelsData[i].MinPoint) {
                        nextIndex = i === 0 ? 0 : i - 1;
                    } else if (profile.loyalty_last_earned_points > loyaltyStatus.userCurrentStatus.MaxPoint) {
                        nextIndex = i === len - 1 ? i : i + 1;
                    }
                }
                loyaltyStatus.userNextStatus = levelsData[nextIndex];
                if (profile.loyalty_point_usage_period !== undefined && profile.loyalty_point_usage_period !== null) {
                    loyaltyStatus.remainingDays = profile.loyalty_point_usage_period;
                }
                break;
            }
        }
    }
    return loyaltyStatus;
}