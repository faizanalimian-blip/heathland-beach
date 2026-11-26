// Formatting and stock rules shared by page code and backend code.
import { HOMES_URL_PREFIX, TEXT } from 'public/hb-config.js';

const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });
const longDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export function formatPrice(n) {
    return typeof n === 'number' && isFinite(n) ? gbp.format(n) : '';
}

export function formatDate(value) {
    if (!value) return '';
    const d = value instanceof Date ? value : new Date(value);
    return isNaN(d.getTime()) ? '' : longDate.format(d);
}

export function showsPrice(home) {
    return !!(home && home.displayPrice && typeof home.price === 'number' && home.price > 0);
}

export function isReduced(home) {
    return showsPrice(home) && typeof home.previousPrice === 'number' && home.previousPrice > home.price;
}

export function plural(n, one, many) {
    return n + ' ' + (n === 1 ? one : many);
}

export function homeUrl(slug) {
    return slug ? HOMES_URL_PREFIX + slug : '';
}

export function slugify(text) {
    return String(text || '')
        .toLowerCase()
        .normalize('NFKD').replace(/[̀-ͯ]/g, '')
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Card-ready view of a home. Never carries a price number when the price is hidden.
export function toHomeCard(home) {
    const range = home.range && typeof home.range === 'object' ? home.range : null;
    const priced = showsPrice(home);
    const reduced = isReduced(home);
    const badges = [];
    if (home.status === 'Sold') badges.push(TEXT.sold);
    else if (home.status === 'Reserved') badges.push(TEXT.reserved);
    if (reduced && home.status !== 'Sold') badges.push(TEXT.reduced);

    let priceText = TEXT.poa;
    if (home.status === 'Sold') priceText = TEXT.sold;
    else if (priced) priceText = formatPrice(home.price);

    return {
        _id: home._id,
        title: home.title || '',
        slug: home.slug || '',
        url: homeUrl(home.slug),
        rangeTitle: range ? range.title : '',
        rangeSlug: range ? range.slug : '',
        status: home.status,
        bedroomsText: typeof home.bedrooms === 'number' ? plural(home.bedrooms, 'bedroom', 'bedrooms') : '',
        sleepsText: typeof home.sleeps === 'number' ? 'Sleeps ' + home.sleeps : '',
        yearText: home.year ? String(home.year) : '',
        dimensionsText: home.dimensions || '',
        priceText,
        wasPriceText: reduced && home.status !== 'Sold' ? 'Was ' + formatPrice(home.previousPrice) : '',
        badges,
        mainImage: home.mainImage || '',
        imageAlt: (home.title || 'Holiday home') + ', ' + (range ? range.title : 'holiday home') + ' at Heathland Beach'
    };
}
