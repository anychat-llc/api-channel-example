# api-channel-example
This console project is designed to demonstrate the use of the "API channel." It runs directly in the server console and does not include any user interface or website.

> [!NOTE]
> Please make sure to run this example on a server with a public IP address. Otherwise, your webhook URL will not be accessible from the internet.

### INSTALLATION

1. Clone repository
```
git clone git@github.com:anychat-llc/api-channel-example.git
cd api-channel-example
```

2. Install node modules
```
npm install
```

3. Create API channel in Anychat
- navigate to **Settings** -> **Live Chat Integrations** https://anychat.one/settings/live-chat-integrations
- click the "Add new channel" button
- choose "API Channel"
- enter your webhook URL. If you run server on port 1212 (default) you should enter http://YOUR_PUBLIC_IP:1212/chat/webhook
- click the "Next" button
- on the next step you will see your API endpoint URL. Copy that URL and paste into example.js of this project as value of API_URL variable
- save the file and run the project

```
node example.js
```

### USAGE
After launching the project, you will be prompted to enter your name and email. You have the option to skip these steps; if you do, your default name will be **API customer** and your email will be **api@customer.net**. 

Next, enter your custom message and press Enter. Your message should appear instantly in Anychat. 

To view and reply to the message, go to the chat section within the Anychat dashboard. 

Reply to your message from anychat and you will immediately see the message in the project console.

### API
To send message, send the following data to your API endpoint (https://api.anychat.one/v1/custom-channel/api?token=...)
```
{
    action: 'message',                          // only 'message' supports at this moment. We will add other stuff (like reactions, ackStatus) later
    chat_id: chatId,                            // your internal chat ID. It must be unique per chat, so Anychat can group messages into signle chat (thread)
    contact: {                                  // contact information
        id: contactId,                          // id must be unique per contact, so Anychat can link chats to a single contact
        name: name,                             // name of the contact (optional)
        email: email                            // email of the contact (optional)
    },
    timestamp: (Date.now() / 1000).toFixed(),   // timestamp of the message
    message_id: randomUUID(),                   // id of the message. Must be unique for each message
    message: answer,                            // message content (plain text)
    attachments: [                              // You can send up to 10 attachments per message (this field is optional)
        {
            url: 'https://...',                 // File URL
            mimetype: 'application/pdf',        // MimeType of the file
            filename: 'invoice'                 // Filename (optional)
        }
    ]
}
```

### Webhook data 
When message comes from Anychat to your webhook URL, it contains following data:
```
{
  action: 'chat.message.create',
  message: {                                    // message object
    id: 65019429,                               // ID of the message
    thread_guid: '853ee33f-00ed...',            // GUID of the chat (thread)
    from_guid: 'fa897fac-91d3...',              // GUID of the sender (agent)
    is_bot: false,                              // reserved... (unused)
    is_service: 0,                              // reserved... (unused)
    message: 'Hi there!',                       // message content
    created_at: 1770810178,                     // message creation time
    updated_at: 1770810178,                     // message last update time
    last_edit: 0,                               // message last edit time
    source: 'livechat',                         // message source
    source_id: null,                            // message source id
    attachments: [                              // attachments
        {
            id: 22063788,                       // attachment id
            thread: '853ee33f-00ed...',         // GUID of the chat (thread)
            message_id: 65019429,               // ID of the message
            filename: 'image.png',              // filename
            url: 'https://anc1.hel...png',      // URL of the file
            filesize: 187398,                   // size of the file
            mime: 'image/png',                  // mimetype of the file
            created_at: 1770810572              // file creation date
        }
    ],
    from_agent: true,                           // indicates if message is sent by the agent
    from_bot: false,                            // indicates if message is sent by the bot
    from_contact: false                         // indicates if message is sent by the contact
  },
  chat: {                                       // Chat object
    guid: '853ee33f-00ed...',                   // GUID of the chat (thread)
    channel: '23a1f26d-de70...',                // GUID of the channel
    started_by: '35055006-84cc...',             // GUID of the user (contact) which start the chat
    assigned_to: 'fa897fac-91d3...',            // GUID of assignee (agent)
    is_closed: 0,                               // indicates if chat is closed
    is_archive: 0,                              // indicates if chat is archived
    status: 1,                                  // indicates if chat is opened (1) or resolved (2)
    notes: null,                                // notes saved by admin
    created_at: 1770810169,                     // chat creation time
    updated_at: 1770810178,                     // chat update time
    last_message_at: 1770810178,                // last message time
    is_group: 0,                                // indicates if chat is group
    title: null,                                // title of the chat (for groups only)
    image: null,                                // image of the chat (for groups only)
    mute: 0,                                    // indicates if chat is muted
    source: 'api',                              // the source of the chat
    source_id: '5c1f1467-b1ad...',              // the source ID of the chat (you pass this with your API request (chat_id field))
    contact: 'a7a25048-bb0f...'                 // the ID of the contact (you pass this with your API request (contact.id field))
  }
}
```