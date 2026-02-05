// 16-dimension embedding vectors
// These mimic "learned" semantic meanings.
// Notice TWINKLE is consistent.

export const EMBEDDING_DIM = 16;
export const HEAD_DIM = 8;

export const TWINKLE_VECTOR = [
  0.12, -0.45, 0.88, 0.05, 
  -0.92, 0.33, 0.18, -0.67,
  0.55, 0.21, -0.34, 0.76,
  -0.11, 0.89, -0.25, 0.42
];

export const LITTLE_VECTOR = [
  -0.78, 0.12, -0.33, 0.56,
  0.44, -0.89, 0.67, 0.23,
  -0.45, 0.91, -0.12, -0.54,
  0.32, -0.22, 0.65, -0.98
];

// Q, K, V projections (8 dimensions) for Twinkle
// In a real model, these are x * W_q, etc. 
// Here we hardcode 'result' vectors for demonstration.
export const TWINKLE_Q = [0.10, 0.43, -0.22, 0.91, -0.05, 0.33, 0.88, -0.12];
export const TWINKLE_K = [-0.55, 0.12, 0.44, -0.98, 0.23, -0.76, 0.11, 0.45];
export const TWINKLE_V = [0.89, -0.34, 0.21, 0.67, -0.11, 0.54, -0.99, 0.02];

// Q, K, V projections (8 dimensions) for Little
export const LITTLE_Q = [-0.33, 0.88, 0.12, -0.56, 0.77, -0.22, 0.45, 0.10];
export const LITTLE_K = [0.66, -0.11, -0.87, 0.34, -0.55, 0.91, -0.33, -0.21];
export const LITTLE_V = [-0.44, 0.55, 0.76, -0.12, 0.33, -0.88, 0.22, 0.65];

// Positional Vectors for Absolute Embedding Demo
// These represent "learned" position vectors to be ADDED
export const POS_VECTOR_0 = [
    0.80, 0.85, 0.70, 0.75,
    0.60, 0.65, 0.50, 0.55,
    0.40, 0.45, 0.30, 0.35,
    0.20, 0.25, 0.10, 0.15
];

export const POS_VECTOR_1 = [
    -0.80, -0.75, -0.70, -0.65,
    -0.60, -0.55, -0.50, -0.45,
    -0.40, -0.35, -0.30, -0.25,
    -0.20, -0.15, -0.10, -0.05
];

// Helper to format floats for display
export const formatFloat = (n: number) => n.toFixed(2);