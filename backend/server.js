require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 5000;

// ============================================================
// GMAIL CONFIGURATION
// ============================================================

const mailTransporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

app.use(cors());
app.use(
  express.json({
    limit: "7mb",
  }),
);

// ============================================================
// TEST ROUTE
// ============================================================

app.get("/", (req, res) => {
  res.json({
    message: "SINGKO backend is running!",
  });
});

// ============================================================
// GET ALL MEMBERS
// ============================================================

app.get("/api/members", (req, res) => {
  const sql = "SELECT * FROM members";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching members:", err);

      return res.status(500).json({
        error: "Failed to fetch members",
      });
    }

    res.json(results);
  });
});

// ============================================================
// GET ALL PROJECTS
// ============================================================

app.get("/api/projects", (req, res) => {
  const sql = "SELECT * FROM projects";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching projects:", err);

      return res.status(500).json({
        error: "Failed to fetch projects",
      });
    }

    res.json(results);
  });
});

// ============================================================
// SAVE CONTACT MESSAGE
// ============================================================

app.post("/api/messages", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // ========================================================
  // CHECK REQUIRED FIELDS
  // ========================================================

  if (!name || !email || !message) {
    return res.status(400).json({
      error: "Name, email, and message are required",
    });
  }

  // ========================================================
  // INSERT MESSAGE INTO MYSQL
  // ========================================================

  const sql = `
        INSERT INTO messages
        (
            name,
            email,
            subject,
            message
        )
        VALUES (?, ?, ?, ?)
    `;

  db.query(
    sql,
    [name, email, subject || null, message],
    async (err, result) => {
      if (err) {
        console.error("Error saving contact message:", err);

        return res.status(500).json({
          error: "Failed to save contact message",
        });
      }

      // ==================================================
      // SEND EMAIL TO GMAIL
      // ==================================================

      try {
        await mailTransporter.sendMail({
          from: process.env.GMAIL_USER,

          to: process.env.GMAIL_RECEIVER,

          replyTo: email,

          subject: subject || "New Portfolio Contact Message",

          text: `
New message from your SINGKO portfolio.

Name:
${name}

Email:
${email}

Subject:
${subject || "No subject"}

Message:
${message}
                    `,
        });

        // ==============================================
        // EMAIL SENT SUCCESSFULLY
        // ==============================================

        console.log("Contact email sent successfully.");

        // ==================================================
        // SEND CONFIRMATION EMAIL TO VISITOR
        // ==================================================

        await mailTransporter.sendMail({
          from: process.env.GMAIL_USER,

          to: email,

          subject: "Thank you for contacting SINGKO",

          text: `
Hello ${name},

Thank you for contacting the SINGKO team.

We have successfully received your message.

Subject:
${subject || "No subject"}

Your message:
${message}

We will review your message and get back to you if a response is needed.

Best regards,
SINGKO Team
National University
Integrative Programming
    `,
        });

        console.log("Confirmation email sent successfully to visitor.");

        // SUCCESS RESPONSE
        // ==================================================

        res.json({
          message: "Contact message saved and email sent successfully!",

          id: result.insertId,
        });
      } catch (emailError) {
        // ==============================================
        // EMAIL ERROR
        // ==============================================

        console.error("Message saved to MySQL, but email failed:", emailError);

        res.status(500).json({
          error: "Message was saved, but the email could not be sent.",
        });
      }
    },
  );
});
// ============================================================
// GET ALL INTRODUCTIONS
// ============================================================

app.get("/api/introductions", (req, res) => {
  const sql = `
        SELECT
            introductions.id,
            introductions.member_id,
            members.name,
            members.role,
            introductions.introduction
        FROM introductions
        INNER JOIN members
            ON introductions.member_id = members.id
        ORDER BY introductions.member_id ASC
    `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching introductions:", err);

      return res.status(500).json({
        error: "Failed to fetch introductions",
      });
    }

    res.json(results);
  });
});

// ============================================================
// UPDATE MEMBER PHOTO
// ============================================================

app.put("/api/members/:id/photo", (req, res) => {
  const memberId = req.params.id;

  const { imageData } = req.body;

  if (!imageData) {
    return res.status(400).json({
      error: "No image data provided",
    });
  }

  // ========================================================
  // CHECK IMAGE FORMAT
  // ========================================================

  const match = imageData.match(
    /^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/,
  );

  if (!match) {
    return res.status(400).json({
      error: "Invalid image format",
    });
  }

  const extension = match[1] === "jpeg" ? "jpg" : match[1];

  const imageBase64 = match[2];

  // ========================================================
  // GET CURRENT PHOTO FROM MYSQL
  // ========================================================

  const getPhotoSQL = `
        SELECT photo
        FROM members
        WHERE id = ?
    `;

  db.query(getPhotoSQL, [memberId], (err, results) => {
    if (err) {
      console.error("Error getting current member photo:", err);

      return res.status(500).json({
        error: "Failed to get current member photo",
      });
    }

    // =================================================
    // CREATE MEMBER IMAGE FOLDER
    // =================================================

    const imageDirectory = path.join(__dirname, "../assets/images/members");

    if (!fs.existsSync(imageDirectory)) {
      fs.mkdirSync(imageDirectory, {
        recursive: true,
      });
    }

    // =================================================
    // IMAGE FILE NAME
    // =================================================

    const fileName = `member-${memberId}.${extension}`;

    const filePath = path.join(imageDirectory, fileName);

    // =================================================
    // DELETE OLD PHOTO
    // =================================================

    if (results.length > 0 && results[0].photo) {
      const oldPhoto = results[0].photo;

      const oldFilePath = path.join(__dirname, oldPhoto);

      if (fs.existsSync(oldFilePath) && oldFilePath !== filePath) {
        try {
          fs.unlinkSync(oldFilePath);

          console.log("Old member photo deleted:", oldFilePath);
        } catch (deleteError) {
          console.error("Unable to delete old member photo:", deleteError);
        }
      }
    }

    // =================================================
    // SAVE NEW IMAGE FILE
    // =================================================

    try {
      fs.writeFileSync(filePath, Buffer.from(imageBase64, "base64"));
    } catch (error) {
      console.error("Error saving member photo:", error);

      return res.status(500).json({
        error: "Failed to save member photo",
      });
    }

    // =================================================
    // SAVE NEW IMAGE PATH TO MYSQL
    // =================================================

    const imagePath = `../assets/images/members/${fileName}`;

    const updateSQL = `
                UPDATE members
                SET photo = ?
                WHERE id = ?
            `;

    db.query(updateSQL, [imagePath, memberId], (err, result) => {
      if (err) {
        console.error("Error updating member photo:", err);

        return res.status(500).json({
          error: "Failed to update member photo",
        });
      }

      // =========================================
      // SUCCESS RESPONSE
      // =========================================

      res.json({
        message: "Member photo updated successfully!",

        photo: imagePath,
      });
    });
  });
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(`🚀 SINGKO server running at http://localhost:${PORT}`);
});
