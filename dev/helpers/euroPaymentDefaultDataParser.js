export function defaultDataParserForEuroPayments (data) {
    let collected = {};

    try {
        data.details.fields.reduce((current, item) => {
            current[item.name] = item.value;
            return current;
        }, collected);
    } catch (e) {
        return data;
    }

    return collected;
}