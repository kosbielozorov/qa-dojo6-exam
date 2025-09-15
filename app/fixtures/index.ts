import { APIRequestContext, test as base } from '@playwright/test';

import AppApi from '../api';

type Fixtures = {
  token: string;
  appApi: AppApi & { token: string };
  request: APIRequestContext;
  requestWithoutToken: APIRequestContext;
};

export const { expect, describe } = base;

export const test = base.extend<Fixtures>({});
