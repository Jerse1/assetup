#!/usr/bin/env node

import minimist from 'minimist';
import { help } from './cmd/help';
import { version } from './cmd/version';
import { configure } from './cmd/configure';
import { upload } from './cmd/upload';
//import { initializeConfig } from './cmd/configure';

export async function init(){
  //initializeConfig();
}

export async function cli(argsArray) {
  const args = minimist(argsArray.slice(2));
  let cmd = args._[0] || 'help';

  if (args.version || args.v) {
    cmd = 'version';
  }

  if (args.help || args.h) {
    cmd = 'help';
  }

  switch (cmd) {
    case 'version':
      version(args);
      break;

    case 'help':
      help(args);
      break;

    case 'upload':
      upload(args);
      break;

    case 'config':
      configure(args);
      break;

    default:
      console.error(`'${cmd} is not a valid command!`)
      break;
  }
}