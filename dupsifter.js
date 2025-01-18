var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

if(process.argv.length !== 4) {

    console.log('Process requires exactly 2 arguement');
    process.exit(-1);
}

var destinationPath = process.argv[3];

if(!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath, 0766);
}

const fileHashes = {};

function run(sourcePath, destinationPath) {
    fs.readdir(sourcePath, { withFileTypes: true }, function(err, items)
    {
    
        for(var i = 0; i<items.length; i++)
        {
            const item = items[i];

            console.log('Item: ', sourcePath+'/'+item.name);
            
            if (item.isDirectory()) {
                const newDirectory = destinationPath + '/' + item.name;
                if(!fs.existsSync(newDirectory)) {
                    fs.mkdirSync(newDirectory, 0766);
                } 

                run(sourcePath + '/' + item.name, destinationPath + '/' + item.name);

                
            } else {
                const filePath = sourcePath+'/'+item.name;
                
                const fileData = fs.readFileSync(filePath);

                const fileExtension = path.extname(filePath);

                if (fileExtension !== '.mov' || fileExtension !== '.mp4' || fileExtension !== '.mkv' || fileExtension !== '.m4v' || fileExtension !== '.fcpbundle' || fileExtension !== '.app' || fileExtension !== '.dmg' || fileExtension !== '.pkg' || fileExtension !== '.zip' || fileExtension !== '.rar' || fileExtension !== '.tar' || fileExtension !== '.gz' || fileExtension !== '.7z' || fileExtension !== '.iso' || fileExtension !== '.dmg' || fileExtension !== '.exe' || fileExtension !== '.msi' || fileExtension !== '.deb' || fileExtension !== '.rpm' || fileExtension !== '.apk' || fileExtension !== '.ipa' || fileExtension !== '.appx' || fileExtension !== '.appxbundle' || fileExtension !== '.wav') {
                    const hash = crypto.createHash('md5');

                    const key = hash.update(fileData).digest('hex');

                    if (!fileHashes[key]) {

                        fileHashes[key] = true;
                    
                        fs.copyFileSync(sourcePath + '/' + item.name, destinationPath + '/' + item.name); 

                        console.log('\tMoved: \t' + item.name);

                    }
                }
            }
            
        }
    });
}

run(process.argv[2], process.argv[3]);
