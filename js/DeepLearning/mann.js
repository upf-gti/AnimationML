/*
 
    ███╗   ███╗ █████╗ ███╗   ██╗███╗   ██╗
    ████╗ ████║██╔══██╗████╗  ██║████╗  ██║
    ██╔████╔██║███████║██╔██╗ ██║██╔██╗ ██║
    ██║╚██╔╝██║██╔══██║██║╚██╗██║██║╚██╗██║
    ██║ ╚═╝ ██║██║  ██║██║ ╚████║██║ ╚████║
    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝
                                        
    This work is based on Alexej Domke implementation of Mode Adaptative Neural Network
    on Unity.

    Depends on:
    * NeuralNetwork
    * MANNParameters
    * Tensor
    
    <!-- Importing Tensorflow 
        https://www.tensorflow.org/js/tutorials/setup
    -->
   
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js"></script>

*/
(function(){

    "use strict";


    /**
     * @class MANN
     * @property {number[]} _ControlNeurons
     * @property {MANNParameters} Parameters
     * 
     * @property {Tensor} _X     
     * @property {Tensor} _GX    
     * @property {Tensor} _Xstd  
     * @property {Tensor} _Xmean 
     * 
     * @property {Tensor} _Y     
     * @property {Tensor} _GY    
     * @property {Tensor} _Ystd  
     * @property {Tensor} _Ymean
     * 
     * @property {Tensor} _WGT0  
     * @property {Tensor} _WGT1  
     * @property {Tensor} _WGT2  
     * @property {Tensor} _WGT0b 
     * @property {Tensor} _WGT1b 
     * @property {Tensor} _WGT2b 
     * 
     * @property {Tensor} _WGT0  
     * @property {Tensor} _WGT1  
     * @property {Tensor} _WGT2  
     * @property {Tensor} _WGT0b 
     * @property {Tensor} _WGT1b 
     * @property {Tensor} _WGT2b 
     * 
     * @property {Tensor} _WXP0  
     * @property {Tensor} _WXP1  
     * @property {Tensor} _WXP2  
     * @property {Tensor} _WXP0b 
     * @property {Tensor} _WXP1b 
     * @property {Tensor} _WXP2b 
     * 
     * @property {Tensor[]} _WXP  
     * 
     */
    class MANN extends NeuralNetwork
    {
        constructor( o )
        {
            super(o);

            //TODO: check if Uint8Array its ok or should check another format
            this.Parameters      = null;
            this._ControlNeurons = new Uint8Array();

            this._X     = null;
            this._GX    = null;
            this._Xstd  = null;
            this._Xmean = null;
            
            this._Y     = null;
            this._GY    = null;
            this._Ystd  = null;
            this._Ymean = null;

            //TODO: what this variables mean?
            this._WGT0  = null;
            this._WGT0b = null;
            this._WGT1  = null;
            this._WGT1b = null;
            this._WGT2  = null;
            this._WGT2b = null;

            //TODO: what this variables mean?
            // trained expert weights
            this._WXP = [];

            //TODO: what this variables mean?   
            // blended expert weights
            this._WXP0  = null;
            this._WXP1  = null;
            this._WXP2  = null;
            this._WXP0b = null;
            this._WXP1b = null;
            this._WXP2b = null;
        }

        /**
         * 
         */
        Predict()
        {
            // Normalise Input
            this.Normalise(this._X, this._Xmean, this._Xstd, this._Y);

            //Process Gating Network
            for (let i = 0; i < this._ControlNeurons.length; ++i) {
                let neuron = this._Y.GetValue(this._ControlNeurons[i], 0);
                this._GX.SetValue(i, 0, neuron);
            }

            this.ELU(this.Layer(this._GX, this._WGT0, this._WGT0b, this._GY));
            this.ELU(this.Layer(this._GY, this._WGT1, this._WGT1b, this._GY));
            this.SoftMax(this.Layer(this._GY, this._WGT2, this._WGT2b, this._GY));

            // Generate Network Weights
            this._WXP0.SetZero(); this._WXP0b.SetZero();
            this._WXP1.SetZero(); this._WXP1b.SetZero();
            this._WXP2.SetZero(); this._WXP2b.SetZero();

            let tid = 0;
            for (let i = 0; i < this.Parameters.NumExperts; i++) {
                let weight = this.GY.GetValue(i, 0);
                this.Blend(this._WXP0,   this._WXP[tid++], weight);
                this.Blend(this._WXP0b,  this._WXP[tid++], weight);
                this.Blend(this._WXP1,   this._WXP[tid++], weight);
                this.Blend(this._WXP1b,  this._WXP[tid++], weight);
                this.Blend(this._WXP2,   this._WXP[tid++], weight);
                this.Blend(this._WXP2b,  this._WXP[tid++], weight);
            }

            // Process Motion-Prediction Network
            this.ELU(this.Layer(this._Y, this._WXP0, this._WXP0b, this._Y));
            this.ELU(this.Layer(this._Y, this._WXP1, this._WXP1b, this._Y));
            this.Layer(this._Y, this._WXP2, this._WXP2b, this._Y);

            // Renormalise Output
            this.Renormalise(this._Y, this._Ymean, this._Ystd, this._Y);
        }

        /**
         * Set tensor specific value
         * @param {int} index 
         * @param {float} value 
         */
        SetInput(index, value) {
            this._X.SetValue(index, 0, value);
        }

        /**
         * Retrieve tensor value
         * @param {int} index 
         */
        GetOutput(index) {
            return this._Y.GetValue(index, 0);
        }

        //=======================================================================
        //  Resource data serialization/deserialization
        //=======================================================================
        /**
         * Load parametrs from url
         * @param {string} path 
         */
        async LoadParameters(path)
        {
            let json = await fetch(path).then(response => response.json());
            this.ReadParameters(json);
        }

        /**
         * Read parametrs from json and create related tensors
         * @param {string} path 
         */
        ReadParameters(params) {
            if(!params || params.constructor.name != "Object")
                throw(`mann_controller.js@readParameters: invalid params: ${params}.`);

            this.Parameters = params;

            this._ControlNeurons = this.Parameters.InputGating;

            this._Xmean = this.CreateTensor("Xmean", params.Xmean);
            this._Xstd  = this.CreateTensor("Xstd ", params.Xstd );
            this._Ymean = this.CreateTensor("Ymean", params.Ymean);
            this._Ystd  = this.CreateTensor("Ystd ", params.Ystd );
            this._WGT0  = this.CreateTensor("WGT0 ", params.WGT0 );
            this._WGT0b = this.CreateTensor("WGT0b", params.WGT0b);
            this._WGT1  = this.CreateTensor("WGT1 ", params.WGT1 );
            this._WGT1b = this.CreateTensor("WGT1b", params.WGT1b);
            this._WGT2  = this.CreateTensor("WGT2 ", params.WGT2 );
            this._WGT2b = this.CreateTensor("WGT2b", params.WGT2b);

            //TODO: Why this "6" ?
            this._WXP = new Array(params.NumExperts * 6);

            let tid = 0;
            for (let i = 0; i < params.NumExperts; ++i) {
                this._WXP[tid] = this.CreateTensor("WXPi" + tid++, params.WXP0.Values[i] );
                this._WXP[tid] = this.CreateTensor("WXPi" + tid++, params.WXP0b.Values[i]);
                this._WXP[tid] = this.CreateTensor("WXPi" + tid++, params.WXP1.Values[i] );
                this._WXP[tid] = this.CreateTensor("WXPi" + tid++, params.WXP1b.Values[i]);
                this._WXP[tid] = this.CreateTensor("WXPi" + tid++, params.WXP2.Values[i] );
                this._WXP[tid] = this.CreateTensor("WXPi" + tid++, params.WXP2b.Values[i]);
            }

            this._X = this.CreateTensor(params.InputSize, 1, "X");
            this._Y = this.CreateTensor(params.OutputSize,1, "Y");

            this._GX    = this.CreateTensor("GX",    params.InputGating.length,    1 );
            this._GY    = this.CreateTensor("GY",    params.NumExperts,            1 );
            this._WXP0  = this.CreateTensor("WXP0",  params.HiddenSize,            params.InputSize );
            this._WXP1  = this.CreateTensor("WXP1",  params.HiddenSize,            params.HiddenSize );
            this._WXP2  = this.CreateTensor("WXP2",  params.OutputSize,            params.HiddenSize );
            this._WXP0b = this.CreateTensor("WXP0b", params.HiddenSize,            1 );
            this._WXP1b = this.CreateTensor("WXP1b", params.HiddenSize,            1 );
            this._WXP2b = this.CreateTensor("WXP2b", params.OutputSize,            1 );
        }

        StoreParameters(){
            return this.Parameters;
        }

    }
    MANN.OrientType = {
        "NONE"           : 0,
        "FLAT_X_UP"      : 1,
        "FLAT_Y_UP"      : 2,
        "FLAT_Z_UP"      : 3,
        "FORWARD_UP"     : 4,
        "QUATERNION"     : 5,
        "ANGLE_AXIS"     : 6,
        "ROTATION_VECTOR": 7,
        
        0:"NONE"            ,
        1:"FLAT_X_UP"       ,
        2:"FLAT_Y_UP"       ,
        3:"FLAT_Z_UP"       ,
        4:"FORWARD_UP"      ,
        5:"QUATERNION"      ,
        6:"ANGLE_AXIS"      ,
        7:"ROTATION_VECTOR" ,
    }

    window.MANN = MANN;

})();