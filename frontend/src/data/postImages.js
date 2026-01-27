/**
 * Maps imageKey from posts.json to the actual image URL.
 * Vite needs static imports for assets, so we centralize them here.
 * When you add more posts, add the import and the key below.
 */
import image1 from '../assets/Images Folder/Unsafe/image1.png'
import art from '../assets/Images Folder/Safe/art.png'

export const postImageMap = {
  image1,
  art,
}

export default postImageMap
