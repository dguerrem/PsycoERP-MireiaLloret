// Get all documents for a specific patient
const getDocumentsByPatientId = async (db, patientId) => {
  const query = `
    SELECT
      id,
      name,
      type,
      size,
      DATE_FORMAT(uploaded_at, '%Y-%m-%d') as upload_date,
      description,
      url as file_url
    FROM documents
    WHERE patient_id = ? AND is_active = true
    ORDER BY uploaded_at DESC
  `;

  const [rows] = await db.execute(query, [patientId]);

  // Format size from bytes to human-readable format
  const formattedRows = rows.map((doc) => {
    const sizeInBytes = doc.size;
    let formattedSize;

    if (sizeInBytes < 1024) {
      formattedSize = `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      formattedSize = `${(sizeInBytes / 1024).toFixed(1)} KB`;
    } else if (sizeInBytes < 1024 * 1024 * 1024) {
      formattedSize = `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      formattedSize = `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }

    return {
      ...doc,
      size: formattedSize,
    };
  });

  return formattedRows;
};

module.exports = {
  getDocumentsByPatientId,
};
