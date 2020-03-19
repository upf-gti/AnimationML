(function(){

    "use strict";

    if (LS)
    {
        /**
         * Once the file is readen, the data is extractend and the class variables are filled
         * @param {string} json_string 
         * @returns {void}
         */
        MANN.prototype.fromData = function(json_string) {
            let data;
            try {
                data = JSON.parse(json_string);
                this.ReadParameters(data);
            }
            catch (e) {
                console.error(e);
                return;
            }
        };

        /**
         * Todo: not implemented yet
         * Parameters serialization
         * @returns {void}
         */
        MANN.prototype.toData = function() {
            //generate data
            var data = this.StoreParameters();
            data = JSON.stringify(data, null, '\t');
            return data;
        };

        MANN.FORMAT = { extension: "nn", dataType: "text" };


        LS.registerResourceClass(MANN);
    } 

})(window);