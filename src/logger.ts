import * as log4js from 'log4js';

const CONFIG_PATH: string = './log4js.config.json';
log4js.configure(CONFIG_PATH);

const logger = log4js.getLogger();

export { logger };