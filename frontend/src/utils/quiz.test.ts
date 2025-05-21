import { shuffleQuestions } from "./quiz";

test("shuffleQuestions randomizes array order", () => {
  const arr = [1, 2, 3, 4];
  const shuffled = shuffleQuestions(arr);
  expect(shuffled).toHaveLength(4);
  expect(shuffled.sort()).toEqual(arr.sort());
});