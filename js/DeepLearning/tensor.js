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
            //this.id = "undefined!"; 
            this._Deleted = false;
            
            //this.id = Eigen.Create(rows, cols);
            
            let matrix = [];
            for(let y = 0; y < rows; ++y)
            matrix.push( new Float32Array(cols) );
            
            this.id = id;
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

        GetMatrix(){
            let m = Tensor.matrices[this.id];
            return m;
        }

        Fit(T){
            let rows = T.GetRows();
            let cols = T.GetCols();

            let matrix = [];
            for(let y = 0; y < rows; ++y)
            matrix.push( new Float32Array(cols) );
            Tensor.matrices[this.id] = matrix

            this.SetZero();
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
    Tensor.id = -1;

    window.Tensor = Tensor;

})(window);