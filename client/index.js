var fs = require('fs');
const http = require('http');
const path = require('path');
const json2csv = require('json2csv').parse;

var eventidaciclare = [1, 2, 3, 4];

for (var i = 0; i < eventidaciclare.length; i++) {

  var tmp = eventidaciclare[i];

  // function(res) is called when the connection is established
  let request = http.get('http://localhost:3000/api/eventi/' + tmp, (res) => {
    if (res.statusCode !== 200) {
      console.error(`Did not get an OK from the server. Code: ${res.statusCode}`);
      res.resume();
      return;
    }

    var data = '';

    // on('data') is called when there's a chunk of data (this almost certainly will be more than once)
    res.on('data', (chunk) => {
      data += chunk;
    });

    // on('close') is called when the connection closes.
    res.on('close', () => {

      var json = JSON.parse(data);
      var fieldNames2 = ['titolo', 'logo_img', 'url_content', 'img_content', 'starttime', 'endtime', 'sinossi'];

      var info_evento = [
        {
          titolo: json.eventTitle,
          logo_img: json.channel.logo,
          url_content: json.content.url,
          img_content: json.content.imagesMap[0].img.url,
          starttime: json.starttime,
          endtime: json.endtime,
          sinossi: json.eventSynopsis
        }
      ];

      rows = json2csv(info_evento, { header: false });

      const write = async (fileName, fieldNames2, info_evento) => {
        // output file in the same folder
        const filename = path.join(__dirname, 'CSV', `${fileName}`);
        let rows;
        // If file doesn't exist, we will create new file and add rows with headers.    
        if (!fs.existsSync(filename)) {
          rows = json2csv(info_evento, { header: true });
          console.log('The file was created!');
        } else {
          // Rows without headers.
          rows = json2csv(info_evento, { header: false });
          console.log('The "data to append" was appended to file!');
        }

        // Append file function can create new file too.
        fs.appendFileSync(filename, rows);
        // Always add new line if file already exists.
        fs.appendFileSync(filename, "\r\n");
      }

      write('eventi.csv', fieldNames2, info_evento);
    });
  });
};
