// import axios from "axios";


// // Replace with your API key and sender ID
// const apiKey = 'A925a6e8922f98c5836efa65c5567dccd';
// const sender = 'GTWELL';

// // MMS details
// const mmsData = {
//     to: '+918279458423', // recipient phone number (with country code)
//     type: 'mms',
//     sender: sender,
//     media_url: 'https://example.com/path-to-your-image.jpg', // URL of the image or media
//     body: 'hi cyril babu', // message body
// };

// // Send MMS function
// export const sendMMS = async () => {
//     try {
//         const response = await axios.post(
//             'https://api.kaleyra.io/v1/messages',
//             mmsData,
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${apiKey}`, // API key for authentication
//                 },
//             }
//         );
//         console.log('MMS sent successfully:', response.data);
//     } catch (error) {
//         console.error('Error sending MMS:', error.response ? error.response.data : error.message);
//     }
// };

// // Call the function to send MMS
// // sendMMS();