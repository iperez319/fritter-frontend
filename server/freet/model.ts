import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Version} from '../version/model';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Freet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  author: Types.ObjectId;
  dateCreated: Date;
  dateModified: Date;
  currentVersion: Types.ObjectId;
  previousVersions: Types.ObjectId[];
  visible: boolean;
};

export type PopulatedFreet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  author: User;
  dateCreated: Date;
  dateModified: Date;
  currentVersion: Version;
  previousVersions: Types.ObjectId[];
  visible: boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FreetSchema = new Schema<Freet>({
  // The author userId
  author: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the freet was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The date the freet was modified
  dateModified: {
    type: Date,
    required: true
  },
  currentVersion: {
    type: Schema.Types.ObjectId,
    ref: 'Version'
  },
  previousVersions: {
    type: [Schema.Types.ObjectId],
    ref: 'Version'
  },
  visible: {
    type: Boolean,
    default: true,
  }
});

const FreetModel = model<Freet>('Freet', FreetSchema);
export default FreetModel;
