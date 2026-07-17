DROP TABLE IF EXISTS articles CASCADE;

-- Enable the pgvector extension to work with embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the articles table
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    embedding VECTOR(3072),
    metadata JSONB NOT NULL  -- All your custom fields live here!
);
