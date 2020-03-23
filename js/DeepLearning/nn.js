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

import { tmpdir } from "os";

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
            return (c) ? this.CreateTensorWH(ID, b, c) : this.CreateTensorM(ID, b);
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

            let T = new Tensor(id, rows, cols);

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

            let T = new Tensor(id, matrix.Rows, matrix.Cols);
            for (let x = 0; x < matrix.Rows; ++x)
                for (let y = 0; y < matrix.Cols; ++y) {
                    //var index = T.locToIndex([x, y]);
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
        DeleteTensor() {
            throw("NOT IMPLEMENTED");
            if (!this._tensors[id]) {
                console.log("Tensor with ID " + id + " not found.");
                return;
            }

            delete this._tensors[id];
        }

        /**
         * @param {Tensor} IN 
         * @param {Tensor} mean 
         * @param {Tensor} std 
         * @param {Tensor} OUT 
         * @return {Tensor} OUT
         */
        Normalise(IN, mean, std, OUT) {

            let inM = IN.GetMatrix();
            let meanM = mean.GetMatrix();
            let stdM = std.GetMatrix();

            let out = inM.subtract(meanM).divide(stdM, false);
            OUT.SetMatrix(out);

            return OUT;
        }

        /**
         * @param {Tensor} IN 
         * @param {Tensor} mean 
         * @param {Tensor} std 
         * @param {Tensor} OUT 
         * @return {Tensor} OUT
         */
        Renormalise(IN, mean, std, OUT) {
            let inM = IN.GetMatrix();
            let meanM = mean.GetMatrix();
            let stdM = std.GetMatrix();

            let out = inM.multiply(stdM).add(meanM, false); // TODO
            OUT.SetMatrix(out);

            return OUT;
        }

        /**
         * @param {Tensor} IN 
         * @param {Tensor} W 
         * @param {Tensor} b 
         * @param {Tensor} OUT 
         * @return {Tensor} OUT
         */
        Layer(IN, W, b, OUT) {

            let inM = IN.GetMatrix();
            let wM = W.GetMatrix();
            let bM = b.GetMatrix();

            let out = wM.dot(inM).add(bM, false);
            OUT.SetMatrix(out);

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

            let tM = T.GetMatrix();
            let wM = W.GetMatrix();

            for(let i = 0; i < tM.selection.length; ++i)
                tM.selection[i] += (wM.selection[i] * w)

            /*let tM = T.GetMatrix();
            let wM = W.GetMatrix();

            addScalarMult(tM.selection, wW.selection, w);
            return T;*/
                
            //throw("Not Implemented");

            //Eigen.Blend(T.id, W.id, w);

            // JS Implementation:
            // T += w * W
            /*let outM = T.GetMatrix();
            let wM = W.GetMatrix();
            for (let i = 0; i < outM.length; i++)
                for (let j = 0; j < outM[i].length; j++)
                    outM[i][j] += wM[i][j] * w;

            return T;*/

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
            let m = T.GetMatrix();
            const rows = m.shape[0];

            for (let i = 0; i < rows; i += 1) {
              const val = Math.max(m.get(i, 0), 0) + Math.exp(Math.min(m.get(i, 0), 0)) - 1;
              m.set(i, 0, val);
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
            let m = T.GetMatrix();

            let frac = 0;
            const rows = m.shape[0];
        
            for (let i = 0; i < rows; i += 1) {
              const val = Math.exp(m.get(i, 0));
              m.set(i, 0, val);
              frac += val;
            }
            for (let i = 0; i < rows; i += 1) {
              const val = m.get(i, 0) / frac;
              m.set(i, 0, val);
            }
            return T;
        }


    }
    window.NeuralNetwork = NeuralNetwork;

})(window);
