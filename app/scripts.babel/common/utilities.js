/**
 * Creazione di un integer random
 * @param  min il valore minimo
 * @param  max il valore massimo
 * @return {integer} un numero random
 */
export function RandomInt(min, max) {
    if(!min) {
        min = 0;
    }
    if(!max) {
        max = 10000000;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
