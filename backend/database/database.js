if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.DATABASE_URL);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(process.env.DATABASE_NAME);
  } catch (err) {
    console.error('Database connection failed', err);
    process.exit(1);
  }
}

// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db) {
  const jsonSchema = {
      $jsonSchema: {
        "bsonType": "object",
        "required": ["name", "email", "mdp", "adresse", "teams", "workers"],
        "properties": {
          "name": {
            "bsonType": "string",
            "description": "Name is required and must be a string."
          },
          "email": {
            "bsonType": "string",
            "pattern": "^[\\w.+-]+@[\\w-]+\\.[a-zA-Z]{2,}$",
            "description": "Email is required and must follow a valid email format."
          },
          "mdp": {
            "bsonType": "string",
            "description": "Password is required and must be a string."
          },
          "adresse": {
            "bsonType": "object",
            "required": ["ville", "codePostal", "rue", "building"],
            "properties": {
              "ville": { "bsonType": "string", "description": "Ville is required and must be a string." },
              "codePostal": { "bsonType": "string", "description": "Code postal is required and must be a string." },
              "rue": { "bsonType": "string", "description": "Rue is required and must be a string." },
              "building": { "bsonType": "string", "description": "Building is required and must be a string." }
            }
          },
          "teams": {
            "bsonType": "object",
            "additionalProperties": {
              "bsonType": "object",
              "required": ["name", "workers", "assignedTasks"],
              "properties": {
                "name": {
                  "bsonType": "string",
                  "description": "Team name is required and must be a string."
                },
                "workers": {
                  "bsonType": "array",
                  "minItems": 2,
                  "items": {
                    "bsonType": "string",
                    "description": "Each worker ID must be a string."
                  },
                  "description": "Workers is required and must contain at least two items."
                },
                "assignedTasks": {
                  "bsonType": "array",
                  "items": {
                    "bsonType": "object",
                    "required": ["name", "state", "dateStart"],
                    "properties": {
                      "name": {
                        "bsonType": "string",
                        "description": "Task name is required and must be a string."
                      },
                      "state": {
                        "enum": ["NOT STARTED", "WORK IN PROGRESS", "DONE"],
                        "description": "State must be one of 'NOT STARTED', 'WORK IN PROGRESS', or 'DONE'."
                      },
                      "dateStart": {
                        "bsonType": "string",
                        "description": "Task start date is required and must be a string (expected format: ISO 8601)."
                      },
                      "dateEnd": {
                        "bsonType": "string",
                        "description": "Task end date must be a string (optional)."
                      }
                    },
                    "description": "Each assigned task must include a name, state, and dateStart."
                  }
                }
              }
            }
          },
          "workers": {
            "bsonType": "object",
            "additionalProperties": {
              "bsonType": "object",
              "required": ["mdp", "email", "enterprise"],
              "properties": {
                "mdp": {
                  "bsonType": "string",
                  "description": "Worker password is required and must be a string."
                },
                "email": {
                  "bsonType": "string",
                  "pattern": "^[\\w.+-]+@[\\w-]+\\.[a-zA-Z]{2,}$",
                  "description": "Worker email is required and must follow a valid email format."
                },
                "role": {
                  "bsonType": "string",
                  "description": "Worker role is optional but must be a string if present."
                },
                "enterprise": {
                  "bsonType": "string",
                  "description": "Enterprise ID is required and must be a string."
                }
              }
            }
          }
        }
      },
  };

  // Try applying the modification to the collection, if the collection doesn't exist, create it
  await db.command({
      collMod: "enterprises",
      validator: jsonSchema
  }).catch(async (error) => {
      if (error.codeName === "NamespaceNotFound") {
          await db.createCollection("enterprises", { validator: jsonSchema });
      }
  });
}

module.exports = { connectToDatabase };
