import "express";

declare namespace Express {
    interface Request {
      user_id?: string;
    }
}