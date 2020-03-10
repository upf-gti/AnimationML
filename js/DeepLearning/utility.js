
"use strict";

/* 

    ██╗   ██╗████████╗██╗██╗     ██╗████████╗██╗   ██╗
    ██║   ██║╚══██╔══╝██║██║     ██║╚══██╔══╝╚██╗ ██╔╝
    ██║   ██║   ██║   ██║██║     ██║   ██║    ╚████╔╝ 
    ██║   ██║   ██║   ██║██║     ██║   ██║     ╚██╔╝  
    ╚██████╔╝   ██║   ██║███████╗██║   ██║      ██║   
     ╚═════╝    ╚═╝   ╚═╝╚══════╝╚═╝   ╚═╝      ╚═╝   
                                                   
*/ 
(function(){


    class Gaussian{
        constructor(random)
        {
            this._hasDeviate;
            this._storedDeviate;
            this._random;

            this._random = random || new RNG(1337);
        }

        /**
         * 
         * @param {double} mu
         * @param {double} sigma
         * @returns {double}
         */
        NextGaussian(mu = 0, sigma = 1)
        {
            if(sigma <= 0)
                throw ("sigma must be greater than zero.");

            if(this._hasDeviate) {
                this._hasDeviate = false;
                return this._storedDeviate * sigma + mu;
            }

            let v1, v2, rSquared;
            do {
                // two random values between -1.0 and 1.0
                //v1 = 2 * _random.NextDouble() - 1;
                v1 = 2 * this._random.nextFloat() - 1;
                //v2 = 2 * _random.NextDouble() - 1;
                v2 = 2 * this._random.nextFloat() - 1;
                rSquared = v1*v1 + v2*v2;
                // ensure within the unit circle
            } while (rSquared >= 1 || rSquared == 0);

            // calculate polar tranformation for each deviate
            var polar = Math.sqrt( -2 * Math.log(rSquared) / rSquared );
            // store first deviate
            this._storedDeviate = v2 * polar;
            this._hasDeviate = true;
            // return second deviate
            return v1 * polar * sigma + mu;
        }
    }

    window.Gaussian = Gaussian;

    class Utility
    {
        static GetRNG() {
            if(Utility.RNG === null || Utility.RNG === undefined) {
                Utility.RNG = new RNG(1337);
            }
            return Utility.RNG;
        }
        
        /**
         * @param {float} roll 
         * @param {float} pitch 
         * @param {float} yaw 
         * @returns {quat}
         */
        static QuaternionEuler(roll, pitch, yaw) 
        {
            roll  *= DEG2RAD / 2;
            pitch *= DEG2RAD / 2;
            yaw   *= DEG2RAD / 2;

            let Z = vec3.clone(vec3.FRONT),
                X = vec3.clone(vec3.RIGHT),
                Y = vec3.clone(vec3.UP);

            let sin, cos;

            sin = Math.sin(roll);
            cos = Math.cos(roll);
            let q1 = quat.fromValues(0, 0, Z[2] * sin, cos);
            sin = sin(pitch);
            cos = cos(pitch);
            let q2 = quat.fromValues(X[0] * sin, 0, 0, cos);
            sin = sin(yaw);
            cos = cos(yaw);
            let q3 = quat.fromValues(0, Y[1] * sin, 0, cos);

            return this.MultiplyQuaternions(this.MultiplyQuaternions(q1, q2), q3);
        }
        
        /**
         * @param {quat} q1 
         * @param {quat} q2 
         * @returns {quat}
         */
        static MultiplyQuaternions(q1, q2) 
        {
            let x =  q1[0] * q2[3] + q1[1] * q2[2] - q1[2] * q2[1] + q1[3] * q2[0];
            let y = -q1[0] * q2[2] + q1[1] * q2[3] + q1[2] * q2[0] + q1[3] * q2[1];
            let z =  q1[0] * q2[1] - q1[1] * q2[0] + q1[2] * q2[3] + q1[3] * q2[2];
            let w = -q1[0] * q2[0] - q1[1] * q2[1] - q1[2] * q2[2] + q1[3] * q2[3];
            return quat.fromValues(x, y, z, w);
        }
        
        /**
         * @param {string} name 
         * @param {int} x 
         * @param {int} y 
         * @param {int} width 
         * @param {int} height 
         * @returns {void}
         */
        static Screenshot(name, x, y, width, height) 
        {
            throw("not implemented");
            /*
            Texture2D tex = new Texture2D(width, height);
            tex.ReadPixels(new Rect(x, y, width, height), 0, 0);
            tex.Apply();
            byte[] bytes = tex.EncodeToPNG();
            File.WriteAllBytes(name + ".png", bytes);
            Destroy(tex);
            */
        }
        
        /**
         * @param {int} fps 
         */
        static SetFPS(fps) {
            throw("not implemented");
            
            /*#if UNITY_EDITOR
            QualitySettings.vSyncCount = 0;
            #else
            QualitySettings.vSyncCount = 1;
            #endif
            Application.targetFrameRate = fps;*/
        }
        
        /**
         */
        static GetTimestamp() {
            return new Date();
        }

        /**
         * @param {vec3} origin
         * @param {LayerMask} mask
         * @returns {float}
         */
        static GetHeight( origin, mask ) 
        {
            throw("not implemented");
            
            const MinValue = 1.175494351e-38;
            const MaxValue = 3.402823466e+38;

            let upHits = [];
            let downHits = [];

            //Translate to litescene 
            //RaycastHit[] upHits   = Physics.RaycastAll(origin+Vector3.down, Vector3.up, float.PositiveInfinity, mask);
            //RaycastHit[] downHits = Physics.RaycastAll(origin+Vector3.up, Vector3.down, float.PositiveInfinity, mask);
            
            if(upHits.length == 0 && downHits.length == 0) {
                return origin[1];
            }
            
            let height = MinValue;
            for(let i = 0; i < downHits.length; ++i) 
            {
                if(
                    downHits[i].point[1] > height 
                    //&& !downHits[i].collider.isTrigger //Check that the collided item is not a trigger
                ) {
                    height = downHits[i].point[1];
                }
            }
            for(let i = 0; i < upHits.length; ++i) 
            {
                if(
                    upHits[i].point[1] > height 
                    //&& !upHits[i].collider.isTrigger
                ) {
                    height = upHits[i].point[1];
                }
            }
            return height;
        }

    }
    Utility.RNG = new RNG(1337);
    window.Utility = Utility;

})();
