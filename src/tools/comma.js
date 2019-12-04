export function comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

export function uncomma(str) {
    str = String(str);
    return str.replace(/[^\d]+/g, '');
}

export function inputNumberFormat(value) {
    return numberWithCommas(uncomma(value));
}

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}