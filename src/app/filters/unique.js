define(['./module'], directives => {
    directives.filter("unique", [() => (arr, field) => {
        let o = {}, i, l = arr !== undefined ? arr.length : 0, r = [];
        for (i = 0; i < l; i++) {
            o[arr[i][field]] = arr[i];
        }
        for (i in o) {
            r.push(o[i]);
        }
        return r;
    }]);
});