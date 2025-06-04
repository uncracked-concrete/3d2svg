import { Vector3 } from "./Vector3D.js";

class Matrix4{
    constructor( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {
        this.elements = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];

        if ( n11 !== undefined ) {
			this.elements[ 0 ] = n11; this.elements[ 4 ] = n12; this.elements[ 8 ] = n13; this.elements[ 12 ] = n14;
		    this.elements[ 1 ] = n21; this.elements[ 5 ] = n22; this.elements[ 9 ] = n23; this.elements[ 13 ] = n24;
		    this.elements[ 2 ] = n31; this.elements[ 6 ] = n32; this.elements[ 10 ] = n33; this.elements[ 14 ] = n34;
		    this.elements[ 3 ] = n41; this.elements[ 7 ] = n42; this.elements[ 11 ] = n43; this.elements[ 15 ] = n44;
		}
    }
    pointAt(position, target, up){
        const newForward = new Vector3().subtract(target, position).normalize();

        const a  = new Vector3().multiplyVectorScalar(newForward, up.dot( newForward ));
		const newUp = up.clone().subtract(a).normalize();

		const newRight = new Vector3().crossVectors(newUp, newForward);

        const e = this.elements;

        e[0] = newRight.x;
        e[1] = newRight.y;
        e[2] = newRight.z;
        e[3] = 0;

        e[4] = newUp.x;
        e[5] = newUp.y;
        e[6] = newUp.z;
        e[7] = 0;

        e[8] = newForward.x;
        e[9] = newForward.y;
        e[10] = newForward.z;
        e[11] = 0;

        e[12] = position.x;
        e[13] = position.y;
        e[14] = position.z;
        e[15] = 1;

        return this;
    }

    quickInverse() { // only for tranlation and rotation !!!
        const m = this.elements;
        const r = new Matrix4();
        const e = r.elements;

        // Transpose rotation part (upper-left 3x3)
        e[0] = m[0]; e[1] = m[4]; e[2] = m[8];
        e[4] = m[1]; e[5] = m[5]; e[6] = m[9];
        e[8] = m[2]; e[9] = m[6]; e[10] = m[10];

        // Zero out last row of rotation
        e[3] = 0; e[7] = 0; e[11] = 0;

        // Invert translation
        e[12] = -(m[12] * e[0] + m[13] * e[4] + m[14] * e[8]);
        e[13] = -(m[12] * e[1] + m[13] * e[5] + m[14] * e[9]);
        e[14] = -(m[12] * e[2] + m[13] * e[6] + m[14] * e[10]);

        // Bottom-right
        e[15] = 1;

         return r;
    }

    multiplyMatrix4(matrix){
        return this.multiplyMatrix4Matrix4( this, matrix);
    }
    multiplyMatrix4Matrix4(m1, m2) {
        const result = new Matrix4();
        const a = m1.elements;
        const b = m2.elements;
        const r = result.elements;

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                r[col + row * 4] =
                    a[0 + row * 4] * b[col + 0] +
                    a[1 + row * 4] * b[col + 4] +
                    a[2 + row * 4] * b[col + 8] +
                    a[3 + row * 4] * b[col + 12];
            }
        }

        return result;
    }
    fromArray( array, offset = 0 ) {

		for ( let i = 0; i < 16; i ++ ) {

			this.elements[ i ] = array[ i + offset ];

		}

		return this;

	}

}
export {Matrix4};