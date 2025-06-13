require("dotenv").config();
const db = require("./config/db");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");
// custom DB connection file

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer Setup for CSV Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ----------------------------------------
// ✅ CSV Upload - Product Items
// ----------------------------------------
app.post("/api/items/upload-csv", upload.single("csvFile"), (req, res) => {
  const filePath = path.join(__dirname, req.file.path);
  const fs = require("fs");
  const csv = require("csv-parser");

  const items = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      const {
        itemName,
        brand,
        description,
        rate,
        quantity,
        unit,
        location,
        remarks,
      } = row;

      items.push([
        itemName,
        brand,
        description,
        parseFloat(rate),
        parseInt(quantity),
        unit,
        location,
        remarks,
      ]);
    })
    .on("end", () => {
      const insertQuery = `
        INSERT INTO items (itemName, brand, description, rate, quantity, unit, location, remarks)
        VALUES ?
      `;

      db.query(insertQuery, [items], (err) => {
        if (err) {
          console.error("❌ Error inserting CSV data:", err);
          return res.status(500).json({ message: "Insert failed" });
        }
        res.json({ message: "CSV uploaded and data inserted successfully" });
      });
    });
});

// ----------------------------------------
// ✅ Booking APIs
// ----------------------------------------
app.post("/booking", (req, res) => {
  const data = req.body;
  const query = `
    INSERT INTO booking (
      customerName, contactNumber, tripStartDate, pickupTime, pickupLocation,
      vehicleType, acType, capacity, carrier,
      dayOneDate, dayOneTinarary, dayTwoDate, dayTwoTinarary,
      dayThreeDate, dayThreeTinarary, dayFourDate, dayFourTinarary,
      tripType, budgets, rate, ratePerKm, enquiryDate, source,
      followUpSchedule1, OutecomeOfSchedule1, followUpSchedule2, OutecomeOfSchedule2,
      followUpSchedule3, OutecomeOfSchedule3, followUpSchedule4, OutecomeOfSchedule4,
      status, handledBy, driverName, vehicle, vehicleCondition
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    data.customerName, data.contactNumber, data.tripStartDate, data.pickupTime, data.pickupLocation,
    data.vehicleType, data.acType, data.capacity, data.carrier,
    data.dayOneDate, data.dayOneTinarary, data.dayTwoDate, data.dayTwoTinarary,
    data.dayThreeDate, data.dayThreeTinarary, data.dayFourDate, data.dayFourTinarary,
    data.tripType, data.budgets, data.rate, data.ratePerKm, data.enquiryDate, data.source,
    data.followUpSchedule1, data.OutecomeOfSchedule1, data.followUpSchedule2, data.OutecomeOfSchedule2,
    data.followUpSchedule3, data.OutecomeOfSchedule3, data.followUpSchedule4, data.OutecomeOfSchedule4,
    data.status, data.handledBy, data.driverName, data.vehicle, data.vehicleCondition
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ Booking error:", err);
      return res.status(500).json({ success: false, message: "Failed to save booking" });
    }
    res.status(200).json({ success: true, message: "Booking saved", bookingId: result.insertId });
  });
});

app.get("/bookings", (req, res) => {
  const name = req.query.customerName || "";
  const sql = name ? `SELECT * FROM booking WHERE customerName LIKE ?` : `SELECT * FROM booking`;
  const values = name ? [`%${name}%`] : [];

  db.query(sql, values, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.put("/bookings/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const fields = Object.keys(data).map((key) => `${key} = ?`).join(", ");
  const values = Object.values(data);
  const sql = `UPDATE booking SET ${fields} WHERE bookingId = ?`;

  db.query(sql, [...values, id], (err) => {
    if (err) return res.status(500).send("Update failed");
    res.send("Booking updated successfully");
  });
});

// ----------------------------------------
// ✅ Admin APIs
// ----------------------------------------
app.post("/api/admin-signup", (req, res) => {
  const { adminId, fullName, mobile, age, address, email, password } = req.body;
  if (!adminId || !fullName || !mobile || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const sql = `INSERT INTO admins (adminId, fullName, mobile, age, address, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [adminId, fullName, mobile, age || null, address || null, email, password];

  db.query(sql, values, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ success: false, message: "Admin already exists" });
      }
      console.error("❌ Admin insert error:", err);
      return res.status(500).json({ success: false, message: "Insert failed" });
    }
    res.status(201).json({ success: true, message: "Admin registered", adminId: result.insertId });
  });
});

app.get("/api/admins", (req, res) => {
  db.query("SELECT * FROM admins", (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    res.json(results);
  });
});

app.get("/api/admins/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM admins WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Admin not found" });
    res.json(results[0]);
  });
});

app.put("/api/admins/:id", (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const fields = Object.keys(data).map((key) => `${key} = ?`).join(", ");
  const values = Object.values(data);

  db.query(`UPDATE admins SET ${fields} WHERE id = ?`, [...values, id], (err) => {
    if (err) return res.status(500).json({ message: "Update failed", error: err });
    res.json({ message: "Admin updated successfully" });
  });
});

app.delete("/api/admins/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM admins WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ message: "Delete failed", error: err });
    res.json({ message: "Admin deleted successfully" });
  });
});

// ----------------------------------------
// ✅ Employee APIs
// ----------------------------------------
app.post("/api/employee-signup", (req, res) => {
  const { employeeId, fullName, mobile, age, address, email, password } = req.body;
  if (!employeeId || !fullName || !mobile || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const sql = `INSERT INTO employees (employeeId, fullName, mobile, age, address, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [employeeId, fullName, mobile, age || null, address || null, email, password];

  db.query(sql, values, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ success: false, message: "Employee already exists" });
      }
      console.error("❌ Employee insert error:", err);
      return res.status(500).json({ success: false, message: "Insert failed" });
    }
    res.status(201).json({ success: true, message: "Employee registered", employeeId: result.insertId });
  });
});

app.get("/api/employees", (req, res) => {
  db.query("SELECT * FROM employees", (err, results) => {
    if (err) {
      console.error("❌ Failed to fetch employees:", err);
      return res.status(500).json({ message: "Failed to fetch employees" });
    }
    res.json(results);
  });
});

app.get("/api/employees/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM employees WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("❌ Failed to fetch employee:", err);
      return res.status(500).json({ message: "Failed to fetch employee" });
    }
    if (results.length === 0) return res.status(404).json({ message: "Employee not found" });
    res.json(results[0]);
  });
});

app.put("/api/employees/:id", (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const fields = Object.keys(data).map((key) => `${key} = ?`).join(", ");
  const values = Object.values(data);

  db.query(`UPDATE employees SET ${fields} WHERE id = ?`, [...values, id], (err) => {
    if (err) {
      console.error("❌ Failed to update employee:", err);
      return res.status(500).json({ message: "Failed to update employee" });
    }
    res.json({ message: "Employee updated successfully" });
  });
});

app.delete("/api/employees/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM employees WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("❌ Failed to delete employee:", err);
      return res.status(500).json({ message: "Failed to delete employee" });
    }
    res.json({ message: "Employee deleted successfully" });
  });
});

// /aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
app.post("/api/admin-signup", (req, res) => {
  const { adminId, fullName, mobile, age, address, email, password } = req.body;

  // ✅ Validate required fields
  if (!adminId || !fullName || !mobile || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  // ✅ SQL Insert Query
  const sql = `INSERT INTO admins (adminId, fullName, mobile, age, address, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [adminId, fullName, mobile, age || null, address || null, email, password];

  // ✅ Run the query
  db.query(sql, values, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ success: false, message: "Admin already exists" });
      }
      console.error("❌ Admin insert error:", err);
      return res.status(500).json({ success: false, message: "Insert failed" });
    }

    // ✅ Success
    res.status(201).json({ success: true, message: "Admin registered", adminId: result.insertId });
  });
});


// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
