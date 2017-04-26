import React from 'react';
import {t} from "../../helpers/translator";
import Config from "../../config/main";

function repeatOptions () {
    let availableCurrencies = Config.main.availableCurrencies || [];

    return availableCurrencies.map((currencyCode) => (
        <option key={currencyCode} value={currencyCode}>{t(currencyCode)}</option>
        ));
}

function AvailableCurrencies ({selected, onChange}) {
    return <select defaultValue={selected} onChange={onChange}>
        { repeatOptions() }
    </select>;
}

AvailableCurrencies.propTypes = {
    selected: React.PropTypes.string,
    onChange: React.PropTypes.func
};

export default AvailableCurrencies;