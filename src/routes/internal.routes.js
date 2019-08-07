let express = require('express');
let router = express.Router();
let userController = require('./../controllers/user.controller');
let chatController = require('./../controllers/chat.controller');

router.get('/createUserId', userController.createUserId);
router.get('/createChatId', chatController.createChatId);
router.get('/getItems', chatController.getItems);
router.get('/getItem', chatController.getItem);
router.get('/getUserConnectedChats', chatController.getUserChats);

router.post('/pushMessageToChat', chatController.pushMessageToChat);
router.get('/addUserToChat', chatController.addUserToChat);
router.get('/removeUserFromChat', chatController.removeUserFromChat);
router.get('/getOnlineUsers', userController.getOnlineUsers);

router.post('/updateUser', userController.updateUser);

module.exports = router;