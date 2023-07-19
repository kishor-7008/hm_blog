import Post from "../model/blog.js";

export const post = async (req, res) => {
  console.log(req.body)
  try {
    const { title, summary, content } = req.body;
    const postSave = await Post.create({
      title,
      summary,
      content,
      file: req.file.filename,
    });
    return res.status(201).json(postSave);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};


export const blogList = async (req, res) => {
  console.log("bloglist")
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    console.log("post ", post);
    const data = posts.map((post) => {
      console.log("post inside data" , post.file)
      return {
        _id: post._id,
        title: post.title,
        summary: post.summary,
        content: post.content,
        fileUrl: `/api/v1/blog/${post.file}`,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        __v: post.__v,
      };
    });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

export const blog = async (req, res) => {
  try {
    const { id } = req.params;
    const singleBlog = await Post.find({ _id: id }).populate("file", [
      "filename",
    ]);
    return res.status(200).json(singleBlog);
  } catch {
    return res.status(404).json({ message: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const id = req.params.id;
    await Post.findByIdAndDelete({ _id: id });
    return res.status(200).json({ message: "Post has been deleted" });
  } catch (err) {
    return res.status(500).json({ status:false, message:err });
  }
};

export const updataBlog=async(req,res)=>{
  console.log(req.file)
  try {
    const id = req.params.id;

    const { title, summary, content } = req.body;
    // let dataGet=await Post.findOne({_id:id})
  
    // console.log("filenam",  dataGet.file)
    if(req.file){
      await Post.updateOne({_id:id},{$set:{file:req.file.filename}})
    }else{

    }
    let response=await Post.updateOne({_id:id},{$set:{ title,
      summary,
      content,
     }})
    return res.status(201).json({status:true,message:"Successfully Updated"})
  } catch (error) {
    return res.status(500).json({status:false, message: error.message });
  }
}
