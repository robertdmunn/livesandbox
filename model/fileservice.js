const FilePartDAO = require( './filepartdao' );
const cuid = require( '../libs/cuid' );
const concat = require('concat-files');
const uploadPath = './client/img/profilePics/';
const fs = require('fs');

const dao = FilePartDAO();

function deleteFiles(files, callback){
  let i = files.length;
  files.forEach(function(filepath){
    fs.unlink(filepath, function(err) {
      i--;
      if (err) {
        callback(err);
        return;
      } else if (i <= 0) {
        callback(null);
      }
    });
  });
}

module.exports = {
  createFilePart: function( fileId, filepath, filepart, parts ){
    return( dao.create( fileId, filepath, filepart, parts ) );
  },
  readFilePart: function( fileId ){
    return( dao.read( fileId ) );
  },
  deleteFileParts: function( fileId ){
    return( dao.delete( fileId ) );
  },
  upload: function( id, tempFile, part, parts, filename, filesize ){
    return new Promise( function( resolve, reject ){
      let addedPart = dao.create( id, tempFile, part, parts );

      let result = {
        fileId: id,
        path: "/img/profilePics/",
        filename: filename,
        disabled: 0,
        filesize: filesize,
        tags:'',
        mimetype: 'application/octect-stream',
        created: new Date()
      };

      if( part === parts ){
        dao.read( id )
        .then( function( fileparts ){
          let filenameparts = filename.split(".");
          let fileextension = filenameparts[filenameparts.length-1].toLowerCase();
          // rename file
          let newFilename = cuid() + "." + fileextension;

          let files = fileparts.map( filepart => filepart.filepath );

          concat(files, uploadPath + newFilename, function(err) {
            if (err) console.log( err );

            // clean up
            dao.delete( id )
            .then( function( success ){

              deleteFiles( files, function(err){
                if (err) {
                  console.log(err);
                } else {
                  console.log('all temp files removed');
                }
              });
            })
            .catch( function( error ){
              console.log( error );
            });
            result.filename = newFilename;
            resolve( result );
          });
        })
        .catch( function( error ){
          console.log( error );
          reject( error );
        });

      }else{
        resolve( result );
      }
    });
  }
};
