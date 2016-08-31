interface String {
    format(...replacements: any[]): string;
    contains(value: string): boolean;
}

// http://stackoverflow.com/a/4673436
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match:any, number:number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

// http://stackoverflow.com/a/1978419
if (!String.prototype.contains) {
    String.prototype.contains = function (it) {
        return this.indexOf(it) != -1;
    };
};