"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchResult = void 0;
class SearchResult {
    constructor(title, magnet, size, peers, seeds) {
        this.seeds = 0;
        this.peers = 0;
        this.size = '';
        this.magnet = '';
        this.title = '';
        this.title = title;
        this.magnet = magnet;
        this.size = size;
        this.peers = peers;
        this.seeds = seeds;
    }
}
exports.SearchResult = SearchResult;
//# sourceMappingURL=search-result.js.map