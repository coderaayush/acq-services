module.exports = {
    createUserId: function(data) {
        let userData = JSON.parse(JSON.stringify(this.userData))
        userData.userId = data.userId;
        userData.userName = data.userName;
        this.onlineUsers.push(userData);
        return userData;
    },
    createChatId: function(data) {
        let chatItem = JSON.parse(JSON.stringify(this.chatItem))
        chatItem.chatId = data.chatId;
        chatItem.connectedUsers.push(data.userId);
        this.items.push(chatItem);     
        return chatItem;
    },
    addUserToChat: function(data) {
        // Check if userId exists in onlineUsers data
        if (this.onlineUsers.find(x => x.userId == data.userId)) {

            //check if userId is already present in connectedUsers for this chat
            if (this.items.find(x => x.chatId == data.chatId).connectedUsers.find(x => x == data.userId)) {
                console.log('user already present in chat');
                return false;
            }
            return this.items.map(x => x.chatId == data.chatId ? x.connectedUsers.push(data.userId) : x);
        } else {
            console.log('user not found');
        }
    },
    removeUserFromChat: function(data) {
        let selectedChatData = this.items.find(x => x.chatId == data.chatId)
        if (selectedChatData) {
            if (selectedChatData.connectedUsers.find(x => x == data.userId)) {
                selectedChatData.connectedUsers = selectedChatData.connectedUsers.filter(x => x != data.userId);
                console.log('user removed from chat item');
                return true;
            }
        } else {
            console.log('user not found');
            return false;
        }
    },
    disconnectUser: function(data) {
        this.removeUserFromChat(data);
        if (this.onlineUsers.find(x => x.userId == data.userId)) {
            this.onlineUsers = this.onlineUsers.filter(x => x.userId != data.userId);
            console.log('user disconnected');
        } else {
            console.log('user not found');
        }
    },
    pushMessageToChat: function(data) {
        //find chat id
        let messageItem = JSON.parse(JSON.stringify(this.messageItem));
        messageItem.userId = data.userId;
        messageItem.message = data.message;
        this.items.map(x => x.chatId == data.chatId ? x.messages.push(messageItem) : x);
        console.log('message pushed to chat');
    },
    getAllItems: function() { return this.items },
    getItem: function(data) { return this.items.find(x => x.chatId == data.chatId) },
    updateUserName: function(data) {
        if (this.onlineUsers.find(x => x.userId == data.userId)) {
            return this.onlineUsers.map(x => {
                if (x.userId == data.userId) {
                    x.userName = data.userName
                }
                return x;
            });
        } else {
            return false;
        }
    },
    getOnlineUsers: function() { return this.onlineUsers},
    getUserConnectedChats: function (data) {
        return this.items.filter(x => x.connectedUsers.find(y => y == data.userId));
    },
    items: [],
    onlineUsers: [],
    userData: {
        userId: '', 
        userName: ''
    },
    chatItem: {
        chatId: '',
        messages: [],
        connectedUsers: [],
    },
    messageItem: {
        userId: '',
        message: ''
    }
}