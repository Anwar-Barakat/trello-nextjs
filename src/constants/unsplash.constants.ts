// Unsplash collection ID for featured images
// Replace this with your actual collection ID
export const UNSPLASH_COLLECTION_ID = "317099"; // Example: Featured collection

// Number of images to fetch from Unsplash
export const UNSPLASH_IMAGE_COUNT = 9;

// Default image URL in case of Unsplash API issues
export const DEFAULT_UNSPLASH_IMAGE =
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200";

// Default board background data
export const DEFAULT_BOARD_BACKGROUND = {
  id: "default",
  urls: {
    full: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
    regular:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1080",
    small: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400",
    thumb: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200",
  },
  links: {
    html: "https://unsplash.com/photos/colorful-gradient",
  },
  user: {
    name: "Unsplash",
    username: "unsplash",
  },
  description: "Colorful gradient background",
};
