export class Utilities {
	private static readonly nullStr: string = (new String(null)).toString();
	private static readonly undefinedStr: string = (new String(undefined)).toString();
	
	public static range(start: number, end: number): number[] {
		const list = [];
		for (let i = start; i <= end; i++)
			list.push(i);
			
		return list;
	}

	public static isNullOrUndefinedString(str: string) {
		return str === this.nullStr || str === this.undefinedStr;
	}
}