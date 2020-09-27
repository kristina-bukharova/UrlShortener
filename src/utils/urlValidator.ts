export default abstract class UrlValidator {
    public static isValidHttpUrl(string: string) {
        try {
            const url = new URL(string);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch (err) {
            return false;
        }
    }
}