const mongoose = require('mongoose');
const ChatRoom = require('../chatroom/chatroom.model');
const User = require('../user/user.model');

const getUser = (username) => {
  const userPromise = User.findOne({
    username,
  });
  return userPromise;
};

exports.getUserFromUsername = username => getUser(username);
// users shoud be type array
exports.getAllUserID = (users) => {
  const userIDArr = users.map(user => getUser(user.username));
  const results = Promise.all(userIDArr);
  return results;
};
// usernames should be array of usernames
exports.getAllUserIDFromUsernames = (usernames) => {
  const userIDArr = usernames.map(username => getUser(username));
  const results = Promise.all(userIDArr);
  return results;
};

// This return Promise
const updateUserChatRoom = (username, roomID) => {
  const userPromise = User.findOneAndUpdate({
    username,
  }, {
    $push: {
      chatRooms: {
        roomID,
        lastSeenMessage: null,
      },
    },
  });
  return userPromise;
};

exports.addChatRoom = (users, room) => {
  const updatedUsers = users.map(user => updateUserChatRoom(user.username, room._id));
  const results = Promise.all(updatedUsers);
  return results;
};

exports.getUserFromChatRoom = (roomID) => {
  const promise = User.find({
    chatRooms: {
      $elemMatch: {
        roomID,
      },
    },
  }).select({
    username: 1,
    firstName: 1,
    lastName: 1,
  });
  return promise;
};

exports.updateLastSeenMessageInRoom = (username, roomID, lastSeenMsg) => {
  const promise = User.update({
    username,
    'chatRooms.roomID': roomID,
  }, {
    $set: {
      'chatRooms.lastSeenMessage': lastSeenMsg,
    },
  });
  return promise;
};

