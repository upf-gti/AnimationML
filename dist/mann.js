/*

    ███████╗███████╗███████╗██████╗  █████╗ ██████╗ ██╗     ███████╗    ██████╗ ███╗   ██╗ ██████╗ 
    ██╔════╝██╔════╝██╔════╝██╔══██╗██╔══██╗██╔══██╗██║     ██╔════╝    ██╔══██╗████╗  ██║██╔════╝ 
    ███████╗█████╗  █████╗  ██║  ██║███████║██████╔╝██║     █████╗      ██████╔╝██╔██╗ ██║██║  ███╗
    ╚════██║██╔══╝  ██╔══╝  ██║  ██║██╔══██║██╔══██╗██║     ██╔══╝      ██╔══██╗██║╚██╗██║██║   ██║
    ███████║███████╗███████╗██████╔╝██║  ██║██████╔╝███████╗███████╗    ██║  ██║██║ ╚████║╚██████╔╝
    ╚══════╝╚══════╝╚══════╝╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝    ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ 
                                                                                                                
    font : https://stackoverflow.com/questions/424292/seedable-javascript-random-number-generator

    example: 

    ```

    var rng = new RNG(20);
    for (var i = 0; i < 10; i++)
    console.log(rng.nextRange(10, 50));

    var digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (var i = 0; i < 10; i++)
    console.log(rng.choice(digits));var rng = new RNG(20);
    for (var i = 0; i < 10; i++)
    console.log(rng.nextRange(10, 50));

    var digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (var i = 0; i < 10; i++)
    console.log(rng.choice(digits));

    ```
*/

"use strict";

(function(){

    function RNG(seed) {
        if(!this) throw("RNG hasn't been called with `new` before");
        // LCG using GCC's constants
        this.m = 0x80000000; // 2**31;
        this.a = 1103515245;
        this.c = 12345;
      
        this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
    }

    RNG.prototype.nextInt = function() {
        this.state = (this.a * this.state + this.c) % this.m;
        return this.state;
    }

    RNG.prototype.nextFloat = function() {
        // returns in range [0,1]
        return this.nextInt() / (this.m - 1);
    }

    RNG.prototype.nextRange = function(start, end) {
        // returns in range [start, end): including start, excluding end
        // can't modulu nextInt because of weak randomness in lower bits
        var rangeSize = end - start;
        var randomUnder1 = this.nextInt() / this.m;
        return start + Math.floor(randomUnder1 * rangeSize);
    }

    RNG.prototype.choice = function(array) {
        return array[this.nextRange(0, array.length)];
    }

    window.RNG = RNG;

})(window);
"use strict";

/***
 * ██████╗  ██████╗ ██╗  ██╗   ██╗███████╗██╗██╗     ██╗     
 * ██╔══██╗██╔═══██╗██║  ╚██╗ ██╔╝██╔════╝██║██║     ██║     
 * ██████╔╝██║   ██║██║   ╚████╔╝ █████╗  ██║██║     ██║     
 * ██╔═══╝ ██║   ██║██║    ╚██╔╝  ██╔══╝  ██║██║     ██║     
 * ██║     ╚██████╔╝███████╗██║   ██║     ██║███████╗███████╗
 * ╚═╝      ╚═════╝ ╚══════╝╚═╝   ╚═╝     ╚═╝╚══════╝╚══════╝
 */

"use strict";

console.assert	= function(cond, text, dontThrow)
{
    if ( cond ) 
        return;

    if ( dontThrow )
        debugger;
    else
        throw new Error( text || "Assertion failed!" );
};

function capitalize(s)
{
    if (typeof s !== 'string') 
        return '';
    
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function Enum(...items)
{
  let v = {};
  for(var i in items)
  {
    v[items[i]] = parseInt(i);  
  }
  return v;
}

//https://gist.github.com/anish000kumar/0fd37acc866a9577cf259980500b1bbe

if(!vec3.ONE) vec3.ONE = new Float32Array([1,1,1]);

if(!vec3.signedAngle)
{
    vec3.signedAngle = function(from, to, axis)
    {
        let unsignedAngle = vec3.angle(from, to);

        let cross_x = from[1]* to[2]- from[2]* to[1];
        let cross_y = from[2]* to[0]- from[0]* to[2];
        let cross_z = from[0]* to[1]- from[1]* to[0];
        let sign = Math.sign(axis[0] * cross_x + axis[1] * cross_y + axis[2] * cross_z);
        return unsignedAngle * sign;
    }
}

if(!mat4.multiplyPoint)
{
    mat4.multiplyPoint = function(out, m, point)
    {
        if(!out)
            out = vec3.create();

        let res = out;
        let w;
        var x = point[0], y = point[1], z = point[2];
        res[0] = m[0][0] * point[0]+ m[0][1] * point[1]+ m[0][2] * point[2]+ m[0][3];
        res[1] = m[1][0] * point[0]+ m[1][1] * point[1]+ m[1][2] * point[2]+ m[1][3];
        res[2] = m[2][0] * point[0]+ m[2][1] * point[1]+ m[2][2] * point[2]+ m[2][3];
        
        res[0] = m[0] * x + m[4] * y + m[8] * z;
        res[1] = m[1] * x + m[5] * y + m[9] * z;
        res[2] = m[2] * x + m[6] * y + m[10] * z;
             w = m[3] * x + m[7] * y + m[11] * z + m[15];

        w = 1 / w;
        res[0] *= w;
        res[1] *= w;
        res[2] *= w;
        return res;
    }

}

if(!DEG2RAD)
    window.DEG2RAD = 0.0174532925;



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
"use strict";

/*
 
    ████████╗██████╗  █████╗      ██╗███████╗ ██████╗████████╗ ██████╗ ██████╗ ██╗   ██╗
    ╚══██╔══╝██╔══██╗██╔══██╗     ██║██╔════╝██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗╚██╗ ██╔╝
       ██║   ██████╔╝███████║     ██║█████╗  ██║        ██║   ██║   ██║██████╔╝ ╚████╔╝ 
       ██║   ██╔══██╗██╔══██║██   ██║██╔══╝  ██║        ██║   ██║   ██║██╔══██╗  ╚██╔╝  
       ██║   ██║  ██║██║  ██║╚█████╔╝███████╗╚██████╗   ██║   ╚██████╔╝██║  ██║   ██║   
       ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚════╝ ╚══════╝ ╚═════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝   
    Depends on:
    * http://glmatrix.net/
    * Matrix4x4Extensions : https://github.com/sebastianstarke/AI4Animation/blob/master/AI4Animation/SIGGRAPH_2018/Unity/Assets/Scripts/Libraries/Matrix4x4Extensions.cs
    * UltiDraw   
    * Utility                                                                               
 
*/


(function () {

    class Trajectory {

        /**
         * Looks complicated but i had to merge 3 constructors in just one
         * @param {number} size 
         * @param {number} styles 
         * @param {Vector3 | Vector3[]}  seedPosition 
         * @param {Vector3 | Vector3[] | Quaternion} seedDirection 
         */
        constructor(size, styles, seedPosition, seedDirection) {
            this.Inspect = false;
            this.Points = new Point[size];

            let mat = mat4.create();

            if (seedPosition && seedDirection) {
                if (isArray(seedPosition) && seedPosition.length > 0 && isArray(seedPosition[0])) {
                    for (let i = 0; i < Points.length; ++i) {
                        mat4.fromRotationTranslation(mat, quat.lookRotation(quat.create(), seedDirection[i], vec3.UP), seedPosition[i]);
                        this.Points[i] = new Point(i, styles);
                        this.Points[i].SetTransformation(mat);
                    }
                    return;
                }

                let rot = (seedDirection.length == 3) ? quat.lookRotation(quat.create(), seedDirection, vec3.UP) : seedDirection;
                mat = mat4.fromRotationTranslation(mat4.create(), rot, seedPosition);
            }

            for (let i = 0; i < Points.length; ++i) {
                this.Points[i] = new Point(i, styles);
                this.Points[i].SetTransformation(mat);
            }
        }

        /**
         * @return {Point}
         */
        GetFirst() {
            return this.Points[0];
        }

        /**
         * 
         * @return {Point}
         */
        GetLast() {
            return this.Points[this.Points.length - 1];
        }

        /**
         * 
         * @return {number} length
         */
        GetLength() {
            let length = 0;
            for (let i = 1; i < this.Points.length; ++i) {
                length += vec3.distance(this.Points[i - 1].GetPosition(), this.Points[i].GetPosition());
            }
            return length;
        }

        /**
         * 
         * @param {number} start 
         * @param {number} end 
         * @param {number} step 
         * 
         * @return {number} length
         */
        GetLength(start, end, step) {
            let length = 0;
            for (let i = 0; i < end - step; i += step) {
                length += vec3.distance(this.Points[i + step].GetPosition(), this.Points[i].GetPosition());
            }
            return length;
        }

        /**
         * 
         * @param {number} start 
         * @param {number} end 
         * @param {number} step 
         * @return {number} curvature
         */
        GetCurvature(start, end, step) {
            let curvature = 0;
            for (let i = step; i < end - step; i += step) {
                curvature += vec3.signedAngle(this.Points[i].GetPosition() - this.Points[i - step].GetPosition(), this.Points[i + step].GetPosition() - this.Points[i].GetPosition(), vec3.UP);
            }
            curvature = Mathf.abs(curvature);
            curvature = Mathf.clamp(curvature / 180, 0, 1);
            return curvature;
        }

        /**
         * 
         */
        Postprocess() {
            for (let i = 0; i < this.Points.Length; ++i) {
                this.Points[i].Postprocess();
            }
        }
    }

    /**
     * @property { number } this._Index;
     * @property { mat4   } this._Transformation;
     * @property { vec3   } this._Velocity;
     * @property { number } this._Speed;
     * @property { vec3   } this._LeftSample;
     * @property { vec3   } this._RightSample;
     * @property { number } this._Slope;
     * @property { number[]} Styles;
     */
    Trajectory.Point = class Point {

        constructor(index, styles) {
            this._Index = index;
            this._Transformation = mat4.create();
            this._Velocity = vec3.clone(vec3.zero);
            this._Speed = vec3.clone(vec3.zero);
            this._LeftSample = vec3.clone(vec3.zero);
            this._RightSample = vec3.clone(vec3.zero);
            this._Slope = 0;
            this.Styles = new Float32Array(styles);
        }

        /**
         * 
         * @param {number} index 
         */
        SetIndex(index) {
            this._Index = index;
        }

        /**
         * 
         * @return {number}
         */
        GetIndex() {
            return this._Index;
        }

        /**
         * 
         * @param {mat4} matrix 
         */
        SetTransformation(matrix) {
            this._Transformation = matrix;
        }

        /**
         * 
         * @param {Point} p 
         */
        Copy(p) {
            this._Transformation = p._Transformation;
            this._Velocity = p._Velocity;
            this._Speed = p._Speed;
            for (let i = 0; i < this.Styles.length; ++i)
                this.Styles[i] = p.Styles[i];
        }

        /**
         * 
         * @param {mat4} matrix 
         */
        ApplyPostTransform(matrix) {
            mat4.mul(this._Transformation, this._Transformation, matrix);
        }

        /**
         * 
         * @param {mat4} matrix 
         */
        ApplyDelta(matrix) {
            let pos = mat4.multiplyPoint(vec3.create(), matrix.GetPosition());
            let rotated = mat4.mul(mat4.create(), matrix, this._Transformation);
            for (let i = 0; i < 3; ++i) {
                this._Transformation[i, 3] = pos[i];
                for (let j = 0; j < 3; ++j)
                    this._Transformation[i, j] = rotated[i, j];
            }
        }

        /**
         * 
         * @return {mat4}
         */
        GetTransformation() {
            return this._Transformation;
        }

        /**
         * 
         * @param {vec3} position 
         */
        SetPosition(position) {
            //Matrix4x4Extensions.SetPosition(this._Transformation, position);
            mat4.setTranslation(this._Transformation, position);
        }

        /**
         * @param {vec3} position 
         */
        GetPosition() {
            //return Matrix4x4Extensions.GetPosition(this._Transformation);
            return mat4.getTranslation(vec3.create(), this._Transformation);
        }

        /**
         * 
         */
        SetRotation(v) {
            //Matrix4x4Extensions.SetRotation(this._Transformation, v);
            if (!isArray(v) || v.length != 4)
                throw ("rotation expected to be quaternion");

            mat4.fromRotationTranslation(this._Transformation, v, this.GetPosition());
        }

        /**
         *  @return {quat} 
         */
        GetRotation() {
            //return Matrix4x4Extensions.GetQuaternion(this._Transformation);
            return quat.fromMat4(quat.create(), this._Transformation);
        }

        /**
         * 
         * @param {vec3} direction 
         */
        SetDirection(direction) {
            let q = quat.lookRotation(quat.create(), direction == vec3.ZERO ? vec3.FRONT : direction, vec3.UP);
            this.SetRotation(q);
        }

        /**
         * @return {vec3} direction 
         */
        GetDirection() {
            //return Matrix4x4Extensions.GetForward(this._Transformation);
            let m = this._Transformation;
            return vec3.fromValues(m[2], m[6], m[11]);
        }

        /**
         * 
         * @param {vec3} velocity 
         */
        SetVelocity(velocity) {
            this._Velocity = velocity;
        }

        /**
         * @return {vec3} velocity 
         */
        GetVelocity() {
            return this._Velocity;
        }

        /**
         * 
         * @param {number} speed 
         */
        SetSpeed(speed) {
            this._Speed = speed;
        }

        /**
         * @return {number} speed
         */
        GetSpeed() {
            return this._Speed;
        }

        /**
         * @param {vec3} position 
         */
        SetLeftsample(position) {
            this._LeftSample = position;
        }

        /**
         * @return {vec3} leftsample 
         */
        GetLeftSample() {
            return this._LeftSample;
        }

        /**
         * @param {vec3} position 
         */
        SetRightSample(position) {
            this._RightSample = position;
        }

        /**
         * @return {vec3} rightsample 
         */
        GetRightSample() {
            return this._RightSample;
        }

        /**
         * @param {number} slope
         */
        SetSlope(slope) {
            this._Slope = slope;
        }

        /**
         * @return {number} slope
         */
        GetSlope() {
            return this._Slope;
        }

        /**
         * 
         */
        Postprocess() {
            //LayerMask mask      = LayerMask.GetMask("Ground"); //wich items should check collision with
            let position = this.GetPosition();
            let direction = this.GetDirection();

            position.y = Utility.GetHeight(position, mask);
            this.SetPosition(position);

            this._Slope = Utility.GetSlope(position, mask);

            //TODO: Be sure if Javi's implementation expects degrees or radians
            let q = quat.fromEuler(quat.create(), [0, 90, 0]);
            let ortho = vec3.transformQuat(vec3.create(), q, direction);
            let ortho_normalised = vec3.normalize(vec3.create(), ortho);

            //Todo: what the hell is Trajectory.Width???
            vec3.scale(this._RightSample, Trajectory.Width, ortho_normalized);
            vec3.add(this._RightSample, this._RightSample, position);
            this._RightSample[1] = Utility.GetHeight(this._RightSample, mask);

            vec3.scale(this._RightSample, Trajectory.Width, ortho_normalized);
            vec3.sub(this._RightSample, position, this._RightSample);
            this._LeftSample[1] = Utility.GetHeight(this._LeftSample, mask);
        }

        /**
         * TODO: Reimplement using LiteScene draw functions
         * @property {number} step
         */
        Draw(step) {
            /* if(step === undefined || step == null)
                 step = 1;
     
             UltiDraw.Begin();
     
             //Connections
             for(let i=0; i < this.Points.length - step; i += step) 
             {
                 UltiDraw.DrawLine(this.Points[i].GetPosition(), this.Points[i+step].GetPosition(), 0.01, UltiDraw.Black);
             }
     
             //Velocities
             for(let i=0; i<this.Points.length; i+=step) {
                 UltiDraw.DrawLine(this.Points[i].GetPosition(), this.Points[i].GetPosition() + this.Points[i].GetVelocity(), 0.025, 0, UltiDraw.DarkGreen.Transparent(0.5));
             }
     
             //Directions
             for(let i=0; i<this.Points.length; i+=step) {
                 UltiDraw.DrawLine(this.Points[i].GetPosition(), this.Points[i].GetPosition() + 0.25 * this.Points[i].GetDirection(), 0.025, 0, UltiDraw.Orange.Transparent(0.75));
             }
     
             //Positions
             for(let i=0; i<this.Points.length; i+=step) 
             {
                 UltiDraw.DrawCircle(this.Points[i].GetPosition(), 0.025, UltiDraw.Black);
             }
             
             UltiDraw.End();*/
        }
    }

    window.Trajectory = Trajectory;

})();
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
/*
 

    ████████╗███████╗███╗   ██╗███████╗ ██████╗ ██████╗ 
    ╚══██╔══╝██╔════╝████╗  ██║██╔════╝██╔═══██╗██╔══██╗
       ██║   █████╗  ██╔██╗ ██║███████╗██║   ██║██████╔╝
       ██║   ██╔══╝  ██║╚██╗██║╚════██║██║   ██║██╔══██╗
       ██║   ███████╗██║ ╚████║███████║╚██████╔╝██║  ██║
       ╚═╝   ╚══════╝╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝
                                                     
    Depends on:
    * IntPTR
    * Eigen TODO: find an implementation
*/
(function(){
    
    "use strict";


    class Tensor
    {
        constructor(rows, cols)
        {
            this.id = "undefined!"; 
            this._Deleted = false;
            
            //this.id = Eigen.Create(rows, cols);
            
            let matrix = [];
            for(let y = 0; y < rows; ++y)
            matrix.push( new Float32Array(cols) );
            
            this.id = ++Tensor.id;
            Tensor.matrices[this.id] = matrix;
        }
        
        destructor()
        {
            this.Delete();
        }
        
        Delete()
        {
            if(!this._Deleted){
                //Eigen.Delete(this.id); //TODO: implement
                throw("Not finished!");
                delete Tensor.matrices[this.id];
                this._Deleted = true;
            }
        }
        
        GetRows() 
        {
            let m = Tensor.matrices[this.id];
            console.assert(m, "matrix not found", window.DEBUG);
            return m.length;
        }
        
        GetCols() 
        {
            let m = Tensor.matrices[this.id];
            console.assert(m, "matrix not found", window.DEBUG);
            return m.length? m[0].length : 0;
        }
        
        SetZero() 
        {
            let m = Tensor.matrices[this.id];
            console.assert(m, "matrix not found", window.DEBUG);
            
            let cols = this.GetCols();
            let rows = this.GetRows();
            
            for(let y = 0; y < rows; ++y)
            for(let x = 0; x < cols; ++x)
            m[y][x] = 0;
        }
        
        SetValue(row, col, value) 
        {
            if(row >= this.GetRows() || col >= this.GetCols()) {
                console.error("Setting out of bounds at [" + row + ", " + col + "].");
                return;
            }
            
            let m = Tensor.matrices[this.id];
            console.assert(m, "matrix not found", window.DEBUG);
            
            m[row][col] = value;
        }
        
        GetValue(row, col) 
        {
            if(row >= this.GetRows() || col >= this.GetCols()) {
                console.error("Getting out of bounds at [" + row + ", " + col + "].");
                return 0;
            }
            let m = Tensor.matrices[this.id];
            console.assert(m, "matrix not found", window.DEBUG);
            
            return m[row][col];
        }
        
        Add(lhs, rhs, OUT) 
        {
            throw("Check this!");//lhs,rhs, out, are tensors, id's or what?

            if(lhs.GetRows() != rhs.GetRows() || lhs.GetCols() != rhs.GetCols()) {
                console.error("Incompatible tensor dimensions.");
            } else {
                let a = Tensor.matrices[lhs.id];
                let b = Tensor.matrices[rhs.id];
                let o = Tensor.matrices[OUT.id];
                
                console.assert(a, "matrix not found", window.DEBUG);
                console.assert(b, "matrix not found", window.DEBUG);
                console.assert(o, "matrix not found", window.DEBUG);
                
                let cols = this.GetCols();
                let rows = this.GetRows();
                
                for(let y = 0; y < rows; ++y)
                for(let x = 0; x < cols; ++x)
                o[y][x] = a[y][x] + b[y][x];
            }
            return OUT;
        }
        
        Subtract(lhs, rhs, OUT) 
        {
            throw("Check this!");//lhs,rhs, out, are tensors, id's or what?

            if(lhs.GetRows() != rhs.GetRows() || lhs.GetCols() != rhs.GetCols()) {
                console.error("Incompatible tensor dimensions.");
            } else {
                let a = Tensor.matrices[lhs.id];
                let b = Tensor.matrices[rhs.id];
                let o = Tensor.matrices[OUT.id];
                
                console.assert(a, "matrix not found", window.DEBUG);
                console.assert(b, "matrix not found", window.DEBUG);
                console.assert(o, "matrix not found", window.DEBUG);
                
                let cols = this.GetCols();
                let rows = this.GetRows();
                
                for(let y = 0; y < rows; ++y)
                for(let x = 0; x < cols; ++x)
                    o[y][x] = a[y][x] - b[y][x];
            }
            return OUT;
        }
        
        Product(lhs, rhs, OUT) 
        {
            throw("Check this!");//lhs,rhs, out, are tensors, id's or what?

            if(lhs.GetCols() != rhs.GetRows()) {
                console.error("Incompatible tensor dimensions.");
            } else { 
                let a = Tensor.matrices[lhs.id];
                let b = Tensor.matrices[rhs.id];
                let o = Tensor.matrices[OUT.id];
                
                console.assert(a, "matrix not found", window.DEBUG);
                console.assert(b, "matrix not found", window.DEBUG);
                console.assert(o, "matrix not found", window.DEBUG);
                
                let cols = this.GetCols();
                let rows = this.GetRows();
                let size = lhs.GetCols();
                
                for(let y = 0; y < rows; ++y)
                for(let x = 0; x < cols; ++x)
                    o[y][x] = 0;
                    
                for(let i = 0; i < size; ++i)
                    o[y][x] += a[y][i] * b[i][x];
            }
            return OUT;
        }
        
        Scale(lhs, value, OUT) 
        {
            throw("Check this!");//lhs,rhs, out, are tensors, id's or what?

            //Eigen.Scale(lhs.id, value, OUT.id); //TODO: implement this!
            throw("Not finished!");
            
            let a = Tensor.matrices[lhs.id];
            let o = Tensor.matrices[OUT.id];
            
            console.assert(a, "matrix not found", window.DEBUG);
            console.assert(o, "matrix not found", window.DEBUG);
            
            let cols = this.GetCols();
            let rows = this.GetRows();
            
            for(let y = 0; y < rows; ++y)
            for(let x = 0; x < cols; ++x)
            o[y][x] *= value;
            
            return OUT;
        }
        
        //TODO: what is PointwiseProduct?
        PointwiseProduct(lhs, rhs, OUT) 
        {
            throw("Check this!");//lhs,rhs, out, are tensors, id's or what?

            if(lhs.GetRows() != rhs.GetRows() || lhs.GetCols() != rhs.GetCols()) {
                console.log("Incompatible tensor dimensions.");
            } else {
                Eigen.PointwiseProduct(lhs.id, rhs.id, OUT.id);
            }
            return OUT;
        }
        
        //TODO: what is PointwiseQuotient?
        PointwiseQuotient(lhs, rhs, OUT) 
        {
            throw("Check this!");//lhs,rhs, out, are tensors, id's or what?

            if(lhs.GetRows() != rhs.GetRows() || lhs.GetCols() != rhs.GetCols()) {
                console.log("Incompatible tensor dimensions.");
            } else {
                //Eigen.PointwiseQuotient(lhs.id, rhs.id, OUT.id);//TODO: implement this!
                throw("Not Finished!");
            }
            return OUT;
        }
        
        //TODO: what is PointwiseAbsolute?
        PointwiseAbsolute(IN, OUT) 
        {
            throw("Check this!");//lhs,rhs, out, are tensors, id's or what?

            //Eigen.PointwiseAbsolute(IN.id, OUT.id); //TODO: implement this!
            return OUT;
        }
        
        RowSum(row) 
        {
            if(row >= this.GetRows()) {
                console.log("Accessing out of bounds.");
                return 0;
            }
            //return Eigen.RowSum(Ptr, row);
            
            let m = Tensor.matrices[this.id];
            let v = 0;
            
            console.assert(a, "matrix not found", window.DEBUG);
            console.assert(o, "matrix not found", window.DEBUG);
            
            let cols = this.GetCols();
            
            for(let x = 0; x < cols; ++x)
                v += m[row][x];
            
            return v;
        }
        
        ColSum(col) 
        {
            if(col >= this.GetCols()) {
                console.log("Accessing out of bounds.");
                return 0;
            }
            
            let rows = this.GetRows();
            
            for(let y = 0; y < rows; ++y)
                v += m[y][col];
            
            return v;
        }
    }
    Tensor.matrices = {};

    window.Tensor = Tensor;

})(window);/*
 

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
            throw("Not Implemented");
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

})();"use strict";

/***
 *  ██████╗██╗  ██╗ █████╗ ██████╗  █████╗  ██████╗████████╗███████╗██████╗   
 * ██╔════╝██║  ██║██╔══██╗██╔══██╗██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗  
 * ██║     ███████║███████║██████╔╝███████║██║        ██║   █████╗  ██████╔╝  
 * ██║     ██╔══██║██╔══██║██╔══██╗██╔══██║██║        ██║   ██╔══╝  ██╔══██╗  
 * ╚██████╗██║  ██║██║  ██║██║  ██║██║  ██║╚██████╗   ██║   ███████╗██║  ██║  
 *  ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝  
 *   
 *  ██████╗ ██████╗ ███╗   ██╗████████╗██████╗  ██████╗ ██╗     ██╗     ███████╗██████╗ 
 * ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔═══██╗██║     ██║     ██╔════╝██╔══██╗
 * ██║     ██║   ██║██╔██╗ ██║   ██║   ██████╔╝██║   ██║██║     ██║     █████╗  ██████╔╝
 * ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██╗██║   ██║██║     ██║     ██╔══╝  ██╔══██╗
 * ╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╔╝███████╗███████╗███████╗██║  ██║
 *  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝
 * Depends on:
 * * glmatrix.js: http://glmatrix.net/
 * 
 * CHECK ALL ABOUT SPLINE IF ITS CORRECT
 */

(function () {

    /**
           public GameObject Character;
           public BezierSpline Spline;
    
           public string RootEffector = "Hips";
           public float PathDuration = 10f;
           public bool RealTime = false;
           //public bool TargetVelocity = false;
           public int MinSpeedFactor = 50;
           public int MaxSpeedFactor = 170;
           public bool EnableGUISlider = true;
    
    
           public int SpeedFactor = 100;
           private const int InitialFrames = 120;
           private int InitialFramesCnt = InitialFrames;
    
           private List<Transform> Transforms = new List<Transform>();
           private MANNController NNController;
           private bool Initialised = false;
           private Vector3 Direction;
                   private class PoseTransform
           {
               public Vector3 position;
               public Quaternion rotation;
               public PoseTransform(Vector3 pos, Quaternion rot)
               {
                   position = pos;
                   rotation = rot;
               }
           }
           private PoseTransform[] InitialPose;
    
           private float Progress;
           private GUIStyle SliderStyle;
           private GUIStyle FontStyle;
           private GUIStyle ThumbStyle;
           private bool ShowGUI = true;
     */
    class PoseTransform {
        constructor(pos, rot) {
            this.position = pow || vec3.create();
            this.rotation = rot || quat.create();
        }
    }

    class NNCharController {
        constructor(o) {
            // /*public GameObject      */ this.Character;
            // /*public BezierSpline    */ this.Spline;
            // /*public string          */ this.RootEffector = "Hips";
            // /*public float           */ this.PathDuration = 10;
            // /*public bool            */ this.RealTime = false;
            // /*public int             */ this.MinSpeedFactor = 50;
            // /*public int             */ this.MaxSpeedFactor = 170;
            // /*public bool            */ this.EnableGUISlider = true;
            // /*public int             */ this.SpeedFactor = 100;
            // /*private const int      */ this._InitialFrames = 120;
            // /*private int            */ this._InitialFramesCnt = InitialFrames;
            // /*private List<Transform>*/ this._Transforms = [];//new List<Transform>();
            // /*private MANNController */ this._NNController;
            // /*private bool           */ this._Initialised = false;
            // /*private Vector3        */ this._Direction = vec3.create();
            // /*private PoseTransform[]*/ this._InitialPose;
            // /*private float          */ this._Progress;
            // /*private GUIStyle       */ this._SliderStyle;
            // /*private GUIStyle       */ this._FontStyle;
            // /*private GUIStyle       */ this._ThumbStyle;
            // /*private bool           */ this._ShowGUI = true;


            this.root_id = "";
            this.spline_id = "";
            this.speed = 5;
            this.trajectory_position = vec3.create();
            this.trajectory_direction = vec3.create();
            this.mann_parameters_file = "";

            this._MANN = new MANNController();
            this.configure(o);
        }

        configure(o) {
            o = o || {};

            //Asign configuration object data to current instance container
            Object.assign(this, o);

            if (this.mann_parameters_file && this.mann_parameters_file.length > 0) {
                this._MANN.mann_parameters_file = o.mann_parameters_file;
            }
        }

        serialize() {
            let data = {};

            [
                "root_id",
                "spline_id",
                "speed",
                "mann_parameters_file"
            ].map(x => data[x] = this[x]);

            return data;
        }

        onStart() {
            if (!this._MANN) {
                console.error("NN not loaded")
                return;
            }

            this.ratio = 0;

            //Get the spline points
            //https://math.stackexchange.com/questions/2154029/how-to-calculate-a-splines-length-from-its-control-points-and-knots-vector
            this._spline_length = 0;
            {
                this._spline_node = LS.GlobalScene._root.findNodeByUId(this.spline_id);
                if (!this._spline_node) return;
                this._spline = this._spline_node.getComponent(LS.Components.Spline);
                var a = this._spline.path.points[0];
                for (var i = 1; i < this._spline.path.points.length; ++i) {
                    var b = this._spline.path.points[i];
                    this._spline_length += vec3.distance(a, b);
                    a = b;
                }
            }

            //Get the skeleton transforms
            {
                this._root_node = LS.GlobalScene._root.findNodeByUId(this.root_id);
                if (!this._root_node) return;
                this.reverse_mapping_nodes = {};
                this.skeleton_transforms = [this._root_node];
                if (this._root_node && this._root_node.constructor.name == "SceneNode") {
                    this.skeleton_transforms = this.skeleton_transforms.concat(this._root_node.getDescendants());
                    for (let i = 0; i < this.skeleton_transforms.length; ++i)
                        this.reverse_mapping_nodes[this.skeleton_transforms[i].name] = i;
                }

                if (!this.skeleton_transforms || this.skeleton_transforms.length <= 1)
                    throw ("skeleton transforms not found");
            }

            //todo:this has to be checked coz i modified
            this._MANN.setSkeletonTransforms(this.skeleton_transforms, this._root_node.name);
            this._MANN.setCurrentPoseAsInitial();
        }


        onUpdate(dt) {
            if (!this._MANN || !this._spline) {
                console.error("NN not loaded")
                return;
            }

            var v = (this.speed * dt) / this._spline_length;
            this.ratio += Math.max(0, Math.min(1, v));

            this._spline.getPoint(this.ratio, this.trajectory_position);
            //Get direction from a given ratio, be sure that the spline has at least four points if its bezier and two if its hermite
            {
                var a = this._spline.getPoint(Math.max(0, this.ratio - 0.01));
                var b = this._spline.getPoint(Math.min(1, this.ratio + 0.01));
                vec3.sub(this.trajectory_direction, a, b);
                vec3.normalize(this.trajectory_direction, this.trajectory_direction);
            }

            this._MANN.setTargetPositionAndDirection(this.trajectory_position, this.trajectory_direction);
            this._MANN.RunControl();
            this.AnimateTransforms();
        }

        AnimateTransforms() {
            let transforms = this._MANN.getCurrentTransforms();

            for (let t of transforms) {
                //todo: needs to be implemented
                let node = reverse_mapping_nodes[t.name];// rootNode.findNodeByName(t.name);
                node.transform = t.transform.clone();
            }
        }
    }

    window.NNCharController = NNCharController;

})();
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

        MANN.FORMAT = { extension: "json", dataType: "text" };


        LS.registerResourceClass(MANN);
    } 

})(window);/*
 ███╗   ██╗███╗   ██╗
 ████╗  ██║████╗  ██║
 ██╔██╗ ██║██╔██╗ ██║
 ██║╚██╗██║██║╚██╗██║
 ██║ ╚████║██║ ╚████║
 ╚═╝  ╚═══╝╚═╝  ╚═══╝

   ██████╗██╗  ██╗ █████╗ ██████╗  █████╗  ██████╗████████╗███████╗██████╗   
 ██╔════╝██║  ██║██╔══██╗██╔══██╗██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗  
 ██║     ███████║███████║██████╔╝███████║██║        ██║   █████╗  ██████╔╝  
 ██║     ██╔══██║██╔══██║██╔══██╗██╔══██║██║        ██║   ██╔══╝  ██╔══██╗  
 ╚██████╗██║  ██║██║  ██║██║  ██║██║  ██║╚██████╗   ██║   ███████╗██║  ██║  
  ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝  
   
  ██████╗ ██████╗ ███╗   ██╗████████╗██████╗  ██████╗ ██╗     ██╗     ███████╗██████╗ 
 ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔═══██╗██║     ██║     ██╔════╝██╔══██╗
 ██║     ██║   ██║██╔██╗ ██║   ██║   ██████╔╝██║   ██║██║     ██║     █████╗  ██████╔╝
 ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██╗██║   ██║██║     ██║     ██╔══╝  ██╔══██╗
 ╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╔╝███████╗███████╗███████╗██║  ██║
  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝
                                                                                   
  ██████╗ ██████╗ ███╗   ███╗██████╗  ██████╗ ███╗   ██╗███████╗███╗   ██╗████████╗
 ██╔════╝██╔═══██╗████╗ ████║██╔══██╗██╔═══██╗████╗  ██║██╔════╝████╗  ██║╚══██╔══╝
 ██║     ██║   ██║██╔████╔██║██████╔╝██║   ██║██╔██╗ ██║█████╗  ██╔██╗ ██║   ██║   
 ██║     ██║   ██║██║╚██╔╝██║██╔═══╝ ██║   ██║██║╚██╗██║██╔══╝  ██║╚██╗██║   ██║   
 ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     ╚██████╔╝██║ ╚████║███████╗██║ ╚████║   ██║   
  ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═══╝   ╚═╝   
                                                                                
*/
(function(){

    "use strict";

    if (!LS) return;

    NNCharController.prototype.onAddedToScene = function(scene) {
        LEvent.bind(scene, "start",  this.onStart, this);
        LEvent.bind(scene, "update", this.onUpdate, this);
    }

    NNCharController.prototype.onRemovedFromScene = function(scene) {
        LEvent.unbindAll(scene, this);
    }

    NNCharController["@mann_filename"]  = { widget: "resource", resource_classname: "MANN" };
    NNCharController["@root_id"]        = { widget: "node_id" };
    NNCharController["@spline_id"]      = { widget: "node_id" };
    NNCharController["@inspector"]      = function(component, inspector) 
    {

    }


    LS.registerComponent(NNCharController);
})(window);