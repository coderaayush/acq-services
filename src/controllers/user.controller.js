let chatData = require('./../common/chatData');
let userId = 0;

module.exports.createUserId =  (req, res, next) => {
    try {
        if (!req.query.userId) {
            let data = {};
            data.userId = ++userId;
            data.userName = req.query.userName ? req.query.userName : 'john doe';
            let userData = chatData.createUserId(data);
            let onlineUsers = chatData.getOnlineUsers();
            var io = req.app.get('socketio');
            io.emit('online-user-created', {data: userData, onlineUsers: onlineUsers});
            return res.status(200).send(JSON.stringify({err: 0, msg: 'userId Created', data: userData}));
        } else {
            return res.status(200).send(JSON.stringify({err:0, msg: 'user id already created'}))
        }
    } catch (err) {
        console.log(err);
        return res.error(400).send(JSON.stringify({err:200, msg: 'something went wrong'}));
    }
};

module.exports.updateUser = function(req, res, next) {
    try {
        if (req.query.userId && req.body.userName) {
            let data = {};
            data.userId = parseInt(req.query.userId);
            data.userName = req.body.userName;
            let userData = chatData.updateUserName(data);
            if (userData) {
                // set socket if message update, publish message
                var io = req.app.get('socketio');
                io.emit('online-user-updated', {data: userData});
                return res.status(200).send(JSON.stringify({err: 0, msg: 'user updated', data: userData}));
            }
            return res.status(200).send(JSON.stringify({err: 0, msg: 'Unable to find userId', data: userData}));
        } else {
            return res.status(200).send(JSON.stringify({err:210, msg: 'user id/username is not provided'}))
        }
    } catch (err) {
        return res.error(400).send(JSON.stringify({err:200, msg: 'something went wrong'}));
    }
}

module.exports.getOnlineUsers = function(req, res, next) {
    try {
        let usersData = chatData.getOnlineUsers();
        return res.status(200).send(JSON.stringify({err: 0, msg: 'online users fetched', data: usersData}));
    } catch (err) {
        console.log(err);
        return res.error(400).send(JSON.stringify({err:201, msg: 'something went wrong'}));
    }
}