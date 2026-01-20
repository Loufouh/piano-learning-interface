export function throwIfMissingField(requiredFields, req) {
	const missingFields = verifyRequiredFields(requiredFields, req);

	if (missingFields.length > 0) {
		throw new Error(`Missing fields: ${missingFields.join(", ")}`);
	}
}

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
