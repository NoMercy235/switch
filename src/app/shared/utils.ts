import { Cache } from "./motion-change-logic.service";

export class Utils {

    static capitalizeFirstLetter(value: any): string {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    public static isBetween(val: number, min: number, max: number, strict: boolean = false): boolean {
        return strict ? val > min && val < max : val >= min && val <= max;
    }

    public static cacheIsBetween(cached: Cache[], min: number, max: number): boolean {
        const cache = Utils.arrCacheAverage(cached);
        return cache.accel.x > min && cache.accel.y > min && cache.accel.z > min &&
            cache.gyro.x > min && cache.gyro.y > min && cache.gyro.z > min &&
            cache.accel.x < max && cache.accel.y < max && cache.accel.z < max &&
            cache.gyro.x < max && cache.gyro.y < max && cache.gyro.z < max;

    }

    public static arrAverage(arr: number[]): number {
        return arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
    }

    public static arrCacheAverage(cached: Cache[]): Cache {
        return Utils.applyToCache(Utils.arrAverage, cached);
    }

    public static hasLowDeviation(obj: { x: number, y: number, z: number }, val: number, margin: number = 1): boolean {
        return (obj.x >= val - margin && obj.x <= val + margin) &&
            (obj.y >= val - margin && obj.y <= val + margin) &&
            (obj.z >= val - margin && obj.z <= val + margin);
    }

    public static cacheLowDeviation(obj: Cache, val: number, margin: number = 1): boolean {
        return Utils.hasLowDeviation(obj.accel, val, margin) && Utils.hasLowDeviation(obj.gyro, val, margin);
    }

    public static standardDeviation(values: number[]): number {
        const avg = Utils.arrAverage(values);

        const squareDiffs = values.map(function(value){
            const diff = value - avg;
            return diff * diff;
        });

        const avgSquareDiff = Utils.arrAverage(squareDiffs);

        return Math.sqrt(avgSquareDiff);
    }

    public static cacheStandardDeviation(cached: Cache[]): Cache {
        return Utils.applyToCache(Utils.standardDeviation, cached);
    }

    public static diffDeviations(dev1: Cache, dev2: Cache): Cache {
        return {
            accel: {
                x: dev2.accel.x - dev1.accel.x,
                y: dev2.accel.y - dev1.accel.y,
                z: dev2.accel.z - dev1.accel.z,
            },
            gyro: {
                x: dev2.accel.x - dev1.accel.x,
                y: dev2.accel.y - dev1.accel.y,
                z: dev2.accel.z - dev1.accel.z,
            },
        }
    }

    public static deviationLowerThan(dev: Cache, number): boolean {
        return dev.accel.x < number && dev.accel.y < number && dev.accel.z < number &&
            dev.gyro.x < number && dev.gyro.y < number && dev.gyro.z < number;
    }

    public static getAccelValue(cache: Cache): number {
        return cache.accel.x * cache.accel.x + cache.accel.y * cache.accel.y + cache.accel.z * cache.accel.z;
    }

    public static removeExtremes(arr: Cache[], percent: number = 0.05): Cache[] {
        const toRemove = Math.floor(arr.length * percent);
        const sliceStart = arr.length - toRemove > 0 ? arr.length - toRemove : 0;

        arr = arr.sort((c1: Cache, c2: Cache): number => {
            if (Utils.getAccelValue(c1) < Utils.getAccelValue(c2)) {
                return -1;
            } else if (Utils.getAccelValue(c1) > Utils.getAccelValue(c2)) {
                return 1;
            } else {
                return 0;
            }
        });

        arr = arr.slice(toRemove);
        arr = arr.slice(sliceStart);
        return arr;
    }

    private static applyToCache(operation: Function, cached: Cache[]): Cache {
        return {
            accel: {
                x: operation(cached.map((el: Cache) => el.accel.x)),
                y: operation(cached.map((el: Cache) => el.accel.y)),
                z: operation(cached.map((el: Cache) => el.accel.z)),
            },
            gyro: {
                x: operation(cached.map((el: Cache) => el.gyro.x)),
                y: operation(cached.map((el: Cache) => el.gyro.y)),
                z: operation(cached.map((el: Cache) => el.gyro.z)),
            },
        };
    }

    public static generateRandomNumber(max: number, min: number, decimals: number = 8): number {
        return +(Math.random() * (max - min) + max).toFixed(decimals);
    }

    // Just for debugging
    public static generateRandomCache(min: number = -20, max: number = 20): Cache {
        return {
            accel: {
                x: Utils.generateRandomNumber(min, max),
                y: Utils.generateRandomNumber(min, max),
                z: Utils.generateRandomNumber(min, max),
            },
            gyro: {
                x: Utils.generateRandomNumber(min, max),
                y: Utils.generateRandomNumber(min, max),
                z: Utils.generateRandomNumber(min, max),
            },
        };
    }
}