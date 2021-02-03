import { S3 } from 'aws-sdk';
import _ from 'lodash';

export class Folder {
  objects?: S3.Object[];
  parent?: string; // avoid circular JSON by adding the name of the parent
  name?: string;
  folders?: Folder[];

  constructor(name?: string, parent?: string) {
    this.name = name;
    this.parent = parent;
  }

  addObject(input: S3.Object) {
    if (!this.objects) this.objects = [];
    this.objects.push(input);
  }

  ensureFolder(name: string) {
    if (!this.folders) this.folders = [];

    const existingFolder = this.folders.find((x) => x.name === name);

    if (!existingFolder) {
      const newFolder = new Folder(name, this.name);
      this.folders.push(newFolder);
      return newFolder;
    }

    return existingFolder;
  }

  all(): (Folder | S3.Object)[] {
    return [...(this.objects ?? []), ...(this.folders ?? [])];
  }

  toJson() {
    const items = _.omitBy(this, _.isUndefined);

    return JSON.stringify(items, null, 2);
  }

  toObject() {
    const toObj = (input: Folder): any => {
      const obj: any = {
        name: input.name,
        parent: input.parent,
        objects: input.objects,
      };

      input.folders?.map((x) => {
        const result = toObj(x);
        obj[result.name as string] = result;
      });

      return obj;
    };

    return toObj(this);
  }
}
