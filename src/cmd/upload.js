const METHODS = ['image', 'decal', 'both'];

import colors from "colors/safe";
import { uploadImages } from '../bin/ImageUploader.js';
import fs from 'fs';

colors.setTheme({
  error: ["red", "bold"],
});


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
    if (!fs.existsSync(args.input)) {
        console.error(colors.error(`Input '${args.input}' must be a valid directory!`));
        
        return
    }
  }

  if (args.method) {
    if (!METHODS.includes(args.method)){
        console.error(colors.error(`Method '${args.method}' must be a valid method!`))

        return
    }
  }

  uploadImages(args.input, args.output, args.method);
}