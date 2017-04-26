const t = str => str; // needed for translations extractor

export const H2H_STATS_PER_SPORT = {
    Tennis: {
        double_fault: t("Double faults"),
        aces: t("Aces")
    },
    Basketball: {
        foul: t("Foul"),
        timeout: t("Timeout")
    },
    Soccer: {
        dangerous_attack: t("Dangerous attack"),
        shot_on_target: t("Shot on target"),
        shot_off_target: t("Shot off target"),
        corner: t("Corner"),
        yellow_card: t("Yellow card"),
        red_card: t("Red card")
    }
};

export const SPORTS_HAVING_TIMELINE = {
    Soccer: true,
    CyberFootball: true
};

export const SPORTS_HAVING_STATS_TABLE = {
    Soccer: true,
    CyberFootball: true
};

export const SPORTS_HAVING_ANIMATIONS = {
    Soccer: true,
    Tennis: true,
    Basketball: true
};