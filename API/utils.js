// Return list of  missing fields
export function verifyRequiredFields(fields, req) {
    const missingFields = [];

    for (const field of fields) {
        if (req.body[field] === undefined) {
            missingFields.push(field);
        }
    }

    return missingFields;
}