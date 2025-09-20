import { faker } from '@faker-js/faker';

/**
 * Creates a random user object with generated fake data.
 *
 * Generates a user with a random first name, standardized email provider,
 * configurable password from environment variables, and a fake bio.
 * The email is automatically constructed using the generated first name
 * and provider domain in lowercase format.
 *
 * @returns {Promise<Object>} A promise that resolves to a user object containing:
 *   - firstName: Randomly generated first name
 *   - provider: Fixed provider domain 'test-qa-dojo.com'
 *   - password: Password from NEW_USER_PASSWORD env var or default 'Test1234!'
 *   - bio: Randomly generated biography text
 *   - email: Constructed email address in format 'firstname@provider'
 *
 * @throws {Error} Throws any error encountered during user generation
 *
 * @example
 * ```typescript
 * const user = await createRandomUser();
 * console.log(user.email); // "john@test-qa-dojo.com"
 * ```
 */
export async function createRandomUser() {
  try {
    const randomUser = {
      firstName: faker.person.firstName(),
      provider: 'test-qa-dojo.com',
      password: process.env.NEW_USER_PASSWORD || 'Test1234!',
      bio: faker.person.bio(),
      email: '',
    };

    randomUser.email =
      `${randomUser.firstName}@${randomUser.provider}`.toLowerCase();

    return randomUser;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error generating random user: ${error}`);
    throw error;
  }
}
