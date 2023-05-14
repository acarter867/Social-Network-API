const { User, Thought } = require("../models");

module.exports = {
  // Get ALL thoughts
  getThought(req, res) {
    Thought.find({})
      .then((thought) => {
        res.json(thought)
    })
      .catch((err) => res.status(500).json(err));
  },
  // get single thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
    .select("-__v")
    .then((thought) => {
        if(thought){
            res.status(200).json(thought)
        }else{
            res.status(404).json({ message: "Thought not available." })
        }
    })
    .catch((err) => res.status(500).json(err));
  },
  //create thought and attatch new thought id to poster
  createThought(req, res) {
    Thought.create(req.body)
    .then(({ _id }) => {
        return User.findOneAndUpdate(
            { _id: req.body.userId },
            { $push: { thoughts: _id } },
            { new: true }
        );
    })
    .then((thought) => {
        if(thought){
            res.status(200).json(thought)
        }else{
            res.status(404).json({ message: "Thought not available." })
        }
    })
    .catch((err) => res.status(500).json(err));
  },
  //update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, New: true }
    )
    .then((user) =>{
        if(user){
            res.status(200).json(user)
        }else{
            res.status(404).json({ message: "Thought not available." })
        }
    })
    .catch((err) => res.status(500).json(err));
  },
  //delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
    .then((thought) => {
        if(thought){
            User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
            )
        }else{
            res.status(404).json({ message: "Thought not available." })
        }
    })
    .then((user) => {
        if(user){
            res.status(200).json({ message: 'Thought deleted.' })
        }else{
            res.status(404).json({ message: 'User not found'})
        }
    })
    .catch((err) => res.status(500).json(err));
  },
  //create reaction
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
    .then((thought) => {
        if(thought){
            res.status(200).json(thought)
        }else{
            res.status(404).json({ message: "Thought not available." })
        }
    })
    .catch((err) => res.status(500).json(err));
  },
  //delete reaction
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) => {
        if(thought){
            res.status(200).json(thought)
        }else{
            res.status(404).json({ message: "Thought not available." })
        }
      })
      .catch((err) => res.status(500).json(err));
  },
};