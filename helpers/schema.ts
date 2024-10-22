import { createSchema } from "genson-js";
import * as fs from "fs/promises";
import { expect } from "@playwright/test";
import Ajv from "ajv";

export async function createJsonSchema(name: string, json: object) {
  const filePath = `.json-schemas/`;

  try {
    await fs.mkdir(filePath, { recursive: true });

    const schema = createSchema(json);
    const schemaString = JSON.stringify(schema, null, 2);
    const schemaName = `.json-schemas/${name}_schema.json`;

    await writeJsonFile(schemaName, schemaString);

    console.log("JSON Schema created and saved.");
  } catch (err) {
    console.error(err);
  }
}

async function writeJsonFile(location: string, data: string) {
  try {
    await fs.writeFile(location, data);
  } catch (err) {
    console.error(err);
  }
}

export async function validateJsonSchema(
  fileName: string,
  body: object,
  createSchema = false,
) {
  const jsonName = fileName;

  if (createSchema) {
    await createJsonSchema(jsonName, body);
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const existingSchema = require(`.json-schemas/${jsonName}_schema.json`);

  const ajv = new Ajv({ allErrors: false });
  const validate = ajv.compile(existingSchema);
  const validRes = validate(body);

  if (!validRes) {
    console.log(
      "SCHEMA ERRORS:",
      JSON.stringify(validate.errors),
      "\nRESPONSE BODY:",
      JSON.stringify(body),
    );
  }

  expect(validRes).toBe(true);
}
