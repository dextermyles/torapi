import chalk from 'chalk';
import _ from 'lodash';
import torrentStream from 'torrent-stream';
import { DateTime } from 'ts-luxon';



export async function download(magnet: string, path: string) {
    let options: TorrentStream.TorrentEngineOptions = {
        connections: 200,
        uploads: 10,
        tmp: 'C:\\tmp',
        path: `C:\\media\\${path}\\`, // Where to save the files. Overrides `tmp`.
        verify: true,
        dht: true,
        tracker: true
    };
    var totalLengthBytes = 0;
    var totalFiles = 0;
    var completed = 0;
    var engine = torrentStream(magnet, options);
    var promise = new Promise<any>((resolve, reject) => {
        try {
            engine.on('ready', () => {
                console.log(chalk.bold.magenta("Found " + Object.keys(engine.files).length + " files:"));

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

            var lastDate = DateTime.now();
            var lastDownloaded = 0;
            var lastBytesPerSec = 0;
            var history: number[] = [];

            engine.on('download', (pieceIndex) => {
                var downloadedAt = DateTime.now();
                var downloaded = engine.swarm.downloaded;
                var bytesRemaining = totalLengthBytes - downloaded;

                completed = Math.round((engine.swarm.downloaded / totalLengthBytes) * 100.0);

                var diff = downloaded - lastDownloaded;
                var timeDiff = downloadedAt.diff(lastDate, 'milliseconds')
                    .milliseconds;

                var msDiff = (timeDiff / 1000.0);
                var bytesPerSec = (diff * msDiff);

                history.push(bytesPerSec);
                if (history.length > 10)
                    history.splice(0, 1);

                var kbytes = (bytesPerSec / 1024);
                var mbytes = (kbytes / 1024).toFixed(2);
                var speed = `${mbytes} mb/s`;

                var averageBytesPerSec = _.sum(history) / history.length;
                if (completed > 95)
                    averageBytesPerSec = bytesPerSec;

                var eta = (bytesRemaining / bytesPerSec);
                var mins = (eta * 60);
                var timeleft = `${mins} mins`;

                if (mins <= 1)
                    timeleft = `${eta} secs`;

                console.log(chalk.cyanBright(`${completed}% | ${speed} | ${timeleft} remaining`));

                if (completed >= 100) {
                    console.log(chalk.green("DOWNLOAD COMPLETE!"));

                    engine.destroy(() => {
                        console.log(chalk.green("SHUTTING DOWN"));
                        resolve(true);
                    });
                }

                lastDownloaded = downloaded;
                lastDate = downloadedAt;
                lastBytesPerSec = bytesPerSec;
            });

            engine.on('idle', () => {
                console.log(chalk.green("IDLING..."));
                engine.destroy(() => {
                    console.log(chalk.green("SHUTTING DOWN"));
                    resolve(true);
                });
            });
        }
        catch (e) {
            reject('Error: ' + e);
        }
    });

    return promise;
}