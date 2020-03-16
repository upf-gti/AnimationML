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

            this._NNController = new MANNController();
            this.configure(o);
        }

        configure(o) {
            o = o || {};

            //Asign configuration object data to current instance container
            Object.assign(this, o);

            if(this.mann_parameters_file )
            {
                if(!this.loadMANN)
                    throw("you have to custom define a method loadMANN in the prototype that from a given path retuns a MANN instance");

                this._NNController._NN = await this.loadMANN(this.mann_parameters_file);
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
            
            if (!this._NNController._NN) {
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
            this._NNController.setSkeletonTransforms(this.skeleton_transforms, this._root_node.name);
            this._NNController.setCurrentPoseAsInitial();
        }


        onUpdate(dt) {
            if (!this._NNController || !this._spline) {
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

            this._NNController.setTargetPositionAndDirection(this.trajectory_position, this.trajectory_direction);
            this._NNController.RunControl();
            this.AnimateTransforms();
        }

        AnimateTransforms() {
            let transforms = this._NNController.getCurrentTransforms();

            for (let t of transforms) {
                //todo: needs to be implemented
                let node = reverse_mapping_nodes[t.name];// rootNode.findNodeByName(t.name);
                node.transform = t.transform.clone();
            }
        }
    }

    window.NNCharController = NNCharController;

})();
