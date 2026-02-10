import express from 'express';
import { stdin as input, stdout as output } from 'node:process';
import readline from 'node:readline/promises';
import axios from 'axios';
import { randomUUID } from 'node:crypto';
import os from 'os';

/**
 * This example made to demonstrate how to use "Custom API channel"
 * 
 * Please note, that you must run this example on the server
 * which can be accessed over the internet (to make it possible to receive webhooks from Anychat)
 */

/**
 * ====================
 * = Helper functions =
 * ====================
 */

const ESC = '\x1b' // ASCII escape character
const CSI = ESC + '[' // control sequence introducer

// clear last line in the console
function clearCurrentLine() {
    process.stdout.write(CSI + 'A') // moves cursor up one line
    process.stdout.write(CSI + 'K') // clears from cursor to line end
}

// get current IP address to generate webhook endpoint
function getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        for (const details of interfaces[interfaceName]) {
            // Check for IPv4 and ensure it's not an internal loopback address
            if (details.family === 'IPv4' && !details.internal) {
                return details.address;
            }
        }
    }
    return false;
}

/** ==================================================================================== */

const HTTP_PORT = 1212;     // we will run server on this port
const API_URL = '';         // paste URL from the "API Channel" settings
let name = '';
let email = '';

const app = express();
app.use(express.json());

const api = axios.create();

const chatId = randomUUID();        // this is the Chat ID. This will be unique on each server restart
const contactId = randomUUID();     // this is the Contact ID. This will be unique on each server restart

const rl = readline.createInterface({
    input,
    output,
    terminal: false
});

// process the webhook (render message and attachemnts to console)
app.post('/chat/webhook', async (req, res) => {
    console.log(`AGENT: ${req.body.message.message}`);
    for (let i of req.body.message.attachments) {
        console.log(`\t ${i.url}`);
    }
    return res.send({
        success: true
    });
});

// listen for customer's message
async function promptInput() {
    const answer = await rl.question('');
    clearCurrentLine();
    console.log('YOU:', answer);

    const data = {
        action: 'message',
        chat_id: chatId,
        contact: {
            id: contactId,
            name: name,
            email: email
        },
        timestamp: (Date.now() / 1000).toFixed(),
        message_id: randomUUID(),
        message: answer,
        // attachments: [                           // You can send up to 10 attachments per message
        //     {
        //         url: 'https://...',              // File URL
        //         mimetype: 'application/pdf',     // MimeType of the file
        //         filename: 'invoice'              // Filename (optional)
        //     }
        // ]
    };
    api.post(API_URL, data);
    await promptInput();
};

// run the app!
app.listen(HTTP_PORT, async () => {
    process.stdout.write('\x1Bc');

    console.log('HTTP server start on port', HTTP_PORT);
    const IP = getLocalIpAddress();
    if (IP === false) {
        console.log(`Seems you don't have public IP or it's not detected.`);
        process.exit(1);
    }
    console.log(`Please set webhook URL to http://${IP}:${HTTP_PORT}/chat/webhook`);
    console.log('ChatID:', chatId);
    console.log('ContactID:', contactId);
    
    // ask the customer name
    name = await rl.question('Enter your name: ') || 'API customer';
    console.log('Welcome,', name);
    
    // ask the customer email
    email = await rl.question('Enter your email: ') || 'api@customer.net';
    console.log('Okay', name, email, "Let's chat");
    console.log('-------------------------------');

    promptInput();
});