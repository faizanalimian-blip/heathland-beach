// Stock queries for page code. Everything returned goes through toHomeCard,
// so a hidden price never reaches the browser.
import { Permissions, webMethod } from 'wix-web-module';
import wixData from 'wix-data';
import { COLLECTIONS, LISTED_STATUS, FEATURED_LIMIT, LATEST_POSTS_LIMIT, TEXT } from 'public/hb-config.js';
import { toHomeCard, showsPrice, formatPrice, formatDate } from 'public/hb-format.js';

function listedQuery() {
    return wixData.query(COLLECTIONS.homes)
        .eq('published', true)
        .hasSome('status', LISTED_STATUS);
}

async function findAll(query) {
    let res = await query.limit(1000).find();
    let items = res.items;
    while (res.hasNext()) {
        res = await res.next();
        items = items.concat(res.items);
    }
    return items;
}

function refId(value) {
    return value && typeof value === 'object' ? value._id : value;
}

// "From" price per range:
// 1. lowest shown price among Available homes in the range
// 2. listed homes but none shows a price: Price on application
// 3. no listed homes: the fallback fromPrice on the Range item
function fromPriceText(range, listed) {
    const inRange = listed.filter(h => refId(h.range) === range._id);
    const prices = inRange
        .filter(h => h.status === 'Available' && showsPrice(h))
        .map(h => h.price);
    if (prices.length) return 'From ' + formatPrice(Math.min(...prices));
    if (inRange.length) return TEXT.poa;
    return range.fromPrice ? 'From ' + formatPrice(range.fromPrice) : TEXT.poa;
}

async function getRangeCards(listed) {
    const res = await wixData.query(COLLECTIONS.ranges).ascending('sortOrder').limit(50).find();
    return res.items.map(r => ({
        _id: r._id,
        title: r.title || '',
        slug: r.slug || '',
        strapline: r.strapline || '',
        image: r.image || '',
        url: r.path || '',
        fromText: fromPriceText(r, listed)
    }));
}

async function getFeatured(limit) {
    const res = await listedQuery()
        .eq('featured', true)
        .include('range')
        .descending('dateAdded')
        .limit(limit)
        .find();
    return res.items.map(toHomeCard);
}

async function getLatestPosts(limit) {
    const base = () => wixData.query(COLLECTIONS.blogPosts).descending('publishedDate').limit(limit);
    let items;
    try {
        items = (await base().include('mainCategory').find()).items;
    } catch (e) {
        try {
            items = (await base().find()).items;
        } catch (err) {
            // Blog not installed or not reachable: the page hides the section.
            return [];
        }
    }
    return items.map(p => ({
        _id: p._id,
        title: p.title || '',
        excerpt: p.excerpt || '',
        image: p.coverImage || '',
        dateText: formatDate(p.publishedDate),
        category: p.mainCategory && typeof p.mainCategory === 'object' ? (p.mainCategory.label || '') : '',
        url: p.postPageURL || ''
    }));
}

export const getHomepageData = webMethod(Permissions.Anyone, async () => {
    const listed = await findAll(listedQuery().fields('status', 'price', 'displayPrice', 'range'));
    const prices = listed.filter(h => h.status === 'Available' && showsPrice(h)).map(h => h.price);

    const [featured, ranges, posts] = await Promise.all([
        getFeatured(FEATURED_LIMIT),
        getRangeCards(listed),
        getLatestPosts(LATEST_POSTS_LIMIT)
    ]);

    return {
        featured,
        ranges,
        posts,
        totalListed: listed.length,
        lowestPriceText: prices.length ? formatPrice(Math.min(...prices)) : ''
    };
});
