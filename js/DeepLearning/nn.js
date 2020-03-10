/*
 

    ███╗   ██╗███████╗██╗   ██╗██████╗  █████╗ ██╗     ███╗   ██╗███████╗████████╗██╗    ██╗ ██████╗ ██████╗ ██╗  ██╗
    ████╗  ██║██╔════╝██║   ██║██╔══██╗██╔══██╗██║     ████╗  ██║██╔════╝╚══██╔══╝██║    ██║██╔═══██╗██╔══██╗██║ ██╔╝
    ██╔██╗ ██║█████╗  ██║   ██║██████╔╝███████║██║     ██╔██╗ ██║█████╗     ██║   ██║ █╗ ██║██║   ██║██████╔╝█████╔╝ 
    ██║╚██╗██║██╔══╝  ██║   ██║██╔══██╗██╔══██║██║     ██║╚██╗██║██╔══╝     ██║   ██║███╗██║██║   ██║██╔══██╗██╔═██╗ 
    ██║ ╚████║███████╗╚██████╔╝██║  ██║██║  ██║███████╗██║ ╚████║███████╗   ██║   ╚███╔███╔╝╚██████╔╝██║  ██║██║  ██╗
    ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚══════╝   ╚═╝    ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
    Depends on:                                                                                                              
    * Tensor
*/

/**
 * Abstract Class. Any extended class needs to explicitly implement following methods
 * * Predict
 * * SetInput
 * * GetOutput
 * 
 * THIS NEEDS TO BE COMPLETED!!!!
 * 
 *          
 * @class NeuralNetwork
 * @property { Tensor[] } _Tensors
 * @property { string[] } _Identifiers
 */

(function () {

    class NeuralNetwork {
        constructor(o) {
            if (this.constructor === NeuralNetwork) {
                throw new TypeError('Abstract class "NeuralNetwork" cannot be instantiated directly.');
            }

            o = o || {
                file: "parameters.json",
                folder: "data",
                out: "data",
            };

            this._tensors = {};
            this.folder = o.folder.lastIndexOf("/") < 0 ? o.folder + "/" : o.folder;
            this.out = o.out.lastIndexOf("/") < 0 ? o.out + "/" : o.out;

            for (let func of [
                "fromData",
                "toData",
                "Predict",
                "SetInput",
                "GetOutput",
            ]) {
                if (this[func] === undefined) {
                    throw new TypeError('Classes extending the widget abstract class');
                }
            }
        }
        /**
         * Creates a tensor
         * @param {*} a 
         * @param {*} b 
         * @param {*} c 
         */
        CreateTensor(ID, b, c) {
            return (c.constructor.name == "Number") ? CreateTensorWH(ID, b, c) : CreateTensorM(ID, b);
        }

        /**
         * Creates a tensor
         * @param {number} rows 
         * @param {number} cols 
         * @param {string} id
         * @return {Tensor}
         */
        CreateTensorWH(id, rows, cols) {
            if (this._tensors[id]) {
                console.log("Tensor with ID " + id + " already contained.");
                return null;
            }

            let T = new Tensor(rows, cols);

            T.id = id;
            this._tensors[id] = T;
            return T;
        }

        /**
         * Creates a tensor
         * @param {MANNParameters} Parameters 
         * @param {FloatMatrix} matrix 
         * @param {string} id 
         * @return {Tensor}
         */
        CreateTensorM(id, matrix) {
            if (this._tensors[id]) {
                console.log("Tensor with ID " + id + " already contained.");
                return null;
            }

            let T = new Tensor(rows, cols);
            for (let x = 0; x < matrix.Rows; ++x)
                for (let y = 0; y < matrix.Cols; ++y) {
                    var index = T.locToIndex([x, y]);
                    T.SetValue(x, y, matrix.Values[x].Values[y]);
                }

            T.id = id;
            this._tensors[id] = T;
            return T;
        }

        /**
         * Deletes a tensor instance from the neural network and deinits it.
         * @param {Tensor} T 
         */
        DeleteTensor(T) {
            if (!this._tensors[id]) {
                console.log("Tensor with ID " + id + " not found.");
                return;
            }

            delete this._tensors[id];
        }

        /**
         * Retrieves a tensor instance from the NN
         * @param {string} id 
         * @return {Tensor}
         */
        GetTensor(id) {
            if (!this._tensors[id]) {
                console.log("Tensor with ID " + id + " not found.");
                return;
            }

            this._tensors[id];
        }

        /**
         * TODO: copy or reference?
         * @param {Tensor} IN 
         * @param {Tensor} mean 
         * @param {Tensor} std 
         * @param {Tensor} OUT 
         * @return {Tensor} OUT
         */
        Normalise(IN, mean, std, OUT) {
            //throw("Not Implemented");

            //Eigen.Normalise(IN.id, mean.id, std.id, OUT.id);

            // JS implementation:
            // OUT = (IN - mean) / std
            let inM = IN.GetMatrix();
            let meanM = mean.GetMatrix();
            let stdM = std.GetMatrix();
            let outM = OUT.GetMatrix();

            for (let i = 0; i < inM.length; i++)
                for (let j = 0; j < inM[i].length; j++) // should be one column
                {
                    let temp = inM[i][j] - meanM[i][j];
                    let stdv = stdM[i][j];
                    if (stdv !== 0)
                        outM[i][j] = temp / stdv;
                    else
                        outM[i][j] = temp;
                }


            //return OUT;
        }

        /**
         * TODO: copy or reference?
         * TODO: What is the difference between this and normalise?
         * @param {Tensor} IN 
         * @param {Tensor} mean 
         * @param {Tensor} std 
         * @param {Tensor} OUT 
         * @return {Tensor} OUT
         */
        Renormalise(IN, mean, std, OUT) {
            //throw("Not Implemented");

            //Eigen.Renormalise(IN.id, mean.id, std.id, OUT.id);

            // JS implementation:
            // OUT = IN * std + mean
            let inM = IN.GetMatrix();
            let meanM = mean.GetMatrix();
            let stdM = std.GetMatrix();
            let outM = OUT.GetMatrix();

            for (let i = 0; i < inM.length; i++)
                for (let j = 0; j < inM[i].length; j++) // should be one column
                    outM[i][j] = inM[i][j] * stdM[i][j] + meanM[i][j];

            //return OUT;
        }

        /**
         * TODO: What this does?
         * @param {Tensor} IN 
         * @param {Tensor} W 
         * @param {Tensor} b 
         * @param {Tensor} OUT 
         * @return {Tensor} OUT
         */
        Layer(IN, W, b, OUT) {
            //throw("Not Implemented");

            //Eigen.Layer(IN.id, W.id, b.id, OUT.id);

            // JS implementation:
            // OUT = W * IN + b

            let inM = IN.GetMatrix();
            let wM = W.GetMatrix();
            let bM = b.GetMatrix();
            let outM = OUT.GetMatrix();

            for (let i = 0; i < wM.length; i++) {
                let wRow = wM[i];
                let temp = 0;
                for (let j = 0; j < inM.length; j++)
                    temp += wRow[j] * inM[j][0]; // assuming one column in IN
                outM[i][0] = temp + bM[i][0]; // assuming one column in OUT and b
            }

            return OUT;
        }

        /**
         * TODO: What this does? Linear interpolation or what?
         * @param {Tensor} T
         * @param {Tensor} W 
         * @param {Tensor} w 
         * @param {Tensor} OUT 
         * @return {Tensor} T
         */
        Blend(T, W, w) {
            //throw("Not Implemented");

            //Eigen.Blend(T.id, W.id, w);

            // JS Implementation:
            // T += w * W
            let outM = T.GetMatrix();
            let wM = W.GetMatrix();
            for (let i = 0; i < outM.length; i++)
                for (let j = 0; j < outM[i].length; j++)
                    outM[i][j] += wM[i][j] * w;

            return T;
        }

        /**
         * TODO: Confirm this is correct
         * Aka: ***Exponential Linear Unit*** Recently a new activation function named Exponential Linear Unit or its widely known name ELU was introduced. Researchs reveal that the function tend to converge cost to zero faster and produce more accurate results. Different to other activation functions, ELU has a extra alpha constant which should be positive number.
         * [[link](https://sefiks.com/2018/01/02/elu-as-a-neural-networks-activation-function/)]
         * @param {Tensor} T
         * @return {Tensor} T
         */
        ELU(T) {
            //throw("Not Implemented");

            //return T.toTensor().elu();

            // JS implementation:
            // T = exp(val) - 1 if x < 0 else val
            let m = T.GetMatrix();
            console.assert(m.length === 0 || m[0].length === 1, "implemented for 1D only", window.DEBUG)
            for (let i = 0; i < m.length; i++) {
                let val = m[i][0]; // should be one column
                if (val < 0)
                    m[i][0] = exp(val) - 1; // in-place operation                
            }
            return T;
        }

        /**
         * A matematical function having a "S"-shaped curve or **sigmoid curve**.
         * [[ link ](https://en.wikipedia.org/wiki/Sigmoid_function##targetText=A%20sigmoid%20function%20is%20a%20bounded%2C%20differentiable%2C%20real%20function%20that,refer%20to%20the%20same%20object.)]
         * @param {Tensor} T 
         * @return {Tensor} T
         */
        Sigmoid(T) {
            throw ("Not Implemented");

            //return T.toTensor().sigmoid();
        }

        /**
         * **Tanh** is the hyperbolic tangent function, which is the hyperbolic analogue of the Tan circular function used throughout trigonometry. **Tanh**[α] is defined as the ratio of the corresponding hyperbolic sine and hyperbolic cosine functions via . **Tanh** may also be defined as , where is the base of the natural logarithm Log.
         * [[link](https://en.wikipedia.org/wiki/Hyperbolic_function)]
         * @param {Tensor} T 
         * @return {Tensor} T
         */
        TanH(T) {
            throw ("Not Implemented");

            //return T.toTensor().tanh();
        }

        /**
         * In mathematics, the **softmax** function, also known as softargmax or normalized exponential function, is a function that takes as input a vector of K real numbers, and normalizes it into a probability distribution consisting of K probabilities proportional to the exponentials of the input numbers.
         * [[link](https://en.wikipedia.org/wiki/Softmax_function##targetText=In%20mathematics%2C%20the%20softmax%20function,exponentials%20of%20the%20input%20numbers.)]
         * @param {Tensor} T 
         * @return {Tensor} T
         */
        SoftMax(T) {
            //throw("Not Implemented");

            //Eigen.SoftMax(T.id);

            // JS implementation:
            // T = exp(T) / sum(exp(T))
            let m = T.GetMatrix();
            console.assert(m.length === 0 || m[0].length === 1, "implemented for 1D only", window.DEBUG)
            let expT = [];
            let sum = 0;
            for (let i = 0; i < m.length; i++) {
                let val = exp(m[i][0]); // should be one column
                sum += val;
                expT.push(val);
            }
            if (sum !== 0) {
                for (let i = 0; i < m.length; i++) {
                    m[i][0] = expT[i] / sum; // in-place operation
                }

                return T;
            }
        }


    }
    window.NeuralNetwork = NeuralNetwork;

})(window);
