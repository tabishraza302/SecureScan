import morgan, { StreamOptions } from 'morgan';
import Logger from '../utils/logger/Logger';

const stream: StreamOptions = { write: (message: string) => console.log(message.trim())};

const skip = () => process.env.NODE_ENV === 'test';

const MorganMiddleware = morgan('combined', { stream, skip });

export default MorganMiddleware;
