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
        constructor(id, rows, cols)
        {
            this._Deleted = false;           
            this.id = id;
            Tensor.matrices[this.id] = nj.zeros([rows, cols]);    
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
            return m.shape[0];
        }
        
        GetCols() 
        {
            let m = Tensor.matrices[this.id];
            console.assert(m, "matrix not found", window.DEBUG);
            return m.shape[1];
        }

        SetZero() 
        {
            let m = Tensor.matrices[this.id];
            console.assert(m, "matrix not found", window.DEBUG);
            m.multiply(0, false);
        }
        
        SetValue(row, col, value) 
        {
            let m = Tensor.matrices[this.id];
            console.assert(m, "matrix not found", window.DEBUG);

            let [rows,cols] = m.shape;
            if(row >= rows || col >= cols) {
                console.error("Setting out of bounds at [" + row + ", " + col + "].");
                return;
            }
            
            m.set(row, col, value);
        }
        
        GetValue(row, col) 
        {
            let m = Tensor.matrices[this.id];
            console.assert(m, "matrix not found", window.DEBUG);

            let [rows,cols] = m.shape;
            if(row >= rows || col >= cols) {
                console.error("Getting out of bounds at [" + row + ", " + col + "].");
                return 0;
            }
            
            return m.get(row,col);
        }

        GetMatrix(){
            let m = Tensor.matrices[this.id];
            return m;
        }

        SetMatrix(m){
            Tensor.matrices[this.id] = m;
        }

    }
    Tensor.matrices = {};
    Tensor.id = -1;

    window.Tensor = Tensor;

})(window);