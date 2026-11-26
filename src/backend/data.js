// Data hooks. Hook names are <collection ID>_<event>.
import wixData from 'wix-data';
import { COLLECTIONS, HOME_STATUS, HOME_CONDITIONS, MANUFACTURERS } from 'public/hb-config.js';
import { slugify } from 'public/hb-format.js';

const SYSTEM = { suppressAuth: true, suppressHooks: true };

// Match a value to its allowed spelling, ignoring case and spacing.
function normalise(value, allowed, label) {
    if (value === undefined || value === null || value === '') return value;
    const key = v => String(v).toLowerCase().replace(/[\s_-]+/g, '');
    const hit = allowed.find(a => key(a) === key(value));
    if (!hit) throw new Error(label + ' must be one of: ' + allowed.join(', ') + '.');
    return hit;
}

async function existsElsewhere(field, value, ownId) {
    let q = wixData.query(COLLECTIONS.homes).eq(field, value);
    if (ownId) q = q.ne('_id', ownId);
    return (await q.count(SYSTEM)) > 0;
}

async function uniqueSlug(item) {
    const base = slugify(item.slug || item.title) || 'home';
    const candidates = [base];
    if (item.condition === 'Pre-loved' && !base.endsWith('-pre-loved')) candidates.push(base + '-pre-loved');
    for (let n = 2; n < 50; n++) candidates.push(base + '-' + n);
    for (const c of candidates) {
        if (!(await existsElsewhere('slug', c, item._id))) return c;
    }
    throw new Error('Could not create a unique URL slug for "' + item.title + '".');
}

async function prepareHome(item) {
    item.status = normalise(item.status || 'Available', HOME_STATUS, 'Status');
    item.condition = normalise(item.condition || 'New', HOME_CONDITIONS, 'Condition');
    item.manufacturer = normalise(item.manufacturer, MANUFACTURERS, 'Manufacturer');

    if (item.stockReference) {
        item.stockReference = String(item.stockReference).trim().toUpperCase();
        if (await existsElsewhere('stockReference', item.stockReference, item._id)) {
            throw new Error('Stock reference ' + item.stockReference + ' is already used by another home.');
        }
    }

    // Keep an edited slug as typed (cleaned); only fall back to the title when empty.
    item.slug = await uniqueSlug(item);

    if (!item.dateAdded) {
        const d = new Date();
        item.dateAdded = d.toISOString().slice(0, 10);
    }
    return item;
}

export async function HolidayHomes_beforeInsert(item) {
    return prepareHome(item);
}

export async function HolidayHomes_beforeUpdate(item) {
    return prepareHome(item);
}
