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
            return quat.fromMat3AndQuat(
                quat.create(), 
                mat3.fromMat4(mat3.create(), this._Transformation)
            );
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

})();/*
 
    ███╗   ███╗ █████╗ ███╗   ██╗███╗   ██╗     ██████╗ ██████╗ ███╗   ██╗████████╗██████╗  ██████╗ ██╗     ██╗     ███████╗██████╗ 
    ████╗ ████║██╔══██╗████╗  ██║████╗  ██║    ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔═══██╗██║     ██║     ██╔════╝██╔══██╗
    ██╔████╔██║███████║██╔██╗ ██║██╔██╗ ██║    ██║     ██║   ██║██╔██╗ ██║   ██║   ██████╔╝██║   ██║██║     ██║     █████╗  ██████╔╝
    ██║╚██╔╝██║██╔══██║██║╚██╗██║██║╚██╗██║    ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██╗██║   ██║██║     ██║     ██╔══╝  ██╔══██╗
    ██║ ╚═╝ ██║██║  ██║██║ ╚████║██║ ╚████║    ╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╔╝███████╗███████╗███████╗██║  ██║
    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝     ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝
    
    Dependends on: 
 
*/

(function () {
    
    
    class MANNController {
        constructor(o)
        {
            this.bone_names_map         = {};
            this._transforms            = [];
            this._initial_pose          = [];

            this.NNParametersFile       = null;                 //public string 
            this._NNParameters          = null;                 //private MANNParameters 
            this._NumBones              = 0;                    //private int 
            this._NN                    = null;                 //private MANN 
            this._NumStyles             = 0;                    //private int 
            this._Styles                = new Float32Array(0);  //private float[] 
            this._DirAxis               = 2;                    //private int     
            this._DirSign               = 1;                    //private float   

            // control options
            this.DirectionControl = true;                       //public bool 
            this.EEControl = false;                             //public bool 

            //State
            this._PoseTransforms        = [];                   //private Transform4x4[]  
            this._Velocities            = vec3.create();        //private Vector3[]       
            this._EffectorTargets       = vec3.create();        //private Vector3[]       
            this._EffectorTargetEnabled = [];                   //private bool[]          

            // NN Parameters
            this._JointDim              = 12;                   //private int 
            this._Framerate             = 60;                   //private int 
            this._InputSamples          = 12;                   //private int 
            this._OutputSamples         = 0;                    //private int 
            this._InputPoint            = 60;                   //private int 
            this._PointDensity          = 10;                   //private int 
            this._TrainingRoot          = 0;                    //private int 
            this._TrajOrientType        = 0;                    //private int 

            // Performance
            this._NetworkPredictionTime = null;                 //private float 

            // Logging
            this._LogFile               = null;                 //private FileStream      
            this._InputLog              = null;                 //private FileStream      
            this._OutputLog             = null;                 //private FileStream      

            //Position PID
            this._TargetLocalVelocity   = vec3.create();        //private Vector2         
            this._TargetPosition        = vec3.create();        //private Vector3         
            this._TargetDirection       = vec3.create();        //private Vector3         
            this._TargetVelocity        = vec3.create();        //private Vector3         
            this._Trajectory            = null;                 //private Trajectory      

            this._LastVelError          = vec3.create();        //private Vector3         
            this._LastPosError          = vec3.create();        //private Vector3         
            this._LastVelError2         = vec3.create();        //private Vector3         

            //EE control
            this._Effectors             = new Int8Array(0);     //private int[]           
            this._RootEffector          = 0;                    //19; //public  int             
            this._LastPosErrorEE        = null;                 //private Vector3[]       
            this._LastVelErrorEE        = null;                 //private Vector3[]       

            //Transitioning
            this._AnimationData         = [];                   //private Matrix4x4[][]   maybe store transforms there instead
            this._TransitionStart       = 0;                    //90; //private int             
            this._TransitionEnd         = 0;                    //470; //private int             
            this._TransitionTime        = 0;                    //(470f - 90f) / Framerate / 7f; //private float           
            this._AnimationStyle        = [];                   //private float[][]    
        }
        configure(o){}
        serialize(){}

        /**
         * this is to be called by Awake of the client script so that network 
         * parameters such as the number of bones and their names can be queried before Setup
         * @returns {void}
         */
        Init() {
            //TODO: REVISIT THIS
            if (MANNController.CONSTRUCT_MANN) {
                if (this.NNParametersFile != null) {
                    if (this._NN == null)
                        this._NN = new MANN();
                    this._NN.ReadParameters(this.NNParametersFile);
                    this._NNParameters = this._NN.Parameters;
                }
            }
        }
        
        /**
         * 
         * @param {Transform[]} xforms
         * @returns {bool}
         */
        Setup(xforms){
            //Construct MANN
            {
                if (this.NNParametersFile != null) {
                    if (this._NN == null) {
                        this._NN = new MANN();
                        this._NNParameters = null;
                    }
                    if (this._NNParameters == null) {
                        this._NN.ReadParameters(this.NNParametersFile);
                        this._NNParameters = this._NN.Parameters;
                    }
                }
                else {
                    return false;
                }
            }

            //NN.LoadParameters();
            this._NumStyles         = this._NN.Parameters.Labels.length || 0;
            this._InputPoint        = this._NN.Parameters.InputSample * this._NN.Parameters.Sampling;
            this._NumBones          = this._NN.Parameters.BoneNames.length || 0;
            this._InputSamples      = this._NN.Parameters.NumSamples;

            //OutputSamples         = NN.Parameters.NumOuputSamples;
            this._PointDensity      = this._NN.Parameters.Sampling;
            this._TrainingRoot      = this._NN.Parameters.RootEffector;

            this._TargetDirection   = vec3.clone(vec3.FRONT);
            this._TargetVelocity    = vec3.clone(vec3.ZERO);
            //TargetTransform       = new Transform4x4();
            this._LastVelError      = vec3.create();
            this._LastPosError      = vec3.create();
            this._LastVelError2     = vec3.create();

            // these could be made fields of Trajectory type
            //TrajOrientType        = new int[numTrajectories];
            //TrajDeltaOrientType   = new int[numTrajectories];
            this._DirAxis           = this._NN.Parameters.DirectionAxis;
            this._DirSign           = this._NN.Parameters.DirectionSign;
            this._TrajOrientType    = this._NN.Parameters.TrajectoryOrientationType;

            let numPoints = (this._InputSamples - 1) * this._PointDensity + 1;
            let trajBone  = this._NN.Parameters.BoneNames[this._NN.Parameters.RootEffector];
            let index     = xforms.findIndex(x => x.name == trajBone);
            if (index < 0)
                throw ("Bone name " + trajBone + " not found!");

            let initPosition  = mat4.getTranslation(vec3.create(), xforms[index]);
            let initRotation  = quat.create();
            let initDirection = vec3.create();

            switch (this._TrajOrientType) {
                case MANN.OrientType.FLAT_Y_UP:
                    initPosition [1] = 0;
                    let rotation = quat.fromMat3AndQuat(
                        quat.create(),
                        mat3.fromMat4(mat3.create(),  trajTrf)
                    );
                    initDirection = vec3.transformQuat(initDirection, rotation, vec3.FRONT);
                    initDirection[1] = 0;
                    vec3.normalize(initDirection, initDirection);
                    quat.lookRotation(initRotation, initRotation, vec3.UP);
                    break;
                default:
                    // TODO: what would be the forward vector with Z or X up?
                    throw ("Not implemented for trajectory orientation type " + this._TrajOrientType);
            }

            this._Trajectory      = new Trajectory(numPoints, this._NumStyles, initPosition, initRotation);
            this._TargetPosition  = initPosition;
            this._TargetDirection = initDirection;
            
            if (this._NumStyles > 0) 
            for (let j = 0; j < this._Trajectory.Points.length; ++j)
                this._Trajectory.Points[j].Styles[0] = 1;
                
            if (this._NumBones > 0) {
                this._PoseTransforms  = new Array(this._NumBones);//new Transform4x4[NumBones];
                this._Velocities      = new Array(this._NumBones);//new Vector3[NumBones];
                this._EffectorTargets = new Array(this._NumBones);//new Vector3[NumBones];
                this._LastVelErrorEE  = new Array(this._NumBones);//new Vector3[NumBones];
            }
            
            for (let i = 0; i < this._NumBones; ++i)
            {
                index = xforms.findIndex(x => x.name == this._NN.Parameters.BoneNames[i]);
                if (index < 0)
                    throw ("Bone name " + this._NN.Parameters.BoneNames[i] + " not found!");

                    this._PoseTransforms[i] = mat4.fromQuat(mat4.create(), quat.lookRotation(quat.create(), xforms[index].getFront(), xforms[index].getTop()) );
                    mat4.setTranslation(this._PoseTransforms[i], xforms[index].position);
        
                    this._Velocities     [i] = vec3.clone(vec3.ZERO);
                    this._EffectorTargets[i] = mat4.getTranslation(vec3.create(),xforms[index]);
            }

            if (this.EEControl)
                this.AddEEControl();

            return true;
        }
        //=======================================================================
        //  Computation Related
        //=======================================================================
 

        //Run things?
        /**
         * @returns {void}
         */
        RunControl(){
            if (this.EEControl)
                this.RunEEControl();
            this.RunPositionControl();
            this.ComputeOutput();
        }

        /**
         * @returns {void}
         */
        AddEEControl(){
            this.EEControl = true;
            this.ResizeEffectorData();
        }

        /**
         * @returns {void}
         */
        ResizeEffectorData(){
            if (this._Effectors.length > 0) 
            {
                this._LastPosErrorEE = new Array(this._Effectors.length);//new Vector3[Effectors.Length];
                this._LastVelErrorEE = new Array(this._Effectors.length);//new Vector3[Effectors.Length];
            }
        }
        
        /**
         * ???? what is this suposed to do?
         * @private
         * @returns {void}
         */
        RunEEControl(){
            let ts = 1 / this._Framerate;
            let boneIdx = null;
            for (let i = 0; i < this._Effectors.length; ++i)
            {
                    boneIdx  = this._Effectors[i];
                let currPos  = mat4.getTranslation(vec3.create(), this._PoseTransforms[boneIdx]);
                let posError = mat4.getTranslation(vec3.create(), this._EffectorTargets[boneIdx]);
                vec3.sub(posError,posError, currPos);

                if (boneIdx == this._TrainingRoot) // if PID velocity algorithm is used in trajectory control
                    posError[0] = posError[2] = 0;

                // PID position algorithm
                let Kc = 0.5; // 0.5f;
                let iratio = 0.1; // 1f / 10f;
                
                //let deltaPos  = Kc * ((posError - this._LastPosErrorEE[i]) + iratio * posError);            
                let deltaPos = vec3.sub(vec3.create(), posError, this._LastPosErrorEE[i]);
                let a = vec3.mul(vec3.create(), posError, [iratio, iratio, iratio]);
                deltaPos = vec3.add(deltaPos, deltaPos, a);
                deltaPos = vec3.mul(deltaPos, deltaPos, [Kc, Kc, Kc]);

                let b = vec3.div(vec3.create(), deltaPos, ts);
                this._Velocities[i] = vec3.add(vec3.create(), this._Velocities[i], b);
                this._LastPosErrorEE[i] = vec3.clone(posError);
            }
        }

        /**
         * @param {vec3} move
         * @param {float} turn
         * @returns {void}
         */
        RunGameControl(move, turn){
            let ts = 1 / this._Framerate;
            let currRot = this._Trajectory.Points[this._InputPoint].GetRotation();
            let aux = vec3.scale(vec3.create(), move, 1e-1);
            vec3.sum(this._TargetLocalVelocity,this._TargetLocalVelocity, aux);
            let worldVel = vec3.transformQuat(vec3.create(), this._TargetLocalVelocity, currRot);

            if (this._NumStyles > 0 && this._Styles != null) {
                if (vec3.length(this._TargetLocalVelocity) < 1e-16) {
                    this._Styles[0] = 1;
                    this._Styles[1] = 0;
                }
                else {
                    this._Styles[1] = 1;
                    this._Styles[0] = 0;
                }
                NNMath.SoftMax(Styles);
            }

            let Kc = 1;
            let iratio = 5;  // ts/tau_i

            let currVel = vec3.copy(vec3.create(), this._Trajectory.Points[this._InputPoint].GetVelocity());
            let velError = vec3.sub(vec3.create(), worldVel, currVel);
            //Vector3 velUpdate      = Kc * ((velError - LastVelError) + iratio * velError);
            let velUpdate = vec3.sub(vec3.create(), velError, this._LastVelError);
            vec3.mul(velUpdate, velUpdate, [Kc, Kc, Kc]);
            let tv3 = vec3.mul(vec3.create(), velError, [iratio, iratio, iratio]);
            vec3.add(velUpdate, velUpdate, tv3);

            vec3.copy(this._LastVelError, velError);
            vec3.add(this._TargetVelocity, currVel, velUpdate);

            if (turn != 0 && this.DirectionControl) {

                //this._TargetDirection = Quaternion.AngleAxis(turn, Vector3.up) * Trajectory.Points[InputPoint].GetDirection();
                let q = quat.fromAxisAngle(vec3.UP, turn);
                vec3.transformQuat(this._TargetDirection, this._Trajectory.Points[this._InputPoint].GetDirection(), q);
            }


            // write future trajectory
            let pos0 = vec3.copy(vec3.create(), this._Trajectory.Points[this._InputPoint].GetPosition());
            let pointDistance = vec3.length(this._TargetVelocity) * ts;
            for (let i = this._InputPoint; i < this._Trajectory.Points.length; i += this._PointDensity) {
                let point = this._Trajectory.Points[i];
                let v = (i - this._InputPoint) * ts;
                let aux = vec3.mul(vec3.create(), this._TargetVelocity, [v, v, v])
                //let pos   = pos0 + (i - InputPoint) * ts * TargetVelocity;
                let pos = vec3.add(vec3.create(), pos0, aux);

                point.SetPosition(pos);
                point.SetVelocity(this._TargetVelocity);
                point.SetSpeed(pointDistance);

                if (this.DirectionControl)
                    point.SetDirection(this._TargetDirection);

                if (this._Styles != null)
                    for (let j = 0; j < this._NumStyles; ++j)
                        point.Styles[j] = this._Styles[j];
            }

            this.ComputeOutput();
        }

        /**
         * @private
         * @returns {void}
         */
        RunPositionControl(){
            let ts = 1 / this._Framerate;
            let currVel = vec3.clone(this._Trajectory.Points[this._InputPoint].GetVelocity());

            // if RootEffector != original root then need to adjust the target for original root
            // e.g. subtract Head - Hips if Head is RootEffector but Hips was the training root
            let velError = vec3.sub(vec3.create(), this.EstimateTargetVelocity(this._Trajectory, this._TargetPosition, this._Framerate), currVel);
            velError[1] = 0;

            // PID velocity alogrithm
            // flat
            let Kc = 1;                                                    // 0.1f;
            let iratio = 1 / 5;                                               //  ts/tau_i
            //Vector3 velUpdate      = Kc * ((velError - LastVelError) + iratio * velError);
            let a = vec3.sub(vec3.create(), velError, this._LastVelError);
            let b = vec3.scale(vec3.create(), velError, iratio);
            let v = vec3.add(vec3.create(), a, b);
            let velUpdate = vec3.scale(vec3.create(), v, Kc);

            this._LastVelError = vec3.clone(velError);
            this._TargetVelocity = vec3.add(vec3.create(), currVel, velUpdate);

            // write future trajectory
            let pos0 = mat4.getTranslation(vec3.create(), this._Trajectory.Points[this._InputPoint]);// + posUpdate;
            let pointDistance = vec3.length(this._TargetVelocity) * ts;
            for (let i = this._InputPoint; i < this._Trajectory.Points.length; i += this._PointDensity) {
                let point = this._Trajectory.Points[i];

                //let pos   = pos0 + (i - this._InputPoint) * ts * this._TargetVelocity;
                let c = vec3.scale(vec3.create(), this._TargetVelocity, ts);
                vec3.scale(c, c, i - this._InputPoint);
                let pos = vec3.add(vec3.create(), pos0, c);

                point.SetPosition(pos);
                point.SetVelocity(this._TargetVelocity);
                point.SetSpeed(pointDistance);

                if (this.DirectionControl)
                    point.SetDirection(this._TargetDirection);

                if (this._Styles != null)
                    for (let j = 0; j < this._NumStyles; ++j)
                        point.Styles[j] = this._Styles[j];
            }
        }

        /**
         * @private
         * @returns {void}
         */
        ComputeOutput(){
            // Calculate Root
            let currentRoot = mat4.clone(this._Trajectory.Points[this._InputPoint].GetTransformation());
             // For flat terrain, Y up
            currentRoot[13] = 0;  
            let fromWorld = mat4.invert(mat4.create(), currentRoot);

            let pos = vec3.create(),
                forward = vec3.create(),
                up = vec3.create(),
                vel = vec3.create();
            let idx = 0;

            // Input Trajectory Positions / Directions / Velocities / Styles
            for (let i = 0; i < this._InputSamples; ++i) {
                let iSample = this.GetSample(this._Trajectory, i);
                mat4.multiplyPoint(pos,     fromWorld, iSample.GetPosition())
                mat4.multiplyPoint(forward, fromWorld, iSample.GetDirection())
                mat4.multiplyPoint(vel,     fromWorld, iSample.GetVelocity())

                // TODO: this is hard-coded for a Y-up scene
                this._NN.SetInput(idx++, pos[0]);
                this._NN.SetInput(idx++, pos[2]);
                this._NN.SetInput(idx++, forward[0]);
                this._NN.SetInput(idx++, forward[2]);
                this._NN.SetInput(idx++, vel[0]);
                this._NN.SetInput(idx++, vel[2]);
                this._NN.SetInput(idx++, iSample.GetSpeed());

                for (let j = 0; j < this._NumStyles; ++j) {
                    this._NN.SetInput(idx++, iSample.Styles[j]);
                }
            }

            // Input Previous Bone Positions / Velocities
            for (let i = 0; i < this._NumBones; ++i) {
                let q = quat.fromMat3AndQuat(quat.create(), mat3.fromMat4(mat3.create(), this._PoseTransforms[i]));
                let front = vec3.transformQuat(out || vec3.create(), Transform.FRONT, q );
                let top   = vec3.transformQuat(out || vec3.create(), Transform.UP,    q );
                mat4.multiplyPoint(pos,     fromWorld, mat4.getTranslation(vec3.create(), this._PoseTransforms[i]));
                mat4.multiplyPoint(forward, fromWorld, front);
                mat4.multiplyPoint(up,      fromWorld, top);

                this._NN.SetInput(idx++, pos[0]);
                this._NN.SetInput(idx++, pos[1]);
                this._NN.SetInput(idx++, pos[2]);
                this._NN.SetInput(idx++, forward[0]);
                this._NN.SetInput(idx++, forward[1]);
                this._NN.SetInput(idx++, forward[2]);
                this._NN.SetInput(idx++, up[0]);
                this._NN.SetInput(idx++, up[1]);
                this._NN.SetInput(idx++, up[2]);

                mat4.multiplyPoint(vel, fromWorld, this._Velocities[i]);

                this._NN.SetInput(idx++, vel[0]);
                this._NN.SetInput(idx++, vel[1]);
                this._NN.SetInput(idx++, vel[2]);
            }

            // Predict
            //System.DateTime timestamp = System.DateTime.Now;
            let ts = performance.now();
            this._NN.Predict();
            //this._NetworkPredictionTime = (float)(System.DateTime.Now - timestamp).Duration().TotalSeconds;
            this._NetworkPredictionTime = performance.now() - ts;

            // Update Past Trajectory
            for (let i = 0; i < this._InputPoint; ++i) {
                this._Trajectory.Points[i].SetPosition( this._Trajectory.Points[i + 1].GetPosition() );
                this._Trajectory.Points[i].SetDirection(this._Trajectory.Points[i + 1].GetDirection());
                this._Trajectory.Points[i].SetVelocity( this._Trajectory.Points[i + 1].GetVelocity() );
                this._Trajectory.Points[i].SetSpeed(    this._Trajectory.Points[i + 1].GetSpeed()    );

                for (let j = 0; j < this._NumStyles; ++j) {
                    this._Trajectory.Points[i].Styles[j] = this._Trajectory.Points[i + 1].Styles[j];
                }

            }

            idx = this._NumBones * this._JointDim;

            let rootMotion = vec3.fromValues(
                this._NN.GetOutput(idx++),
                this._NN.GetOutput(idx++),
                this._NN.GetOutput(idx++)
            );

            vec3.scale(rootMotion, rootMotion, 1 / this._Framerate);

            //TODO: this is hard-coded for a Y-up scene

            let translation = vec3.fromValues(rootMotion[0], 0, rootMotion[2]);
            let angle = rootMotion[1];
            let deltaRotation = quat.fromAxisAngle(vec3.UP, angle);

            this._Trajectory.Points[this._InputPoint].SetPosition(mat4.multiplyPoint(vec3.create(), currentRoot, translation));
            let newRot = quat.mul(quat.create(), deltaRotation, this._Trajectory.Points[this._InputPoint].GetRotation());
            this._Trajectory.Points[this._InputPoint].SetRotation(quat.normalize(quat.create(), newRot));

            let v = vec3.scale(vec3.create(), translation, this._Framerate);
            mat4.rotateVec3(v, curentRoot, v);
            this._Trajectory.Points[this._InputPoint].SetVelocity(v);

            // Update Future Trajectory
            // this is just for drawing the future trajectory (overwritten by control in next frame)
            // output is in input frame space (currentRoot)
            idx = 0;

            // Compute Posture
            for (let i = 0; i < this._NumBones; ++i) {
                mat4.multiplyPoint(
                    pos,
                    currentRoot,
                    vec3.fromValues(
                        this._NN.GetOutput(idx++),
                        this._NN.GetOutput(idx++),
                        this._NN.GetOutput(idx++)
                ));

                mat4.multiplyVec3(
                    forward,
                    currentRoot,
                    vec3.fromValues(
                        this._NN.GetOutput(idx++),
                        this._NN.GetOutput(idx++),
                        this._NN.GetOutput(idx++)
                ));

                mat4.multiplyVec3(
                    up,
                    currentRoot,
                    vec3.fromValues(
                        this._NN.GetOutput(idx++),
                        this._NN.GetOutput(idx++),
                        this._NN.GetOutput(idx++)
                ));

                mat4.fromQuat(this._PoseTransforms[i], quat.lookRotation(quat.create(), forward, up));

                mat4.multiplyVec3(
                    vel, 
                    curentRoot, 
                    vec3.fromValues(
                        this._NN.GetOutput(idx++),
                        this._NN.GetOutput(idx++),
                        this._NN.GetOutput(idx++)
                ));

                
                let a = vec3.div(vec3.create, vel, [this._Framerate, this._Framerate, this._Framerate]);
                vec3.add(a, mat4.getTranslation(vec3.create(), this._PoseTransforms[i]), a);
                mat4.setTranslation(
                    this._PoseTransforms[i],
                    vec3.lerp(vec3.create(), a, pos, 0.5)
                );
                
                this._Velocities[i] = vec3.clone(vel);
            }

            // use current orientation of the root effector for future trajectory, in case direction control is not used
            forward = this.GetDirection(this._PoseTransforms[this._TrainingRoot].matrix);
            for (let i = this._InputPoint + this._PointDensity; i < this._Trajectory.Points.length; i += this._PointDensity)
                this._Trajectory.Points[i].SetDirection(forward);

        }

        //NN
        /**
         * @returns {float}
         */
        GetNetworkPredictionTime(){
            let v = this._NetworkPredictionTime;

            console.assert(!isNaN(v), "prediction time is NaN", window.DEBUG);
            console.assert(v >= 0, "prediction time is negative", window.DEBUG);

            return v;
        }

        //Transitions
        /**
         * @private
         * @param {int} frame 
         * @param {&vec3} vel 
         * @param {&vec3} acc 
         * @param {bool} backward_looking 
         */
        GetAnimationVA(frame, vel, acc, backward_looking){
             //coefficients for forward-looking derivatives from finite differences
             let vgains = new Float32Array([-3 / 2, 2, -.5]);
             let agains = new Float32Array([2, -5, 4, -1]);
 
             if (backward_looking) {
                 if (frame < 3)
                     backward_looking = false;
             }
             else if (frame + 3 >= this._AnimationData.length)
                 backward_looking = true;
 
             let sign = backward_looking ? -1 : 1;
 
             //TODO: fijo que esto no esta bien
             {
                 /*
                     vel = ( sign * vgains[0] * this._AnimationData[frame][0].GetPosition() +
                     sign * vgains[1] * this._AnimationData[frame + sign*1][0].GetPosition() +
                     sign * vgains[2] * this._AnimationData[frame + sign*2][0].GetPosition()); 
                 */
                 let v = vec3.create();
                 vec3.scale(v, vgains[0], sign);
                 vec3.mul(v, v, mat4.getTranslation(vec3.create(), this._AnimationData[frame][0]));
                 vec3.add(vel, vec3.create(), v);
 
                 v = vec3.create();
                 vec3.mul(v, vgains[1], sign);
                 vec3.mul(v, v, mat4.getTranslation(vec3.create(), this._AnimationData[frame + sign * 1][0]));
                 vec3.add(vel, vel, v);
 
                 v = vec3.create();
                 vec3.mul(v, vgains[2], sign);
                 vec3.mul(v, v, mat4.getTranslation(vec3.create(), this._AnimationData[frame + sign * 2][0]));
                 vec3.add(vel, vel, v);
             }
 
             {
                 /*
                     acc = ( sign * agains[0] * this._AnimationData[frame][0].GetPosition() +
                     sign * agains[1] * this._AnimationData[frame + sign*1][0].GetPosition() +
                     sign * agains[2] * this._AnimationData[frame + sign*2][0].GetPosition() +
                     sign * agains[3] * this._AnimationData[frame + sign*3][0].GetPosition());
                 */
                 let v = vec3.create();
                 vec3.mul(v, agains[0], [sign, sign, sign]);
                 vec3.mul(v, v, mat4.getTranslation(vec3.create(), this._AnimationData[frame][0]));
                 vec3.add(acc, vec3.create(), v);
 
                 v = vec3.create();
                 vec3.mul(v, agains[1], [sign, sign, sign]);
                 vec3.mul(v, v, mat4.getTranslation(vec3.create(), this._AnimationData[frame + sign * 1][0]));
                 vec3.add(acc, acc, v);
 
                 v = vec3.create();
                 vec3.mul(v, agains[2], [sign, sign, sign]);
                 vec3.mul(v, v, mat4.getTranslation(vec3.create(), this._AnimationData[frame + sign * 2][0]));
                 vec3.add(acc, acc, v);
 
                 v = vec3.create();
                 vec3.mul(v, agains[3], [sign, sign, sign]);
                 vec3.mul(v, v, mat4.getTranslation(vec3.create(), this._AnimationData[frame + sign * 3][0]));
                 vec3.add(acc, acc, v);
             }
        }

        /**
         * 
         * @param {mat4[][]} aData 
         * @param {&float[][]} animStyle 
         * @param {vec3[]} positionCurve 
         * @param {vec3[]} directionCurve 
         * @returns {void}
         */
        PrepareTransition(aData, animStyle, positionCurve, directionCurve){
            this._AnimationData  = Array.from(aData);
            this._AnimationStyle = Array.from(animStyle);
            let transitionFrames = this._TransitionTime > 0 ? this._TransitionTime * this._Framerate : this._TransitionEnd - this._TransitionStart;
            if ((this._TransitionStart + transitionFrames) >= this._AnimationData.length)
                transitionFrames -= this._TransitionStart + transitionFrames - this._AnimationData.length - 1;
            // TODO: it could be some other bone (e.g. Head)
            //int trajBoneIdx = 0;
            if (transitionFrames > 0) {
                let startFrames = this._TransitionStart > 0 ? this._TransitionStart - 1 : 0;
                let endFrames   = this._TransitionEnd < this._AnimationData.length ? this._AnimationData.length - this._TransitionEnd : 0;
                let grown       = transitionFrames - (this._TransitionEnd - this._TransitionStart) - 1;
                let totalFrames = startFrames + transitionFrames + endFrames;
                //VelocityCurve = new Vector3[totalFrames];
                positionCurve   = new Array(totalFrames);//new Vector3[totalFrames];
                directionCurve  = new Array(totalFrames);//new Vector3[totalFrames];

                // fill before start                
                for (let i = 0; i < this._TransitionStart; ++i) {
                    positionCurve[i] = mat4.getTranslation(vec3.create(), this._AnimationData[i][0]);
                    directionCurve[i] = this.GetDirection(this._AnimationData[i][0]);
                }
                // fill after end
                for (let i = this._TransitionEnd; i < this._AnimationData.Length; i++) {
                    positionCurve[i + grown] = mat4.getTranslation(vec3.create(), this._AnimationData[i][0]);
                    directionCurve[i + grown] = this.GetDirection(this._AnimationData[i][0]);
                }
                // generate transition curves
                this.GenerateTrajectories(transitionFrames, positionCurve, directionCurve);
                // generate interpolated styles
                this.PrepareStyleTransition(transitionFrames, totalFrames, animStyle);
            }
            else {
                positionCurve = new Array(this._AnimationData.length); //new Vector3[AnimationData.Length];
                directionCurve = new Array(this._AnimationData.length);//new Vector3[AnimationData.Length];
                // fill with backward-looking velocities
                for (let i = 0; i < this._AnimationData.length; ++i) {
                    positionCurve[i] = mat4.getTranslation(this._AnimationData[i][this._RootEffector]);
                    directionCurve[i] = this.GetDirection(this._AnimationData[i][this._RootEffector]);
                }
            }
        }

        /**
         * @private
         * @param {int} transitionFrames 
         * @param {vec3[]} positionCurve 
         * @param {vec3[]} directionCurve 
         * @returns {void}
         */
        GenerateTrajectories(transitionFrames, positionCurve, directionCurve){
            console.assert(positionCurve && isArray(positionCurve), "", window.DEBUG);
            let pOrder = 5;
            let i, j, k;
            let x0 = mat4.getTranslation(vec3.create(), this._AnimationData[this._TransitionStart][0]);
            let x1 = mat4.getTranslation(vec3.create(), this._AnimationData[this._TransitionEnd][0]);

            let v0 = vec3.create(),
                v1 = vec3.create(),
                a0 = vec3.create(),
                a1 = vec3.create();

            this.GetAnimationVA(this._TransitionStart, v0, a0, true);
            this.GetAnimationVA(this._TransitionEnd,   v1, a1, false); // as if merging two independent clips

            // for horizontal trajectory:
            x0[1] = x1[1] = v0[1] = v1[1] = a0[1] = a1[1] = 0;

            //List < float[] > p = ComputeVectorPolynomials(ref x0, ref v0, ref a0, ref x1, ref v1, ref a1, transitionFrames - 1, pOrder);
            let p = this.ComputeVectorPolynomials(x0, v0, a0, x1, v1, a1, transitionFrames - 1, pOrder);

            //WriteLog(transitionFrames.ToString());
            /*WriteLog(p[0][0].ToString("0.000000000") + " " + p[0][1].ToString("0.000000000") + " " +
            p[0][2].ToString("0.000000000") + " " + p[0][3].ToString("0.000000000"));*/

            // TODO: it could be some other bone (e.g. Head)
            //int trajBoneIdx = 0;
            let dir0 = this.GetDirection(this._AnimationData[this._TransitionStart][0]);
            let dir1 = this.GetDirection(this._AnimationData[this._TransitionEnd][0]);

            let ddir0 = vec3.create(),
                ddir1 = vec3.create();

            if (this._TransitionStart > 0)
                vec3.sub(ddir0, dir0, this.GetDirection(this._AnimationData[this._TransitionStart - 1][0]));
            else
                vec3.sub(ddir0, this.GetDirection(this._AnimationData[this._TransitionStart - 1][0]), dir0);

            if (this._TransitionEnd + 1 < this._AnimationData.length)
                vec3.sub(ddir1, this.GetDirection(this._AnimationData[this._TransitionEnd + 1][0]), dir1);
            else
                vec3.sub(ddir1, dir1, this.GetDirection(this._AnimationData[this._TransitionEnd - 1][0]));

            let pOrderDir = 3;
            let zeroVec = vec3.clone(vec3.ZERO);

            let pdir = this.ComputeVectorPolynomials(dir0, ddir0, zeroVec, dir1, ddir1, zeroVec, transitionFrames - 1, pOrderDir)

            //Vector3 vel = new Vector3();
            let pos = vec3.create(), dir = vec3.create();
            let c = new Float32Array();
            let temp;
            for (let i = 0; i < transitionFrames; ++i) {
                for (let j = 0; j < 3; ++j) {
                    c = p[j];
                    temp = 0;
                    for (let k = 0; k <= pOrder; ++k)
                        temp += c[k] * Math.pow(i, k);
                    pos[j] = temp;

                    c = pdir[j];
                    temp = 0;
                    for (let k = 0; k <= pOrderDir; ++k)
                        temp += c[k] * Math.pow(i, k);
                    dir[j] = temp;
                }
                positionCurve[this._TransitionStart + i] = vec3.clone(pos);
                //VelocityCurve[TransitionStart + i] = vel * Framerate;
                vec3.normalize(dir, dir);
                directionCurve[this._TransitionStart + i] = vec3.clone(dir);
                //DirectionCurve[TransitionStart + i] = getDirection(ref AnimationData[TransitionStart + i][0]);
            }
        }

        /**
         * @param {int} transitionFrames 
         * @param {int} totalFrames 
         * @param {float[][]} animStyle 
         * @returns {void}
         */
        PrepareStyleTransition(transitionFrames, totalFrames, animStyle){
            //List < float[] > newStyles = new List<float[]>();
            let newStyles = [];
            let i;

            //int grown = transitionFrames - (TransitionEnd - TransitionStart);
            console.assert(this._AnimationStyle && isArray(this._AnimationStyle) && this._AnimationStyle.length > 0, "No styles defined", window.DEBUG);
            let pOrder = 3;
            let numStyles = this._AnimationStyle[0].length;
            //List < float[] > p = new List<float[]>();
            let p = [];
            let x0, x1, v0, v1;
            //float[] c;

            // compute polynomials for each style
            for (i = 0; i < numStyles; ++i) {
                x0 = this._AnimationStyle[this._TransitionStart][i];
                x1 = this._AnimationStyle[this._TransitionEnd][i];
                if (this._TransitionStart > 0)
                    v0 = x0 - this._AnimationStyle[this._TransitionStart - 1][i];
                else
                    v0 = this._AnimationStyle[this._TransitionStart + 1][i] - x0;
                if (this._TransitionEnd + 1 < this._AnimationData.length)
                    v1 = this._AnimationStyle[this._TransitionEnd + 1][i] - x1;
                else
                    v1 = x1 - this._AnimationStyle[this._TransitionEnd - 1][i];
                p.push(this.ComputePolynomial(x0, v0, 0, x1, v1, 0, transitionFrames - 1, pOrder));
            }

            // fill before start
            for (i = 0; i < this._TransitionStart; ++i) {
                newStyles.push(this._AnimationStyle[i]);
            }
            // fill transition
            /* style transition should be max over 1 sec 
            * could either use the start or the end styles for most */
            let s = Array.from(this._AnimationStyle[this._TransitionEnd]);
            for (i = 0; i < transitionFrames; ++i) {
                newStyles.push(s);
            }
            // fill after end
            for (i = this._TransitionEnd; i < this._AnimationData.length; i++) {
                newStyles.push(this._AnimationStyle[i]);
            }
            //AnimationStyle.Clear();
            //TODO:not 
            this._AnimationStyle = animStyle = Array.from(newStyles);//.ToArray();
        }

        //Trajectory
        /**
         * @private
         * @param {Trajectory} traj
         * @param {int} index
         * @returns {Trajectory.Point}
         */
        GetSample(traj, index){
            let value = index * this._PointDensity, 
                min   = 0, 
                max   = traj.Points.length - 1;

            return traj.Points[Math.max(min,Math.min(max,v))];
        }

        /**
         * @private
         * @param {Trajectory} traj
         * @param {int} index
         * @returns {Trajectory.Point}
         */
        GetNextSample(traj, index){
            if (index % this._PointDensity == 0) {
                return this.GetSample(traj, index / this._PointDensity);
            } else {
                return this.GetSample(traj, index / this._PointDensity + 1);
            }
        }

        /**
         * @private
         * @param {Trajectory} traj
         * @param {int} index
         * @returns {Trajectory.Point}
         */
        GetPreviousSample(traj, index){
            return this.GetSample(traj, index / this._PointDensity);
        }

        //Others
        /**
         * @param {float[]} styles
         * @returns {void}
         */
        SetStyles(styles){
            console.assert(isArray(styles), "value is not recognised as an array", window.DEBUG);

            this._Styles = Array.from(styles);
        }

        /**
         * TODO: initialize NN or own variable in constructor / Awake method
         * @param {int} i 
         * @returns {string}
         */
        GetBoneName(i){
            console.assert(this._NNParameters && this._NNParameters.BoneNames && isArray(this._NNParameters.BoneNames), "value is not an array", window.DEBUG);
            console.assert(i >= 0 && this._NNParameters.BoneNames.length > i, "provided index out of range", window.DEBUG);

            let v = null;

            if (this._NNParameters && this._NNParameters.BoneNames ) {
                if (i >= 0 && i < this._NNParameters.BoneNames.length)
                    v = this._NNParameters.BoneNames[i];
            }
            
            if (!v || v.length == 0)
                console.warn(`boneID:${i} has an empty name`);

            return v;
        }

        /**
         * TODO: initialize NN or own variable in constructor / Awake method
         * @returns { string[] } 
         */
        GetBoneNames(){
            if (this._NNParameters) {
                return this._NNParameters.BoneNames;
            }
        }

        /**
         * TODO: initialize NN or own variable in constructor / Awake method
         * @returns {void}
         */
        GetNumberOfBones() {
            if (MANNController.CONSTRUCT_MANN) {
                if (this._NNParameters != null)
                    return this._NNParameters.BoneNames.length;
            }
            else {
                if (this._NN)
                    return this._NN.Parameters.BoneNames.length;
            }
            return 0;
        }

        /**
         * @private
         * @param {Trajectory} traj
         * @param {&vec3} nextPos
         * @param {float} currFPS
         * @returns {vec3}
         */
        EstimateTargetVelocity(traj, nextPos, currFPS){
            //from finite differences
            let gains = [3 / 2, -2, .5];

            let result = vec3.scale(vec3.create(), nextPos, gains[0]);// * currFPS;
            for (let i = 0; i < gains.length - 1; ++i)
                result += gains[i + 1] * traj.Points[this._InputPoint - i].GetPosition();// * LastFPS[i];

            return vec3.scale(vec3.create(), result, currFPS);
        }
        
        //?????????????????
        /**
         * @private
         * @param {int} orientType
         * @param {bool} forTrajDelta
         * @returns {int}
         */
        GetOrientSize(orientType, forTrajDelta){
            switch (orientType) {
                case MANN.OrientType.NONE: 
                    return 0;

                case MANN.OrientType.FLAT_X_UP:
                case MANN.OrientType.FLAT_Y_UP:
                case MANN.OrientType.FLAT_Z_UP: 
                    return forTrajDelta ? 1 : 2;

                case MANN.OrientType.ROTATION_VECTOR: 
                    return 3;

                case MANN.OrientType.QUATERNION:
                case MANN.OrientType.ANGLE_AXIS: 
                    return 4;

                case MANN.OrientType.FORWARD_UP: 
                    return 6;

                default:
                    throw ("Unknown orientation type " + orientType);
            }
        }

        /**
         * @private
         * @param {quat} rotation 
         */
        Quat2Direction(rotation){
            let dir = vec3.create();
            dir[this._DirAxis] = this._DirSign;
            dir = vec3.transformQuat(vec3.create(), dir, rotation);
            dir[1] = 0;
            vec3.normalize(dir, dir);
            return dir;
        }
        /**
         * @private
         * @param {float} x0 
         * @param {float} v0 
         * @param {float} a0 
         * @param {float} x1 
         * @param {float} v1 
         * @param {float} a1 
         * @param {int} numSteps 
         * @param {int} pOrder 
         * @returns {float[]}
         */
        ComputePolynomial(x0, v0, a0, x1, v1, a1, numSteps, pOrder){
            let c = new Float32Array(6);
            let t = numSteps,
                t2 = Math.pow(t, 2),
                t3 = Math.pow(t, 3),
                t4 = Math.pow(t, 4),
                t5 = Math.pow(t, 5);

            //if porder == 1: no velocity profile (constant velocity)
            switch (pOrder) {
                case (2): // velocity profile linear 		
                    c[0] = x0;
                    c[1] = v0;
                    c[2] = (v1 - v0) / t;
                    break;
                case (3): // velocity profile quadratic			
                    c[0] = x0;
                    c[1] = v0;
                    c[2] = 3 / t2 * (x1 - x0) - (2 * v0 + v1) / t;
                    c[3] = 2 / t3 * (x0 - x1) + (v0 + v1) / t2;
                    break;
                case (4): // velocity profile cubic			
                    c[0] = x0;
                    c[1] = v0;
                    c[2] = a0 / 2;
                    //a1 is ignored
                    c[4] = 3 * (x0 - x1) / t4 + (2 * v0 + v1) / t3 + 0.5 * a0 / t2;
                    c[3] = 12 * (x1 - x0) / (3 * t3) - (3 * v0 + v1) / t2 - a0 / t;
                    break;
                case (5): // velocity profile 4th order
                    c[0] = x0;
                    c[1] = v0;
                    c[2] = a0 / 2;
                    c[3] = (a1 - 3 * a0) / (2 * t) - (6 * v0 + 4 * v1) / t2 - 10 * (x0 - x1) / t3;
                    c[4] = (3 * a0 - 2 * a1) / (2 * t2) + (8 * v0 + 7 * v1) / t3 + 15 * (x0 - x1) / t4;
                    c[5] = 0.5 * (a1 - a0) / t3 - 3 * (v0 + v1) / t4 + 6 * (x1 - x0) / t5;
                    break;
                default:
                    throw ("Not implemented");//new NotImplementedException();
            }
            return c;
        }

        /**
         * @private
         * @param {&vec3} x0 
         * @param {&vec3} v0 
         * @param {&vec3} a0 
         * @param {&vec3} x1 
         * @param {&vec3} v1 
         * @param {&vec3} a1 
         * @param {int} numSteps 
         * @param {int} pOrder 
         * @returns {float[]}
         */
        ComputeVectorPolynomials (x0, v0, a0, x1, v1, a1, numSteps, pOrder){
            let p = [];

            p.push(this.ComputePolynomial(x0[0], v0[0], a0[0], x1[0], v1[0], a1[0], numSteps, pOrder));
            p.push(this.ComputePolynomial(x0[1], v0[1], a0[1], x1[1], v1[1], a1[1], numSteps, pOrder));
            //p.Add(new float[6]);
            p.push(this.ComputePolynomial(x0[2], v0[2], a0[2], x1[2], v1[2], a1[2], numSteps, pOrder));
            return p;
        }

        
        //-------------------------

        //Actor Getters & Setters
         /**
         * TODO: IS THIS CORRECT?
         * @param {int} boneIdx 
         * @returns {vec3} 
         */
        GetPosition(boneIdx) {
            console.assert(this._PoseTransforms && isArray(this._PoseTransforms), "value is not recognised as an array", window.DEBUG);
            console.assert(boneIdx >= 0 && this._PoseTransforms.length > boneIdx, "provided index out of range", window.DEBUG);

            let v = mat4.getTranslation(vec3.create(), this._PoseTransforms[boneIdx]);

            console.assert(v && isArray(v) && v.length == 3, "'v' return value is not recognised as a 3 component float array", window.DEBUG);
            return v;
        }

        /**
         * 
         * @param {int} boneIdx 
         * @param {vec3} pos 
         * @returns {void}
         */
        SetPosition(boneIdx, pos) {
            console.assert(boneIdx >= 0 && boneIdx < this._PoseTransforms.length, "provided index out of range", window.DEBUG);
            console.assert(pos && isArray(pos) && pos.length == 3, "'v' return value is not recognised as a 3 component float array", window.DEBUG);

            mat4.setTranslation(this._PoseTransforms[boneIdx], pos);
        }

        /**
         * 
         * @param {int} boneIdx 
         * @returns {vec3}
         */
        GetVelocity(boneIdx) {
            let v = this._Velocities[boneIdx];
            console.assert(v && isArray(v) && v.length == 3, "'v' return value is not recognised as a 3 component float array", window.DEBUG);

            return v;
        }

        /**
         * 
         * @param {int} boneIdx 
         * @param {vec3} vel 
         * @returns {void}
         */
        SetVelocity(boneIdx, vel) {
            this._Velocities[boneIdx] = vec3.clone(vel);
        }

        /**
         * 
         * @param {int} boneIdx 
         */
        GetOrientation(boneIdx) {
            console.assert(this._PoseTransforms && isArray(this._PoseTransforms), "value is not recognised as an array", window.DEBUG);
            console.assert(boneIdx >= 0 && this._PoseTransforms.length > boneIdx, "provided index out of range", window.DEBUG);

            let v = quat.fromMat3AndQuat(
                quat.create(),
                mat3.fromMat4(mat3.create(), this._PoseTransforms[boneIdx])
            );

            console.assert(v && isArray(v) && v.length == 4, "'v' return value is not recognised as a 4 component float array", window.DEBUG);
            return v;
        }

        /**
         * 
         * @param {int} boneIdx 
         * @param {quat} rotation 
         * @returns {void}
         */
        SetOrientation(boneIdx, rotation) {
            let pos = this.GetPosition(boneIdx);
            mat4.fromQuat(this._PoseTransforms[boneIdx], rotation);
            this.SetPosition(boneIdx, pos);
        }

        /**
         * @private
         * @param {&mat4} mat 
         */
        GetDirection(mat){
            let dir = vec3.fromValues(
                mat[0 * 4 + this._DirAxis] * this._DirSign, 
                0, 
                mat[2 * 4 + this._DirAxis] * this._DirSign
            );
            vec3.normalize(dir, dir);
            return dir;
        }

        //Target Getters & Setters
        /**
         * @param {vec3} target
         * @returns {void}
         */
        SetTargetPosition(target) {
            console.assert(target && isArray(target) && target.length == 3, "'target' parameter is not recognised as a 3 component float array", window.DEBUG);

            //TargetTransform.SetPosition(target);
            vec3.copy(this._TargetPosition, target);
        }

         /**
         * 
         * @returns {vec3}
         */
        GetTargetVelocity() {
            let v = this._TargetVelocity;
            console.assert(v && isArray(v) && v.length == 3, "'v' return value is not recognised as a 3 component float array", window.DEBUG);

            return v;
        }
        //--- SetTargetVelocity(){}   //CharcController

        /**
         * 
         * @returns {vec3}
         */
        GetTargetDirection() {
            // direction is always stored as forward (Z) axis
            //return TargetTransform.GetForward();
            let v = this._TargetDirection;
            console.assert(v && isArray(v) && v.length == 3, "'v' return value is not recognised as a 3 component float array", window.DEBUG);

            return v;
        }

        /**
         * 
         * @param {vec3 || quat} dir 
         * @returns {void}
         */
        SetTargetDirection(dir) {
            //console.assert(dir && isArray(dir) && dir.length == 3, "'dir' parameter is not recognised as a 3 component float array", window.DEBUG);
            if(dir.length == 4)
            {
                this.SetTargetDirection(this.Quat2Direction(orient));
                return;
            }

            // assuming a Y up scene
            dir[1] = 0;
            let v = vec3.normalize(vec3.create(), dir);

            // direction is always stored as forward (Z) axis
            vec3.copy(this._TargetDirection, v);
        }

        /**
         * 
         * @param {vec3} vel
         * @returns {void}
         */
        SetLocalVelocity(vel) {
            console.assert(vel && isArray(vel) && vel.length == 3, "'target' parameter is not recognised as a 3 component float array", window.DEBUG);

            vec3.copy(this._TargetLocalVelocity, vel);
        }

        /**
         * TODO: Is this final bone position? end effector position for ik or fk?
         * @param {int} effectorIndex 
         * @param {Vector3} position 
         * @return {void}
         */
        SetEffectorTarget(effectorIndex, position) {
            console.assert(this._Effectors && isArray(this._Effectors), "value is not recognised as an array", window.DEBUG);
            console.assert(effectorIndex >= 0 && this._Effectors.length > effectorIndex, "provided index out of range", window.DEBUG);
            console.assert(position && isArray(position) && position.length == 3, "'position' parameter is not recognised as a 3 component float array", window.DEBUG);

            let boneIdx = this._Effectors[effectorIndex];
            vec3.copy(this._EffectorTargets[boneIdx], position);
        }

        /**
         * 
         * @returns {Trajectory.Point}
         */
        GetCurrentPoint() {
            console.assert(this._Trajectory && this._Trajectory.Points && isArray(this._Trajectory.Points), "value is not recognised as an array", window.DEBUG);
            console.assert(this._InputPoint >= 0 && this._Trajectory.Points.length > this._InputPoint, "provided index out of range", window.DEBUG);

            let v = this._Trajectory.Points[this._InputPoint];

            console.assert(v && isArray(v) && v.length == 3, "'v' return value is not recognised as a 3 component float array", window.DEBUG);
            return v;
        }
        
        /**
         * 
         * @returns {int}
         */
        GetNumOfStyles() {
            return this._NumStyles;
        }

        /**
         * 
         * @returns {int}
         */
        GetPointDensity() {
            return this._PointDensity;
        }

        /**
         * 
         * @return {vec3}
         */
        GetTrajectoryPosition() {
            let v = this._Trajectory.Points[this._InputPoint].getPosition();
            console.assert(v && isArray(v) && v.length == 3, "'v' return value is not recognised as a 3 component float array", window.DEBUG);

            return v;
        }

        /**
         * 
         * @param {vec3} pos 
         * @returns {void}
         */
        SetTrajectoryPosition(pos) {
            console.assert(this._Trajectory && this._Trajectory.Points && isArray(this._Trajectory.Points), "invalid array", window.DEBUG);
            console.assert(this._InputPoint && this._InputPoint > 0 && this._InputPoint < this._Trajectory.Points.length, "index out of range", window.DEBUG);

            // assuming flat trajectory
            this._Trajectory.Points[this._InputPoint].setPosition(pos[0], 0, pos[2]);
        }
        
        /**
         * TODO: this is NOT the orientation of the respective bone with flat trajectories
         * @returns {quat}
         */
        GetTrajectoryOrientation() {
            // with flat trajectories it can only be a 2D rotation even if mapped back to bone axes
            let v = this._Trajectory.Points[this._InputPoint].getRotation();
            console.assert(v && isArray(v) && v.length == 4, "'v' return value is not recognised as a 4 component float array", window.DEBUG);

            return v;
        }

        /**
         * 
         * @param {quat} rotation 
         * @returns {void}
         */
        SetTrajectoryOrientation(rotation) {
            console.assert(this._Trajectory && this._Trajectory.Points && isArray(this._Trajectory.Points), "invalid array", window.DEBUG);
            console.assert(this._InputPoint && this._InputPoint > 0 && this._InputPoint < this._Trajectory.Points.length, "index out of range", window.DEBUG);

            //assuming flat trajectory
            //TODO: dont know if this is right
            //this._Trajectory.Points[this._InputPoint].SetDirection(this.Quat2Direction(rotation));
            this._Trajectory.Points[this._InputPoint].setRotation(rotation);
        }

        /**
         * 
         * @returns {vec3}
         */
        GetTrajectoryDirection() {
            let v = this._Trajectory.Points[this._InputPoint].getFront();
            console.assert(v && isArray(v) && v.length == 3, "'v' return value is not recognised as a 3 component float array", window.DEBUG);

            return v;
        }
        
        /**
         * 
         * @param {int[]} effectors 
         * @returns {void}
         */
        SetEffectors(effectors) {
            this._Effectors = Array.from(effectors);
            this.ResizeEffectorData();
        }
        
        /**
         * 
         * @returns {int}
         */
        GetFramerate() {
            return this._Framerate;
        }

        /**
         * 
         * @returns {Trajectory}
         */
        GetTrajectory() {
            return this._Trajectory;
        }

        /**
         * @param {vec3} velocity 
         * @returns {void}
         */
        SetTargetVelocity(velocity)
        {
            this._TargetVelocity = velocity;
        }
       
    }

    window.MANNController = MANNController;

})();
"use strict";

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

        ControlByPath(){}
        ControlByGamePad(){}
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