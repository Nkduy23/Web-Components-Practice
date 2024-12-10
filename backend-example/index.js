const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();

// Middleware để parse dữ liệu POST từ form
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Thiết lập thư mục công khai (public) để chứa hình ảnh tải lên
app.use(express.static("public"));

// Thiết lập Multer để lưu trữ hình ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads"); // Lưu hình ảnh vào thư mục "public/uploads"
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file là thời gian hiện tại + phần mở rộng
  },
});

const upload = multer({ storage: storage });

// Dữ liệu giả lập (bạn có thể thay thế bằng dữ liệu từ cơ sở dữ liệu)
const products = [];

// Route chính để render sản phẩm
app.get("/", (req, res) => {
  res.render("index", { products: products });
});

// Route để thêm sản phẩm mới
app.post("/add-product", upload.single("image"), (req, res) => {
  const { name, price } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : "";

  // Kiểm tra dữ liệu và thêm sản phẩm vào mảng
  if (name && price && image) {
    const newProduct = {
      id: products.length + 1,
      name: name,
      price: parseFloat(price),
      image: image,
    };
    products.push(newProduct);
    res.redirect("/"); // Quay lại trang chủ để hiển thị sản phẩm mới
  } else {
    res.status(400).send("Invalid product data. Name, price, and image are required.");
  }
});

// Thiết lập view engine (EJS)
app.set("view engine", "ejs");

// Chạy server trên port 3000
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
