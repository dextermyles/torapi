import TorrentSearchApi from 'torrent-search-api';

export interface Torrent extends TorrentSearchApi.Torrent {
    seeds: number;
    peers: number;
}