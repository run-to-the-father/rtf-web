import { ResultAsync } from 'neverthrow';

export const toPromise = <T>(resultAsync: ResultAsync<T, any>) =>
  resultAsync.match(
    (value) => value,
    (error) => {
      throw error;
    },
  );
