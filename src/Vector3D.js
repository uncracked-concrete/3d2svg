class Vector3 {

	constructor( x = 0, y = 0, z = 0 ) {

		this.x = x;
		this.y = y;
		this.z = z;

	}
	clone(){
		return new this.constructor (this.x, this.y, this.z);
	}
	add (v){
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this;
	}
	addVectors (a, b){
		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;
		return this;
	}
	subtract(v){
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	}
	subtractVectors (a, b){
		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;
		return this;
	}
	multiplyVectorScalar(v, k)
	{
		this.x = v.x * k;
		this.y = v.y * k;
		this.z = v.z * k;
		return this;
	}
	multiply (v){
		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;
		return this;
	}
	multiplyVectors (a, b){
		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;
		return this;
	}
	divide (v){
		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;
		return this;
	}
	divideVectors (a, b){
		this.x = a.x / b.x;
		this.y = a.y / b.y;
		this.z = a.z / b.z;
		return this;
	}
	dot (v){
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}
	dotVectors (a, b){
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}
	length(){
		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z)
	}
	normalize(){
		const l = this.length() || 1;
		this.x /= l;
		this.y /= l;
		this.z /= l;
        return this; 
	}
	cross (v){
		return this.crossVectors(this, v);
	}
	crossVectors(a, b){
        this.x = a.y * b.z - a.z * b.y;
        this.y = a.z * b.x - a.x * b.z;
        this.z = a.x * b.y - a.y * b.x;
		return this;
	}
	multiplyWithMatrix4 (matrix) {
		return this.multiplyVector3Matrix4(this, matrix);
	}
	multiplyVector3Matrix4(vector, matrix){      
        this.x   = vector.x * matrix[0] + vector.y * matrix[4] + vector.z * matrix[8] + matrix[12];
        this.y  = vector.x * matrix[1] + vector.y * matrix[5] + vector.z * matrix[9] + matrix[13];
        this.z   = vector.x * matrix[2] + vector.y * matrix[6] + vector.z * matrix[10] + matrix[14];
        const w       = vector.x * matrix[3] + vector.y * matrix[7] + vector.z * matrix[11] + matrix[15];
    
        if ( Math.abs(w) !=  0.0){
            this.x /= w;
            this.y /= w;
            this.z /= w;
        }
        return this;
	}
	applyMatrix4( m ) {
		const x = this.x, y = this.y, z = this.z;
		const e = m.elements;

		const w = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] );

		this.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] ) * w;
		this.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] ) * w;
		this.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * w;

		return this;

	}
}
export {Vector3};