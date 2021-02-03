import { S3 } from 'aws-sdk';
import s3Dir from '../../lib';
// import { s3Dir } from '../services';
import { Folder } from '../../lib/models';

class S3ObjectMock implements S3.Object {
  Key?: S3.ObjectKey;
  LastModified?: S3.LastModified;
  ETag?: S3.ETag;
  Size?: S3.Size;
  StorageClass?: S3.ObjectStorageClass;
  Owner?: S3.Owner;

  static create(key: string): S3.Object {
    const s3Object = new S3ObjectMock();
    s3Object.Key = key;

    return s3Object;
  }
}

test('undefined objects generates empty root folder', () => {
  const result = s3Dir.toDir(undefined);

  const rootFolder: Folder = new Folder();

  expect(result).toEqual(rootFolder);
});

test('empty s3Dir objects generates empty root folder', () => {
  const result = s3Dir.toDir([]);

  const rootFolder: Folder = new Folder();

  expect(result).toEqual(rootFolder);
});

test('folder structure with one S3 object', () => {
  const input = [S3ObjectMock.create('some path/some other path/my awesome file.jpeg')];

  const rootFolder = new Folder();
  const firstLevelFolder = new Folder('some path', rootFolder.name);
  const secondLevelFolder = new Folder('some other path', firstLevelFolder.name);
  secondLevelFolder.addObject(input[0]);
  rootFolder.folders = [firstLevelFolder];
  firstLevelFolder.folders = [secondLevelFolder];

  const result = s3Dir.toDir(input);

  expect(result).toEqual(rootFolder);
});

test('folder structure with multiple S3 object', () => {
  const input = [
    S3ObjectMock.create('some path/some other path/my awesome file.jpeg'),
    S3ObjectMock.create('some path/my awesome file1.jpeg'),
    S3ObjectMock.create('some path/some other path/my awesome file2.jpeg'),
    S3ObjectMock.create('some path1/some other path/my awesome file.jpeg'),
    S3ObjectMock.create('some path2/some other path3/my awesome file.jpeg'),
    S3ObjectMock.create('some path1/some other path2/my awesome file.jpeg'),
  ];

  const rootFolder = new Folder();
  const firstLevelFolder1 = new Folder('some path', undefined);
  const firstLevelFolder2 = new Folder('some path1', undefined);
  const firstLevelFolder3 = new Folder('some path2', undefined);
  const secondLevelFolder1 = new Folder('some other path', firstLevelFolder1.name);
  const secondLevelFolder2 = new Folder('some other path', firstLevelFolder2.name);
  const secondLevelFolder3 = new Folder('some other path3', firstLevelFolder3.name);
  const secondLevelFolder4 = new Folder('some other path2', firstLevelFolder2.name);

  rootFolder.folders = [firstLevelFolder1, firstLevelFolder2, firstLevelFolder3];
  firstLevelFolder1.folders = [secondLevelFolder1];
  firstLevelFolder1.addObject(input[1]);
  firstLevelFolder2.folders = [secondLevelFolder2, secondLevelFolder4];
  firstLevelFolder3.folders = [secondLevelFolder3];
  secondLevelFolder1.addObject(input[0]);
  secondLevelFolder1.addObject(input[2]);
  secondLevelFolder2.addObject(input[3]);
  secondLevelFolder3.addObject(input[4]);
  secondLevelFolder4.addObject(input[5]);

  const result = s3Dir.toDir(input);

  const json = result.toJson();
  const obj = result.toObject();

  expect(result).toEqual(rootFolder);
});
