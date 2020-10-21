import constants from "../../src/config/constants";

test("constants: should calculate skip value", () => {
	expect(constants.calculateSkipValue(1, 10)).toBe(0);
	expect(constants.calculateSkipValue(5, 5)).toBe(20);
	expect(constants.calculateSkipValue(4, 10)).toBe(30);
});

test("constants: should return proper pagination", () => {
	const paginatedResponse = constants.paginate(1, 5, 50, [1, 2, 3, 3, 4]);
	expect(paginatedResponse).toHaveProperty("page", 1);
	expect(paginatedResponse).toHaveProperty("size", 5);
	expect(paginatedResponse).toHaveProperty("totalRecords", 50);
	expect(paginatedResponse).toHaveProperty("pages", 10);
	expect(paginatedResponse).toHaveProperty("list", [1, 2, 3, 3, 4]);
	const paginatedResponse2 = constants.paginate(5, 6, 27, [1, 2, 3]);
	expect(paginatedResponse2).toHaveProperty("page", 5);
	expect(paginatedResponse2).toHaveProperty("size", 3);
	expect(paginatedResponse2).toHaveProperty("totalRecords", 27);
	expect(paginatedResponse2).toHaveProperty("pages", 5);
	expect(paginatedResponse2).toHaveProperty("list", [1, 2, 3]);
});
