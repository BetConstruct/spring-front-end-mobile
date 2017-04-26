import Config from "../../config/main";

function setProfileDetails () {
    let wis = window.intercomSettings;
    let p = window.aboutUserObj;
    if (p && window.Intercom) {
        wis.user_hash = window.CryptoJS.HmacSHA256(p.id + '', "CGlzlKlwrgMzCjXZoDNxaKVfD5_LmtZ2a6eCTWXM") + '';
        wis.unique_id = p && p.unique_id;
        wis.user_id = p && p.id;
        wis.email = p && (p.email || p.username || 'Unknown');
        wis.name = p && ((((p.first_name ? p.first_name + " " : "") || '') + (p.last_name || '')) || p.full_name || p.username || p.email || 'Unknown');
        wis.phone = p && p.phone;
        wis.gender = p && p.gender;
        wis.address = p && p.address;
        wis.reg_date = p && p.reg_date;
        wis.birth_date = p && p.birth_date;
        wis.currency = p && p.currency_name;
        wis.balance = p && p.balance;
        wis.bonus_id = p && p.bonus_id;
        wis.super_bet = p && p.super_bet;
        wis.active_step = p && p.active_step;
        wis.active_step_state = p && p.active_step_state;
        wis.subscribed_to_news = p && p.subscribed_to_news;
        wis.bonus_balance = p && p.bonus_balance;
        wis.frozen_balance = p && p.frozen_balance;
        wis.bonus_win_balance = p && p.bonus_win_balance;
        wis.has_free_bets = p && p.has_free_bets;
        wis.loyalty_point = p && p.loyalty_point;
        wis.loyalty_earned_points = p && p.loyalty_earned_points;
        wis.loyalty_exchanged_points = p && p.loyalty_exchanged_points;
        wis.loyalty_level_id = p && p.loyalty_level_id;
        wis.loyalty_point_usage_period = p && p.loyalty_point_usage_period;
        wis.loyalty_min_exchange_point = p && p.loyalty_min_exchange_point;
        wis.loyalty_max_exchange_point = p && p.loyalty_max_exchange_point;
        wis.affiliate_id = p && p.affiliate_id;
        wis.is_verified = p && p.is_verified;
        wis.incorrect_fields = p && p.incorrect_fields;
        wis.active_time_in_casino = p && p.active_time_in_casino;
        wis.bonus_money = p && p.bonus_money;
        wis.reg_info_incomplete = p && p.reg_info_incomplete;
        wis.casino_promo = p && p.casino_promo;
        wis.exclude_date = p && p.exclude_date;
        wis.created_at = Math.floor(Date.now() / 1000);
        wis.hostName = window.location.hostname;
    } else if (window.Intercom) {
        window.intercomSettings = {
            app_id: "xv546ist"
        };
    }
    window.Intercom('shutdown');
    window.Intercom('reattach_activator');
    window.Intercom('update', window.intercomSettings);
}

let setGlobalUserDetails = (nextProps) => {
    Config.main.storeUserProfileOnWindow && (window.aboutUserObj = nextProps.profile);
    setProfileDetails();
};

export default setGlobalUserDetails;