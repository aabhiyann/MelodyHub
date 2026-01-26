const axios = require('axios');

async function fetchIds() {
    try {
        console.log('Fetching albums...');
        const albums = await axios.get('http://localhost:5001/api/albums');
        console.log('Albums found:', albums.data.albums?.length || 0);
        if (albums.data.albums && albums.data.albums.length > 0) {
            console.log('First Album ID:', albums.data.albums[0]._id);
            console.log('Sample Album Title:', albums.data.albums[0].title);
        } else {
            console.log('No albums found.');
        }
    } catch (error) {
        console.error('Error fetching albums:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

fetchIds();
