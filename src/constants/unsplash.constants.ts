// Unsplash collection ID for featured images
// Replace this with your actual collection ID
export const UNSPLASH_COLLECTION_ID = "317099"; // Example: Featured collection

// Number of images to fetch from Unsplash
export const UNSPLASH_IMAGE_COUNT = 9;

// Default image URL in case of Unsplash API issues
export const DEFAULT_UNSPLASH_IMAGE =
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200";

// Fallback images array in case Unsplash API fails
export const FALLBACK_UNSPLASH_IMAGES = [
  {
    id: "fallback-1",
    urls: {
      full: "https://images.unsplash.com/photo-1745605443018-030f36ce90e7?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      regular:
        "https://images.unsplash.com/photo-1745605443018-030f36ce90e7?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      small:
        "https://images.unsplash.com/photo-1745605443018-030f36ce90e7?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      thumb:
        "https://images.unsplash.com/photo-1745605443018-030f36ce90e7?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    user: {
      name: "Unsplash",
      username: "unsplash",
    },
  },
  {
    id: "fallback-2",
    urls: {
      full: "https://images.unsplash.com/photo-1726065235158-d9c3f817f331?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      regular:
        "https://images.unsplash.com/photo-1726065235158-d9c3f817f331?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      small:
        "https://images.unsplash.com/photo-1726065235158-d9c3f817f331?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      thumb:
        "https://images.unsplash.com/photo-1726065235158-d9c3f817f331?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    user: {
      name: "Unsplash",
      username: "unsplash",
    },
  },
  {
    id: "fallback-3",
    urls: {
      full: "https://images.unsplash.com/photo-1743482858217-5aef42cfc636?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      regular:
        "https://images.unsplash.com/photo-1743482858217-5aef42cfc636?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      small:
        "https://images.unsplash.com/photo-1743482858217-5aef42cfc636?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      thumb:
        "https://images.unsplash.com/photo-1743482858217-5aef42cfc636?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    user: {
      name: "Unsplash",
      username: "unsplash",
    },
  },
  {
    id: "fallback-4",
    urls: {
      full: "https://images.unsplash.com/photo-1743309411498-a0f4f4b96b65?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      regular:
        "https://images.unsplash.com/photo-1743309411498-a0f4f4b96b65?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      small:
        "https://images.unsplash.com/photo-1743309411498-a0f4f4b96b65?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      thumb:
        "https://images.unsplash.com/photo-1743309411498-a0f4f4b96b65?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    user: {
      name: "Unsplash",
      username: "unsplash",
    },
  },
  {
    id: "fallback-5",
    urls: {
      full: "https://images.unsplash.com/photo-1745750747228-d7ae37cba3a5?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      regular:
        "https://images.unsplash.com/photo-1745750747228-d7ae37cba3a5?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      small:
        "https://images.unsplash.com/photo-1745750747228-d7ae37cba3a5?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      thumb:
        "https://images.unsplash.com/photo-1745750747228-d7ae37cba3a5?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    user: {
      name: "Unsplash",
      username: "unsplash",
    },
  },
];

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
