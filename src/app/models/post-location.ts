import { firestore } from "firebase";

export interface PostLocation {
    name: string;
    position: firestore.GeoPoint;
}
