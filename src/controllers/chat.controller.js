let chatData = require('./../common/chatData');
let chatId = 0;

module.exports.createChatId =  (req, res, next) => {
    try {
        if (!req.query.chatId) {
            let data = {}; 
            data.chatId = ++chatId;
            data.userId = parseInt(req.query.userId);
            data.userName = req.query.userName ? req.query.userName : 'john doe';
            let chatItem = chatData.createChatId(data);
            var io = req.app.get('socketio');
            io.emit('user-connected-chat-updated', {items: chatData.getItem(data), connectedChats: chatData.getUserConnectedChats(data), userId: data.userId});
            return res.status(200).send(JSON.stringify({err: 0, msg: 'chatId Created', data: chatItem}));
        } else {
            return res.status(200).send(JSON.stringify({err:0, msg: 'chat id already created'}))
        }
    } catch (err) {
        console.log(err);
        return res.error(400).send(JSON.stringify({err:100, msg: 'something went wrong'}));
    }
};

module.exports.getItems = (req, res, next) => {
    console.log('get items');
    let chatItems = chatData.getAllItems()
    return res.status(200).send(JSON.stringify({err: 0, msg: 'chatItems retrieved', data: chatItems}));
};

module.exports.getItem = (req, res, next) => { 
    try {
        if (req.query.chatId && req.query.userId) {
            let data = {};
            data.userId = parseInt(req.query.userId);
            data.chatId = parseInt(req.query.chatId);
            let itemsData = chatData.getItem(data);
            if (itemsData && itemsData.connectedUsers.find(x => x == data.userId)) {
                return res.status(200).send(JSON.stringify({err:0, msg: 'chat data fetch successfully', data: itemsData}))
            } else {
                return res.status(200).send(JSON.stringify({err:141, msg: 'user not does not exist in this chat', data: itemsData}))
            }
        }
    } catch(err) {
        console.log(err);
        return res.error(400).send(JSON.stringify({err:101, msg: 'something went wrong'}));
    }
}

module.exports.getUserChats = (req, res, next) => {
    try {
        if (req.query.userId) {
            let data = {};
            data.userId = parseInt(req.query.userId);
            let itemsData = chatData.getUserConnectedChats(data);
            return res.status(200).send(JSON.stringify({err:0, msg: 'user connected chats data fetch successfully', data: itemsData}))
        } else {
            return res.status(200).send(JSON.stringify({err:0, msg: 'invalid userId'}))
        }

    } catch (err) {
        console.log(err);
        return res.error(400).send(JSON.stringify({err:109, msg: 'something went wrong'}));
    }
}

module.exports.pushMessageToChat =  (req, res, next) => {
    try {
        if (req.query.chatId && req.query.userId) {
            let data = {};
            if (req.body.message) {
                data.userId = parseInt(req.query.userId);
                data.chatId = parseInt(req.query.chatId);
                data.message = req.body.message;
            } else {
                return res.status(200).send(JSON.stringify({err:0, msg: 'message missing'}))
            }
            chatData.pushMessageToChat(data);

            // set socket if message update, publish message
            var io = req.app.get('socketio');
            let itemsData = chatData.getItem(data);
            if (itemsData && itemsData.connectedUsers.find(x => x == data.userId)) {
                io.emit('chat-item-updated', {data: itemsData, chatId: data.chatId});
            }
            return res.status(200).send(JSON.stringify({err:0, msg: 'message pushed successfully', data: data}))
        } else {
            return res.status(200).send(JSON.stringify({err:0, msg: 'chatid or userid missing'}))
        }
    } catch(err) {
        console.log(err);
        return res.error(400).send(JSON.stringify({err:102, msg: 'something went wrong'}));
    }
}

module.exports.addUserToChat =  (req, res, next) => {
    try {
        if (req.query.chatId  && req.query.userId) {
            let data = {};
            data.userId = parseInt(req.query.userId);
            data.chatId = parseInt(req.query.chatId);
            if (chatData.addUserToChat(data)) {

                var io = req.app.get('socketio');
                io.emit('user-connected-chat-updated', {items: chatData.getItem(data),
                     connectedChats: chatData.getUserConnectedChats(data), userId: data.userId, onlineUsers: chatData.getOnlineUsers() });

                return res.status(200).send(JSON.stringify({err:0, msg: 'user added'}));
            } else {
                return res.status(200).send(JSON.stringify({err:111, msg: 'user already present'}));
            }
        } else {
            return res.status(200).send(JSON.stringify({err:112, msg: 'invalid user/chatid'}));
        }
    } catch(err) {
        console.log(err);
        return res.error(400).send(JSON.stringify({err:103, msg: 'something went wrong'}));
    }
}

module.exports.removeUserFromChat =  (req, res, next) => {
    try {
        if (req.query.chatId  && req.query.userId) {
            let data = {};
            data.userId = parseInt(req.query.userId);
            data.chatId = parseInt(req.query.chatId);
            if (chatData.removeUserFromChat(data)) {

                var io = req.app.get('socketio');
                io.emit('user-chat-disconnected', {items: chatData.getItem(data),
                     connectedChats: chatData.getUserConnectedChats(data),chatid: data.chatId,
                      userId: data.userId, onlineUsers: chatData.getOnlineUsers() });

                return res.status(200).send(JSON.stringify({err:0, msg: 'user removed from chat'}));
            } else {
                return res.status(200).send(JSON.stringify({err:121, msg: 'user not found'}));
            }
        } else {
            return res.status(400).send(JSON.stringify({err:0, msg: 'invalid user/chatid '}));
        }
    } catch(err) {
        console.log(err);
        return res.error(400).send(JSON.stringify({err:104, msg: 'something went wrong'}));
    }
}