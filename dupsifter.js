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
const reference = {};
const tags = {};
const finalTags = {};

function run(sourcePath, destinationPath) {
    const items = fs.readdirSync(sourcePath, { withFileTypes: true});

    for(var i = 0; i<items.length; i++) {
        if(items[i].name.startsWith('.') == false){
            const item = items[i];
            console.log('Item: ', sourcePath+'/'+item.name);
            
            if (item.isDirectory()) {
                const newDirectory = destinationPath + '/' + item.name;
                if(!fs.existsSync(newDirectory)) {
                    fs.mkdirSync(newDirectory, 0766);
                } 

                run(sourcePath + '/' + item.name, destinationPath + '/' + item.name);
    
            } else {  
                
                const fileData = fs.readFileSync(sourcePath+'/'+item.name);

                const hash = crypto.createHash('md5');

                const key = hash.update(fileData).digest('hex');

                if (!fileHashes[key]) {

                    fileHashes[key] = destinationPath + '/' + item.name;
                
                    fs.copyFileSync(sourcePath + '/' + item.name, destinationPath + '/' + item.name); 

                    console.log('\tMoved: \t' + item.name);

                    reference[key] = ('\n' + path.basename(fileHashes[key]) + '\n\n\tfound in: \n\t\t' + sourcePath);

                    const splits = sourcePath.split("/");

                    tags[key] = ('\n' + path.basename(fileHashes[key]) + '\n\tTags:\n\t\t');

                    for(var a = 3; a < splits.length; a++) {

                        const itemTag = splits[a];
                        tags[key] = tags[key] + '\n\t\t' + itemTag;
                    }
                } else if (fileHashes[key]) {

                    const splits = sourcePath.split("/");

                    for(var a = 3; a < splits.length; a++) {

                        //for loop filter

                        tags[key] = tags[key] + '\n\t\t' + splits[a];

                    }

                    reference[key] = (reference[key] + '\n\t\t' + sourcePath);

                }
            }
        }
    }
}

run(process.argv[2], process.argv[3]);

fs.appendFileSync(destinationPath + '/reference.txt', Object.values(reference));

for(b = 0; b < tags.length; b++) {

    for(r = 0; r < finalTags.length; r++) {

        if (tags[b] !== finalTags[r]) {

            

        }

    }
}

fs.appendFileSync(destinationPath + '/tags.txt', Object.values(tags));
