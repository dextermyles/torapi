"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.download = void 0;
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const torrent_stream_1 = __importDefault(require("torrent-stream"));
const ts_luxon_1 = require("ts-luxon");
const options = {
    connections: 100,
    uploads: 10,
    tmp: '/tmp',
    path: 'C:\\media',
    verify: true,
    dht: true,
    tracker: true
};
function download(magnet) {
    return __awaiter(this, void 0, void 0, function* () {
        var downloadPath = path_1.default.win32.resolve(__dirname, '\\dist\\downloads');
        console.log(downloadPath);
        var totalLengthBytes = 0;
        var totalFiles = 0;
        var completed = 0;
        var engine = (0, torrent_stream_1.default)(magnet, options);
        var promise = new Promise((resolve, reject) => {
            try {
                engine.on('ready', () => {
                    console.log(chalk_1.default.bold.magenta("Found " + Object.keys(engine.files).length + " files:"));
                    engine.files.forEach(function (file) {
                        totalFiles += 1;
                        console.log("------------------\n");
                        console.log('filename:', file.name);
                        file.select();
                        console.log("------------------\n");
                    });
                    totalLengthBytes = engine.files.reduce(function (prevLength, currFile) {
                        return prevLength + currFile.length;
                    }, 0);
                });
                var lastDate = ts_luxon_1.DateTime.now();
                var lastDownloaded = 0;
                engine.on('download', (pieceIndex) => {
                    var downloadedAt = ts_luxon_1.DateTime.now();
                    var downloaded = engine.swarm.downloaded;
                    var bytesRemaining = totalLengthBytes - downloaded;
                    completed = Math.round((engine.swarm.downloaded / totalLengthBytes) * 100.0);
                    var diff = downloaded - lastDownloaded;
                    var timeDiff = downloadedAt.diff(lastDate, 'milliseconds')
                        .milliseconds;
                    var msDiff = (timeDiff / 1000.0);
                    var bytesPerSec = diff * msDiff;
                    var kbytes = bytesPerSec * 1024;
                    var mbytes = (kbytes * 1024).toFixed(2);
                    var speed = `${mbytes} mb/s`;
                    var eta = bytesRemaining / bytesPerSec;
                    var mins = eta * 60;
                    var timeleft = `${mins} mins`;
                    if (mins <= 1)
                        timeleft = `${eta} secs`;
                    console.log(chalk_1.default.cyanBright(`${completed}% | ${speed} | ${timeleft} remaining`));
                    if (completed >= 100) {
                        console.log(chalk_1.default.green("DOWNLOAD COMPLETE!"));
                        engine.destroy(() => {
                            console.log(chalk_1.default.green("SHUTTING DOWN"));
                            resolve(true);
                        });
                    }
                    lastDownloaded = downloaded;
                    lastDate = downloadedAt;
                });
                engine.on('idle', () => {
                    console.log(chalk_1.default.green("IDLING..."));
                    engine.destroy(() => {
                        console.log(chalk_1.default.green("SHUTTING DOWN"));
                        resolve(true);
                    });
                });
            }
            catch (e) {
                reject('Error: ' + e);
            }
        });
        return promise;
    });
}
exports.download = download;
//# sourceMappingURL=download.js.map