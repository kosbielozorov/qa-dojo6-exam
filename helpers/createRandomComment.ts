import { faker } from '@faker-js/faker';

/**
 * Creates a random comment string using Lorem Ipsum text.
 *
 * @returns A promise that resolves to a randomly generated sentence string
 *
 * @example
 * ```typescript
 * const comment = await createRandomComment();
 * console.log(comment); // "Lorem ipsum dolor sit amet consectetur."
 * ```
 */
export async function createRandomComment() {
  const randomComment = faker.lorem.sentence();

  return randomComment;
}
