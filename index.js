import express from "express";
import cors from "cors";

import helmet from "helmet";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import bodyParser from "body-parser";
import morgan from "morgan";
import { connect } from "./connect/connect.js";
import {
  blog,
  blogList,
  deleteBlog,
  post,
  updataBlog,
} from "./controller/post.js";
import path from "path";
import { fileURLToPath } from "url";
import { login, register } from "./controller/user.js";
import mongoose from "mongoose";
import { verifyToken } from "./middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 8000;
const app = express();

app.use(cors());

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

const mongouri =
  "mongodb+srv://radhika:radhika123@cluster0.turlubz.mongodb.net/blog";

/* FILE STORAGE */
const storage = new GridFsStorage({
  url: mongouri,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const originalName = file.originalname;
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = uniqueSuffix + "-" + originalName;
      const fileInfo = {
        filename: filename,
        bucketName: "file1",
      };
      resolve(fileInfo);
    });
  },
});

console.log("storage", storage);

const upload = multer({
  storage,
});

//creating bucket
let bucket;
mongoose.connection.on("connected", () => {
  var client = mongoose.connections[0].client;
  var db = mongoose.connections[0].db;
  bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "file1",
  });
  //console.log(bucket);
});

import nodemailer from "nodemailer";
import {
  isValid,
  isValidEmail,
  isValidName,
  isValidPhone,
} from "./utils/validate.js";
app.post("/contact/email", async (req, res) => {
  try {
    const { email, phone, message, name } = req.body;
    if (!email || !phone || !message || !name) {
      return res
        .status(400)
        .json({ status: false, message: "All Fields Are Required" });
    }
    if (!isValidName(name)) {
      return res.status(403).json({ status: false, message: "Name Not Valid" });
    }
    if (!isValidEmail(email)) {
      return res
        .status(403)
        .json({ status: false, message: "Email Id Not Valid" });
    }

    if (!isValidPhone(phone)) {
      return res
        .status(403)
        .json({ status: false, message: "Phone Number Not Valid" });
    }

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "info@hminnovance.com",
        pass: "dhefcdnwioddvqjl",
      },
    });

    var mailOptions = {
      from: "info@hminnovance.com",
      to: "contact@hminnovance.com",
      subject: `Sending Email by client `,
      template: "email",
      text: `
Hello Sir/Madam

     Contact Us 
     Name : ${name}
     Email : ${email}
     Phone : ${phone}
     Message : ${message}

 Thank you,‍
 H & M INNOVANCE LLP

 ‍
`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res
      .status(200)
      .json({ status: true, message: "Thanks For Connecting Us !" });
  } catch (error) {
    res.status(500).json({ status: false, message: error });
  }
});
app.post("/register", register);
app.post("/login", login);
app.post("/api/v1/blog", upload.single("file"), verifyToken, post);
app.get("/get/blog", blogList);
app.get("/api/v1/get-blog/:id", blog);

app.put("/update/blog/:id", upload.single("file"), verifyToken, updataBlog);

app.get("/api/v1/blog/:filename", async (req, res) => {
  const file = await bucket.find({
    filename: req.params.filename,
  });
  bucket.openDownloadStreamByName(req.params.filename).pipe(res);
});
app.delete("/delete/blog/:id", deleteBlog);

const start = async () => {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`i am at ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
