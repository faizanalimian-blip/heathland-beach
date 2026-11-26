// Home page: featured homes, ranges with live "from" prices, latest news.
import wixLocationFrontend from 'wix-location-frontend';
import { getHomepageData } from 'backend/homes.web';
import { setText, setImage, setBoxBackground, setLink, onClickGo, show } from 'public/hb-ui.js';

$w.onReady(async function () {
    setupFeaturedRepeater();
    setupRangesRepeater();
    setupNewsRepeater();

    let data;
    try {
        data = await getHomepageData();
    } catch (err) {
        console.error('Homepage data failed', err);
        show($w, '#featuredSection', false);
        show($w, '#newsSection', false);
        return;
    }

    $w('#featuredRepeater').data = data.featured;
    show($w, '#featuredSection', data.featured.length > 0);
    if (data.totalListed) setLink($w, '#allHomesBtn', '/homes', 'View all ' + data.totalListed + ' homes');

    $w('#rangesRepeater').data = data.ranges;

    $w('#newsRepeater').data = data.posts;
    show($w, '#newsSection', data.posts.length > 0);
});

function setupFeaturedRepeater() {
    $w('#featuredRepeater').onItemReady(($item, home) => {
        setImage($item, '#featuredImage', home.mainImage, home.imageAlt);
        setText($item, '#featuredRange', home.rangeTitle);
        setText($item, '#featuredTitle', home.title);
        setText($item, '#featuredBeds', home.bedroomsText);
        setText($item, '#featuredYear', home.yearText);
        setText($item, '#featuredSleeps', home.sleepsText);
        setText($item, '#featuredSize', home.dimensionsText);
        setText($item, '#featuredPrice', home.priceText);
        setText($item, '#featuredWasPrice', home.wasPriceText);
        setText($item, '#featuredBadge', home.badges.join('  ·  '));
        setLink($item, '#featuredViewBtn', home.url);
        onClickGo($item, '#featuredItemBox', () => wixLocationFrontend.to(home.url));
    });
}

function setupRangesRepeater() {
    $w('#rangesRepeater').onItemReady(($item, range) => {
        setBoxBackground($item, '#rangeItemBox', range.image);
        setImage($item, '#rangeImage', range.image, range.title);
        setText($item, '#rangeTitle', range.title);
        setText($item, '#rangeStrapline', range.strapline);
        setText($item, '#rangeFromPrice', range.fromText);
        setLink($item, '#rangeViewBtn', range.url);
        onClickGo($item, '#rangeItemBox', () => wixLocationFrontend.to(range.url));
    });
}

function setupNewsRepeater() {
    $w('#newsRepeater').onItemReady(($item, post) => {
        setImage($item, '#newsImage', post.image, post.title);
        setText($item, '#newsCategory', post.category);
        setText($item, '#newsDate', post.dateText);
        setText($item, '#newsTitle', post.title);
        setText($item, '#newsExcerpt', post.excerpt);
        setLink($item, '#newsReadMoreBtn', post.url);
        onClickGo($item, '#newsItemBox', () => wixLocationFrontend.to(post.url));
    });
}
