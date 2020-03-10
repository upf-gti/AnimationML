/*
 
    ███╗   ██╗███╗   ██╗███╗   ███╗ █████╗ ████████╗██╗  ██╗
    ████╗  ██║████╗  ██║████╗ ████║██╔══██╗╚══██╔══╝██║  ██║
    ██╔██╗ ██║██╔██╗ ██║██╔████╔██║███████║   ██║   ███████║
    ██║╚██╗██║██║╚██╗██║██║╚██╔╝██║██╔══██║   ██║   ██╔══██║
    ██║ ╚████║██║ ╚████║██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║
    ╚═╝  ╚═══╝╚═╝  ╚═══╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝
    Depends on:
    * Utility
                                                         
 
*/
(function () {

    class NNMath {
        /**
         * @static
         * @param {float} value 
         * @param {float} valueMin 
         * @param {float} valueMax 
         * @param {float} resultMin 
         * @param {float} resultMax 
         * @return {float}
         */
        static Normalise(value, valueMin, valueMax, resultMin, resultMax) {
            if (valueMax - valueMin != 0) {
                return (value - valueMin) / (valueMax - valueMin) * (resultMax - resultMin) + resultMin;
            }
            else {
                console.warn("Not possible to normalise input value.")
                return value;
            }
        }

        /**
         * 
         * @param {float[]} values 
         */
        static SoftMax(values) {
            let min = Math.min(...values);
            let max = Math.max(...values);
            for (let i = 0; i < values.length; i++) {
                values[i] = this.Normalise(values[i], min, max, 0, 1);
            }
            let frac = 0;
            for (let i = 0; i < values.length; ++i) {
                frac += values[i];
            }
            if (frac != 0) {
                for (let i = 0; i < values.length; ++i) {
                    values[i] /= frac;
                }
            }
        }

    }
    window.NNMath = NNMath;
})();
