// @ts-nocheck
import type {HydratedDocument, Types} from 'mongoose';
import moment from 'moment';
import type {Comment, PopulatedComment} from '../comment/model';
import type {Freet} from '../freet/model';
import type {Version} from '../version/model';

// Update this if you add a property to the Freet type!
type CommentResponse = {
  _id: string;
  author: {
    username: string,
    _id: string,
  };
  dateCreated: string;
  dateModified: string;
  parent: string;
  currentVersion: Version;
  previousVersions: string[];
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<PopulatedComment>} comment - A freet
 * @returns {CommentResponse} - The freet object formatted for the frontend
 */
const constructCommentResponse = (comment: HydratedDocument<PopulatedComment>): CommentResponse => {
  const commentCopy: PopulatedComment = {
    ...comment.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    ...commentCopy,
    _id: commentCopy._id.toString(),
    author: {
      username: commentCopy.author.username,
      _id: commentCopy._id.toString()
    },
    dateCreated: comment.dateCreated.toString(),
    dateModified: comment.dateModified.toString(),
    parent: commentCopy.parent.toString(),
    content: commentCopy.currentVersion.content,
  };
};

export {
  constructCommentResponse
};
