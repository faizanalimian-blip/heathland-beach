// Small helpers for page code. Each one skips elements that are not on the page,
// so an optional element can be added later in the editor without code changes.

function el($scope, id) {
    try {
        const e = $scope(id);
        return e && e.id ? e : null;
    } catch (err) {
        return null;
    }
}

export function setText($scope, id, value) {
    const e = el($scope, id);
    if (!e) return;
    if (value) {
        e.text = String(value);
        if (e.expand) e.expand();
    } else if (e.collapse) {
        e.collapse();
    }
}

export function setImage($scope, id, src, alt) {
    const e = el($scope, id);
    if (!e || !src) return;
    e.src = src;
    if (alt !== undefined) e.alt = alt;
}

export function setBoxBackground($scope, id, src) {
    const e = el($scope, id);
    if (!e || !src || !e.background) return;
    e.background.src = src;
}

export function setLink($scope, id, url, label) {
    const e = el($scope, id);
    if (!e || !url) return;
    e.link = url;
    e.target = '_self';
    if (label) e.label = label;
}

export function onClickGo($scope, id, handler) {
    const e = el($scope, id);
    if (e && e.onClick) e.onClick(handler);
}

export function show($scope, id, visible) {
    const e = el($scope, id);
    if (!e) return;
    if (visible) {
        if (e.expand) e.expand();
        if (e.show) e.show();
    } else if (e.collapse) {
        e.collapse();
    }
}
