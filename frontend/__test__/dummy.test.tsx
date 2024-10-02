import { expect, test } from "vitest";

test("5 + 5 = 10", () => {
	let x = 5 + 5;
	expect(x).toBe(10);
});

test("1 + 1 = 2", () => {
	expect(1 + 1).toBe(2);
});
