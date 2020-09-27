export interface IDatabaseClient {
    createNewUrlRecord: (originalUrl: string) => Promise<any>;
    setShortenedUrl: (id: number, shortenedUrl: string, ) => Promise<any>;
    getUrlInfo: (id: number) => Promise<any>;
}