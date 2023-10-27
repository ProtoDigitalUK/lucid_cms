
CREATE TABLE IF NOT EXISTS lucid_languages (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lucid_translation_keys (
  id SERIAL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS lucid_translations (
  id SERIAL PRIMARY KEY,
  translation_key_id INTEGER REFERENCES lucid_translation_keys(id) ON DELETE CASCADE ON UPDATE CASCADE,
  language_id INTEGER REFERENCES lucid_languages(id) ON DELETE CASCADE ON UPDATE CASCADE,
  value TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
