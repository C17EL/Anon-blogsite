import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";


const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));




app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.use(express.static(__dirname));


let blogList= [];

app.get("/", (req, res) => {
    res.render("index.ejs");
  });

  
  app.post("/home", (req, res) => {
    const blogTitle = req.body.blogTitle;
    const blogDescription = req.body.blogDes;
    blogList.push({
      id:generateID(),
      title:blogTitle,
      description: blogDescription,

    });
    console.log(blogList);
    res.redirect("/home");
  });

  app.get("/home", (req, res) => {
    console.log("Current Blog List:", blogList); // Debugging line
    res.render("home.ejs", { blogList });
});

function generateID() {
  return Math.floor(Math.random() * 10000);
};
  



  

 app.post("/delete/:id", (req, res) => {
  const blogId = parseInt(req.params.id); 
  blogList = blogList.filter(blog => blog.id !== blogId);
  res.redirect("/home"); 
});

app.get("/blogDetails/:id", (req, res) => {
  const blogId = parseInt(req.params.id); // Get the ID from the URL
  const blog = blogList.find(blog => blog.id === blogId); // Find the blog in the array
  if (blog) {
      res.render("blogDetails.ejs", { blog }); // Render the blogDetails template with the blog data
  } else {
      res.status(404).send("Blog not found"); // Handle case where blog doesn't exist
  }
});

app.get("/edit/:id", (req, res) => {
  const blogId = parseInt(req.params.id);
  const blog = blogList.find(blog => blog.id === blogId);
  res.render("edit.ejs", { blog }); 
});

app.post("/update/:id", (req, res) => {
  const blogId = parseInt(req.params.id);
  const updatedTitle = req.body.blogTitle;
  const updatedDescription = req.body.blogDes;

  const blogIndex = blogList.findIndex(blog => blog.id === blogId);
  if (blogIndex !== -1) {
      // Update the blog details
      blogList[blogIndex].title = updatedTitle;
      blogList[blogIndex].description = updatedDescription;
      res.redirect("/home");
  } else {
      res.status(404).send("Blog not found");
  }
});





  app.listen(port, () => {
    console.log(`Connected on port ${port}`);
  });