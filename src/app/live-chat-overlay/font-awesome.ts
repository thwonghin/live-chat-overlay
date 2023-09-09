import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faPalette,
    faThumbtack,
    faTimes,
    faCommentSlash,
    faComment,
} from '@fortawesome/free-solid-svg-icons';

export function init() {
    console.log(faComment);
    library.add(faComment, faCommentSlash, faPalette, faThumbtack, faTimes);
}
