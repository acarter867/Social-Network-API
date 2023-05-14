const { User, Thought } = require("../models");

module.exports = {
  //Get all users
  getUser(req, res) {
    User.find({})
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  //Get single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
    .populate("thoughts")
    .populate("friends")
    .select("-__v")
    .then((user) => {
        if(user){
            res.status(200).json(user)
        }else{
            res.status(404).json({ message: "User not avialable" })
        }
    })
    .catch((err) => res.status(500).json(err));
  },
  //create user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  //update user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
    .then((user) => {
        if(user){
            res.status(200).json(user)
        }else{
            res.status(404).json({ message: "User not avialable." })
        }
    })
    .catch((err) => res.status(500).json(err));
  },
  //delete a user AND associated thoughts 
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
    .then((user) => {
        if(user){
            Thought.deleteMany({ _id: { $in: user.thoughts } })
        }else{
            res.status(404).json({ message: "User not available." })
        }
    })
    .then(() => res.json({ message: "User and Thought deleted!" }))
    .catch((err) => res.status(500).json(err));
  },
  //add a friend
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
    .then((user) => {
        if(user){
            res.status(200).json(user)
        }else{
            res.status(404).json({ message: "User not available." })
        }
    })
    .catch((err) => res.status(500).json(err));
  },
  //delete a friend
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
    .then((user) => {
        if(user){
            res.status(200).json(user)
        }else{
            res.status(404).json({ message: "User not available." })
        }
    })
    .catch((err) => res.status(500).json(err));
  },
};