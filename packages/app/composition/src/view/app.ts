import { getContainer } from '../singleton';

export const config = getContainer().config;
export const logger = getContainer().logger;
export const platform = getContainer().platform;
export const clipboard = getContainer().clipboard;
