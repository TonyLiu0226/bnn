-- Enable the pgvector extension to work with embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the articles table
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    title TEXT,
    published_date TIMESTAMP WITH TIME ZONE,
    embedding VECTOR(1536) -- Adjust the dimension (1536) based on your embedding model (e.g., OpenAI uses 1536)
);
