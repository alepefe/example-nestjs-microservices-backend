export interface UseCase {
  run(...args: any[]): Promise<any>;
}
