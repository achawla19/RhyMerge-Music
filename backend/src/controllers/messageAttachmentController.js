/**
 * Message attachment upload endpoint.
 * Accepts audio or image via multipart/form-data, uploads to Cloudinary,
 * returns the CDN URL. The URL is then passed as `attachment.url` in the
 * socket send_message event — the backend never stores the file itself,
 * only the URL reference inside the encrypted message payload.
 */

export const uploadMessageAttachment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    // multer-storage-cloudinary puts the CDN URL in req.file.path
    // and the public_id in req.file.filename
    res.json({
      url: req.file.path,
      publicId: req.file.filename,
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
    });
  } catch (err) {
    console.error("uploadMessageAttachment:", err);
    res.status(500).json({ msg: "Upload failed" });
  }
};
