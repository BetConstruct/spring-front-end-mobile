import React from 'react';
import {Link} from 'react-router';
import Expandable from "../../containers/expandable/";
import Loader from "../../components/loader/";
import {t} from "../../../helpers/translator";
import Config from "../../../config/main";

module.exports = function promotionsTemplate () {
    if (this.props.loaded) {
        let promotions = this.props.cmsData.data[this.props.slug].posts,
            filteredPromotions = promotions && promotions.filter((promo) => {
                return promo.actual ? promo : null;
            });
        if (!promotions) {
            return null;
        }
        return <div className="promotions">
            <Expandable className="title-row-u-m" uiKey="rm_promo">
                <div className="icon-view-u-m promo-view-m"/>
                <p><span>{t("Promotions")}<i>{Config.cms.filterPromotions ? filteredPromotions.length : promotions.length}</i></span>
                </p>
                <i className="arrow-u-m"/>
            </Expandable>
            <div className="open-view-single-u-m">
                <ul>
                    {Config.cms.filterPromotions
                        ? filteredPromotions.map(promo =>
                            <li key={promo.id}>
                                <Link to={`/promo/${promo.id}/${encodeURIComponent(promo.title)}`} onClick={this.props.closeRightMenu()}>
                                    <p className="name-sub-u-m-title">
                                        <i className="arrow-u-m"/>
                                        <span>{promo.title}</span>
                                    </p>
                                </Link>
                            </li>
                        )
                        : promotions.map(promo =>
                            <li key={promo.id}>
                                <Link to={`/promo/${promo.id}/${encodeURIComponent(promo.title)}`} onClick={this.props.closeRightMenu()}>
                                    <p className="name-sub-u-m-title">
                                        <i className="arrow-u-m"/>
                                        <span>{promo.title}</span>
                                    </p>
                                </Link>
                            </li>
                        )
                    }
                </ul>
            </div>
        </div>;
    } else {
        return <Loader/>;
    }

};
