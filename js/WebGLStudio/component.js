/*
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

    NNCharController.prototype.loadMANN = async function(path, callback){

      var NN = await new Promise(function(resolve,reject){
        LS.ResourcesManager.load(path, (function(res) {
          console.assert( res, `Resource is empty`, window.DEBUG);
          resolve(res);
          if (callback)
          callback(res);
        }).bind(this));   
      });

      if(!NN)
        throw "NN not loaded properly";

      return NN;
    }

    NNCharController.prototype.getResources = function( res )
    {
      if( this.mann_filename )
        res[ this.mann_filename ] = MANN;
      return res;
    }

    NNCharController.prototype.onResourceRenamed = function(a,b,c){
      console.log(a,b,c);
    }


    NNCharController["@mann_filename"]  = { widget: "resource", resource_classname: "MANN" };
    NNCharController["@root_id"]        = { widget: "node_id", type:"node_id" };
    NNCharController["@spline_id"]      = { widget: "node_id", type:"node_id" };
    NNCharController["@loadMANN"]       = { widget: null };
    //NNCharController["@inspector"]      = function(component, inspector) {}

    LS.registerComponent(NNCharController);

})(window);