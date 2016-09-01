
class Convert {
    public static matrixToArray(matrix: Array<Array<any>>): Array<any> {
        return matrix.reduce(function (a1, a2) {
            return a1.concat(a2);
        }, []);
    }
}