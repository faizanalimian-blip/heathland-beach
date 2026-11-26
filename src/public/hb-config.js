// Site-wide settings. Change values here, not in page code.

export const SITE = {
    name: 'Heathland Beach Holiday Park',
    phone: '01502 740337',
    phoneHref: 'tel:+441502740337',
    email: 'sales@heathlandbeach.co.uk'
};

export const COLLECTIONS = {
    homes: 'HolidayHomes',
    ranges: 'Ranges',
    locations: 'Locations',
    locationFaqs: 'LocationFaqs',
    testimonials: 'Testimonials',
    submissions: 'FormSubmissions',
    blogPosts: 'Blog/Posts'
};

// Allowed values for the fixed-choice text fields (enforced in backend/data.js).
export const HOME_STATUS = ['Available', 'Reserved', 'Sold'];
export const HOME_CONDITIONS = ['New', 'Pre-loved'];
export const MANUFACTURERS = ['Willerby', 'ABI', 'Victory', 'Delta', 'Atlas', 'Regal', 'Europa', 'BK', 'Other'];

// Statuses that appear in listings. Sold homes never list.
export const LISTED_STATUS = ['Available', 'Reserved'];

export const HOMES_URL_PREFIX = '/homes/';
export const PAGE_SIZE = 9;
export const FEATURED_LIMIT = 3;
export const LATEST_POSTS_LIMIT = 3;

// Lower bound inclusive, upper bound exclusive.
export const PRICE_BANDS = [
    { value: 'under-30000', label: 'Under £30,000', min: 0, max: 30000 },
    { value: '30000-60000', label: '£30,000 to £60,000', min: 30000, max: 60000 },
    { value: '60000-100000', label: '£60,000 to £100,000', min: 60000, max: 100000 },
    { value: '100000-150000', label: '£100,000 to £150,000', min: 100000, max: 150000 },
    { value: 'over-150000', label: 'Over £150,000', min: 150000, max: null }
];

export const SORTS = [
    { value: 'price-asc', label: 'Price: low to high' },
    { value: 'price-desc', label: 'Price: high to low' },
    { value: 'newest', label: 'Newest first' }
];

export const TEXT = {
    poa: 'Price on application',
    reserved: 'Reserved',
    reduced: 'Reduced',
    sold: 'Sold'
};
