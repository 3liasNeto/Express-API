import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

import { HttpStatusCode as StatusCodes } from "axios";

function BodyValidator(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = schema.parse(req.body);
        req.body = validatedData;


        next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res
          .status(StatusCodes.BadRequest)
          .json({ error: "Invalid data", details: errorMessages });
      } else {
        res
          .status(StatusCodes.InternalServerError)
          .json({ error: "Internal Server Error" });
      }
    }
  };
}

function QueryValidator(schema: z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        req.query = schema.parse(req.query);
        next();
      } catch (err) {
        let message = 'Query Format Error';
        let details: any = {};
  
        if (err instanceof ZodError) {
          message = `Validation failed: ${err.issues.length} errors detected in query params`;
          details = err.issues;
        }
  
        res
          .status(StatusCodes.BadRequest)
          .json({ error: "Invalid data", details: details.message });
      }
    };
  }

  function Validator(body: z.ZodObject<any, any>, query: z.ZodObject<any, any>){
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        req.query = query.parse(req.query);
        req.body = body.parse(req.body);
        next();
      } catch (err) {
        let message = 'Query Format Error';
        let details: any = {};
  
        if (err instanceof ZodError) {
          message = `Validation failed: ${err.issues.length}.`;
          details = err.issues;
        }
  
        res
          .status(StatusCodes.BadRequest)
          .json({ error: "Invalid data", details: details.message });
      }
    }
  }

export { BodyValidator , QueryValidator, Validator };
