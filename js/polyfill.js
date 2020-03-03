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


