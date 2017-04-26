import moment from "moment";

let t = str => str;  // all strings here have to be inside t() to be recognizable by translation extraction script

export const mainTransactionTypes = {
    "-1": t("All"),
    "0": t("New Bets"),
    "1": t("Winning Bets"),
    "2": t("Returned Bet"),
    "3": t("Deposit"),
    "4": t("Card Deposit"),
    "5": t("Bonus"),
    "6": t("Bonus Bet"),
    "7": t("Commission"),
    "8": t("Withdrawal"),
    "9": t("Correction"),
    "302": t("Correction Down"),
    "10": t("Deposit by payment system"),
    "12": t("Withdrawal request"),
    "13": t("Authorized Withdrawal"),
    "14": t("Withdrawal denied"),
    "15": t("Withdrawal paid"),
    "16": t("Pool Bet"),
    "17": t("Pool Bet Win"),
    "18": t("Pool Bet Return"),
    "23": t("In the process of revision"),
    "24": t("Bet Recalculation"),
    "29": t("Free Bet Bonus received"),
    "30": t("Wagering Bonus received"),
    "31": t("Transfer from Gaming Wallet"),
    "32": t("Transfer to Gaming Wallet"),
    "37": t("Declined Superbet"),
    "39": t("Bet on hold"),
    // "40": t("Bet cashout"), //doesn't exist in spring
    "19": t("Fair"),
    "20": t("Fair Win"),
    "21": t("Fair Commission")
};

export const casinoTransactionTypes = {
    0: t("Bet"),
    1: t("Win"),
    2: t("Correction"),
    3: t("Deposit"),
    4: t("Withdraw"),
    5: t("Tip"),
    6: t("Bonus")
};

export const predefinedDateRanges = [
    {name: t("Today"), fromDate: moment().subtract(1, "days").endOf('day'), toDate: moment()},
    {name: t("Last 2 days"), fromDate: moment().subtract(2, "days").startOf('day'), toDate: moment()},
    {name: t("Week"), fromDate: moment().subtract(7, "days").startOf('day'), toDate: moment()},
    {name: t("Month"), fromDate: moment().subtract(1, "months").startOf('day'), toDate: moment()}
];