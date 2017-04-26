import React from 'react';
import Helpers from "../../../helpers/helperFunctions";
import Scroll from "react-scroll";
import Loader from "../loader/";
import Expandable from "../../containers/expandable/";
import {t} from "../../../helpers/translator";

module.exports = function cmsPageTemplate () {
    const Element = Scroll.Element;

    /**
     * @name displayPage
     * @description get page from cms and return page content
     * @param {object} field
     * @returns {object}
     * */
    let displayPage = page => {
        console.log("page", page);
        if (page) {
            return (page.hasContent) ? <div className={"page-container " + page.slug} key={page.id}>
                <Expandable className="page-section" uiKey={"p" + page.id}>
                    <Element name={page.slug}/>
                    <h2>{page.title_plain}</h2>
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
    console.debug("page", this.props);

    /**
     * Recursively checks pages for content(to have non-empty "content" field or children with that field)
     * and marks them with hasContent field
     * @param {Object} page
     * @returns {boolean|*}
     */
    function checkForContent (page) {
        if (page.content) {
            page.hasContent = true;
            page.children.map(checkForContent);
        } else if (!page.children.length) {
            page.hasContent = false;
        } else {
            page.hasContent = page.children.reduce((final, page) => (checkForContent(page) || final), false);
        }
        return page.hasContent;
    }

    if (this.pageType === "page" && this.props.cmsData.loaded && this.props.cmsData.loaded[this.props.params.slug]) {
        checkForContent(this.props.cmsData.data[this.props.params.slug].page);
        return <div className="game-view-wrapper">{displayPage(this.props.cmsData.data[this.props.params.slug].page)}</div>;
    } else if (this.pageType === "promo" && this.props.promotionsLoaded) {
        return <div className="game-view-wrapper">{displayPromotion(this.props.routeParams.slug)}</div>;
    } else {
        return <Loader/>;
    }
};
