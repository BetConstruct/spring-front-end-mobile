import React from 'react';
import {t} from "../../helpers/translator";

/**
 * Component which renders a <select> with countries list
 * @param {String} selected selected country code
 * @param {Function} onChange callback function to call on change
 * @returns {XML}
 * @constructor
 */
function Countries ({selected, onChange}) {
    return <select defaultValue={selected} onChange={onChange}>
        <option value="AU" key="AU">{t("Australia")}</option>
        <option value="AD" key="AD">{t("Andorra")}</option>
        <option value="AE" key="AE">{t("UAE")}</option>
        <option value="AF" key="AF">{t("Afghanistan")}</option>
        <option value="AG" key="AG">{t("Antigua and Barbuda")}</option>
        <option value="AL" key="AL">{t("Albania")}</option>
        <option value="AM" key="AM">{t("Armenia")}</option>
        <option value="AO" key="AO">{t("Angola")}</option>
        <option value="AR" key="AR">{t("Argentina")}</option>
        <option value="AS" key="AS">{t("American Samoa")}</option>
        <option value="AT" key="AT">{t("Austria")}</option>
        <option value="AW" key="AW">{t("Aruba")}</option>
        <option value="AZ" key="AZ">{t("Azerbaijan")}</option>
        <option value="BA" key="BA">{t("Bosnia and Herzegovina")}</option>
        <option value="BB" key="BB">{t("Barbados")}</option>
        <option value="BD" key="BD">{t("Bangladesh")}</option>
        <option value="BE" key="BE">{t("Belgium")}</option>
        <option value="BF" key="BF">{t("Burkina Faso")}</option>
        <option value="BG" key="BG">{t("Bulgaria")}</option>
        <option value="BH" key="BH">{t("Bahrain")}</option>
        <option value="BI" key="BI">{t("Burundi")}</option>
        <option value="BJ" key="BJ">{t("Benin")}</option>
        <option value="BM" key="BM">{t("Bermuda")}</option>
        <option value="BN" key="BN">{t("Brunei")}</option>
        <option value="BO" key="BO">{t("Bolivia")}</option>
        <option value="BR" key="BR">{t("Brazil")}</option>
        <option value="BS" key="BS">{t("Bahamas")}</option>
        <option value="BT" key="BT">{t("Bhutan")}</option>
        <option value="BW" key="BW">{t("Botswana")}</option>
        <option value="BY" key="BY">{t("Belarus")}</option>
        <option value="BZ" key="BZ">{t("Belize")}</option>
        <option value="CA" key="CA">{t("Canada")}</option>
        <option value="CD" key="CD">{t("Democratic Republic of the Congo")}</option>
        <option value="CF" key="CF">{t("Central African Republic")}</option>
        <option value="CG" key="CG">{t("Republic of the Congo")}</option>
        <option value="CH" key="CH">{t("Switzerland")}</option>
        <option value="CI" key="CI">{t("Cote d'Ivoire")}</option>
        <option value="CK" key="CK">{t("Cook Islands")}</option>
        <option value="CL" key="CL">{t("Chile")}</option>
        <option value="CM" key="CM">{t("Cameroon")}</option>
        <option value="CN" key="CN">{t("China")}</option>
        <option value="CO" key="CO">{t("Colombia")}</option>
        <option value="CR" key="CR">{t("Costa Rica")}</option>
        <option value="CU" key="CU">{t("Cuba")}</option>
        <option value="CV" key="CV">{t("Cape Verde")}</option>
        <option value="CY" key="CY">{t("Cyprus")}</option>
        <option value="CZ" key="CZ">{t("Czech Republic")}</option>
        <option value="DE" key="DE">{t("Germany")}</option>
        <option value="DJ" key="DJ">{t("Djibouti")}</option>
        <option value="DK" key="DK">{t("Denmark")}</option>
        <option value="DM" key="DM">{t("Dominica")}</option>
        <option value="DO" key="DO">{t("Dominican Republic")}</option>
        <option value="DZ" key="DZ">{t("Algeria")}</option>
        <option value="EC" key="EC">{t("Ecuador")}</option>
        <option value="EE" key="EE">{t("Estonia")}</option>
        <option value="EG" key="EG">{t("Egypt")}</option>
        <option value="ER" key="ER">{t("Eritrea")}</option>
        <option value="ES" key="ES">{t("Spain")}</option>
        <option value="ET" key="ET">{t("Ethiopia")}</option>
        <option value="FI" key="FI">{t("Finland")}</option>
        <option value="FJ" key="FJ">{t("Fiji")}</option>
        <option value="FM" key="FM">{t("Federated States of Micronesia")}</option>
        <option value="FO" key="FO">{t("Faroe Islands")}</option>
        <option value="GA" key="GA">{t("Gabon")}</option>
        <option value="GD" key="GD">{t("Grenada")}</option>
        <option value="GE" key="GE">{t("Georgia")}</option>
        <option value="GH" key="GH">{t("Ghana")}</option>
        <option value="GM" key="GM">{t("Gambia")}</option>
        <option value="GN" key="GN">{t("Guinea")}</option>
        <option value="GQ" key="GQ">{t("Equatorial Guinea")}</option>
        <option value="GR" key="GR">{t("Greece")}</option>
        <option value="GT" key="GT">{t("Guatemala")}</option>
        <option value="GU" key="GU">{t("Guam")}</option>
        <option value="GW" key="GW">{t("Guinea-Bissau")}</option>
        <option value="GY" key="GY">{t("Guyana")}</option>
        <option value="HK" key="HK">{t("Hong Kong")}</option>
        <option value="HN" key="HN">{t("Honduras")}</option>
        <option value="HR" key="HR">{t("Croatia")}</option>
        <option value="HT" key="HT">{t("Republic of Haiti")}</option>
        <option value="HU" key="HU">{t("Hungary")}</option>
        <option value="ID" key="ID">{t("Indonesia")}</option>
        <option value="IE" key="IE">{t("Ireland")}</option>
        <option value="IL" key="IL">{t("Israel")}</option>
        <option value="IN" key="IN">{t("India")}</option>
        <option value="IQ" key="IQ">{t("Iraq")}</option>
        <option value="IR" key="IR">{t("Iran")}</option>
        <option value="IS" key="IS">{t("Iceland")}</option>
        <option value="IT" key="IT">{t("Italy")}</option>
        <option value="JM" key="JM">{t("Jamaica")}</option>
        <option value="JO" key="JO">{t("Jordan")}</option>
        <option value="JP" key="JP">{t("Japan")}</option>
        <option value="KE" key="KE">{t("Kenya")}</option>
        <option value="KG" key="KG">{t("Kyrgyzstan")}</option>
        <option value="KH" key="KH">{t("Cambodia")}</option>
        <option value="KI" key="KI">{t("Kiribati")}</option>
        <option value="KM" key="KM">{t("Comoros")}</option>
        <option value="KN" key="KN">{t("Saint Kitts and Nevis")}</option>
        <option value="KP" key="KP">{t("DPRK")}</option>
        <option value="KR" key="KR">{t("South Korea")}</option>
        <option value="KW" key="KW">{t("Kuwait")}</option>
        <option value="KY" key="KY">{t("Cayman Islands")}</option>
        <option value="KZ" key="KZ">{t("Kazakhstan")}</option>
        <option value="LA" key="LA">{t("Laos")}</option>
        <option value="LB" key="LB">{t("Lebanon")}</option>
        <option value="LC" key="LC">{t("Saint Lucia")}</option>
        <option value="LI" key="LI">{t("Liechtenstein")}</option>
        <option value="LK" key="LK">{t("Sri Lanka")}</option>
        <option value="LR" key="LR">{t("Liberia")}</option>
        <option value="LS" key="LS">{t("Lesotho")}</option>
        <option value="LT" key="LT">{t("Lithuania")}</option>
        <option value="LU" key="LU">{t("Luxemburg")}</option>
        <option value="LV" key="LV">{t("Latvia")}</option>
        <option value="LY" key="LY">{t("Libya")}</option>
        <option value="MA" key="MA">{t("Morocco")}</option>
        <option value="MC" key="MC">{t("Monaco")}</option>
        <option value="MD" key="MD">{t("Moldavia")}</option>
        <option value="ME" key="ME">{t("Montenegro")}</option>
        <option value="MG" key="MG">{t("Madagascar")}</option>
        <option value="MK" key="MK">{t("Macedonia")}</option>
        <option value="ML" key="ML">{t("Mali")}</option>
        <option value="MM" key="MM">{t("Myanmar")}</option>
        <option value="MN" key="MN">{t("Mongolia")}</option>
        <option value="MR" key="MR">{t("Mauritania")}</option>
        <option value="MT" key="MT">{t("Malta")}</option>
        <option value="MU" key="MU">{t("Mauritius")}</option>
        <option value="MV" key="MV">{t("Maldives")}</option>
        <option value="MW" key="MW">{t("Malawi")}</option>
        <option value="MX" key="MX">{t("Mexico")}</option>
        <option value="MY" key="MY">{t("Malaysia")}</option>
        <option value="MZ" key="MZ">{t("Mozambique")}</option>
        <option value="NA" key="NA">{t("Namibia")}</option>
        <option value="NE" key="NE">{t("Niger")}</option>
        <option value="NG" key="NG">{t("Nigeria")}</option>
        <option value="NI" key="NI">{t("Nicaragua")}</option>
        <option value="NL" key="NL">{t("Netherlands")}</option>
        <option value="NO" key="NO">{t("Norway")}</option>
        <option value="NP" key="NP">{t("Nepal")}</option>
        <option value="NR" key="NR">{t("Nauru")}</option>
        <option value="NZ" key="NZ">{t("New Zealand")}</option>
        <option value="OM" key="OM">{t("Oman")}</option>
        <option value="PA" key="PA">{t("Panama")}</option>
        <option value="PE" key="PE">{t("Peru")}</option>
        <option value="PG" key="PG">{t("Papua New Guinea")}</option>
        <option value="PH" key="PH">{t("Philippines")}</option>
        <option value="PK" key="PK">{t("Pakistan")}</option>
        <option value="PL" key="PL">{t("Poland")}</option>
        <option value="PR" key="PR">{t("Puerto Rico")}</option>
        <option value="PS" key="PS">{t("Palestine")}</option>
        <option value="PT" key="PT">{t("Portugal")}</option>
        <option value="PW" key="PW">{t("Palau")}</option>
        <option value="PY" key="PY">{t("Paraguay")}</option>
        <option value="QA" key="QA">{t("Qatar")}</option>
        <option value="RO" key="RO">{t("Romania")}</option>
        <option value="RS" key="RS">{t("Serbia")}</option>
        <option value="RU" key="RU">{t("Russia")}</option>
        <option value="RW" key="RW">{t("Rwanda")}</option>
        <option value="SA" key="SA">{t("Saudi Arabia")}</option>
        <option value="SB" key="SB">{t("Solomon Islands")}</option>
        <option value="SC" key="SC">{t("Seychelles")}</option>
        <option value="SD" key="SD">{t("Sudan")}</option>
        <option value="SE" key="SE">{t("Sweden")}</option>
        <option value="SG" key="SG">{t("Singapore")}</option>
        <option value="SI" key="SI">{t("Slovenia")}</option>
        <option value="SK" key="SK">{t("Slovakia")}</option>
        <option value="SL" key="SL">{t("Sierra Leone")}</option>
        <option value="SM" key="SM">{t("San Marino")}</option>
        <option value="SN" key="SN">{t("Senegal")}</option>
        <option value="SO" key="SO">{t("Somalia")}</option>
        <option value="SR" key="SR">{t("Republic of Suriname")}</option>
        <option value="ST" key="ST">{t("Sao Tome and Principe")}</option>
        <option value="SV" key="SV">{t("Salvador")}</option>
        <option value="SY" key="SY">{t("Syria")}</option>
        <option value="SZ" key="SZ">{t("Swaziland")}</option>
        <option value="TD" key="TD">{t("Chad")}</option>
        <option value="TG" key="TG">{t("Togo")}</option>
        <option value="TH" key="TH">{t("Thailand")}</option>
        <option value="TJ" key="TJ">{t("Tadjikistan")}</option>
        <option value="TL" key="TL">{t("Timor-Leste")}</option>
        <option value="TM" key="TM">{t("Turkmenistan")}</option>
        <option value="TN" key="TN">{t("Tunisia")}</option>
        <option value="TO" key="TO">{t("Tonga")}</option>
        <option value="TR" key="TR">{t("Turkey")}</option>
        <option value="TT" key="TT">{t("Trinidad and Tobago")}</option>
        <option value="TV" key="TV">{t("Tuvalu")}</option>
        <option value="TW" key="TW">{t("Taiwan")}</option>
        <option value="TZ" key="TZ">{t("Tanzania")}</option>
        <option value="UA" key="UA">{t("Ukraine")}</option>
        <option value="UG" key="UG">{t("Uganda")}</option>
        <option value="GB" key="GB">{t("United Kingdom")}</option>
        <option value="UY" key="UY">{t("Uruguay")}</option>
        <option value="UZ" key="UZ">{t("Uzbekistan")}</option>
        <option value="VC" key="VC">{t("Saint Vincent and the Grenadines")}</option>
        <option value="VE" key="VE">{t("Venezuela")}</option>
        <option value="VG" key="VG">{t("British Virgin Islands")}</option>
        <option value="VI" key="VI">{t("United States Virgin Islands")}</option>
        <option value="VN" key="VN">{t("Vietnam")}</option>
        <option value="VU" key="VU">{t("Vanuatu")}</option>
        <option value="WS" key="WS">{t("Samoa")}</option>
        <option value="YE" key="YE">{t("Yemen")}</option>
        <option value="ZA" key="ZA">{t("Republic of South Africa")}</option>
        <option value="ZM" key="ZM">{t("Zambia")}</option>
        <option value="ZW" key="ZW">{t("Zimbabwe")}</option>
    </select>;
}

Countries.propTypes = {
    selected: React.PropTypes.string,
    onChange: React.PropTypes.func
};

export default Countries;