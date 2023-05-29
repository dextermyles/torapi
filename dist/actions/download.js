"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.download = void 0;
const chalk_1 = __importDefault(require("chalk"));
const fs = __importStar(require("fs"));
const lodash_1 = __importDefault(require("lodash"));
const torrent_stream_1 = __importDefault(require("torrent-stream"));
const ts_luxon_1 = require("ts-luxon");
function download(magnet, path) {
    if (!path)
        path = 'movies';
    path = `C:\\media\\${path}\\`;
    const options = {
        connections: 200,
        uploads: 10,
        tmp: 'C:\\tmp',
        path,
        verify: true,
        dht: true,
        tracker: true,
        trackers: ["http://178.33.73.26:2710/announce", "http://182.176.139.129:6969/announce", "http://185.5.97.139:8089/announce", "http://188.165.253.109:1337/announce", "http://194.106.216.222/announce", "http://195.123.209.37:1337/announce", "http://210.244.71.25:6969/announce", "http://210.244.71.26:6969/announce", "http://213.159.215.198:6970/announce", "http://213.163.67.56:1337/announce", "http://37.19.5.139:6969/announce", "http://37.19.5.155:6881/announce", "http://46.4.109.148:6969/announce", "http://5.79.249.77:6969/announce", "http://5.79.83.193:2710/announce", "http://51.254.244.161:6969/announce", "http://59.36.96.77:6969/announce", "http://74.82.52.209:6969/announce", "http://80.246.243.18:6969/announce", "http://81.200.2.231/announce", "http://85.17.19.180/announce", "http://87.248.186.252:8080/announce", "http://87.253.152.137/announce", "http://91.216.110.47/announce", "http://91.217.91.21:3218/announce", "http://91.218.230.81:6969/announce", "http://93.92.64.5/announce", "http://atrack.pow7.com/announce", "http://bt.henbt.com:2710/announce", "http://bt.pusacg.org:8080/announce", "http://bt2.careland.com.cn:6969/announce", "http://explodie.org:6969/announce", "http://mgtracker.org:2710/announce", "http://mgtracker.org:6969/announce", "http://open.acgtracker.com:1096/announce", "http://open.lolicon.eu:7777/announce", "http://open.touki.ru/announce.php", "http://p4p.arenabg.ch:1337/announce", "http://p4p.arenabg.com:1337/announce", "http://pow7.com:80/announce", "http://retracker.gorcomnet.ru/announce", "http://retracker.krs-ix.ru/announce", "http://retracker.krs-ix.ru:80/announce", "http://secure.pow7.com/announce", "http://t1.pow7.com/announce", "http://t2.pow7.com/announce", "http://thetracker.org:80/announce", "http://torrent.gresille.org/announce", "http://torrentsmd.com:8080/announce", "http://tracker.aletorrenty.pl:2710/announce", "http://tracker.baravik.org:6970/announce", "http://tracker.bittor.pw:1337/announce", "http://tracker.bittorrent.am/announce", "http://tracker.calculate.ru:6969/announce", "http://tracker.dler.org:6969/announce", "http://tracker.dutchtracking.com/announce", "http://tracker.dutchtracking.com:80/announce", "http://tracker.dutchtracking.nl/announce", "http://tracker.dutchtracking.nl:80/announce", "http://tracker.edoardocolombo.eu:6969/announce", "http://tracker.ex.ua/announce", "http://tracker.ex.ua:80/announce", "http://tracker.filetracker.pl:8089/announce", "http://tracker.flashtorrents.org:6969/announce", "http://tracker.grepler.com:6969/announce", "http://tracker.internetwarriors.net:1337/announce", "http://tracker.kicks-ass.net/announce", "http://tracker.kicks-ass.net:80/announce", "http://tracker.kuroy.me:5944/announce", "http://tracker.mg64.net:6881/announce", "http://tracker.opentrackr.org:1337/announce", "http://tracker.skyts.net:6969/announce", "http://tracker.tfile.me/announce", "http://tracker.tiny-vps.com:6969/announce", "http://tracker.tvunderground.org.ru:3218/announce", "http://tracker.yoshi210.com:6969/announce", "http://tracker1.wasabii.com.tw:6969/announce", "http://tracker2.itzmx.com:6961/announce", "http://tracker2.wasabii.com.tw:6969/announce", "http://www.wareztorrent.com/announce", "http://www.wareztorrent.com:80/announce", "https://104.28.17.69/announce", "https://www.wareztorrent.com/announce", "udp://107.150.14.110:6969/announce", "udp://109.121.134.121:1337/announce", "udp://114.55.113.60:6969/announce", "udp://128.199.70.66:5944/announce", "udp://151.80.120.114:2710/announce", "udp://168.235.67.63:6969/announce", "udp://178.33.73.26:2710/announce", "udp://182.176.139.129:6969/announce", "udp://185.5.97.139:8089/announce", "udp://185.86.149.205:1337/announce", "udp://188.165.253.109:1337/announce", "udp://191.101.229.236:1337/announce", "udp://194.106.216.222:80/announce", "udp://195.123.209.37:1337/announce", "udp://195.123.209.40:80/announce", "udp://208.67.16.113:8000/announce", "udp://213.163.67.56:1337/announce", "udp://37.19.5.155:2710/announce", "udp://46.4.109.148:6969/announce", "udp://5.79.249.77:6969/announce", "udp://5.79.83.193:6969/announce", "udp://51.254.244.161:6969/announce", "udp://62.138.0.158:6969/announce", "udp://62.212.85.66:2710/announce", "udp://74.82.52.209:6969/announce", "udp://85.17.19.180:80/announce", "udp://89.234.156.205:80/announce", "udp://9.rarbg.com:2710/announce", "udp://9.rarbg.me:2780/announce", "udp://9.rarbg.to:2730/announce", "udp://91.218.230.81:6969/announce", "udp://94.23.183.33:6969/announce", "udp://bt.xxx-tracker.com:2710/announce", "udp://eddie4.nl:6969/announce", "udp://explodie.org:6969/announce", "udp://mgtracker.org:2710/announce", "udp://open.stealth.si:80/announce", "udp://p4p.arenabg.com:1337/announce", "udp://shadowshq.eddie4.nl:6969/announce", "udp://shadowshq.yi.org:6969/announce", "udp://torrent.gresille.org:80/announce", "udp://tracker.aletorrenty.pl:2710/announce", "udp://tracker.bittor.pw:1337/announce", "udp://tracker.coppersurfer.tk:6969/announce", "udp://tracker.eddie4.nl:6969/announce", "udp://tracker.ex.ua:80/announce", "udp://tracker.filetracker.pl:8089/announce", "udp://tracker.flashtorrents.org:6969/announce", "udp://tracker.grepler.com:6969/announce", "udp://tracker.ilibr.org:80/announce", "udp://tracker.internetwarriors.net:1337/announce", "udp://tracker.kicks-ass.net:80/announce", "udp://tracker.kuroy.me:5944/announce", "udp://tracker.leechers-paradise.org:6969/announce", "udp://tracker.mg64.net:2710/announce", "udp://tracker.mg64.net:6969/announce", "udp://tracker.opentrackr.org:1337/announce", "udp://tracker.piratepublic.com:1337/announce", "udp://tracker.sktorrent.net:6969/announce", "udp://tracker.skyts.net:6969/announce", "udp://tracker.tiny-vps.com:6969/announce", "udp://tracker.yoshi210.com:6969/announce", "udp://tracker2.indowebster.com:6969/announce", "udp://tracker4.piratux.com:6969/announce", "udp://zer0day.ch:1337/announce", "udp://zer0day.to:1337/announce"]
    };
    const exists = fs.existsSync(path);
    if (!exists) {
        fs.mkdirSync(path);
    }
    console.log(chalk_1.default.blue(`DOWNLOAD PATH: ${path}`));
    let totalLengthBytes = 0;
    let completed = 0;
    const engine = (0, torrent_stream_1.default)(magnet, options);
    const promise = new Promise((resolve, reject) => {
        try {
            engine.listen(6881, () => {
                console.log(chalk_1.default.green('Listening on port 6881'));
            });
            engine.on('ready', () => {
                console.log(chalk_1.default.bold.magenta("Found " + Object.keys(engine.files).length + " files:"));
                engine.files.forEach(function (file) {
                    console.log("------------------\n");
                    console.log('filename:', file.name);
                    file.select();
                    console.log("------------------\n");
                });
                totalLengthBytes = engine.files.reduce(function (prevLength, currFile) {
                    return prevLength + currFile.length;
                }, 0);
            });
            let lastDate = ts_luxon_1.DateTime.now();
            let lastDownloaded = 0;
            const history = [];
            engine.on('download', () => {
                const downloadedAt = ts_luxon_1.DateTime.now();
                const downloaded = engine.swarm.downloaded;
                const bytesRemaining = totalLengthBytes - downloaded;
                completed = Math.round((engine.swarm.downloaded / totalLengthBytes) * 100.0);
                const diff = downloaded - lastDownloaded;
                const timeDiff = downloadedAt.diff(lastDate, 'milliseconds')
                    .milliseconds;
                const msDiff = (1000.0 / timeDiff);
                const bytesPerSec = (diff * msDiff);
                history.push(bytesPerSec);
                if (history.length > 10)
                    history.splice(0, 1);
                let averageBytesPerSec = (lodash_1.default.sum(history) / history.length);
                if (completed > 95)
                    averageBytesPerSec = bytesPerSec;
                const kbytes = (averageBytesPerSec / 1024);
                const mbytes = (kbytes / 1024).toFixed(2);
                const etaSeconds = (bytesRemaining / averageBytesPerSec);
                const etaMins = (etaSeconds / 60);
                const etaHours = (etaMins / 60);
                let timeleft = `${etaHours.toFixed(2)} hours`;
                if (etaHours < 1)
                    timeleft = `${etaMins.toFixed(2)} minutes`;
                if (etaMins < 1)
                    timeleft = `${etaSeconds.toFixed(2)} minutes`;
                const speed = `${mbytes} mb/s`;
                console.log(chalk_1.default.cyanBright(`${completed}% | ${speed} | ${timeleft} remaining`));
                if (completed >= 100) {
                    console.log(chalk_1.default.green("DOWNLOAD COMPLETE!"));
                    engine.destroy(() => {
                        resolve(true);
                    });
                }
                lastDownloaded = downloaded;
                lastDate = downloadedAt;
            });
            engine.on('idle', () => {
                console.log(chalk_1.default.green("IDLING..."));
                engine.destroy(() => {
                    resolve(true);
                });
            });
        }
        catch (e) {
            reject('Error: ' + e);
        }
    });
    return promise
        .then(() => {
        console.log(chalk_1.default.green("SHUTTING DOWN"));
    });
}
exports.download = download;
//# sourceMappingURL=download.js.map