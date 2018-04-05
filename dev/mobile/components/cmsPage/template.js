import React from 'react';
import Helpers from "../../../helpers/helperFunctions";
import Scroll from "react-scroll";
import Loader from "../loader/";
import Expandable from "../../containers/expandable/";
import {t} from "../../../helpers/translator";
import {checkForContent} from "../../../helpers/cms";

module.exports = function cmsPageTemplate () {
    const Element = Scroll.Element;
    const scroller = Scroll.scroller;

    scroller.scrollTo(this.props.params.section, {
        duration: 100,
        smooth: true
    });

    /**
     * @name displayPage
     * @description get page from cms and return page content
     * @param {object} field
     * @returns {object}
     * */
    let matched;
    let displayPage = page => {
        if (page) {
            return (page.hasContent) ? <div className={"page-container " + (page.slug || page.title)} key={page.id}>
                <Expandable openAnywhere={page.slug === this.props.params.slug || page.title === this.props.params.section || (() => {
                    const iterateOverChildren = (subPage) => {
                        if (subPage && !matched) {
                            if (subPage.title === this.props.params.section) {
                                return true;
                            } else if (subPage.children) {
                                return iterateOverChildren(subPage.children);
                            }
                        }
                    };
                    matched = page.children.map(iterateOverChildren).indexOf(true) !== -1;
                    return matched;
                })()} className="page-section" uiKey={"p" + page.id}>
                    <Element name={page.title}/>
                    <h2>{t(page.title_plain)}</h2>
                </Expandable>
                <div dangerouslySetInnerHTML={{__html: page.content}} className="page-content"></div>
                {page.children.map(displayPage)}
            </div> : null;
        } else {
            return <p className="page-no-found-t-m">{t("Page not found")}</p>;
        }
    };

    /**
     * @name displayPromotion
     * @description get promotions from cms and return page content
     * @param {number} promoId
     * @returns {object}
     * */
    let displayPromotion = promoId => {
        let promo = Helpers.getArrayObjectElementHavingFieldValue(this.props.promotionsData.posts, "id", promoId);
        if (promo) {
            return <div className="promo-info-container">
                <h1>{promo.title}</h1>
                { promo.image ? <div className="img-p-wrapper-m"><img src={promo.image} alt=""/></div> : null }
                <div className="promo-text-box" dangerouslySetInnerHTML={{__html: promo.content}}></div>
            </div>;
        } else {
            return <p className="page-no-found-t-m">{t("Page not found")}</p>;
        }
    };

    if (this.pageType === "page" && this.props.cmsData.loaded && this.props.cmsData.loaded[this.props.params.slug]) {
        checkForContent(this.props.cmsData.data[this.props.params.slug].page);
        return <div className="game-view-wrapper">{displayPage(this.props.cmsData.data[this.props.params.slug].page)}</div>;
    } else if (this.pageType === "promo" && this.props.promotionsLoaded) {
        return <div className="game-view-wrapper">{displayPromotion(this.props.routeParams.slug)}</div>;
    } else {
        return <Loader/>;
    }
};
