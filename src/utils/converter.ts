export abstract class Converter {
    public static ALPHABET: string = "23456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ-_";
	public static BASE: number = Converter.ALPHABET.length;

    public static encodeNumberToString(id: number): string {
        let str = '';
		while (id > 0) {
			str += this.ALPHABET.charAt(id % this.BASE);
			id = Math.floor(id / this.BASE);
		}
		return str;
    }

    public static decodeStringToNumber(urlHash: string): number {
        let id = 0;
		for (let i = 0; i < urlHash.length; i++) {
			id = id * this.BASE + this.ALPHABET.indexOf(urlHash.charAt(i));
		}
		return id;
    }
}

