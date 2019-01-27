import { firestore } from 'firebase';
import { PostLocation } from './post-location';

export interface Post {
    title: string;
    date: Date;
    description: string,
    location: PostLocation | undefined,
    photos: string[],
}