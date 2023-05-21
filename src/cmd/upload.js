const METHODS = ['image', 'decal', 'both'];

import { uploadImages } from '../bin/ImageUploader.js';
import fs from 'fs';

export async function upload(args) {
  if (args.o){
    args.output = args.o;
  }
  if (args.i){
    args.input = args.i;
  }
  if (args.m){
    args.method = args.m;
  }

  if (!args.hasOwnProperty('output')) {
    args.output = 'output.txt';
  }

  if (!args.hasOwnProperty('method')) {
    args.method = 'image';
  }

  if (!args.hasOwnProperty('input')) {
    args.input = 'input';
  }

  if (args.input) {
    fs.access(args.input, fs.F_OK, (err) => {
        if (err) {
            console.error(`Input '${args.input}' must be valid!`)
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

  uploadImages(args.input, args.output, args.method);
}