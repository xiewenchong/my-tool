function countLines(ele) {
    var styles = window.getComputedStyle(ele, null);
    var lh = parseInt(styles.lineHeight, 10);
    var h = parseInt(styles.height, 10);
    var lc = Math.round(h / lh);
    return lc;
}