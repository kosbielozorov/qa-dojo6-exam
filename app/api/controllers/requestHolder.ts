import type { APIRequestContext } from '@playwright/test';

export default abstract class RequestHolder {
  constructor(protected request: APIRequestContext) {
    this.request = request;
  }
}
