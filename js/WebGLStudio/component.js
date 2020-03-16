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

    NNCharController.prototype.LoadResource = async function(path){
      var promise = new Promise(function(resolve,reject){
        LS.ResourcesManager.load(path, (function(res) {
          console.assert( res, `Resource is empty`, window.DEBUG);
          resolve(res);
        }).bind(this));   
      }); 

      var NN = await promise();
      if(!NN)
        throw "NN not loaded properly";
      return NN;
    }


    NNCharController["@mann_filename"]  = { widget: "resource", resource_classname: "MANN" };
    NNCharController["@root_id"]        = { widget: "node_id" };
    NNCharController["@spline_id"]      = { widget: "node_id" };
    NNCharController["@inspector"]      = function(component, inspector) 
    {

    }


    LS.registerComponent(NNCharController);
})(window);