import express from "express";
import fs from "fs/promises";

const PORT = 3000;

const app = express();

const readProducts = async () => {
  try {
    const data = await fs.readFile("./products.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeProducts = async (data) => {
  await fs.writeFile("./products.json", JSON.stringify(data, null, 2));
};
app.use(express.json());

//  barcha mahsulatlarni olish

app.get("/api/products", async (req, res) => {
  const products = await readProducts();
  res.json({
    success: true,
    count: products.length,
    data: products,
  });
});

// id boyicha mahsulotni topish

app.get("/api/products/:id", async (req, res) => {
  const prodId = Number(req.params.id);
  const products = await readProducts();

  const findProd = products.find((prod) => prod.id === prodId);

  if (!findProd) {
    return res.status(404).json({
      success: false,
      message: "Mahsulot     topilmadi",
    });
  }

  res.json({ success: true, data: findProd });
});

// post yangi mahsulot qoshish

app.post("/api/products", async (req, res) => {
  const { title, price } = req.body;
  const products = await readProducts();

  if (!title || !price) {
    return res.status(400).json({
      success: false,
      message: "Title va priceni kirting",
    });
  }

  let newProduct = {
    id: products.length === 0 ? 1 : products.at(-1).id + 1,

    title,
    price,
  };

  products.push(newProduct);
  await writeProducts(products);

  res.status(201).json({
    success: true,
    message: "Muvaffiqaytali qoshildi",
    data: newProduct,
  });
});

// put mahsultni yangilash

app.put("/api/products/:id", async (req, res) => {
  const prodId = Number(req.params.id);
  const { title, price } = req.body;
  const products = await readProducts();

  if (!title && !price) {
    return res.status(400).json({
      success: false,
      message: "Title va priceni kirting",
    });
  }

  const findProd = products.find((prod) => prod.id === prodId);

  if (!findProd) {
    return res.status(404).json({
      success: false,
      message: "Mahsulot topilmadi",
    });
  }

  // 2. Qaysi biri kelgan bo'lsa, faqat o'shani yangilaymiz!
  if (title) findProd.title = title;
  if (price) findProd.price = price;

  await writeProducts(products);

  res.status(200).json({
    success: true,
    message: "yangilandi",
    data: findProd,
  });
});

// delete

app.delete("/api/products/:id", async (req, res) => {
  const prodId = Number(req.params.id);
  const products = await readProducts();

  const findIndex = products.findIndex((prod) => prod.id == prodId);

  if (findIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Mahsulot topilmadi",
    });
  }

  const deleteProduct = products.splice(findIndex, 1);
  await writeProducts(products);

  res.status(200).json({
    success: true,
    message: "OChirildi",
    data: deleteProduct[0],
  });
});

app.listen(PORT, () => {
  console.log(`serverimiz http://localhost:${PORT}`);
});
