import { ToPersonsPipe } from './to-persons.pipe';

describe('ToPersonsPipe', () => {
  it('create an instance', () => {
    const pipe = new ToPersonsPipe();
    expect(pipe).toBeTruthy();
  });
});
