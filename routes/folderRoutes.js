const express = require('express');
const mongoose = require('mongoose')
const Folder = require('../models/Folder');
const File = require('../models/File')
const checkAuth = require('../middlewares/auth');

const router = express.Router();

router.post('/', checkAuth, async(req, res) => {
    const {name, parentId} = req.body;

    try{
        const newFolder = new Folder({
            name,
            userId: req.user._id,
            parentId: parentId || null,       
        });

        await newFolder.save();

        res.status(201).json({ message: 'Folder created', folder: newFolder });
    }
    catch(err){
        res.status(500).json({ message: 'Error creating folder', error: err.message });
    }
})

router.get('/', checkAuth, async (req, res) => {
  
    const folders = await Folder.find({ parentId: null, userId: req.user._id });
    const files = await File.aggregate([
        {
          $match: {
            folderId: new mongoose.Types.ObjectId(null),
            userId: new mongoose.Types.ObjectId(req.user._id)
          }
        },
        { $sort: { version: -1 } }, 
        {
          $group: {
            _id: "$fileGroupId",
            file: { $first: "$$ROOT" }
          }
        },
        {
          $replaceRoot: { newRoot: "$file" } 
        },
        {
          $sort: { uploadedAt: -1 }
        }
      ]);
      
  
    // Fetch breadcrumb
    let breadcrumbs = [];
    let currentId = null;
    while (currentId) {
      const folder = await Folder.findById(currentId);
      if (!folder) break;
      breadcrumbs.unshift({ name: folder.name, _id: folder._id });
      currentId = folder.parentId;
    }
  
    res.render('folder_view', { folders, files, breadcrumbs });
});  

router.get('/:folderId', checkAuth, async (req, res) => {
    const folderId = req.params.folderId || null;
  
    const folders = await Folder.find({ parentId: folderId, userId: req.user._id });
    const files = await File.aggregate([
        {
          $match: {
            folderId: new mongoose.Types.ObjectId(folderId),
            userId: new mongoose.Types.ObjectId(req.user._id)
          }
        },
        { $sort: { version: -1 } },
        {
          $group: {
            _id: "$fileGroupId",
            file: { $first: "$$ROOT" }
          }
        },
        {
          $replaceRoot: { newRoot: "$file" }
        },
        {
          $sort: { uploadedAt: -1 }
        }
      ]);
      
  
    // Fetch breadcrumb
    let breadcrumbs = [];
    let currentId = folderId;
    while (currentId) {
      const folder = await Folder.findById(currentId);
      if (!folder) break;
      breadcrumbs.unshift({ name: folder.name, _id: folder._id });
      currentId = folder.parentId;
    }
  
    res.render('folder_view', { folders, files, breadcrumbs });
});  

router.get('/:parentId/contents', async(req, res) => {
    const parentId = req.params.parentId === 'root' ? null : req.params.parentId;

    try{
        const folders = await Folder.findOne({userId: req.user._id, parentId});
        const files = await File.findOne({userId: req.user._id, folderId:parentId});
        res.json({Folders:folders, Files:files});
    }
    catch(err){
        res.status(500).json({message:'failed to fetch folder contents', error:err.message});
    }
})

module.exports = router;

