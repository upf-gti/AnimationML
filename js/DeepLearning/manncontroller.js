/*
 
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
