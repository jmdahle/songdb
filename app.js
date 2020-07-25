const mysql = require('mysql');
const inquirer = require('inquirer');
const { listenerCount } = require('process');
const { connectableObservableDescriptor } = require('rxjs/internal/observable/ConnectableObservable');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'jdahle',
    password: 'JD@lama2519',
    database: 'top_songsDB',
});

connection.connect(err => {
    if (err) throw err
    console.log(`Connected to database on ${connection.threadId}`);
    initialPrompts();
})

const killIt = () => {
    console.log('Closing connections and exiting.');
    connection.end();
    process.exit();
}

const initialPrompts = () => {
    console.log('\n=======\n');

    inquirer.prompt([
        {
            name: 'action',
            message: 'Choose an action',
            type: 'list',
            choices: [
                {name: 'Artist Search', value: 'artist'},
                {name: 'Multi Search', value: 'multi'},
                {name: 'Range Search', value: 'range'},
                {name: 'Song Search', value: 'song'},
                {name: 'Exit', value: 'exit'}
            ]
        }
    ]).then( answer => {
        switch (answer.action) {
            case 'artist':
                artistSearch();
                break;
            case 'song':
                songSearch();
                break;
            case 'multi':
                multiSearch();
                break;
            case 'range':
                rangeSearch();
                break;
            default :
                console.log('Exiting...');
                killIt();
                break;
        }
    });
}

// artirst serach
// --   A query which returns all data for songs sung by a specific artist
const artistSearch = () => {
    console.log('Searching artist...');
    inquirer.prompt([
        {
            type: 'input',
            message: 'Select an artist',
            name: 'artist'
        }
    ]).then ( answer => {
        let sqlStatement = `SELECT position, song, year from top5000 where artist = '${answer.artist}' ORDER BY position`;
        connection.query(sqlStatement, (err, data) => {
            if (err) throw err;
            console.log('Songs in top 5000 by ' + answer.artist);
            console.table(data);
            initialPrompts();
        })
    })
    
    
}

// multiSearch
// --    A query which returns all artists who appear within the top 5000 more than once
const multiSearch = () => {
    console.log('Searching for artists that appear more than x times ...');
    
    initialPrompts();
}

// rangeSearch
// --    A query which returns all data contained within a specific range
const rangeSearch = () => {
    console.log('rangeSearch...');
    inquirer.prompt([
        {
            name: 'startPosition',
            type: 'number',
            message: 'Starting position for search'
        },
        {
            name: 'endPosition',
            type: 'number',
            message: 'Ending position for search'
        },
    ]).then( answers => {
        connection.query(`SELECT position, artist, song, year FROM top5000 WHERE position BETWEEN ${answers.startPosition} AND ${answers.endPosition};`, (err, data) => {
            if (err) throw err;
            console.table(data);
            initialPrompts();
        })
    })

}

// --    A query which searches for a specific song in the top 5000 and returns the data for it
const songSearch = () => {
    console.log('Searching for song...');
    
    initialPrompts();
}

