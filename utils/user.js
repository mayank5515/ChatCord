const users = [];

//WHEN USER JOINS ADD THEM TO DB
function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    //splice method removes elements from array and returns an array of removed elements
    return users.splice(index, 1)[0]; //will remove that element and we want that user that has left
  }
}

function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}
module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
