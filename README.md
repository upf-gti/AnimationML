# AnimationML

## How to add new animations / characters (WIP)
* **process_bvh.py**: this is where you set the bone names etc. as described above. It outputs Numpy matrices to data/database.npz.

* **train.py**: this is the actual training script that reads the .npz file and does the training. You need to supply the path to the .npz file and the path to the folder for the output data. The Json file is then written to one of the subdirectories there. There are also other files in those subdirectories, like intermediary training results and weights in binary format.

## Log
* Reviewed again the manncontroller.js, by now doesnt crash, still have to adapt to the setup and init for requesting a resource instead of creating and requiring a file each time.
* Still have to implement the webglstudio component and editor interface
