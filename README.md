# Chatbot-UI
This is based on the [Rasa Chatbot UI](https://elysian01.github.io/Rasa-Chatbot-UI/#get-started)

# Get Started
Paste in this embed code
```
<div id="chat-container"></div>
<script src="https://jihuang-adobe.github.io/Chatbot-UI/chatbot-ui.js"></script>
<link rel="stylesheet" href="https://jihuang-adobe.github.io/Chatbot-UI/chatbot-ui.css">
<script>
    createChatBot(host = "https://prod-92.westus.logic.azure.com:443/workflows/5b95c07912994ce8887c1739e914a8cb/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=VKaoo2JGX7FDFk0SDkQzKCYu82IXTt2PdTJE6z8phIE", botLogo = "./imgs/bot-logo.png",
        title = "WKND BOT", welcomeMessage = "Hey, I am WKND bot", inactiveMsg = "Server is down, Please contact the developer to activate it", theme = "dark")
</script>
```