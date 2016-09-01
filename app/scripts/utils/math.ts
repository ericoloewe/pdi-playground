interface Math {
    average(numbers: Array<number>): number;
    median(numbers: Array<number>): number;
    mode(numbers: Array<number>): number;
    variance(numbers: Array<number>): number;
    histogram(max: number, numbers: Array<number>): Array<number>;
}

Math.average = function (numbers: Array<number>) {
    return numbers.reduce(function (n1, n2) {
        return n1 + n2;
    }) / numbers.length;
}

Math.median = function (numbers: Array<number>) {
    numbers.sort();
    return numbers[Math.floor(numbers.length / 2)];
}

Math.mode = function (numbers: Array<number>) {
    var maxValue = numbers.reduce(function (n1, n2) { return n1 > n2 ? n1 : n2; });
    var histogram = Math.histogram(maxValue, numbers)
    return histogram.indexOf(Math.max.apply(null, histogram));
}

Math.variance = function (numbers: Array<number>) {
    var average = Math.average(numbers);
    return numbers.reduce(function (n1, n2) {
        return n1 + Math.pow((n2 - average), 2);
    }) / numbers.length;
}

Math.histogram = function (max: number, numbers: Array<number>) {
    var histogram = new Array();

    for (var i = 0; i <= max; i++) {
        histogram[i] = 0;
    }

    numbers.forEach(function (num, i) {
        histogram[num] += 1;
    });

    return histogram;
}