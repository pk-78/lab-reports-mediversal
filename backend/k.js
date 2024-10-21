// In your backend server (Node.js)
import express from 'express';
import axios from 'axios';

const app = express();

app.post('/send-mms', async (req, res) => {
  try {
    const response = await axios.post('https://api.kaleyra.io/v1/messages', {
        to: '+918279458423',
        type: 'mms',
        sender: sender,
        media_url: 'https://example.com/path-to-your-image.jpg',
        body: 'hi cyril babu',
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer A925a6e8922f98c5836efa65c5567dccd',
      },
    });
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error sending MMS: ' + error.message);
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
