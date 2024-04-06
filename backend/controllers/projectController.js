const User = require("../models/user");
const Project = require("../models/project");

const createProject = async (req, res) => {
  try {
    const id = req.id;
    const { title, teamId } = req.body;
    const project = new Project({
      title,
      teams: [teamId],
    });
    await project.save();
    await User.findByIdAndUpdate(id, { $push: { projects: project._id } });
    return res.status(200).json({ msg: "done" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getProject = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Project.findById(id).populate({
      path: "teams",
      populate: {
        path: "users",
      },
    });
    return res.status(200).json({ project });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.createProject = createProject;
exports.getProject = getProject;