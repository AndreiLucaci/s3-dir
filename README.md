# s3-dir

Small utility function to display AWS S3 objects in a tree/folder like structured way

## Intent

This utilitary tool can help you convert a list of S3 objects (most likely coming from a [ListObjects](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjects.html) call from AWS) to a directory / folder like structure.

## Install

`npm i s3-dir`

or

`yarn add s3-dir`

## Usage

```typescript
import s3Dir from 's3-dir';

const myS3Objects: S3.Object[] = [];
const result = s3Dir.toDir(myS3Objects);
```

The result is the root `Folder`.

The `Folder` structure:

```typescript
class Folder {
  objects?: S3.Object[];
  parent?: string;
  name?: string;
  folders?: Folder[];
  constructor(name?: string, parent?: string);
  addObject(input: S3.Object): void;
  ensureFolder(name: string): Folder;
  all(): (Folder | S3.Object)[];
  toJson(): string;
  toObject(): any;
}
```

## Example

Having a structure like this with S3 objects:

```
some path/some other path/my awesome file.jpeg
some path/my awesome file1.jpeg
some path/some other path/my awesome file2.jpeg
some path1/some other path/my awesome file.jpeg
some path2/some other path3/my awesome file.jpeg
some path1/some other path2/my awesome file.jpeg
```

The generated result JSON based on the `Folder`'s `toJson()` method is:

```JSON
{
  "folders": [
    {
      "name": "some path",
      "folders": [
        {
          "name": "some other path",
          "parent": "some path",
          "objects": [
            {
              "Key": "some path/some other path/my awesome file.jpeg"
            },
            {
              "Key": "some path/some other path/my awesome file2.jpeg"
            }
          ]
        }
      ],
      "objects": [
        {
          "Key": "some path/my awesome file1.jpeg"
        }
      ]
    },
    {
      "name": "some path1",
      "folders": [
        {
          "name": "some other path",
          "parent": "some path1",
          "objects": [
            {
              "Key": "some path1/some other path/my awesome file.jpeg"
            }
          ]
        },
        {
          "name": "some other path2",
          "parent": "some path1",
          "objects": [
            {
              "Key": "some path1/some other path2/my awesome file.jpeg"
            }
          ]
        }
      ]
    },
    {
      "name": "some path2",
      "folders": [
        {
          "name": "some other path3",
          "parent": "some path2",
          "objects": [
            {
              "Key": "some path2/some other path3/my awesome file.jpeg"
            }
          ]
        }
      ]
    }
  ]
}
```

## Details

The root node will always have the `name` and the `parent` be `undefined`.
