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
