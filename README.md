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
- enter your webhook URL. If you run server on port 1212 (default) you should enter http://YOUR_IP:1212/chat/webhook
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