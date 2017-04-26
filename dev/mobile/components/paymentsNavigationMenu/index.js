import React from 'react';
import {t} from "../../../helpers/translator";
import {Link} from 'react-router';
import Config from '../../../config/main';

export default function PaymentsNavigationMenu () {
    return (
        <div className="page-menu-contain">
            <ul>
                <li>
                    <Link activeClassName="active"
                          to="/balance/deposit"><span>{t("Deposit")}</span></Link>
                </li>
                <li>
                    <Link activeClassName="active"
                          to="/balance/withdraw"><span>{t("Withdraw")}</span></Link>
                </li>
                {
                    Config.main.GmsPlatformMultipleBalance
                        ? (<li><Link activeClassName="active"
                                     to="/balance/transfer"><span>{t("Transfer")}</span></Link></li>)
                        : (null)
                }
                <li>
                    <Link activeClassName="active"
                          to="/balance/history"><span>{t("History")}</span></Link>
                </li>
            </ul>
        </div>
    );
}