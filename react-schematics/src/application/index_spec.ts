import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

// SchematicTestRunner needs an absolute path to the collection to test.
const collectionPath = path.join(__dirname, '../collection.json');

describe('application', () => {
  it('requires required option', async () => {
    // We test that
    const runner = new SchematicTestRunner('schematics', collectionPath);
    await expectAsync(
      runner.runSchematicAsync('application', {}, Tree.empty()).toPromise(),
    ).toBeRejected();
  });

  it('works', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner
      .runSchematicAsync('application', { name: 'str' }, Tree.empty())
      .toPromise();

    // Listing files
    expect(tree.files.sort()).toEqual(['/allo', '/hola', '/test1', '/test2']);
  });
});
