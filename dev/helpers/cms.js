/**
 * Finds page by slug and returns it's id together with all its parent page ids
 * @param {Object} rootPage top page containing others
 * @param {String} slug
 * @returns {Array|null}
 */
export function getPageIdBySLug (rootPage, slug) {
    let id;
    if (rootPage.slug === slug) {
        id = rootPage.id;
    } else if (rootPage.children && rootPage.children.length) {
        id = rootPage.children.reduce((acc, curr) => {
            return getPageIdBySLug(curr, slug) || acc;
        }, null);
    }
    if (Array.isArray(id)) {
        id.push(rootPage.id);
    } else if (id) {
        id = [rootPage.id, id];
    }
    return id;
}

/**
 * Returns page object identified by slug or null if not found
 * @param {Object} rootPage
 * @param {String} slug
 * @returns {Object|null}
 */
export function getPageBySLug (rootPage, slug) {
    if (!rootPage) {
        return null;
    }
    let page = null;
    if (rootPage.slug === slug) {
        page = rootPage;
    } else if (rootPage.children && rootPage.children.length) {
        page = rootPage.children.reduce((acc, curr) => {
            return getPageBySLug(curr, slug) || acc;
        }, null);
    }
    return page;
}

/**
 * Recursively checks pages for content(to have non-empty "content" field or children with that field)
 * and marks them with hasContent field
 * @param {Object} page
 * @returns {boolean|*}
 */
export function checkForContent (page) {
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