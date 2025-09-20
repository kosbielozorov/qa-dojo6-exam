import { faker } from '@faker-js/faker';

/**
 * Creates a random article object with faker-generated content.
 *
 * @param slug - Optional boolean flag to include a randomly generated slug. Defaults to false.
 * @returns A Promise that resolves to an object containing:
 *   - title: Random words (3-7 words)
 *   - description: Random sentence
 *   - body: Random paragraph
 *   - tagList: Array containing 'kos'
 *   - slug: Empty string or random slug if slug parameter is true
 * @throws Will throw an error if faker operations fail
 *
 * @example
 * ```typescript
 * // Create article without slug
 * const article = await createRandomArticle();
 *
 * // Create article with slug
 * const articleWithSlug = await createRandomArticle(true);
 * ```
 */
export async function createRandomArticle(slug = false) {
  try {
    const randomArticle = {
      title: faker.lorem.words({ min: 3, max: 7 }),
      description: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      tagList: ['kos'],
      slug: '',
    };

    if (slug) {
      randomArticle.slug = faker.lorem.slug(3);
    }

    return randomArticle;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error generating random article: ${error}`);
    throw error;
  }
}
