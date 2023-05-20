import chalk from 'chalk';

const menus = {
  main: `
${chalk.greenBright('imgup [command] <options>')}
  ${chalk.blueBright('upload')} ............. uploads images
  ${chalk.blueBright('config')}.............. set API key, default city ID, default temperature units
  ${chalk.blueBright('version')} ............ show package version
  ${chalk.blueBright('help')} ............... show help menu for a command
`,

  upload: `//...
        `,
  config: `//...
        `,
}

export async function help(args) {
  const subCmd = args._[0] === 'help'
    ? args._[1]
    : args._[0]
  console.log(menus[subCmd] || menus.main)
}