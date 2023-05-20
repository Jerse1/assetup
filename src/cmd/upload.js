const METHODS = ['image', 'decal', 'both'];

import { uploadImages } from '../bin/ImageUploader.js';
import fs from 'fs';

export async function upload(args) {
  if (args.o){
    args.output = args.o;
  }

  if (!args.hasOwnProperty('output')) {
    args.output = 'output.txt';
  }

  if (!args.hasOwnProperty('method')) {
    args.method = 'image';
  }

  if (!args.hasOwnProperty('path')) {
    args.path = 'images';
  }

  if (args.path) {
    fs.access(args.path, fs.F_OK, (err) => {
        if (err) {
            console.error(`Path '${args.path}' must be valid!`)
            return
        }
      })
  }

  if (args.method) {
    if (!METHODS.includes(args.method)){
        console.error(`Method '${args.method}' must be valid!`)

        return
    }
  }

  uploadImages(args.path, args.output, args.method);
}