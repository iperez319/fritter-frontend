import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import CommentCollection from '../comment/collection';
import VersionCollection from './collection';
import * as freetValidator from '../freet/middleware';
import * as commentValidator from '../comment/middleware';

const doesParentExist = async (req: Request, res: Response, next: NextFunction) => {
  const {parentId} = req.query;

  try {
    const report = await VersionCollection.findByParentId(parentId as string);

    if(!report){
      res.status(404).json({message: 'Parent is not valid'})
    }
  
    const parentType = report[0].parentType;
    req.query.parentType = parentType;
  
    if (parentType === 'Comment') {
      req.body.commentId = parentId as string;
      return commentValidator.doesCommentExist(req, res, next);
    }
  
    if (parentType === 'Freet') {
      req.params.freetId = parentId as string;
      return freetValidator.isFreetExists(req, res, next);
    }

  } catch {
    res.status(400).json({message: 'Invalid request'});
  }
};

export {
  doesParentExist
};
