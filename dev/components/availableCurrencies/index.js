import React from 'react';
import {t} from "../../helpers/translator";
import Config from "../../config/main";
import PropTypes from 'prop-types';

function repeatOptions () {
    let availableCurrencies = Config.main.availableCurrencies || [];

    return availableCurrencies.map((currencyCode) => (
        <option key={currencyCode} value={currencyCode}>{t(currencyCode)}</option>
        ));
}

function AvailableCurrencies ({selected, onChange}) {
    return <select value={selected} onChange={onChange}>
        { repeatOptions() }
    </select>;
}

AvailableCurrencies.propTypes = {
    selected: PropTypes.string,
    onChange: PropTypes.func
};

export default AvailableCurrencies;