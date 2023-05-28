export class SearchResult {
    seeds = 0;
    peers = 0;
    size = '';
    magnet = '';
    title = '';
    constructor(title: string, magnet: string, size: string, peers: number, seeds: number) {
        this.title = title;
        this.magnet = magnet;
        this.size = size;
        this.peers = peers;
        this.seeds = seeds;
    }
}